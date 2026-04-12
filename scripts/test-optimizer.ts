import { optimizeGear, optimizeBuild } from "../src/lib/gear-optimizer";
import { BOSS_PRESETS } from "../src/data/boss-presets";
import type { PlayerConfig, CombatStyle } from "../src/types/dps";

const ALL_REGIONS = ["varlamore", "karamja", "misthalin", "asgarnia", "morytania", "kourend", "desert", "tirannwn", "fremennik", "kandarin", "wilderness"];

const BASE_PLAYER: PlayerConfig = {
  attack: 99, strength: 99, defence: 99, ranged: 99, magic: 99, prayer: 99, hitpoints: 99,
  potion: "super-combat", prayerType: "piety",
  attackStyle: "accurate", combatStyle: "melee",
  regions: ALL_REGIONS,
  activePacts: [], voidSet: "none", onSlayerTask: false, targetDistance: 1,
};

const custom = BOSS_PRESETS.find(b => b.id === "custom")!;
const graardor = BOSS_PRESETS.find(b => b.id === "graardor")!;

function testGear(label: string, overrides: Partial<PlayerConfig>, boss = custom) {
  const style = overrides.combatStyle ?? "melee";
  const player: PlayerConfig = {
    ...BASE_PLAYER,
    potion: style === "melee" ? "super-combat" : style === "ranged" ? "ranging" : "magic",
    prayerType: style === "melee" ? "piety" : style === "ranged" ? "rigour" : "augury",
    attackStyle: style === "melee" ? "accurate" : style === "ranged" ? "rapid" : "autocast",
    ...overrides,
  };

  const t0 = performance.now();
  const results = optimizeGear({ player, target: boss, lockedSlots: {}, topN: 10 });
  const t1 = performance.now();

  console.log(`\n=== ${label} ===`);
  console.log(`  Time: ${(t1 - t0).toFixed(0)}ms | Combinations: ${results[0]?.combinationsEvaluated?.toLocaleString() ?? "?"} | Results: ${results.length}`);
  for (const r of results.slice(0, 5)) {
    const w = r.loadout.weapon?.name ?? "none";
    const gear = [r.loadout.head, r.loadout.body, r.loadout.legs, r.loadout.shield]
      .filter(Boolean).map(i => i!.name).join(", ");
    console.log(`  ${r.result.dps.toFixed(2)} DPS | ${w} | ${gear}`);
  }
}

// Standard tests — all regions
testGear("MELEE (all regions)", { combatStyle: "melee" });
testGear("RANGED (all regions)", { combatStyle: "ranged" });
testGear("MAGIC (all regions)", { combatStyle: "magic" });

// Graardor test
testGear("MELEE vs Graardor", { combatStyle: "melee" }, graardor);

// Thorns test — select thorns pacts (node1 → node74 → node71=thorns, node139=defRecoil)
testGear("MELEE + THORNS PACTS", {
  combatStyle: "melee",
  activePacts: ["node1", "node74", "node71", "node139"],
});

// Limited regions
testGear("MELEE (3 regions)", {
  combatStyle: "melee",
  regions: ["varlamore", "karamja", "misthalin"],
});
