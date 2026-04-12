import { optimizeGear, optimizeBuild } from "../src/lib/gear-optimizer";
import { BOSS_PRESETS } from "../src/data/boss-presets";
import type { PlayerConfig, CombatStyle } from "../src/types/dps";

const ALL_REGIONS = ["varlamore", "karamja", "asgarnia", "morytania", "kourend", "desert", "tirannwn", "fremennik", "kandarin", "wilderness"];

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
  console.log(`  Time: ${(t1 - t0).toFixed(0)}ms | Results: ${results.length}`);
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
testGear("MELEE (2 starting regions)", {
  combatStyle: "melee",
  regions: ["varlamore", "karamja"],
});

// Full optimizer test — includes pact optimization
function testOptimizer(label: string, overrides: Partial<PlayerConfig>, boss = custom) {
  const style = overrides.combatStyle ?? "melee";
  const player: PlayerConfig = {
    ...BASE_PLAYER,
    potion: "auto" as PlayerConfig["potion"],
    prayerType: "auto" as PlayerConfig["prayerType"],
    attackStyle: "auto" as PlayerConfig["attackStyle"],
    ...overrides,
  };

  const t0 = performance.now();
  const results = optimizeBuild({ player, target: boss, lockedSlots: {}, topN: 10 });
  const t1 = performance.now();

  console.log(`\n=== OPTIMIZE: ${label} ===`);
  console.log(`  Time: ${(t1 - t0).toFixed(0)}ms | Results: ${results.length}`);
  for (const r of results.slice(0, 10)) {
    const w = r.loadout.weapon?.name ?? "none";
    const cat = r.loadout.weapon?.weaponCategory ?? "?";
    const pactCount = r.optimizedConfig?.activePacts?.length ?? 0;
    const pacts = r.optimizedConfig?.activePacts?.join(",") ?? "";
    const hasDist = pacts.includes("node74") || pacts.includes("node153") || pacts.includes("node43") || pacts.includes("node155");
    console.log(`  ${r.result.dps.toFixed(2)} DPS | ${cat.padEnd(10)} | ${w} | ${pactCount} pacts${hasDist ? " [DISTANCE]" : ""}`);
  }
}

testOptimizer("MELEE (all regions)", { combatStyle: "melee" });

// Test with locked halberd weapon
function testLockedWeapon(label: string, weaponId: string, boss = custom) {
  const weapon = getItem(weaponId);
  if (!weapon) { console.log(`\n=== ${label}: weapon '${weaponId}' NOT FOUND ===`); return; }
  const player: PlayerConfig = {
    ...BASE_PLAYER,
    potion: "auto" as PlayerConfig["potion"],
    prayerType: "auto" as PlayerConfig["prayerType"],
    attackStyle: "auto" as PlayerConfig["attackStyle"],
  };
  const t0 = performance.now();
  const results = optimizeBuild({ player, target: boss, lockedSlots: { weapon }, topN: 5 });
  const t1 = performance.now();
  console.log(`\n=== LOCKED: ${label} ===`);
  console.log(`  Time: ${(t1 - t0).toFixed(0)}ms | Results: ${results.length}`);
  for (const r of results.slice(0, 3)) {
    const w = r.loadout.weapon?.name ?? "none";
    const pacts = r.optimizedConfig?.activePacts ?? [];
    const hasRange = pacts.includes("node43") || pacts.includes("node155");
    const hasDist = pacts.includes("node74") || pacts.includes("node153");
    console.log(`  ${r.result.dps.toFixed(2)} DPS | ${w} | ${pacts.length} pacts | range:${hasRange} dist:${hasDist}`);
    console.log(`    max=${r.result.breakdown.finalMaxHit} min=${r.result.breakdown.minHit} acc=${(r.result.breakdown.finalAccuracy * 100).toFixed(1)}% speed=${r.result.breakdown.attackSpeed}t`);
    console.log(`    chain: ${r.result.breakdown.multiplierChain.map(s => `${s.name}=${s.factor.toFixed(3)}`).join(", ")}`);
    console.log(`    sustain: ${r.result.breakdown.sustainInfo.join("; ")}`);
  }
}

testLockedWeapon("Crystal Halberd", "crystal-halberd");
testLockedWeapon("Ghrazi Rapier", "ghrazi-rapier");
testLockedWeapon("Scythe of Vitur", "scythe");

// Manual halberd test — check actual DPS with distance pacts
import { calculateDps } from "../src/lib/dps-engine";
import { getItem } from "../src/data/items";
import type { BuildLoadout } from "../src/types/dps";

function emptyLoadout(): BuildLoadout {
  return { head: null, cape: null, neck: null, ammo: null, weapon: null, body: null, shield: null, legs: null, hands: null, feet: null, ring: null };
}

