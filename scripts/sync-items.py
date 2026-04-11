#!/usr/bin/env python3
"""
Sync ALL equipment items from the weirdgloop/osrs-dps-calc equipment.json
into our item format. Outputs src/data/equipment-db.json.

Usage: python3 scripts/sync-items.py

Data source: https://github.com/weirdgloop/osrs-dps-calc/blob/main/cdn/json/equipment.json
"""

import json
import urllib.request
import re
import sys
from collections import defaultdict

EQUIPMENT_URL = "https://raw.githubusercontent.com/weirdgloop/osrs-dps-calc/main/cdn/json/equipment.json"
OUTPUT_PATH = "src/data/equipment-db.json"

# ── Slot mapping (wiki → ours) ──────────────────────────────────────────
SLOT_MAP = {
    "head": "head",
    "cape": "cape",
    "neck": "neck",
    "ammo": "ammo",
    "weapon": "weapon",
    "body": "body",
    "shield": "shield",
    "legs": "legs",
    "hands": "hands",
    "feet": "feet",
    "ring": "ring",
}

# ── Weapon category mapping (wiki category → our WeaponCategory) ────────
WEAPON_CATEGORY_MAP = {
    "Bow": "bow",
    "Crossbow": "crossbow",
    "Thrown": "thrown",
    "Chinchompas": "thrown",
    "Powered Staff": "powered-staff",
    "2h Sword": "2h-melee",
    "Bludgeon": "2h-melee",
    "Bulwark": "2h-melee",
    "Slash Sword": "1h-light",  # Default; overridden for heavy variants
    "Stab Sword": "1h-heavy",   # Default; overridden for light variants
    "Spear": "1h-heavy",
    "Partisan": "1h-heavy",
    "Polearm": "halberd",
    "Staff": "staff",
    "Bladed Staff": "staff",
    "Polestaff": "staff",
    "Scythe": "scythe",
    "Blunt": "standard",
    "Spiked": "standard",
    "Pickaxe": "standard",
    "Axe": "standard",
    "Banner": "standard",
    "Whip": "1h-light",
    "Claw": "1h-light",
    "Salamander": "standard",
    "Gun": "standard",
    "Blaster": "standard",
    "Unarmed": "standard",
}

# Items where weapon category needs specific override
WEAPON_CATEGORY_OVERRIDES = {
    "Ghrazi rapier": "1h-light",
    "Abyssal tentacle": "1h-light",
    "Toxic blowpipe": "blowpipe",
    "Drygore blowpipe": "blowpipe",
    "Osmumten's fang": "1h-heavy",
    "Inquisitor's mace": "1h-heavy",
    "Blade of saeldor": "1h-heavy",
    "Dragon scimitar": "1h-light",
    "Dragon longsword": "1h-heavy",
    "Abyssal dagger": "1h-light",
    "Eclipse atlatl": "thrown",
    "Viggora's chainmace": "1h-heavy",
    "Ursine chainmace": "1h-heavy",
}

# ── Attack type from weapon category ────────────────────────────────────
ATTACK_TYPE_FROM_CATEGORY = {
    "Stab Sword": "stab",
    "Spear": "stab",
    "Partisan": "stab",
    "Slash Sword": "slash",
    "2h Sword": "slash",
    "Axe": "slash",
    "Scythe": "slash",
    "Whip": "slash",
    "Claw": "slash",
    "Blunt": "crush",
    "Spiked": "crush",
    "Bludgeon": "crush",
    "Pickaxe": "crush",
    "Banner": "stab",
    "Polearm": "slash",
    "Bow": "ranged",
    "Crossbow": "ranged",
    "Thrown": "ranged",
    "Chinchompas": "ranged",
    "Blaster": "ranged",
    "Staff": "magic",
    "Bladed Staff": "magic",
    "Polestaff": "magic",
    "Powered Staff": "magic",
    "Salamander": "slash",
    "Gun": "ranged",
    "Bulwark": "crush",
    "Unarmed": "crush",
}

# ── Exclusion patterns ───────────────────────────────���──────────────────
# Names/patterns to exclude (cosmetic, event, unusable, etc.)
EXCLUDE_PATTERNS = [
    r"\(deadman\)",      # Deadman mode variants
    r"\(bh\)",           # Bounty hunter variants
    r"Corrupted ",       # Corrupted BH variants (not degraded barrows)
    r"\(Last Man Standing\)",
    r"\(beta\)",
    r"Trouver parchment",
    r"Broken ",          # Broken items
]

# Specific items to exclude by name
EXCLUDE_NAMES = {
    "Wilderness champion amulet",  # All null stats
}

