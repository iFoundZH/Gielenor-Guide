import { optimizeBuild } from "../src/lib/gear-optimizer";
import { calculateDps } from "../src/lib/dps-engine";
import { getItem } from "../src/data/items";
import { BOSS_PRESETS } from "../src/data/boss-presets";
import type { PlayerConfig, BuildLoadout } from "../src/types/dps";

const ALL_REGIONS = ["varlamore", "karamja", "misthalin", "asgarnia", "morytania", "kourend", "desert", "tirannwn", "fremennik", "kandarin", "wilderness"];
const custom = BOSS_PRESETS.find(b => b.id === "custom")!;

const BASE: PlayerConfig = {
  attack: 99, strength: 99, defence: 99, ranged: 99, magic: 99, prayer: 99, hitpoints: 99,
  potion: "auto" as PlayerConfig["potion"],
  prayerType: "auto" as PlayerConfig["prayerType"],
  attackStyle: "auto" as PlayerConfig["attackStyle"],
  combatStyle: "melee",
  regions: ALL_REGIONS,
  activePacts: [], voidSet: "none", onSlayerTask: false,
};

function testLocked(label: string, weaponId: string) {
  const weapon = getItem(weaponId);
  if (!weapon) { console.log(`${label}: weapon '${weaponId}' NOT FOUND`); return; }
  const t0 = performance.now();
  const results = optimizeBuild({ player: BASE, target: custom, lockedSlots: { weapon }, topN: 3 });
  const t1 = performance.now();
  console.log(`\n=== ${label} (${(t1-t0).toFixed(0)}ms) ===`);
  const r = results[0];
  if (!r) { console.log("  NO RESULTS"); return; }
  const pacts = r.optimizedConfig?.activePacts ?? [];
  const bd = r.result.breakdown;
  console.log(`  DPS: ${r.result.dps.toFixed(2)}`);
  console.log(`  Max hit: ${bd.finalMaxHit}, Min hit: ${bd.minHit}, Acc: ${(bd.finalAccuracy * 100).toFixed(1)}%, Speed: ${bd.attackSpeed}t`);
  console.log(`  Chain: ${bd.multiplierChain.map(s => `${s.name}=${s.factor.toFixed(3)}`).join(", ")}`);
  console.log(`  Pacts (${pacts.length}): ${pacts.join(", ")}`);
  console.log(`  Has range pacts: node43=${pacts.includes("node43")}, node155=${pacts.includes("node155")}`);
  console.log(`  Has dist pacts: node74=${pacts.includes("node74")}, node153=${pacts.includes("node153")}`);
  console.log(`  Sustain: ${bd.sustainInfo.join("; ")}`);
  console.log(`  Base DPS: ${bd.baseDps.toFixed(2)}, Bonus: ${bd.bonusDps.toFixed(2)}, Thorns: ${bd.thornsDps.toFixed(2)}`);
  const gear = ["head", "body", "legs", "shield", "neck", "cape", "hands", "feet", "ring", "ammo"] as const;
  console.log(`  Gear: ${gear.map(s => r.loadout[s]?.name ?? "-").join(", ")}`);
}

// --- Halberd DPS sanity checks (no optimizer, just DPS engine) ---
import { calculateDps } from "../src/lib/dps-engine";

function emptyLoadout(): BuildLoadout {
  return { head: null, cape: null, neck: null, ammo: null, weapon: null, body: null, shield: null, legs: null, hands: null, feet: null, ring: null };
}

const MELEE_BASE: PlayerConfig = {
  ...BASE,
  potion: "super-combat",
  prayerType: "piety",
  attackStyle: "accurate",
};

// Full distance pact path: node1→node74→node43→node83→node88→node156→node153→node154→node155
const FULL_DIST_PACTS = ["node1", "node74", "node43", "node83", "node88", "node156", "node153", "node154", "node155"];

function testHalberdDps(label: string, weaponId: string) {
  const weapon = getItem(weaponId);
  if (!weapon) { console.log(`  ${label}: NOT FOUND (id=${weaponId})`); return; }

  const loadout = { ...emptyLoadout(), weapon };

  // No pacts
  const noPact = calculateDps({ player: { ...MELEE_BASE, activePacts: [] }, loadout, target: custom });
  // With full distance pacts
  const withPact = calculateDps({ player: { ...MELEE_BASE, activePacts: FULL_DIST_PACTS }, loadout, target: custom });

  console.log(`  ${label} (${weapon.weaponCategory}, ${weapon.attackSpeed}t, mstr=${weapon.bonuses.mstr}):`);
  console.log(`    No pacts: ${noPact.dps.toFixed(2)} DPS (max=${noPact.breakdown.finalMaxHit}, speed=${noPact.breakdown.attackSpeed}t)`);
  console.log(`    Dist pacts: ${withPact.dps.toFixed(2)} DPS (max=${withPact.breakdown.finalMaxHit}, min=${withPact.breakdown.minHit}, speed=${withPact.breakdown.attackSpeed}t, range=${withPact.breakdown.sustainInfo.find(s => s.includes("range"))?.match(/\d+/)?.[0] ?? "?"})`);
  console.log(`    Boost: +${((withPact.dps / noPact.dps - 1) * 100).toFixed(0)}%`);
}

console.log("\n=== HALBERD DPS SANITY CHECK (naked, custom target) ===");
testHalberdDps("Dragon Halberd", "d-halberd");
testHalberdDps("Crystal Halberd", "crystal-halberd");
testHalberdDps("Noxious Halberd", "noxious-halberd");
console.log("\n  --- Comparison (non-halberds) ---");
testHalberdDps("Ghrazi Rapier", "rapier");
testHalberdDps("Whip", "whip");
testHalberdDps("Scythe", "scythe");

// --- Full optimizer runs ---
console.log("\n=== OPTIMIZER (locked weapon, all regions) ===");
testLocked("Crystal Halberd", "crystal-halberd");
testLocked("Noxious Halberd", "noxious-halberd");
testLocked("Ghrazi Rapier", "rapier");
testLocked("Scythe", "scythe");

// Full unconstrained optimizer — do halberds appear?
console.log("\n=== FULL OPTIMIZER (melee, all regions, no locks) ===");
const fullResults = optimizeBuild({ player: BASE, target: custom, lockedSlots: {}, topN: 15 });
const t = performance.now();
for (const r of fullResults) {
  const w = r.loadout.weapon;
  const cat = w?.weaponCategory ?? "?";
  const pacts = r.optimizedConfig?.activePacts ?? [];
  const hasNode155 = pacts.includes("node155");
  console.log(`  ${r.result.dps.toFixed(2)} DPS | ${cat.padEnd(12)} | ${(w?.name ?? "?").padEnd(25)} | ${hasNode155 ? "node155" : "       "} | speed=${r.result.breakdown.attackSpeed}t`);
}
console.log(`  Time: ${(performance.now() - t).toFixed(0)}ms`);
