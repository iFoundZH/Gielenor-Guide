#!/usr/bin/env python3
"""
Sync boss data from weirdgloop/osrs-dps-calc monsters.json and OSRS Wiki
DP Areas page into our format. Outputs src/data/boss-db.json.

Usage: python3 scripts/sync-bosses.py

Data sources:
- https://github.com/weirdgloop/osrs-dps-calc/blob/main/cdn/json/monsters.json
- https://oldschool.runescape.wiki/api.php (Demonic Pacts League/Areas wikitext)
"""

import json
import urllib.request
import re
import sys
from collections import defaultdict

MONSTERS_URL = "https://raw.githubusercontent.com/weirdgloop/osrs-dps-calc/main/cdn/json/monsters.json"
WIKI_API_URL = "https://oldschool.runescape.wiki/api.php"
OUTPUT_PATH = "src/data/boss-db.json"

# ── Boss Lookup Table ────────────────────────────────────────────────────
# Maps our boss ID → (wiki name, version filter or None)
BOSS_LOOKUP = {
    # GWD
    "graardor":     ("General Graardor", None),
    "zilyana":      ("Commander Zilyana", None),
    "kreearra":     ("Kree'arra", None),
    "kril":         ("K'ril Tsutsaroth", None),
    "nex":          ("Nex", None),

    # DT2
    "duke":         ("Duke Sucellus", "Post-quest"),  # DT2 post-quest version
    "leviathan":    ("The Leviathan", "Post-quest"),
    "whisperer":    ("The Whisperer", "Post-quest"),
    "vardorvis":    ("Vardorvis", "Post-quest"),

    # Raids
    "tekton":       ("Tekton", "Normal"),
    "olm-melee":    ("Great Olm", "Left claw (Normal)"),
    "olm-head":     ("Great Olm", "Head (Normal)"),
    "verzik-p3":    ("Verzik Vitur", "Normal mode, Phase 3"),
    "wardens-p3":   ("Elidinis' Warden", "Enraged"),

    # Slayer bosses
    "cerberus":     ("Cerberus", None),
    "hydra":        ("Alchemical Hydra", None),
    "thermy":       ("Thermonuclear smoke devil", None),
    "kraken":       ("Kraken", "Kraken"),
    "abyssal-sire": ("Abyssal Sire", "Phase 2"),
    "grotesque-guardians": ("Dusk", "First form"),  # Dusk is the killable guardian

    # Other bosses
    "vorkath":      ("Vorkath", "Post-quest"),
    "zulrah":       ("Zulrah", "Serpentine"),
    "corp":         ("Corporeal Beast", None),
    "hunllef":      ("Corrupted Hunllef", None),
    "kbd":          ("King Black Dragon", None),
    "kq":           ("Kalphite Queen", "Crawling"),  # Phase 1 = Crawling (melee) form
    "nightmare":    ("The Nightmare", None),
    "jad":          ("TzTok-Jad", None),
    "zuk":          ("TzKal-Zuk", "Normal"),
    "sol-heredit":  ("Sol Heredit", None),
    "giant-mole":   ("Giant Mole", None),

    # Fremennik
    "dag-rex":      ("Dagannoth Rex", None),
    "dag-prime":    ("Dagannoth Prime", None),
    "dag-supreme":  ("Dagannoth Supreme", None),
    "phantom-muspah": ("Phantom Muspah", "Ranged"),

    # Kourend
    "araxxor":      ("Araxxor", None),
    "demonic-gorillas": ("Demonic gorilla", None),
    "sarachnis":    ("Sarachnis", None),
    "skotizo":      ("Skotizo", None),

    # Varlamore
    "amoxliatl":    ("Amoxliatl", None),
}

# Bosses not in monsters.json — manual entries with wiki-verified stats
MANUAL_BOSSES = {
    "echo-amoxliatl": {
        "id": "echo-amoxliatl",
        "name": "Echo Amoxliatl",
        "defenceLevel": 220,
        "magicLevel": 130,
        "hp": 750,
        "size": 3,
        "attackSpeed": 4,
        "dstab": 60, "dslash": 60, "dcrush": 60,
        "dranged": 60, "dranged_light": 60, "dranged_standard": 60, "dranged_heavy": 60,
        "dmagic": 60,
        "region": "varlamore",
    },
}

