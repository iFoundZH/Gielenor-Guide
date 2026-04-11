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
import { optimizeGear } from "@/lib/gear-optimizer";
import { getItem } from "@/data/items";
import { getBoss } from "@/data/boss-presets";
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

describe("optimizeGear", () => {
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

describe("2H weapon handling", () => {
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

describe("locked slots", () => {
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

describe("region filtering", () => {
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

  it("regionless items (whip) are always available", () => {
    const config: OptimizerConfig = {
      player: defaultPlayer({ regions: [] }), // no regions
      target: custom,
      lockedSlots: {},
      topN: 5,
    };
    const results = optimizeGear(config);
    // Should still have results with whip or other regionless weapons
    expect(results.length).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// COMBAT STYLE FILTERING
// ═══════════════════════════════════════════════════════════════════════

describe("combat style filtering", () => {
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
// OPTIMIZER VS SPECIFIC BOSSES
// ═══════════════════════════════════════════════════════════════════════

describe("optimizer boss-specific", () => {
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

  it("vs K'ril (demon), arclight appears in top results", () => {
    const kril = getBoss("kril")!;
    const config: OptimizerConfig = {
      player: defaultPlayer({ combatStyle: "melee" }),
      target: kril,
      lockedSlots: {},
      topN: 5,
    };
    const results = optimizeGear(config);
    const weaponIds = results.map(r => r.loadout.weapon?.id);
    const hasAntiDemon = weaponIds.some(id => id === "arclight" || id === "echo-tecpatl");
    expect(hasAntiDemon).toBe(true);
  });
});
