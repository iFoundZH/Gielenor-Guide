/**
 * Gear Optimizer Unit Tests
 *
 * Tests the brute-force gear optimizer:
 * - Slot candidate filtering by region + style
 * - Dominated item pruning
 * - Top-N heap correctness
 * - 2H weapons blocking shield slot
 * - Locked slots
 * - Optimizer returns valid DPS results
 */
import { describe, it, expect } from "vitest";
import { optimizeGear, optimizeBuild, isNodeRelevantForStyle, getAmmoCategory, getCompatibleAmmo } from "@/lib/gear-optimizer";
import { calculateDps } from "@/lib/dps-engine";
import { getItem } from "@/data/items";
import { getBoss } from "@/data/boss-presets";
import { validateSelection, getNode, getAllNodes } from "@/data/pacts";
import { PACT_POINT_LIMIT } from "@/types/dps";
import type { PlayerConfig, OptimizerConfig, BuildLoadout } from "@/types/dps";

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════

function defaultPlayer(overrides: Partial<PlayerConfig> = {}): PlayerConfig {
  return {
    attack: 99, strength: 99, defence: 99, ranged: 99, magic: 99,
    prayer: 99, hitpoints: 99,
    potion: "super-combat", prayerType: "piety",
    attackStyle: "accurate", combatStyle: "melee",
    regions: ["asgarnia", "morytania", "kourend", "desert", "tirannwn", "fremennik", "kandarin", "wilderness", "varlamore", "karamja"],
    activePacts: [], voidSet: "none", onSlayerTask: false,
    ...overrides,
  };
}

const custom = getBoss("custom")!;

// ═══════════════════════════════════════════════════════════════════════
// BASIC OPTIMIZER TESTS
// ═══════════════════════════════════════════════════════════════════════