# Display names (override wiki names for our UI)
DISPLAY_NAMES = {
    "olm-melee": "Great Olm (Melee Hand)",
    "olm-head": "Great Olm (Head)",
    "verzik-p3": "Verzik Vitur (P3)",
    "wardens-p3": "Wardens (P3 Tumeken)",
    "kq": "Kalphite Queen (Crawling)",
    "grotesque-guardians": "Grotesque Guardians",
    "kraken": "Kraken",
    "demonic-gorillas": "Demonic Gorillas",
}

# ── Region Data ──────────────────────────────────────────────────────────
# Maps wiki boss page names → our boss IDs for wiki Areas page extraction
BOSS_WIKI_LINK_MAP = {
    "General Graardor": "graardor",
    "Commander Zilyana": "zilyana",
    "Kree'arra": "kreearra",
    "K'ril Tsutsaroth": "kril",
    "Nex": "nex",
    "Duke Sucellus": "duke",
    "The Leviathan": "leviathan",
    "The Whisperer": "whisperer",
    "Vardorvis": "vardorvis",
    "Tekton": "tekton",
    "Great Olm": ["olm-melee", "olm-head"],
    "Chambers of Xeric": ["tekton", "olm-melee", "olm-head"],
    "Verzik Vitur": "verzik-p3",
    "Theatre of Blood": "verzik-p3",
    "Tombs of Amascut": "wardens-p3",
    "Elidinis' Warden": "wardens-p3",
    "Cerberus": "cerberus",
    "Alchemical Hydra": "hydra",
    "Thermonuclear smoke devil": "thermy",
    "Kraken": "kraken",
    "Abyssal Sire": "abyssal-sire",
    "Grotesque Guardians": "grotesque-guardians",
    "Dusk": "grotesque-guardians",
    "Vorkath": "vorkath",
    "Zulrah": "zulrah",
    "Corporeal Beast": "corp",
    "Corrupted Hunllef": "hunllef",
    "The Gauntlet": "hunllef",
    "King Black Dragon": "kbd",
    "Kalphite Queen": "kq",
    "The Nightmare": "nightmare",
    "TzTok-Jad": "jad",
    "Fight Caves": "jad",
    "TzKal-Zuk": "zuk",
    "Inferno": "zuk",
    "Sol Heredit": "sol-heredit",
    "Fortis Colosseum": "sol-heredit",
    "Giant Mole": "giant-mole",
    "Dagannoth Rex": "dag-rex",
    "Dagannoth Prime": "dag-prime",
    "Dagannoth Supreme": "dag-supreme",
    "Dagannoth Kings": ["dag-rex", "dag-prime", "dag-supreme"],
    "Phantom Muspah": "phantom-muspah",
    "Araxxor": "araxxor",
    "Demonic gorilla": "demonic-gorillas",
    "Demonic Gorillas": "demonic-gorillas",
    "Demonic gorillas": "demonic-gorillas",
    "Sarachnis": "sarachnis",
    "Skotizo": "skotizo",
    "Amoxliatl": "amoxliatl",
    "Echo Amoxliatl": "echo-amoxliatl",
}

# Region name normalization (wiki section → our region id)
REGION_NAME_MAP = {
    "Asgarnia": "asgarnia",
    "Desert": "desert",
    "Fremennik": "fremennik",
    "Fremennik Provinces": "fremennik",
    "Kandarin": "kandarin",
    "Karamja": "karamja",
    "Kourend": "kourend",
    "Morytania": "morytania",
    "Tirannwn": "tirannwn",
    "Varlamore": "varlamore",
    "Wilderness": "wilderness",
    "Misthalin": "misthalin",
}