# ── Version preference ──────────────────────────────────────────────────
# When multiple versions exist, prefer these patterns (in order)
VERSION_PREFERENCES = [
    "",           # No version = standard
    "Charged",
    "Active",
    "Full",
    "(100)",      # Full charge barrows
    "Normal",
]

# Versions to exclude
VERSION_EXCLUDES = [
    "(0)",     # Uncharged
    "(25)",    # Low charge barrows
    "(50)",
    "(75)",
    "Inactive",
    "Broken",
    "Deactivated",
    "Uncharged",
    "Empty",
    "Damaged",
]


def val(v):
    """Handle None values in bonus fields."""
    return v if v is not None else 0


def should_exclude(item):
    """Check if item should be excluded."""
    name = item["name"]
    if name in EXCLUDE_NAMES:
        return True
    for pattern in EXCLUDE_PATTERNS:
        if re.search(pattern, name, re.IGNORECASE):
            return True
    version = item.get("version", "")
    for excl in VERSION_EXCLUDES:
        if excl.lower() in version.lower():
            return True
    return False


def has_any_positive_stat(item):
    """Check if item has at least one positive combat stat."""
    b = item["bonuses"]
    o = item["offensive"]
    d = item["defensive"]
    return (
        val(b["str"]) > 0 or val(b["ranged_str"]) > 0 or
        val(b["magic_str"]) > 0 or val(b["prayer"]) > 0 or
        val(o["stab"]) > 0 or val(o["slash"]) > 0 or
        val(o["crush"]) > 0 or val(o["magic"]) > 0 or
        val(o["ranged"]) > 0 or
        val(d["stab"]) > 0 or val(d["slash"]) > 0 or
        val(d["crush"]) > 0 or val(d["magic"]) > 0 or
        val(d["ranged"]) > 0
    )


def has_offensive_value(item):
    """Check if item has any offensive or strength value (DPS-relevant)."""
    b = item["bonuses"]
    o = item["offensive"]
    return (
        val(b["str"]) > 0 or val(b["ranged_str"]) > 0 or
        val(b["magic_str"]) > 0 or val(b["prayer"]) > 0 or
        val(o["stab"]) > 0 or val(o["slash"]) > 0 or
        val(o["crush"]) > 0 or val(o["magic"]) > 0 or
        val(o["ranged"]) > 0
    )


def determine_combat_style(item):
    """Determine combat style from weapon stats."""
    o = item["offensive"]
    b = item["bonuses"]
    cat = item.get("category", "")

    # Magic weapons
    if cat in ("Staff", "Bladed Staff", "Polestaff", "Powered Staff"):
        return "magic"

    # Ranged weapons
    if cat in ("Bow", "Crossbow", "Thrown", "Chinchompas", "Blaster", "Gun"):
        return "ranged"

    # Check if ranged offensive > melee offensive
    ranged_off = val(o["ranged"])
    melee_off = max(val(o["stab"]), val(o["slash"]), val(o["crush"]))

    if ranged_off > melee_off and val(b["ranged_str"]) > 0:
        return "ranged"

    return "melee"


def determine_attack_type(item):
    """Determine primary attack type."""
    cat = item.get("category", "")

    # Direct category mapping
    if cat in ATTACK_TYPE_FROM_CATEGORY:
        return ATTACK_TYPE_FROM_CATEGORY[cat]

    # Fallback: use highest offensive bonus
    o = item["offensive"]
    stats = {
        "stab": val(o["stab"]),
        "slash": val(o["slash"]),
        "crush": val(o["crush"]),
        "ranged": val(o["ranged"]),
        "magic": val(o["magic"]),
    }
    best = max(stats, key=stats.get)
    return best


def get_weapon_category(item):
    """Map wiki weapon category to our WeaponCategory."""
    name = item["name"]
    cat = item.get("category", "")

    # Check specific overrides first (case-insensitive)
    for override_name, override_cat in WEAPON_CATEGORY_OVERRIDES.items():
        if name.lower() == override_name.lower():
            return override_cat

    # Check if it's a special blowpipe weapon
    if "blowpipe" in name.lower():
        return "blowpipe"

    # Map from wiki category
    if cat in WEAPON_CATEGORY_MAP:
        return WEAPON_CATEGORY_MAP[cat]

    return "standard"


def make_item_id(name, wiki_id):
    """Generate a stable item ID from the name and wiki ID."""
    # Create slug from name
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    # Append wiki ID for uniqueness
    return f"{slug}-{wiki_id}"