// Halberd + distance pacts (all range pacts: node1→node74→node43→node83→node88→node156→node153→node154→node155)
const halberdPacts = ["node1", "node74", "node43", "node83", "node88", "node156", "node153", "node154", "node155"];
const dHalberd = getItem("d-halberd");
const cHalberd = getItem("crystal-halberd");
const nHalberd = getItem("noxious-halberd");

console.log("\n=== MANUAL HALBERD DPS CHECK ===");

// BIS gear for comparison
const bisGear: Partial<BuildLoadout> = {
  head: getItem("torva-helm") ?? null,
  body: getItem("torva-body") ?? null,
  legs: getItem("torva-legs") ?? null,
  neck: getItem("amulet-of-torture") ?? null,
  cape: getItem("infernal-cape") ?? null,
  hands: getItem("ferocious-gloves") ?? null,
  feet: getItem("primordial-boots") ?? null,
  ring: getItem("berserker-ring-i") ?? null,
};

for (const [name, weapon] of [["Dragon halberd", dHalberd], ["Crystal halberd", cHalberd], ["Noxious halberd", nHalberd]] as const) {
  if (!weapon) { console.log(`  ${name}: NOT FOUND`); continue; }
  console.log(`  ${name}: cat=${weapon.weaponCategory}, 2H=${weapon.isTwoHanded}, speed=${weapon.attackSpeed}, mstr=${weapon.bonuses.mstr}, slash=${weapon.bonuses.aslash}`);

  // With BIS gear + distance pacts
  const loadout = { ...emptyLoadout(), ...bisGear, weapon, shield: null };
  const pactCtx = { player: { ...BASE_PLAYER, activePacts: halberdPacts }, loadout, target: custom };
  const pactR = calculateDps(pactCtx);

  // Without pacts but BIS gear
  const noPactCtx = { player: { ...BASE_PLAYER, activePacts: [] as string[] }, loadout, target: custom };
  const noPactR = calculateDps(noPactCtx);

  console.log(`    No pacts: ${noPactR.dps.toFixed(2)} DPS (max ${noPactR.breakdown.finalMaxHit}, acc ${(noPactR.breakdown.finalAccuracy * 100).toFixed(1)}%, speed ${noPactR.breakdown.attackSpeed}t)`);
  console.log(`    Distance pacts: ${pactR.dps.toFixed(2)} DPS (max ${pactR.breakdown.finalMaxHit}, min ${pactR.breakdown.minHit}, acc ${(pactR.breakdown.finalAccuracy * 100).toFixed(1)}%, speed ${pactR.breakdown.attackSpeed}t)`);
  console.log(`    chain: ${pactR.breakdown.multiplierChain.map(s => s.name + "=" + s.factor.toFixed(3)).join(", ")}`);
  console.log(`    sustain: ${pactR.breakdown.sustainInfo.join("; ")}`);
}

// Compare with rapier + 1h-light pacts
const rapier = getItem("ghrazi-rapier");
const defender = getItem("avernic-defender");
if (rapier) {
  // rapier with same distance pacts
  const rapierLoadout = { ...emptyLoadout(), ...bisGear, weapon: rapier, shield: defender ?? null };
  const rapierCtx = { player: { ...BASE_PLAYER, activePacts: halberdPacts }, loadout: rapierLoadout, target: custom };
  const rapierR = calculateDps(rapierCtx);
  console.log(`\n  Ghrazi rapier (halberd pacts): ${rapierR.dps.toFixed(2)} DPS (max ${rapierR.breakdown.finalMaxHit}, min ${rapierR.breakdown.minHit}, acc ${(rapierR.breakdown.finalAccuracy * 100).toFixed(1)}%, speed ${rapierR.breakdown.attackSpeed}t)`);
  console.log(`    chain: ${rapierR.breakdown.multiplierChain.map(s => s.name + "=" + s.factor.toFixed(3)).join(", ")}`);

  // rapier with light weapon pacts
  const lightPacts = ["node1", "node74", "node71", "node72", "node73", "node43", "node83", "node86"]; // path to 1h-light pacts
  const rapierLightCtx = { player: { ...BASE_PLAYER, activePacts: lightPacts }, loadout: rapierLoadout, target: custom };
  const rapierLR = calculateDps(rapierLightCtx);
  console.log(`  Ghrazi rapier (light pacts): ${rapierLR.dps.toFixed(2)} DPS (max ${rapierLR.breakdown.finalMaxHit}, min ${rapierLR.breakdown.minHit}, acc ${(rapierLR.breakdown.finalAccuracy * 100).toFixed(1)}%, speed ${rapierLR.breakdown.attackSpeed}t)`);
  console.log(`    chain: ${rapierLR.breakdown.multiplierChain.map(s => s.name + "=" + s.factor.toFixed(3)).join(", ")}`);
}