# Fallback region overrides — for bosses not found on wiki Areas page or
# where DP league uses different classifications than base game.
# Source: DP Areas wiki page section headers + area contents.
REGION_OVERRIDES = {
    # GWD bosses — wiki page lists "God Wars Dungeon" under Asgarnia
    "graardor": "asgarnia",
    "zilyana": "asgarnia",
    "kreearra": "asgarnia",
    "kril": "asgarnia",
    "nex": "asgarnia",
    # DT2 bosses use LEAGUE classifications (confirmed in DP Areas page)
    "duke": "fremennik",
    "leviathan": "desert",
    "whisperer": "asgarnia",
    "vardorvis": "varlamore",
    # Raids — wiki lists "Chambers of Xeric" under Kourend
    "tekton": "kourend",
    "olm-melee": "kourend",
    "olm-head": "kourend",
    # Theatre of Blood under Morytania (Ver Sinhaza)
    "verzik-p3": "morytania",
    # Tombs of Amascut under Desert
    "wardens-p3": "desert",
    # Slayer bosses — derived from their dungeon locations on wiki Areas page
    "cerberus": "asgarnia",       # Taverley Dungeon area, Asgarnia
    "hydra": "kourend",           # Mount Karuulm Slayer Dungeon, Kourend
    "thermy": "kandarin",         # Smoke Devil Dungeon, Kandarin
    "kraken": "kandarin",         # Kraken Cove, Kandarin
    "abyssal-sire": "varlamore",  # Unsired listed under Varlamore notable drops on wiki DP Areas page
    "grotesque-guardians": "morytania",  # Slayer Tower, Morytania
    # Other bosses
    "vorkath": "fremennik",       # Ungael, listed under Fremennik
    "corp": "wilderness",         # Sigils listed under Wilderness notable drops
    "hunllef": "tirannwn",        # The Gauntlet, listed under Tirannwn
    "kbd": "wilderness",          # KBD Lair, Wilderness
    "kq": "desert",               # Kalphite Lair, Desert
    "nightmare": "morytania",     # Slepe, listed under Morytania
    "jad": "karamja",             # Mor Ul Rek / Fight Caves, Karamja
    "zuk": "karamja",             # Mor Ul Rek / Inferno, Karamja
    "giant-mole": "asgarnia",     # Falador Mole Lair, Asgarnia
    # Fremennik bosses
    "dag-rex": "fremennik",       # Waterbirth Island, Fremennik
    "dag-prime": "fremennik",
    "dag-supreme": "fremennik",
    "phantom-muspah": "fremennik",  # Ghorrock Dungeon, listed under Fremennik
    # Kourend/Kebos
    "araxxor": "morytania",       # Araxxor's Web, reached from Morytania
    "demonic-gorillas": "kandarin",  # Crash Site Cavern, Kandarin (MM2)
    "sarachnis": "kourend",       # Listed directly under Kourend
    "skotizo": "kourend",         # Catacombs of Kourend
}

# ── Non-wiki override data ──────────────────────────────────────────────
DAMAGE_MODIFIERS = {
    "tekton": {"type": "tekton-magic"},
    "kraken": {"type": "kraken-ranged"},
    "corp": {"type": "corp"},
    "zulrah": {"type": "zulrah-cap"},
}

TYPICAL_DISTANCES = {
    "kraken": 4,
    "zulrah": 3,
    "jad": 10,
    "zuk": 10,
    "dag-prime": 5,
}


def val(v):
    """Handle None values."""
    return v if v is not None else 0


def fetch_monsters():
    """Fetch monsters.json from weirdgloop."""
    print("Fetching monsters.json from weirdgloop/osrs-dps-calc...")
    req = urllib.request.Request(
        MONSTERS_URL,
        headers={"User-Agent": "GielenorGuide-DPSCalc/2.0 (boss sync script)"}
    )
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
    print(f"  Downloaded {len(data)} monsters")
    return data


def fetch_wiki_regions():
    """Fetch DP Areas wikitext and extract boss→region mapping."""
    print("Fetching DP Areas page from OSRS Wiki...")
    params = {
        "action": "parse",
        "page": "Demonic Pacts League/Areas",
        "prop": "wikitext",
        "format": "json",
    }
    url = WIKI_API_URL + "?" + "&".join(f"{k}={urllib.request.quote(str(v))}" for k, v in params.items())
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "GielenorGuide-DPSCalc/2.0 (boss sync script)"}
    )
    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read().decode())

    wikitext = result["parse"]["wikitext"]["*"]

    # Parse sections: ==Region Name==
    regions = {}
    current_region = None
    for line in wikitext.split("\n"):
        # Match ==Region Name== headers (level 2)
        header_match = re.match(r"^==\s*([^=]+?)\s*==\s*$", line)
        if header_match:
            region_name = header_match.group(1).strip()
            current_region = REGION_NAME_MAP.get(region_name)
            continue

        if current_region is None:
            continue

        # Extract [[wiki links]] from this line
        links = re.findall(r"\[\[([^\]|]+?)(?:\|[^\]]+?)?\]\]", line)
        for link in links:
            link = link.strip()
            if link in BOSS_WIKI_LINK_MAP:
                boss_ids = BOSS_WIKI_LINK_MAP[link]
                if isinstance(boss_ids, str):
                    boss_ids = [boss_ids]
                for bid in boss_ids:
                    if bid not in regions:
                        regions[bid] = current_region
                        print(f"  Region from wiki: {bid} → {current_region}")

    return regions