def convert_item(wiki_item):
    """Convert a wiki equipment item to our format."""
    name = wiki_item["name"]
    slot = SLOT_MAP.get(wiki_item["slot"])
    if not slot:
        return None

    wiki_id = wiki_item["id"]
    o = wiki_item["offensive"]
    d = wiki_item["defensive"]
    b = wiki_item["bonuses"]

    bonuses = {
        "astab": val(o["stab"]),
        "aslash": val(o["slash"]),
        "acrush": val(o["crush"]),
        "aranged": val(o["ranged"]),
        "amagic": val(o["magic"]),
        "dstab": val(d["stab"]),
        "dslash": val(d["slash"]),
        "dcrush": val(d["crush"]),
        "dranged": val(d["ranged"]),
        "dmagic": val(d["magic"]),
        "mstr": val(b["str"]),
        "rstr": val(b["ranged_str"]),
        "mdmg": round(val(b["magic_str"]) / 10),
        "prayer": val(b["prayer"]),
    }

    item = {
        "id": make_item_id(name, wiki_id),
        "wikiId": wiki_id,
        "name": name,
        "slot": slot,
        "bonuses": bonuses,
    }

    # Weapon-specific fields
    if slot == "weapon":
        if wiki_item.get("isTwoHanded"):
            item["isTwoHanded"] = True
        speed = wiki_item.get("speed", 0)
        if speed > 0:
            item["attackSpeed"] = speed
        item["weaponCategory"] = get_weapon_category(wiki_item)
        item["combatStyle"] = determine_combat_style(wiki_item)
        item["attackType"] = determine_attack_type(wiki_item)

    return item


def pick_best_version(items):
    """From a list of same-named items, pick the best version."""
    if len(items) == 1:
        return items[0]

    # Prefer items matching VERSION_PREFERENCES
    for pref in VERSION_PREFERENCES:
        for item in items:
            version = item.get("version", "")
            if pref == "" and version == "":
                return item
            elif pref != "" and pref.lower() in version.lower():
                return item

    # Fallback: pick the one with highest total offensive stats
    def total_stats(item):
        o = item["offensive"]
        b = item["bonuses"]
        return (
            val(o["stab"]) + val(o["slash"]) + val(o["crush"]) +
            val(o["ranged"]) + val(o["magic"]) +
            val(b["str"]) + val(b["ranged_str"]) + val(b["magic_str"]) +
            val(b["prayer"])
        )
    return max(items, key=total_stats)


def deduplicate(items):
    """Group items by name and pick the best version of each."""
    groups = defaultdict(list)
    for item in items:
        groups[item["name"]].append(item)

    result = []
    for name, group in groups.items():
        best = pick_best_version(group)
        result.append(best)
    return result


def main():
    print("Fetching equipment.json from weirdgloop/osrs-dps-calc...")
    req = urllib.request.Request(
        EQUIPMENT_URL,
        headers={"User-Agent": "GielenorGuide-DPSCalc/2.0 (sync script)"}
    )
    with urllib.request.urlopen(req) as resp:
        raw_items = json.loads(resp.read().decode())

    print(f"  Downloaded {len(raw_items)} items")

    # Step 1: Exclude unwanted items
    filtered = [item for item in raw_items if not should_exclude(item)]
    print(f"  After exclusions: {len(filtered)}")

    # Step 2: Deduplicate (pick best version of each)
    deduped = deduplicate(filtered)
    print(f"  After deduplication: {len(deduped)}")

    # Step 3: Keep only items with at least one positive stat
    useful = [item for item in deduped if has_any_positive_stat(item)]
    print(f"  With positive stats: {len(useful)}")

    # Step 4: Convert to our format
    converted = []
    skipped = 0
    for wiki_item in useful:
        item = convert_item(wiki_item)
        if item:
            converted.append(item)
        else:
            skipped += 1

    print(f"  Converted: {len(converted)} (skipped {skipped})")

    # Step 5: Sort by slot then name for readability
    slot_order = ["weapon", "head", "body", "legs", "shield", "cape", "neck", "ammo", "hands", "feet", "ring"]
    converted.sort(key=lambda x: (slot_order.index(x["slot"]) if x["slot"] in slot_order else 99, x["name"]))

    # Stats
    from collections import Counter
    slot_counts = Counter(item["slot"] for item in converted)
    print("\n  Items by slot:")
    for slot in slot_order:
        print(f"    {slot}: {slot_counts.get(slot, 0)}")

    # Step 6: Write output
    with open(OUTPUT_PATH, "w") as f:
        json.dump(converted, f, separators=(",", ":"))

    file_size = len(json.dumps(converted, separators=(",", ":")))
    print(f"\n  Written to {OUTPUT_PATH} ({file_size / 1024:.0f} KB)")
    print(f"  Total items: {len(converted)}")


if __name__ == "__main__":
    main()