describe("optimizeGear", { timeout: 600_000 }, () => {
  it("returns results sorted by DPS descending", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer(),
      target: custom,
      lockedSlots: {},
      topN: 5,
    };
    const results = optimizeGear(config);
    expect(results.length).toBeGreaterThan(0);
    expect(results.length).toBeLessThanOrEqual(5);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].result.dps).toBeGreaterThanOrEqual(results[i].result.dps);
    }
  });

  it("top result has higher DPS than a known baseline", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer(),
      target: custom,
      lockedSlots: {},
      topN: 1,
    };
    const results = optimizeGear(config);
    expect(results.length).toBe(1);
    // Whip alone DPS ≈ 7.19 with super combat + piety
    expect(results[0].result.dps).toBeGreaterThan(7);
  });

  it("every result has a weapon equipped", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer(),
      target: custom,
      lockedSlots: {},
      topN: 10,
    };
    const results = optimizeGear(config);
    for (const r of results) {
      expect(r.loadout.weapon).not.toBeNull();
    }
  });

  it("every result has valid DPS (positive number)", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer(),
      target: custom,
      lockedSlots: {},
      topN: 10,
    };
    const results = optimizeGear(config);
    for (const r of results) {
      expect(r.result.dps).toBeGreaterThan(0);
      expect(Number.isFinite(r.result.dps)).toBe(true);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════
// 2H WEAPON HANDLING
// ═══════════════════════════════════════════════════════════════════════

describe("2H weapon handling", { timeout: 600_000 }, () => {
  it("2H weapon results have null shield", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer({ combatStyle: "ranged", attackStyle: "rapid", potion: "ranging", prayerType: "rigour" }),
      target: custom,
      lockedSlots: {},
      topN: 20,
    };
    const results = optimizeGear(config);
    for (const r of results) {
      if (r.loadout.weapon?.isTwoHanded) {
        expect(r.loadout.shield).toBeNull();
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════
// LOCKED SLOTS
// ═══════════════════════════════════════════════════════════════════════

describe("locked slots", { timeout: 600_000 }, () => {
  it("locked weapon is used in all results", () => {
    const whip = getItem("whip")!;
    const config: OptimizerConfig = {
      player: defaultPlayer(),
      target: custom,
      lockedSlots: { weapon: whip } as Partial<BuildLoadout>,
      topN: 5,
    };
    const results = optimizeGear(config);
    for (const r of results) {
      expect(r.loadout.weapon?.id).toBe("whip");
    }
  });

  it("locked head slot is preserved", () => {
    const slayerHelm = getItem("slayer-helm-i")!;
    const config: OptimizerConfig = {
      player: defaultPlayer({ onSlayerTask: true }),
      target: custom,
      lockedSlots: { head: slayerHelm } as Partial<BuildLoadout>,
      topN: 5,
    };
    const results = optimizeGear(config);
    for (const r of results) {
      expect(r.loadout.head?.id).toBe("slayer-helm-i");
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════
// REGION FILTERING
// ═══════════════════════════════════════════════════════════════════════

describe("region filtering", { timeout: 600_000 }, () => {
  it("without morytania, scythe is not in results", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer({ regions: ["asgarnia", "desert"] }), // no morytania
      target: custom,
      lockedSlots: {},
      topN: 20,
    };
    const results = optimizeGear(config);
    for (const r of results) {
      expect(r.loadout.weapon?.id).not.toBe("scythe");
    }
  });

  it("regionless items (d-scim, soulreaper-axe) are always available", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer({ regions: [] }), // no regions
      target: custom,
      lockedSlots: {},
      topN: 5,
    };
    const results = optimizeGear(config);
    // Should still have results with regionless weapons like d-scim or soulreaper axe
    expect(results.length).toBeGreaterThan(0);
  });

  it("region-locked items don't appear without their region", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer({
        combatStyle: "ranged", attackStyle: "rapid",
        potion: "ranging", prayerType: "rigour",
        regions: ["wilderness", "varlamore", "karamja"],
      }),
      target: custom,
      lockedSlots: {},
      topN: 50,
    };
    const results = optimizeGear(config);
    for (const r of results) {
      const allItems = [
        r.loadout.head, r.loadout.cape, r.loadout.neck, r.loadout.ammo,
        r.loadout.weapon, r.loadout.body, r.loadout.shield,
        r.loadout.legs, r.loadout.hands, r.loadout.feet, r.loadout.ring,
      ].filter(Boolean);
      // Pegasian (asgarnia), anguish (kandarin), ferocious (kourend) should NOT appear
      const ids = allItems.map(i => i!.id);
      expect(ids).not.toContain("pegasian");
      expect(ids).not.toContain("anguish");
      expect(ids).not.toContain("ferocious");
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════
// COMBAT STYLE FILTERING
// ═══════════════════════════════════════════════════════════════════════

describe("combat style filtering", { timeout: 600_000 }, () => {
  it("melee optimizer only uses melee weapons", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer({ combatStyle: "melee" }),
      target: custom,
      lockedSlots: {},
      topN: 10,
    };
    const results = optimizeGear(config);
    for (const r of results) {
      const weapon = r.loadout.weapon;
      expect(weapon).not.toBeNull();
      // Weapon should be melee-style or no style (generic)
      if (weapon?.combatStyle) {
        expect(weapon.combatStyle).toBe("melee");
      }
    }
  });

  it("ranged optimizer only uses ranged weapons", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer({
        combatStyle: "ranged", attackStyle: "rapid",
        potion: "ranging", prayerType: "rigour",
      }),
      target: custom,
      lockedSlots: {},
      topN: 10,
    };
    const results = optimizeGear(config);
    for (const r of results) {
      if (r.loadout.weapon?.combatStyle) {
        expect(r.loadout.weapon.combatStyle).toBe("ranged");
      }
    }
  });

  it("magic optimizer only uses magic weapons", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer({
        combatStyle: "magic", attackStyle: "autocast",
        potion: "magic", prayerType: "augury",
      }),
      target: custom,
      lockedSlots: {},
      topN: 10,
    };
    const results = optimizeGear(config);
    for (const r of results) {
      if (r.loadout.weapon?.combatStyle) {
        expect(r.loadout.weapon.combatStyle).toBe("magic");
      }
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════
// WEAPON DIVERSITY
// ═══════════════════════════════════════════════════════════════════════

describe("weapon diversity", { timeout: 600_000 }, () => {
  it("magic results include diverse weapons, not all the same", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer({
        combatStyle: "magic", attackStyle: "autocast",
        potion: "magic", prayerType: "augury",
      }),
      target: custom,
      lockedSlots: {},
      topN: 5,
    };
    const results = optimizeGear(config);
    const weaponIds = new Set(results.map(r => r.loadout.weapon?.id));
    // With all regions, should have at least 3 different weapons in top 5
    expect(weaponIds.size).toBeGreaterThanOrEqual(3);
  });

  it("melee results include diverse weapons", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer(),
      target: custom,
      lockedSlots: {},
      topN: 5,
    };
    const results = optimizeGear(config);
    const weaponIds = new Set(results.map(r => r.loadout.weapon?.id));
    expect(weaponIds.size).toBeGreaterThanOrEqual(3);
  });

  it("Shadow beats Trident when desert is unlocked (all regions)", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer({
        combatStyle: "magic", attackStyle: "autocast",
        potion: "magic", prayerType: "augury",
      }),
      target: custom,
      lockedSlots: {},
      topN: 10,
    };
    const results = optimizeGear(config);
    const shadowIdx = results.findIndex(r => r.loadout.weapon?.id === "shadow");
    const tridentIdx = results.findIndex(r => r.loadout.weapon?.id === "trident-swamp");
    // Shadow should appear in results and rank above Trident
    expect(shadowIdx).toBeGreaterThanOrEqual(0);
    expect(tridentIdx).toBeGreaterThanOrEqual(0);
    expect(shadowIdx).toBeLessThan(tridentIdx);
  });

  it("1H weapons still appear when shield pool is empty", () => {
    // Use regions with no magic shields
    const config: OptimizerConfig = {
      player: defaultPlayer({
        combatStyle: "magic", attackStyle: "autocast",
        potion: "magic", prayerType: "augury",
        regions: [], // no regions — very limited items
      }),
      target: custom,
      lockedSlots: {},
      topN: 5,
    };
    const results = optimizeGear(config);
    // Should still have results (1H weapons tested with null shield)
    expect(results.length).toBeGreaterThan(0);
    const has1H = results.some(r => r.loadout.weapon && !r.loadout.weapon.isTwoHanded);
    expect(has1H).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// AMMO CLASSIFICATION & COMPATIBILITY
// ═══════════════════════════════════════════════════════════════════════

describe("ammo classification", () => {
  it("classifies arrows correctly", () => {
    const arrow = getItem("dragon-arrows")!;
    expect(arrow).toBeDefined();
    expect(getAmmoCategory(arrow)).toBe("arrow");
  });

  it("classifies bolts correctly", () => {
    const bolt = getItem("ruby-dragon-bolts-e")!;
    expect(bolt).toBeDefined();
    expect(getAmmoCategory(bolt)).toBe("bolt");
  });

  it("classifies darts correctly", () => {
    const dart = getItem("atlatl-dart")!;
    expect(dart).toBeDefined();
    expect(getAmmoCategory(dart)).toBe("dart");
  });

  it("classifies javelins correctly", () => {
    const jav = getItem("dragon-javelin")!;
    expect(jav).toBeDefined();
    expect(getAmmoCategory(jav)).toBe("javelin");
  });

  it("classifies blessings correctly", () => {
    const blessing = getItem("echo-crystal-blessing")!;
    expect(blessing).toBeDefined();
    expect(getAmmoCategory(blessing)).toBe("blessing");
  });
});

describe("weapon-ammo compatibility", () => {
  it("bows use arrows and blessings", () => {
    const tbow = getItem("tbow")!;
    expect(tbow).toBeDefined();
    const compat = getCompatibleAmmo(tbow)!;
    expect(compat).toContain("arrow");
    expect(compat).toContain("blessing");
    expect(compat).not.toContain("bolt");
    expect(compat).not.toContain("javelin");
  });

  it("crossbows use bolts and blessings (not javelins or arrows)", () => {
    const zcb = getItem("zcb")!;
    expect(zcb).toBeDefined();
    const compat = getCompatibleAmmo(zcb)!;
    expect(compat).toContain("bolt");
    expect(compat).toContain("blessing");
    expect(compat).not.toContain("arrow");
    expect(compat).not.toContain("javelin");
  });

  it("blowpipes use darts and blessings", () => {
    const bp = getItem("blowpipe")!;
    expect(bp).toBeDefined();
    const compat = getCompatibleAmmo(bp)!;
    expect(compat).toContain("dart");
    expect(compat).toContain("blessing");
    expect(compat).not.toContain("arrow");
    expect(compat).not.toContain("bolt");
  });

  it("melee weapons return null (no ammo restriction)", () => {
    const whip = getItem("whip")!;
    expect(getCompatibleAmmo(whip)).toBeNull();
  });
});

describe("ranged optimizer ammo pairing", { timeout: 600_000 }, () => {
  const rangedPlayer = defaultPlayer({
    combatStyle: "ranged", attackStyle: "rapid",
    potion: "ranging", prayerType: "rigour",
  });

  it("TBow uses arrows, not bolts or javelins", () => {
    const tbow = getItem("tbow")!;
    expect(tbow).toBeDefined();
    const config: OptimizerConfig = {
      player: rangedPlayer,
      target: custom,
      lockedSlots: { weapon: tbow } as Partial<BuildLoadout>,
      topN: 1,
    };
    const results = optimizeGear(config);
    expect(results.length).toBe(1);
    const ammo = results[0].loadout.ammo;
    expect(ammo).not.toBeNull();
    const ammoName = ammo!.name.toLowerCase();
    expect(ammoName).toMatch(/arrow|blessing/);
    expect(ammoName).not.toMatch(/bolt|javelin/);
  });

  it("ZCB uses bolts, not arrows", () => {
    const zcb = getItem("zcb")!;
    expect(zcb).toBeDefined();
    const config: OptimizerConfig = {
      player: rangedPlayer,
      target: custom,
      lockedSlots: { weapon: zcb } as Partial<BuildLoadout>,
      topN: 1,
    };
    const results = optimizeGear(config);
    expect(results.length).toBe(1);
    const ammo = results[0].loadout.ammo;
    expect(ammo).not.toBeNull();
    const ammoName = ammo!.name.toLowerCase();
    expect(ammoName).toMatch(/bolt|blessing/);
    expect(ammoName).not.toMatch(/arrow|javelin/);
  });

  it("ranged results include diverse weapon categories", () => {
    const config: OptimizerConfig = {
      player: rangedPlayer,
      target: custom,
      lockedSlots: {},
      topN: 20,
    };
    const results = optimizeGear(config);
    const categories = new Set(results.map(r => r.loadout.weapon?.weaponCategory));
    // Should have at least bow and crossbow categories
    expect(categories.has("bow")).toBe(true);
    expect(categories.has("crossbow")).toBe(true);
  });

  it("ZCB is not pruned by bowfa (cross-category pruning prevented)", () => {
    const config: OptimizerConfig = {
      player: rangedPlayer,
      target: custom,
      lockedSlots: {},
      topN: 50, // enough to include crossbows among many wiki weapons
    };
    const results = optimizeGear(config);
    const weaponIds = results.map(r => r.loadout.weapon?.id);
    expect(weaponIds).toContain("zcb");
  });

  it("all ranged results have valid DPS (not inflated by wrong ammo)", () => {
    const config: OptimizerConfig = {
      player: rangedPlayer,
      target: custom,
      lockedSlots: {},
      topN: 20,
    };
    const results = optimizeGear(config);
    for (const r of results) {
      expect(r.result.dps).toBeGreaterThan(0);
      expect(Number.isFinite(r.result.dps)).toBe(true);
      // No DPS should be wildly inflated (e.g., >30 would be suspicious for custom target)
      expect(r.result.dps).toBeLessThan(30);
    }
  });
});

// ═══════════════════════════════════════════════════════════════════════
// OPTIMIZER VS SPECIFIC BOSSES
// ═══════════════════════════════════════════════════════════════════════

describe("optimizer boss-specific", { timeout: 600_000 }, () => {
  it("vs Vorkath (dragon), DHCB or DHL appears in top results", () => {
    const vorkath = getBoss("vorkath")!;
    const config: OptimizerConfig = {
      player: defaultPlayer({ combatStyle: "melee" }),
      target: vorkath,
      lockedSlots: {},
      topN: 5,
    };
    const results = optimizeGear(config);
    const weaponIds = results.map(r => r.loadout.weapon?.id);
    // DHL should be highly ranked against dragons
    const hasDragonHunter = weaponIds.some(id => id === "dhl" || id === "dhcb");
    expect(hasDragonHunter).toBe(true);
  });

  it("vs K'ril (demon), anti-demon weapons appear in top results", () => {
    const kril = getBoss("kril")!;
    const config: OptimizerConfig = {
      player: defaultPlayer({ combatStyle: "melee", regions: ["varlamore", "karamja"] }),
      target: kril,
      lockedSlots: {},
      topN: 10,
    };
    const results = optimizeGear(config);
    const weaponIds = results.map(r => r.loadout.weapon?.id);
    // Arclight is unobtainable in DP league; echo-tecpatl is the demon-killer
    const hasAntiDemon = weaponIds.some(id => id === "echo-tecpatl");
    expect(hasAntiDemon).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// PACT BEAM SEARCH (via optimizeBuild)
// ═══════════════════════════════════════════════════════════════════════

describe("pact beam search optimization", { timeout: 600_000 }, () => {
  it("fills all 40 pact points when activePacts is empty (auto)", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer({ activePacts: [] }),
      target: custom,
      lockedSlots: {},
      topN: 3,
    };
    const results = optimizeBuild(config);
    expect(results.length).toBeGreaterThan(0);

    // Best result should have optimized pacts filling the full 40-point budget
    const best = results[0];
    expect(best.optimizedConfig?.activePacts).toBeDefined();
    expect(best.optimizedConfig!.activePacts!.length).toBe(PACT_POINT_LIMIT);
  }, 600_000);

  it("optimized pacts form a valid connected tree", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer({ activePacts: [] }),
      target: custom,
      lockedSlots: {},
      topN: 1,
    };
    const results = optimizeBuild(config);
    const pacts = results[0].optimizedConfig?.activePacts ?? [];
    const sel = new Set(pacts);
    const { valid, error } = validateSelection(sel);
    expect(valid).toBe(true);
    if (error) throw new Error(error);
  }, 600_000);

  it("optimized pacts produce higher DPS than no pacts", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer({ activePacts: [] }),
      target: custom,
      lockedSlots: {},
      topN: 1,
    };
    const results = optimizeBuild(config);

    // Compare: same gear, no pacts
    const noPactConfig: OptimizerConfig = {
      player: defaultPlayer({ activePacts: ["node1"] }), // minimal pacts — not auto
      target: custom,
      lockedSlots: {},
      topN: 1,
    };
    const noPactResults = optimizeGear(noPactConfig);

    expect(results[0].result.dps).toBeGreaterThan(noPactResults[0].result.dps);
  }, 600_000);

  it("works for ranged style", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer({
        combatStyle: "ranged", attackStyle: "auto", potion: "auto", prayerType: "auto",
        activePacts: [],
      }),
      target: custom,
      lockedSlots: {},
      topN: 1,
    };
    const results = optimizeBuild(config);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].optimizedConfig?.activePacts?.length).toBe(PACT_POINT_LIMIT);
  }, 600_000);

  it("works for magic style", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer({
        combatStyle: "magic", attackStyle: "auto", potion: "auto", prayerType: "auto",
        activePacts: [],
      }),
      target: custom,
      lockedSlots: {},
      topN: 1,
    };
    const results = optimizeBuild(config);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].optimizedConfig?.activePacts?.length).toBe(PACT_POINT_LIMIT);
  }, 600_000);
});