def find_monster(monsters, wiki_name, version_filter):
    """Find a monster entry matching name and optional version."""
    candidates = [m for m in monsters if m["name"] == wiki_name]
    if not candidates:
        # Try case-insensitive
        candidates = [m for m in monsters if m["name"].lower() == wiki_name.lower()]
    if not candidates:
        return None

    if version_filter is not None:
        versioned = [m for m in candidates if version_filter.lower() in (m.get("version", "") or "").lower()]
        if versioned:
            return versioned[0]
        # If no version match, warn and use first
        versions = [m.get("version", "") for m in candidates]
        print(f"  WARNING: No version '{version_filter}' for {wiki_name}, available: {versions}")
        return candidates[0]

    # No version filter — prefer versionless, then first
    versionless = [m for m in candidates if not m.get("version")]
    if versionless:
        return versionless[0]
    return candidates[0]


def extract_boss_data(boss_id, monster, region, display_name=None):
    """Convert monster data to our BossPreset format."""
    skills = monster.get("skills", {})
    defensive = monster.get("defensive", {})
    attrs = monster.get("attributes", [])
    weakness = monster.get("weakness", {})

    # Defensive bonuses
    dstab = val(defensive.get("stab", 0))
    dslash = val(defensive.get("slash", 0))
    dcrush = val(defensive.get("crush", 0))
    dmagic = val(defensive.get("magic", 0))
    dranged_light = val(defensive.get("light", 0))
    dranged_standard = val(defensive.get("standard", 0))
    dranged_heavy = val(defensive.get("heavy", 0))

    # Use standard as backward-compatible dranged
    dranged = dranged_standard

    boss = {
        "id": boss_id,
        "name": display_name or monster["name"],
        "defenceLevel": val(skills.get("def", 0)),
        "magicLevel": val(skills.get("magic", 0)),
        "hp": val(skills.get("hp", 0)),
        "size": val(monster.get("size", 1)),
        "attackSpeed": val(monster.get("speed", 4)),
        "dstab": dstab,
        "dslash": dslash,
        "dcrush": dcrush,
        "dranged": dranged,
        "dranged_light": dranged_light,
        "dranged_standard": dranged_standard,
        "dranged_heavy": dranged_heavy,
        "dmagic": dmagic,
    }

    # Region
    if region:
        boss["region"] = region

    # Attributes → boolean flags
    if "demon" in attrs:
        boss["isDemon"] = True
    if "dragon" in attrs:
        boss["isDragon"] = True
    if "undead" in attrs:
        boss["isUndead"] = True
    if "kalphite" in attrs:
        boss["isKalphite"] = True

    # Slayer monster flag
    if monster.get("is_slayer_monster"):
        boss["isSlayerMonster"] = True

    # Elemental weakness
    if weakness and weakness.get("element"):
        boss["elementalWeakness"] = weakness["element"]
        boss["elementalWeaknessPercent"] = val(weakness.get("severity", 0))

    return boss


def load_current_bosses():
    """Load current boss-presets.ts data for diff comparison."""
    try:
        with open("src/data/boss-presets.ts") as f:
            content = f.read()
    except FileNotFoundError:
        return {}

    bosses = {}
    # Parse boss objects (rough but works for comparison)
    for match in re.finditer(r'\{\s*id:\s*"([^"]+)"[^}]+\}', content):
        boss_text = match.group(0)
        boss_id = match.group(1)
        boss = {"id": boss_id}

        for field in ["defenceLevel", "magicLevel", "hp", "size",
                       "dstab", "dslash", "dcrush", "dranged", "dmagic"]:
            m = re.search(rf'{field}:\s*(-?\d+)', boss_text)
            if m:
                boss[field] = int(m.group(1))

        region_m = re.search(r'region:\s*"([^"]+)"', boss_text)
        if region_m:
            boss["region"] = region_m.group(1)

        bosses[boss_id] = boss
    return bosses


