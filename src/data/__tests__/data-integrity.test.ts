/**
 * Data Integrity Tests
 *
 * Validates that all static data (items, bosses, pacts) has correct
 * structure, no duplicates, valid references, and wiki-verified values.
 */
import { describe, it, expect } from "vitest";
import { ITEMS, getItem, getItemsBySlot, getItemsByRegion, getItemsForStyle, getAvailableItems } from "@/data/items";
import { BOSS_PRESETS, getBoss, getBossesByRegion } from "@/data/boss-presets";
import type { EquipmentSlot } from "@/types/dps";

// ═══════════════════════════════════════════════════════════════════════
// ITEMS DATA INTEGRITY
// ═══════════════════════════════════════════════════════════════════════

describe("items data integrity", () => {
  it("has items loaded", () => {
    expect(ITEMS.length).toBeGreaterThan(50);
  });

  it("all items have unique IDs", () => {
    const ids = ITEMS.map(i => i.id);
    const dupes = ids.filter((id, idx) => ids.indexOf(id) !== idx);
    expect(dupes).toEqual([]);
  });

  it("all items have a name", () => {
    for (const item of ITEMS) {
      expect(item.name.length).toBeGreaterThan(0);
    }
  });

  it("all items have valid slot", () => {
    const validSlots: EquipmentSlot[] = [
      "head", "cape", "neck", "ammo", "weapon", "body",
      "shield", "legs", "hands", "feet", "ring",
    ];
    for (const item of ITEMS) {
      expect(validSlots).toContain(item.slot);
    }
  });

  it("all items have bonuses object with required keys", () => {
    const requiredKeys = [
      "astab", "aslash", "acrush", "aranged", "amagic",
      "dstab", "dslash", "dcrush", "dranged", "dmagic",
      "mstr", "rstr", "mdmg", "prayer",
    ];
    for (const item of ITEMS) {
      for (const key of requiredKeys) {
        expect(typeof (item.bonuses as unknown as Record<string, number>)[key]).toBe("number");
      }
    }
  });

  it("weapons have attackSpeed", () => {
    const weapons = ITEMS.filter(i => i.slot === "weapon");
    for (const w of weapons) {
      expect(w.attackSpeed).toBeGreaterThan(0);
    }
  });

  it("weapons have combatStyle", () => {
    const weapons = ITEMS.filter(i => i.slot === "weapon");
    for (const w of weapons) {
      expect(["melee", "ranged", "magic"]).toContain(w.combatStyle);
    }
  });

  it("2H weapons are marked as isTwoHanded", () => {
    const twoHandedIds = ["scythe", "tbow", "shadow", "bowfa"];
    for (const id of twoHandedIds) {
      const item = getItem(id);
      expect(item).toBeDefined();
      expect(item!.isTwoHanded).toBe(true);
    }
  });

  it("1H weapons are not marked as isTwoHanded", () => {
    const oneHandedIds = ["whip", "rapier", "fang", "arclight"];
    for (const id of oneHandedIds) {
      const item = getItem(id);
      expect(item).toBeDefined();
      expect(item!.isTwoHanded).toBeFalsy();
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════
// WIKI-VERIFIED ITEM STATS
// Spot-checks against OSRS Wiki equipment database
// ═══════════════════════════════════════════════════════════════════════

describe("wiki-verified item stats", () => {
  it("Abyssal whip: aslash=82, mstr=82, 4t, slash", () => {
    const whip = getItem("whip")!;
    expect(whip.bonuses.aslash).toBe(82);
    expect(whip.bonuses.mstr).toBe(82);
    expect(whip.attackSpeed).toBe(4);
    expect(whip.attackType).toBe("slash");
  });

  it("Osmumten's fang: astab=105, mstr=103, 5t, stab", () => {
    const fang = getItem("fang")!;
    expect(fang.bonuses.astab).toBe(105);
    expect(fang.bonuses.mstr).toBe(103);
    expect(fang.attackSpeed).toBe(5);
    expect(fang.attackType).toBe("stab");
  });

  it("Twisted bow: aranged=70, rstr=20, 6t", () => {
    const tbow = getItem("tbow")!;
    expect(tbow.bonuses.aranged).toBe(70);
    expect(tbow.bonuses.rstr).toBe(20);
    expect(tbow.attackSpeed).toBe(6); // Wiki: 6 ticks base (3.6s)
    expect(tbow.isTwoHanded).toBe(true);
  });

  it("Tumeken's shadow: amagic=35, 5t, powered-staff", () => {
    const shadow = getItem("shadow")!;
    expect(shadow.bonuses.amagic).toBe(35);
    expect(shadow.attackSpeed).toBe(5);
    expect(shadow.weaponCategory).toBe("powered-staff");
    expect(shadow.isTwoHanded).toBe(true);
  });

  it("Scythe of vitur: aslash=125, mstr=75, 5t", () => {
    const scythe = getItem("scythe")!;
    expect(scythe.bonuses.aslash).toBe(125);
    expect(scythe.bonuses.mstr).toBe(75);
    expect(scythe.attackSpeed).toBe(5);
  });

  it("Amulet of torture: mstr=10, astab=15, aslash=15, acrush=15", () => {
    const torture = getItem("torture")!;
    expect(torture.bonuses.mstr).toBe(10);
    expect(torture.bonuses.astab).toBe(15);
    expect(torture.bonuses.aslash).toBe(15);
    expect(torture.bonuses.acrush).toBe(15);
  });

  it("Necklace of anguish: rstr=5, aranged=15", () => {
    const anguish = getItem("anguish")!;
    expect(anguish.bonuses.rstr).toBe(5);
    expect(anguish.bonuses.aranged).toBe(15);
  });

  it("Occult necklace: mdmg=5, amagic=12", () => {
    const occult = getItem("occult")!;
    expect(occult.bonuses.mdmg).toBe(5);
    expect(occult.bonuses.amagic).toBe(12);
  });

  it("Avernic defender: mstr=8, astab=30, aslash=29, acrush=28", () => {
    const avernic = getItem("avernic")!;
    expect(avernic.bonuses.mstr).toBe(8);
    expect(avernic.bonuses.astab).toBe(30);
    expect(avernic.bonuses.aslash).toBe(29);
    expect(avernic.bonuses.acrush).toBe(28);
  });

  it("Infernal cape: mstr=8, astab=4, aslash=4, acrush=4", () => {
    const infernal = getItem("infernal-cape")!;
    expect(infernal.bonuses.mstr).toBe(8);
    expect(infernal.bonuses.astab).toBe(4);
    expect(infernal.bonuses.aslash).toBe(4);
    expect(infernal.bonuses.acrush).toBe(4);
  });

  it("Ferocious gloves: mstr=14, astab=16, aslash=16, acrush=16", () => {
    const ferocious = getItem("ferocious")!;
    expect(ferocious.bonuses.mstr).toBe(14);
    expect(ferocious.bonuses.astab).toBe(16);
    expect(ferocious.bonuses.aslash).toBe(16);
    expect(ferocious.bonuses.acrush).toBe(16);
  });

  it("Dragon arrow: rstr=60", () => {
    const arrow = getItem("dragon-arrows")!;
    expect(arrow.bonuses.rstr).toBe(60);
  });

  it("Ruby dragon bolts (e): ammo slot", () => {
    const bolts = getItem("ruby-bolts-e")!;
    expect(bolts.slot).toBe("ammo");
  });
});

// ═══════════════════════════════════════════════════════════════════════
// ITEM HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════

describe("item helper functions", () => {
  it("getItem returns correct item by ID", () => {
    expect(getItem("whip")?.name).toBe("Abyssal whip");
    expect(getItem("nonexistent")).toBeUndefined();
  });

  it("getItemsBySlot returns items for that slot only", () => {
    const weapons = getItemsBySlot("weapon");
    expect(weapons.length).toBeGreaterThan(10);
    for (const item of weapons) {
      expect(item.slot).toBe("weapon");
    }
  });

  it("getItemsByRegion filters correctly", () => {
    const morytaniaItems = getItemsByRegion("morytania");
    expect(morytaniaItems.length).toBeGreaterThan(0);
    for (const item of morytaniaItems) {
      expect(item.region).toBe("morytania");
    }
  });

  it("getAvailableItems includes regionless items", () => {
    const available = getAvailableItems([]);
    // Should include items without a region
    const regionless = available.filter(i => !i.region);
    expect(regionless.length).toBeGreaterThan(0);
  });

  it("getAvailableItems includes items from specified regions", () => {
    const available = getAvailableItems(["morytania"]);
    const morytania = available.filter(i => i.region === "morytania");
    expect(morytania.length).toBeGreaterThan(0);
    // Should NOT include items from other regions
    const desert = available.filter(i => i.region === "desert");
    expect(desert.length).toBe(0);
  });

  it("getAvailableItems with multiple regions includes all", () => {
    const available = getAvailableItems(["morytania", "desert"]);
    const morytania = available.filter(i => i.region === "morytania");
    const desert = available.filter(i => i.region === "desert");
    expect(morytania.length).toBeGreaterThan(0);
    expect(desert.length).toBeGreaterThan(0);
    // Should NOT include items from other regions
    const kourend = available.filter(i => i.region === "kourend");
    expect(kourend.length).toBe(0);
  });

  it("getItemsForStyle returns melee weapons and gear", () => {
    const melee = getItemsForStyle("melee");
    expect(melee.length).toBeGreaterThan(10);
    // Should include whip (melee weapon)
    expect(melee.some(i => i.id === "whip")).toBe(true);
    // Should NOT include tbow (ranged weapon)
    expect(melee.some(i => i.id === "tbow")).toBe(false);
    // Should include torture amulet (has mstr/astab)
    expect(melee.some(i => i.id === "torture")).toBe(true);
  });

  it("getItemsForStyle returns ranged weapons and gear", () => {
    const ranged = getItemsForStyle("ranged");
    expect(ranged.length).toBeGreaterThan(5);
    // Should include tbow (ranged weapon)
    expect(ranged.some(i => i.id === "tbow")).toBe(true);
    // Should NOT include whip (melee weapon)
    expect(ranged.some(i => i.id === "whip")).toBe(false);
    // Should include anguish (has rstr/aranged)
    expect(ranged.some(i => i.id === "anguish")).toBe(true);
  });

  it("getItemsForStyle returns magic weapons and gear", () => {
    const magic = getItemsForStyle("magic");
    expect(magic.length).toBeGreaterThan(5);
    // Should include shadow (magic weapon)
    expect(magic.some(i => i.id === "shadow")).toBe(true);
    // Should NOT include whip (melee weapon)
    expect(magic.some(i => i.id === "whip")).toBe(false);
    // Should include occult (has mdmg/amagic)
    expect(magic.some(i => i.id === "occult")).toBe(true);
  });

  it("getItemsBySlot returns no items for non-matching slot check", () => {
    const weapons = getItemsBySlot("weapon");
    for (const w of weapons) {
      expect(w.slot).toBe("weapon");
    }
    const rings = getItemsBySlot("ring");
    for (const r of rings) {
      expect(r.slot).toBe("ring");
    }
    // Ensure no overlap
    const weaponIds = new Set(weapons.map(w => w.id));
    for (const r of rings) {
      expect(weaponIds.has(r.id)).toBe(false);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════
// ECHO ITEMS
// ═══════════════════════════════════════════════════════════════════════

describe("echo items", () => {
  const echoIds = [
    "echo-vs-helm", "echo-kings-barrage", "echo-tecpatl", "echo-fang-hound",
    "echo-shadowflame", "echo-natures-recurve", "echo-devils-element",
    "echo-crystal-blessing", "echo-lithic-sceptre", "echo-drygore-blowpipe",
  ];

  it("all 10 echo items exist", () => {
    for (const id of echoIds) {
      expect(getItem(id)).toBeDefined();
    }
  });

  it("echo items have passive descriptions", () => {
    for (const id of echoIds) {
      const item = getItem(id)!;
      expect(item.passive).toBeDefined();
      expect(item.passive!.length).toBeGreaterThan(0);
    }
  });

  it("echo items have region assignments", () => {
    for (const id of echoIds) {
      const item = getItem(id)!;
      expect(item.region).toBeDefined();
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════
// BOSS PRESETS DATA INTEGRITY
// ═══════════════════════════════════════════════════════════════════════

describe("boss presets data integrity", () => {
  it("has boss presets loaded", () => {
    expect(BOSS_PRESETS.length).toBeGreaterThan(20);
  });

  it("all bosses have unique IDs", () => {
    const ids = BOSS_PRESETS.map(b => b.id);
    const dupes = ids.filter((id, idx) => ids.indexOf(id) !== idx);
    expect(dupes).toEqual([]);
  });

  it("all bosses have required numeric fields", () => {
    for (const boss of BOSS_PRESETS) {
      expect(boss.defenceLevel).toBeGreaterThanOrEqual(0);
      expect(boss.magicLevel).toBeGreaterThanOrEqual(0);
      expect(boss.hp).toBeGreaterThan(0);
      expect(typeof boss.dstab).toBe("number");
      expect(typeof boss.dslash).toBe("number");
      expect(typeof boss.dcrush).toBe("number");
      expect(typeof boss.dranged).toBe("number");
      expect(typeof boss.dmagic).toBe("number");
    }
  });

  it("all bosses have names", () => {
    for (const boss of BOSS_PRESETS) {
      expect(boss.name.length).toBeGreaterThan(0);
    }
  });

  it("getBoss returns correct boss by ID", () => {
    expect(getBoss("graardor")?.name).toBe("General Graardor");
    expect(getBoss("nonexistent")).toBeUndefined();
  });

  it("getBossesByRegion filters correctly", () => {
    const asgarnia = getBossesByRegion("asgarnia");
    expect(asgarnia.length).toBeGreaterThan(0);
    for (const boss of asgarnia) {
      expect(boss.region).toBe("asgarnia");
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════
// WIKI-VERIFIED BOSS STATS
// Spot-checks against OSRS Wiki monster database
// ═══════════════════════════════════════════════════════════════════════

describe("wiki-verified boss stats", () => {
  it("General Graardor: def=250, magicLevel=80, hp=255, size=4", () => {
    const boss = getBoss("graardor")!;
    expect(boss.defenceLevel).toBe(250);
    expect(boss.magicLevel).toBe(80);
    expect(boss.hp).toBe(255);
    expect(boss.dstab).toBe(90);
    expect(boss.dslash).toBe(90);
    expect(boss.region).toBe("asgarnia");
    expect(boss.size).toBe(4);
  });

  it("Vorkath: isDragon=true, isUndead=true, region=fremennik", () => {
    const boss = getBoss("vorkath")!;
    expect(boss.isDragon).toBe(true);
    expect(boss.isUndead).toBe(true);
    expect(boss.region).toBe("fremennik");
  });

  it("K'ril Tsutsaroth: isDemon=true", () => {
    const boss = getBoss("kril")!;
    expect(boss.isDemon).toBe(true);
    expect(boss.region).toBe("asgarnia");
  });

  it("Kalphite Queen: isKalphite=true, region=desert", () => {
    const boss = getBoss("kq")!;
    expect(boss.isKalphite).toBe(true);
    expect(boss.region).toBe("desert");
  });

  it("Verzik P3: isUndead=true, region=morytania", () => {
    const boss = getBoss("verzik-p3")!;
    expect(boss.isUndead).toBe(true);
    expect(boss.region).toBe("morytania");
  });

  it("Zulrah: hp=500, dmagic=-45", () => {
    const boss = getBoss("zulrah")!;
    expect(boss.hp).toBe(500);
    expect(boss.dmagic).toBe(-45);
    expect(boss.region).toBe("kandarin");
  });

  it("Wardens P3: dmagic=-60 (weak to magic)", () => {
    const boss = getBoss("wardens-p3")!;
    expect(boss.dmagic).toBe(-60);
    expect(boss.region).toBe("desert");
  });

  it("Great Olm: isDragon=true, region=kourend", () => {
    const olm = getBoss("olm-head")!;
    expect(olm.isDragon).toBe(true);
    expect(olm.region).toBe("kourend");
  });

  it("Alchemical Hydra: isDragon=true, region=kourend", () => {
    const hydra = getBoss("hydra")!;
    expect(hydra.isDragon).toBe(true);
    expect(hydra.region).toBe("kourend");
  });

  it("Corp is in Asgarnia (not Wilderness)", () => {
    const corp = getBoss("corp")!;
    expect(corp.region).toBe("asgarnia");
  });

  it("Jad is in Karamja", () => {
    const jad = getBoss("jad")!;
    expect(jad.region).toBe("karamja");
  });

  it("Sol Heredit is in Varlamore", () => {
    const sol = getBoss("sol-heredit")!;
    expect(sol.region).toBe("varlamore");
  });

  it("DT2 bosses use league region classifications", () => {
    expect(getBoss("duke")!.region).toBe("fremennik");
    expect(getBoss("leviathan")!.region).toBe("desert");
    expect(getBoss("whisperer")!.region).toBe("asgarnia");
    expect(getBoss("vardorvis")!.region).toBe("varlamore");
  });

  it("custom target: def=1, all bonuses=0", () => {
    const boss = getBoss("custom")!;
    expect(boss.defenceLevel).toBe(1);
    expect(boss.dstab).toBe(0);
    expect(boss.dslash).toBe(0);
    expect(boss.dcrush).toBe(0);
    expect(boss.dranged).toBe(0);
    expect(boss.dmagic).toBe(0);
    expect(boss.hp).toBe(100);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// ITEM REGION ASSIGNMENTS (memory notes — confirmed correct locations)
// ═══════════════════════════════════════════════════════════════════════

describe("item region assignments", () => {
  it("Torva is in Asgarnia (from Nex/GWD)", () => {
    expect(getItem("torva-helm")!.region).toBe("asgarnia");
    expect(getItem("torva-body")!.region).toBe("asgarnia");
    expect(getItem("torva-legs")!.region).toBe("asgarnia");
  });

  it("Scythe of Vitur is in Morytania (from ToB)", () => {
    expect(getItem("scythe")!.region).toBe("morytania");
  });

  it("Twisted bow is in Kourend (from CoX)", () => {
    expect(getItem("tbow")!.region).toBe("kourend");
  });

  it("Shadow and Fang are in Desert (from ToA)", () => {
    expect(getItem("shadow")!.region).toBe("desert");
    expect(getItem("fang")!.region).toBe("desert");
  });

  it("Bowfa and Crystal are in Tirannwn (from Gauntlet)", () => {
    expect(getItem("bowfa")!.region).toBe("tirannwn");
    expect(getItem("crystal-helm")!.region).toBe("tirannwn");
  });

  it("Wilderness weapons are in Wilderness", () => {
    expect(getItem("craws-bow")!.region).toBe("wilderness");
    expect(getItem("viggoras-chainmace")!.region).toBe("wilderness");
  });

  it("Whip has no region (available everywhere)", () => {
    expect(getItem("whip")!.region).toBeUndefined();
  });

  it("Barrows gloves have no region", () => {
    expect(getItem("barrows-gloves")!.region).toBeUndefined();
  });
});

// ════════════════════════════════════���══════════════════════════════════
// BOSS SIZE AND ADDITIONAL DATA INTEGRITY
// ══════════════════��════════════════════════════════════════════════════

describe("all bosses have size", () => {
  it("every boss preset has a defined size field", () => {
    for (const boss of BOSS_PRESETS) {
      expect(boss.size).toBeDefined();
      expect(boss.size).toBeGreaterThanOrEqual(1);
    }
  });

  it("boss sizes match known wiki values", () => {
    expect(getBoss("graardor")!.size).toBe(4);
    expect(getBoss("kreearra")!.size).toBe(5);
    expect(getBoss("vorkath")!.size).toBe(7);
    expect(getBoss("duke")!.size).toBe(7);
    expect(getBoss("zuk")!.size).toBe(7);
    expect(getBoss("whisperer")!.size).toBe(1);
    expect(getBoss("vardorvis")!.size).toBe(2);
    expect(getBoss("custom")!.size).toBe(1);
  });
});

describe("echo items isTwoHanded correct", () => {
  it("2H echo items are marked isTwoHanded", () => {
    const twoHandedEchos = [
      "echo-tecpatl",
      "echo-shadowflame",
      "echo-natures-recurve",
      "echo-kings-barrage",
      "echo-lithic-sceptre",
      "echo-drygore-blowpipe",
    ];
    for (const id of twoHandedEchos) {
      const item = getItem(id);
      expect(item).toBeDefined();
      expect(item!.isTwoHanded).toBe(true);
    }
  });

  it("1H echo items are NOT marked isTwoHanded", () => {
    const oneHandedEchos = [
      "echo-fang-hound",
    ];
    for (const id of oneHandedEchos) {
      const item = getItem(id);
      expect(item).toBeDefined();
      expect(item!.isTwoHanded).toBeFalsy();
    }
  });

  it("non-weapon echo items have no isTwoHanded flag", () => {
    const nonWeaponEchos = [
      "echo-vs-helm",
      "echo-devils-element",
      "echo-crystal-blessing",
    ];
    for (const id of nonWeaponEchos) {
      const item = getItem(id);
      expect(item).toBeDefined();
      expect(item!.isTwoHanded).toBeFalsy();
    }
  });
});

describe("specific boss data", () => {
  it("Demonic Gorillas: region=kandarin, isDemon=true", () => {
    const boss = getBoss("demonic-gorillas")!;
    expect(boss).toBeDefined();
    expect(boss.region).toBe("kandarin");
    expect(boss.isDemon).toBe(true);
    expect(boss.size).toBe(2);
  });

  it("Giant Mole: defenceLevel=50, all defence bonuses 0", () => {
    const boss = getBoss("giant-mole")!;
    expect(boss).toBeDefined();
    expect(boss.defenceLevel).toBe(50);
    expect(boss.dstab).toBe(0);
    expect(boss.dslash).toBe(0);
    expect(boss.dcrush).toBe(0);
    expect(boss.dranged).toBe(0);
    expect(boss.dmagic).toBe(0);
    expect(boss.hp).toBe(200);
    expect(boss.region).toBe("asgarnia");
    expect(boss.size).toBe(3);
  });
});