// ═══════════════════════════════════════════════════════════════════════
// PACT STYLE RELEVANCE
// ═══════════════════════════════════════════════════════════════════════

describe("pact style relevance", { timeout: 600_000 }, () => {
  function countBranchPacts(pacts: string[], branch: string): number {
    return pacts.filter(id => {
      const node = getNode(id);
      return node?.branch === branch;
    }).length;
  }

  it("melee build selects mostly melee + neutral pacts (fewer than 5 ranged)", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer({ activePacts: [] }),
      target: custom,
      lockedSlots: {},
      topN: 1,
    };
    const results = optimizeBuild(config);
    const pacts = results[0].optimizedConfig!.activePacts!;
    const rangedCount = countBranchPacts(pacts, "ranged");
    expect(rangedCount).toBeLessThan(5);
  }, 600_000);

  it("ranged build selects mostly ranged + neutral pacts (fewer than 5 melee)", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer({
        combatStyle: "ranged", attackStyle: "auto", potion: "auto", prayerType: "auto",
        activePacts: [],
      }),
      target: custom,
      lockedSlots: {},
      topN: 1,
    };
    const results = optimizeBuild(config);
    const pacts = results[0].optimizedConfig!.activePacts!;
    const meleeCount = countBranchPacts(pacts, "melee");
    expect(meleeCount).toBeLessThan(5);
  }, 600_000);

  it("magic build selects mostly magic + neutral pacts (fewer than 5 melee)", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer({
        combatStyle: "magic", attackStyle: "auto", potion: "auto", prayerType: "auto",
        activePacts: [],
      }),
      target: custom,
      lockedSlots: {},
      topN: 1,
    };
    const results = optimizeBuild(config);
    const pacts = results[0].optimizedConfig!.activePacts!;
    const meleeCount = countBranchPacts(pacts, "melee");
    expect(meleeCount).toBeLessThan(5);
  }, 600_000);

  it("melee build includes key melee DPS nodes", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer({ activePacts: [] }),
      target: custom,
      lockedSlots: {},
      topN: 1,
    };
    const results = optimizeBuild(config);
    const pacts = new Set(results[0].optimizedConfig!.activePacts!);
    const meleeCount = countBranchPacts([...pacts], "melee");
    // Should have at least 3 melee-branch nodes
    expect(meleeCount).toBeGreaterThanOrEqual(3);
  }, 600_000);

  it("ranged build includes ranged DPS nodes", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer({
        combatStyle: "ranged", attackStyle: "auto", potion: "auto", prayerType: "auto",
        activePacts: [],
      }),
      target: custom,
      lockedSlots: {},
      topN: 1,
    };
    const results = optimizeBuild(config);
    const pacts = results[0].optimizedConfig!.activePacts!;
    const rangedCount = countBranchPacts(pacts, "ranged");
    expect(rangedCount).toBeGreaterThanOrEqual(3);
  }, 600_000);

  it("magic build includes magic DPS nodes", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer({
        combatStyle: "magic", attackStyle: "auto", potion: "auto", prayerType: "auto",
        activePacts: [],
      }),
      target: custom,
      lockedSlots: {},
      topN: 1,
    };
    const results = optimizeBuild(config);
    const pacts = results[0].optimizedConfig!.activePacts!;
    const magicCount = countBranchPacts(pacts, "magic");
    expect(magicCount).toBeGreaterThanOrEqual(3);
  }, 600_000);

  it("melee DPS multiplier chain includes 'Melee Pacts' not 'Ranged Pacts'", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer({ activePacts: [] }),
      target: custom,
      lockedSlots: {},
      topN: 1,
    };
    const results = optimizeBuild(config);
    const pacts = results[0].optimizedConfig!.activePacts!;
    const loadout = results[0].loadout;
    const result = calculateDps({
      player: { ...defaultPlayer({ activePacts: pacts }), },
      loadout,
      target: custom,
    });
    const chainNames = result.breakdown.multiplierChain.map(m => m.name);
    // Melee build should have melee pacts in its multiplier chain
    const hasMeleePacts = chainNames.some(n => n.includes("Melee"));
    const hasRangedPacts = chainNames.some(n => n.includes("Ranged"));
    expect(hasMeleePacts).toBe(true);
    expect(hasRangedPacts).toBe(false);
  }, 600_000);

  it("echo DPS is zero for melee even with twohMeleeEchos + rangedRegenEchoChance", () => {
    // Select pacts that include both 2H melee echos and ranged echo chance
    const rapier = getItem("rapier")!;
    const loadout: BuildLoadout = {
      head: null, cape: null, neck: null, ammo: null,
      weapon: rapier, body: null, shield: null,
      legs: null, hands: null, feet: null, ring: null,
    };
    // Include node157 (2H melee echos) + node2 (ranged echo +25%)
    const pacts = ["node1", "node2", "node157"];
    const result = calculateDps({
      player: defaultPlayer({ combatStyle: "melee", activePacts: pacts }),
      loadout,
      target: custom,
    });
    // Echo DPS should be 0 for melee
    expect(result.echoDps).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// isNodeRelevantForStyle unit tests
// ═══════════════════════════════════════════════════════════════════════

describe("isNodeRelevantForStyle", () => {
  it("melee damage node is relevant for melee", () => {
    const node = getNode("node140")!; // Melee Power I
    expect(isNodeRelevantForStyle(node, "melee")).toBe(true);
  });

  it("melee damage node is NOT relevant for ranged", () => {
    const node = getNode("node140")!; // Melee Power I
    expect(isNodeRelevantForStyle(node, "ranged")).toBe(false);
  });

  it("ranged damage node is relevant for ranged", () => {
    const node = getNode("node13")!; // Ranged Power I
    expect(isNodeRelevantForStyle(node, "ranged")).toBe(true);
  });

  it("ranged damage node is NOT relevant for melee", () => {
    const node = getNode("node13")!; // Ranged Power I
    expect(isNodeRelevantForStyle(node, "melee")).toBe(false);
  });

  it("all-style accuracy node is relevant for all styles", () => {
    const allNodes = getAllNodes();
    const accNode = allNodes.find(n => n.effects.some(e => e.type === "talent_all_style_accuracy"))!;
    expect(isNodeRelevantForStyle(accNode, "melee")).toBe(true);
    expect(isNodeRelevantForStyle(accNode, "ranged")).toBe(true);
    expect(isNodeRelevantForStyle(accNode, "magic")).toBe(true);
  });

  it("neutral node (defence/regen) is relevant for all styles", () => {
    const allNodes = getAllNodes();
    const neutralNode = allNodes.find(n => n.effects.some(e => e.type === "talent_defence_boost"));
    expect(neutralNode).toBeDefined();
    expect(isNodeRelevantForStyle(neutralNode!, "melee")).toBe(true);
    expect(isNodeRelevantForStyle(neutralNode!, "ranged")).toBe(true);
    expect(isNodeRelevantForStyle(neutralNode!, "magic")).toBe(true);
  });
});