def print_diff(old_bosses, new_bosses):
    """Print stat differences between old and new data."""
    print("\n═══════════════════════════════════════════════════════════════")
    print("STAT DIFFERENCES (old → new)")
    print("═══════════════════════════════════════════════════════════════")

    fields_to_compare = ["defenceLevel", "magicLevel", "hp", "size",
                          "dstab", "dslash", "dcrush", "dranged", "dmagic", "region"]

    total_diffs = 0
    for boss_id, new in new_bosses.items():
        old = old_bosses.get(boss_id)
        if not old:
            print(f"\n  NEW: {boss_id}")
            continue

        diffs = []
        for field in fields_to_compare:
            old_val = old.get(field)
            new_val = new.get(field)
            if old_val != new_val and new_val is not None:
                diffs.append(f"    {field}: {old_val} → {new_val}")

        if diffs:
            total_diffs += len(diffs)
            print(f"\n  {boss_id}:")
            for d in diffs:
                print(d)

    if total_diffs == 0:
        print("\n  No differences found!")
    else:
        print(f"\n  Total: {total_diffs} field changes across all bosses")


def main():
    monsters = fetch_monsters()

    # Fetch regions from wiki
    wiki_regions = fetch_wiki_regions()

    # Apply region overrides
    for boss_id, region in REGION_OVERRIDES.items():
        if region is not None:
            wiki_regions[boss_id] = region
            print(f"  Region override: {boss_id} → {region}")

    # Process each boss from monsters.json
    results = []
    missing = []

    for boss_id, (wiki_name, version_filter) in BOSS_LOOKUP.items():
        monster = find_monster(monsters, wiki_name, version_filter)
        if not monster:
            print(f"  ERROR: Could not find '{wiki_name}' (version: {version_filter}) in monsters.json")
            missing.append(boss_id)
            continue

        region = wiki_regions.get(boss_id)
        if not region:
            print(f"  ERROR: No region for {boss_id} — not found on wiki Areas page or in overrides")
            missing.append(boss_id)
            continue

        display_name = DISPLAY_NAMES.get(boss_id)
        boss = extract_boss_data(boss_id, monster, region, display_name)
        results.append(boss)
        print(f"  ✓ {boss_id}: {boss['name']} (def={boss['defenceLevel']}, hp={boss['hp']}, size={boss['size']}, region={region})")

    # Add manual bosses (not in monsters.json)
    for boss_id, boss_data in MANUAL_BOSSES.items():
        results.append(boss_data)
        print(f"  ✓ {boss_id}: {boss_data['name']} (MANUAL, region={boss_data.get('region', 'none')})")

    if missing:
        print(f"\n  FATAL: {len(missing)} boss(es) could not be resolved: {missing}")
        print("  Fix BOSS_LOOKUP or REGION data before proceeding.")
        sys.exit(1)

    # Load current data for diff
    old_bosses = load_current_bosses()
    new_bosses_map = {b["id"]: b for b in results}
    print_diff(old_bosses, new_bosses_map)

    # Summary of new ranged defence split data
    print("\n═══════════════════════════════════════════════════════════════")
    print("RANGED DEFENCE SPLIT (light / standard / heavy)")
    print("═══════════════════════════════════════════════════════════════")
    for boss in results:
        l, s, h = boss["dranged_light"], boss["dranged_standard"], boss["dranged_heavy"]
        if l != s or s != h:
            print(f"  {boss['id']}: light={l}, standard={s}, heavy={h}")

    # Write output
    with open(OUTPUT_PATH, "w") as f:
        json.dump(results, f, indent=2)

    print(f"\n  Written {len(results)} bosses to {OUTPUT_PATH}")
    print(f"  Total bosses: {len(results)}")


if __name__ == "__main__":
    main()
