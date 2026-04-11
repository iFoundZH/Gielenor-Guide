/**
 * DPS Engine Validation Script
 *
 * Tests our DPS calculations against hand-verified reference values
 * from the Bitterkoekje DPS spreadsheet and OSRS Wiki formulas.
 *
 * Run: npx tsx --tsconfig tsconfig.test.json scripts/dps-validation.ts
 */

import {
  calculateDps,
  calculateMaxHit,
  calculateAccuracy,
  calculateAttackRoll,
  calculateDefenceRoll,
  calculateEffectiveStrengthLevel,
  calculateBaseMaxHit,
  getMultiplierChain,
  sumEquipmentBonuses,
} from "../src/lib/dps-engine";
import { getItem } from "../src/data/items";
import { getBoss } from "../src/data/boss-presets";
import type {
  DpsContext,
  BuildLoadout,
  PlayerConfig,
  BossPreset,
  Item,
  AttackType,
} from "../src/types/dps";

// ═══════════════════════════════════════════════════════════════════════
// TEST INFRASTRUCTURE
// ═══════════════════════════════════════════════════════════════════════

let passed = 0;
let failed = 0;
const failures: string[] = [];

function assertClose(actual: number, expected: number, label: string, tolerance = 0.01) {
  const diff = Math.abs(actual - expected);
  const relDiff = expected !== 0 ? diff / Math.abs(expected) : diff;
  if (diff > tolerance && relDiff > 0.001) {
    failed++;
    const msg = `  FAIL: ${label}: got ${actual}, expected ${expected} (diff: ${diff.toFixed(6)})`;
    failures.push(msg);
    console.log(msg);
  } else {
    passed++;
  }
}

function assertEqual(actual: number, expected: number, label: string) {
  if (actual !== expected) {
    failed++;
    const msg = `  FAIL: ${label}: got ${actual}, expected ${expected}`;
    failures.push(msg);
    console.log(msg);
  } else {
    passed++;
  }
}

function section(title: string) {
  console.log(`\n${"═".repeat(70)}`);
  console.log(`  ${title}`);
  console.log(`${"═".repeat(70)}`);
}

// ═══════════════════════════════════════════════════════════════════════
// HELPER: Build DPS Context
// ═══════════════════════════════════════════════════════════════════════

function emptyLoadout(): BuildLoadout {
  return { head: null, cape: null, neck: null, ammo: null, weapon: null, body: null, shield: null, legs: null, hands: null, feet: null, ring: null };
}

function defaultPlayer(overrides: Partial<PlayerConfig> = {}): PlayerConfig {
  return {
    attack: 99, strength: 99, defence: 99, ranged: 99, magic: 99, prayer: 99, hitpoints: 99,
    potion: "none", prayerType: "none", attackStyle: "accurate", combatStyle: "melee",
    regions: [], activePacts: [], voidSet: "none", onSlayerTask: false, ...overrides,
  };
}

function makeCtx(player: Partial<PlayerConfig>, loadout: Partial<BuildLoadout>, target: BossPreset): DpsContext {
  const full = { ...emptyLoadout(), ...loadout };
  return { player: defaultPlayer(player), loadout: full, target };
}

const customTarget: BossPreset = getBoss("custom")!; // def=1, all bonuses=0

// ═══════════════════════════════════════════════════════════════════════
// TEST 1: BASIC MELEE — Whip, 99 str, no potion/prayer, accurate style
// vs Custom target (def 1, all 0)
// ═══════════════════════════════════════════════════════════════════════

section("TEST 1: Basic Melee — Whip, 99 stats, no boost, accurate");
{
  // Reference calc (Bitterkoekje/wiki):
  // EffStrLevel: base=99, no potion(+0), no prayer(*1.0), style=accurate(+0), +8 → 99+0+8=107
  // Max hit: floor(0.5 + 107 * (82+64)/640) = floor(0.5 + 107*146/640) = floor(0.5 + 24.41875) = floor(24.91875) = 24
  // EffAtkLevel: base=99, no pot, no prayer, accurate(+3), +8 → 99+3+8=110
  // AtkRoll: 110 * (82+64) = 110*146 = 16060
  // DefRoll: (1+9)*(0+64) = 640
  // Accuracy: A>D → 1-(640+2)/(2*(16060+1)) = 1-642/32122 = 0.98002
  // DPS: (24/2 * 0.98002) / (4*0.6) = (12*0.98002)/2.4 = 11.76024/2.4 = 4.9001

  const ctx = makeCtx(
    { combatStyle: "melee", attackStyle: "accurate" },
    { weapon: getItem("whip")! },
    customTarget,
  );

  const result = calculateDps(ctx);
  assertEqual(result.breakdown.effectiveLevel, 107, "T1: effective str level");
  assertEqual(result.breakdown.baseMaxHit, 24, "T1: base max hit");
  assertEqual(result.breakdown.attackRoll, 16060, "T1: attack roll");
  assertEqual(result.breakdown.defenceRoll, 640, "T1: defence roll");
  assertClose(result.breakdown.baseAccuracy, 0.98002, "T1: accuracy", 0.001);
  assertClose(result.dps, 4.9001, "T1: DPS", 0.05);
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 2: Melee — Whip, Super Combat, Piety, Accurate
// ═══════════════════════════════════════════════════════════════════════

section("TEST 2: Melee — Whip, Super Combat, Piety, Accurate");
{
  // Super combat str boost: 5 + floor(99*0.15) = 5+14=19 → boosted=118
  // Piety str: floor(118*1.23) = floor(145.14) = 145
  // Style(accurate)=0, +8 → 145+0+8=153
  // Max hit: floor(0.5 + 153*(82+64)/640) = floor(0.5 + 153*146/640) = floor(0.5+34.903)=floor(35.403)=35
  //
  // Super combat atk boost: 5+floor(99*0.15)=19 → 118
  // Piety acc: floor(118*1.20) = floor(141.6) = 141
  // Style(accurate)=+3, +8 → 141+3+8=152
  // AtkRoll: 152*(82+64) = 152*146 = 22192
  // DefRoll: 640
  // Accuracy: 1-(642)/(2*22193) = 1-642/44386 = 0.98554
  // DPS: (35/2*0.98554)/(4*0.6) = (17.5*0.98554)/2.4 = 17.247/2.4 = 7.1862

  const ctx = makeCtx(
    { combatStyle: "melee", attackStyle: "accurate", potion: "super-combat", prayerType: "piety" },
    { weapon: getItem("whip")! },
    customTarget,
  );
  const result = calculateDps(ctx);

  assertEqual(result.breakdown.effectiveLevel, 153, "T2: effective str level");
  assertEqual(result.breakdown.baseMaxHit, 35, "T2: base max hit");
  assertEqual(result.breakdown.attackRoll, 22192, "T2: attack roll");
  assertClose(result.breakdown.baseAccuracy, 0.98554, "T2: accuracy", 0.001);
  assertClose(result.dps, 7.1862, "T2: DPS", 0.05);
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 3: Melee — Whip, Super Combat, Piety, Aggressive
// ═══════════════════════════════════════════════════════════════════════

section("TEST 3: Melee — Whip, Super Combat, Piety, Aggressive");
{
  // Str: 99+19=118, floor(118*1.23)=145, +3(aggressive)+8=156
  // Max hit: floor(0.5+156*(82+64)/640) = floor(0.5+156*146/640) = floor(0.5+35.5875) = floor(36.0875) = 36
  // Atk: 99+19=118, floor(118*1.20)=141, +0(aggressive)+8=149
  // AtkRoll: 149*146=21754
  // Accuracy: 1-642/(2*21755) = 1-642/43510 = 0.98525
  // DPS: (36/2*0.98525)/2.4 = (18*0.98525)/2.4 = 17.7345/2.4 = 7.3894

  const ctx = makeCtx(
    { combatStyle: "melee", attackStyle: "aggressive", potion: "super-combat", prayerType: "piety" },
    { weapon: getItem("whip")! },
    customTarget,
  );
  const result = calculateDps(ctx);

  assertEqual(result.breakdown.effectiveLevel, 156, "T3: effective str level");
  assertEqual(result.breakdown.baseMaxHit, 36, "T3: base max hit");
  assertEqual(result.breakdown.attackRoll, 21754, "T3: attack roll");
  assertClose(result.dps, 7.3894, "T3: DPS", 0.05);
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 4: Full melee gear — Whip + torture + infernal + torva + avernic
// ═══════════════════════════════════════════════════════════════════════

section("TEST 4: Full melee gear, Super Combat, Piety, Accurate vs Custom");
{
  // Equipment bonuses (slash attack, melee str):
  // whip: aslash=82, mstr=82
  // torture: astab=15,aslash=15,acrush=15, mstr=10
  // infernal: astab=4,aslash=4,acrush=4, mstr=8
  // torva helm: mstr=8
  // torva body: mstr=6
  // torva legs: mstr=4
  // avernic: astab=30,aslash=29,acrush=28, mstr=8
  // primordial: astab=2,aslash=2,acrush=2, mstr=5
  // ferocious: astab=16,aslash=16,acrush=16, mstr=14
  // berserker-i: mstr=8
  //
  // Total mstr: 82+10+8+8+6+4+8+5+14+8 = 153
  // Total aslash: 82+15+4+0+0+0+29+2+16+0 = 148 (whip attacks with slash)
  //
  // EffStr: 99+19=118, floor(118*1.23)=145, +0+8=153
  // Max hit: floor(0.5+153*(153+64)/640) = floor(0.5+153*217/640) = floor(0.5+51.877) = floor(52.377) = 52
  //
  // EffAtk: 99+19=118, floor(118*1.20)=141, +3+8=152
  // AtkRoll: 152*(148+64)=152*212=32224
  // DefRoll: 640
  // Acc: 1-642/(2*32225)=1-642/64450=0.99004
  // DPS: (52/2*0.99004)/2.4 = (26*0.99004)/2.4 = 25.741/2.4 = 10.725

  const ctx = makeCtx(
    { combatStyle: "melee", attackStyle: "accurate", potion: "super-combat", prayerType: "piety" },
    {
      weapon: getItem("whip")!,
      neck: getItem("torture")!,
      cape: getItem("infernal-cape")!,
      head: getItem("torva-helm")!,
      body: getItem("torva-body")!,
      legs: getItem("torva-legs")!,
      shield: getItem("avernic")!,
      feet: getItem("primordial")!,
      hands: getItem("ferocious")!,
      ring: getItem("berserker-i")!,
    },
    customTarget,
  );
  const result = calculateDps(ctx);

  assertEqual(result.breakdown.equipmentStrength, 153, "T4: equipment strength");
  assertEqual(result.breakdown.effectiveLevel, 153, "T4: effective str level");
  assertEqual(result.breakdown.baseMaxHit, 52, "T4: base max hit");
  assertEqual(result.breakdown.attackRoll, 32224, "T4: attack roll");
  assertClose(result.dps, 10.725, "T4: DPS", 0.05);
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 5: Ranged — Twisted Bow vs Zulrah (high magic)
// ═══════════════════════════════════════════════════════════════════════

section("TEST 5: Ranged — TBow + dragon arrows vs Zulrah, Rigour, Ranging pot, Rapid");
{
  // Zulrah: def=300, magic=300, dranged=50
  // Setup: tbow + dragon arrows + anguish + masori + assembler + zaryte vambs + pegasian + venator
  //
  // TBow ranged str = 20 from weapon
  // dragon arrows: rstr=60
  // anguish: rstr=5
  // masori mask: rstr=2
  // masori body: rstr=4
  // masori chaps: rstr=2
  // assembler: rstr=2
  // zaryte vambs: rstr=2
  // venator: rstr=2
  // pegasian: rstr=0
  // Total rstr = 20+60+5+2+4+2+2+2+2 = 99
  //
  // Ranging pot: 4+floor(99*0.10) = 13 → 112
  // Rigour str (1.23): floor(112*1.23) = floor(137.76) = 137
  // Style(rapid) +0 +8 = 145
  // Base max hit: floor(0.5 + 145*(99+64)/640) = floor(0.5+145*163/640) = floor(0.5+36.9296) = floor(37.4296) = 37
  //
  // TBow dmg: M=250, x=75, 250+floor(61/100)-floor(4225/100) = 250+0-42 = 208
  // Final max: floor(37*2.08) = floor(76.96) = 76
  //
  // Ranging atk: 4+floor(99*0.10)=13 → 112
  // Rigour acc (1.20): floor(112*1.20) = floor(134.4) = 134
  // Style(rapid) +0 +8 = 142
  //
  // Total aranged: 70+0+15+12+43+27+8+18+0+10 = 203
  // AtkRoll: 142*(203+64)=142*267=37914
  //
  // TBow acc: 140+floor(65/100)-floor(625/100) = 140+0-6 = 134 → factor 1.34
  // AtkRoll after tbow: floor(37914*134/100) = floor(37914*1.34) = floor(50804.76) = 50804
  //
  // DefRoll (ranged attack type vs Zulrah): (300+9)*(50+64) = 309*114 = 35226
  // Accuracy: A>D → 1-(35226+2)/(2*(50804+1)) = 1-35228/101610 = 0.65332
  //
  // Attack speed: tbow=5, rapid → 5-1=4 → 2.4s
  // DPS: (76/2*0.65332)/2.4 = (38*0.65332)/2.4 = 24.826/2.4 = 10.344

  const zulrah = getBoss("zulrah")!;
  const ctx = makeCtx(
    { combatStyle: "ranged", attackStyle: "rapid", potion: "ranging", prayerType: "rigour" },
    {
      weapon: getItem("tbow")!,
      ammo: getItem("dragon-arrows")!,
      neck: getItem("anguish")!,
      head: getItem("masori-mask")!,
      body: getItem("masori-body")!,
      legs: getItem("masori-chaps")!,
      cape: getItem("avas-assembler")!,
      hands: getItem("zaryte-vambs")!,
      feet: getItem("pegasian")!,
      ring: getItem("venator")!,
    },
    zulrah,
  );
  const result = calculateDps(ctx);

  assertEqual(result.breakdown.effectiveLevel, 145, "T5: effective str level");
  assertEqual(result.breakdown.equipmentStrength, 99, "T5: equipment ranged str");
  assertEqual(result.breakdown.baseMaxHit, 37, "T5: base max hit");
  // TBow dmg: M=250, t2=trunc((750-14)/100)=7, t3=trunc((75-140)^2/100)=42 → 250+7-42=215
  // Final max: floor(37*2.15) = floor(79.55) = 79
  assertEqual(result.maxHit, 79, "T5: final max hit (after tbow)");
  // TBow acc: t2=trunc((750-10)/100)=7, t3=trunc((75-100)^2/100)=6 → 140+7-6=141, capped 140
  // AtkRoll: floor(39618*140/100) = floor(55465.2) = 55465
  // DefRoll: 35226
  // Accuracy: A>D → 1-(35228)/(2*55466) = 1-35228/110932 = 0.6824
  assertClose(result.breakdown.defenceRoll, 35226, "T5: defence roll", 1);
  assertClose(result.accuracy, 0.682, "T5: accuracy", 0.02);
  assertClose(result.dps, 11.24, "T5: DPS", 0.3);
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 6: Magic — Shadow vs Wardens P3 (low magic def)
// ═══════════════════════════════════════════════════════════════════════

section("TEST 6: Magic — Shadow + full mage gear vs Wardens P3, Augury, Magic pot");
{
  // Shadow: powered staff, 5 tick, magic attack +35 (tripled to 105), +0% mdmg (tripled)
  // Gear:
  // ancestral hat: amagic=8, mdmg=3
  // ancestral top: amagic=35, mdmg=3
  // ancestral bottom: amagic=26, mdmg=3
  // occult: amagic=12, mdmg=5
  // imbued god cape: amagic=15, mdmg=2
  // tormented: amagic=10, mdmg=5
  // eternal: amagic=8
  // magus ring: amagic=8, mdmg=2
  // elidinis ward: amagic=25, mdmg=5
  //
  // Total amagic (from equip): 35+8+35+26+12+15+10+8+8+25 = 182
  // Shadow triples to: 182*3 = 546
  //
  // Total mdmg: 0+3+3+3+5+2+5+0+2+5 = 28
  // Shadow triples to: min(100, 28*3) = 84
  //
  // Wait - Shadow is 2H so no shield. Can't equip elidinis ward.
  // Let me remove ward.
  // Total amagic: 35+8+35+26+12+15+10+8+8 = 157, tripled = 471
  // Total mdmg: 0+3+3+3+5+2+5+0+2 = 23, tripled = 69
  //
  // Magic pot: 4+floor(99*0.10) = 13 → 112
  // Shadow powered staff base: floor(visibleMagic/3)+1 = floor(112/3)+1 = 37+1 = 38
  // Max hit: floor(38*(1+69/100)) = floor(38*1.69) = floor(64.22) = 64
  //
  // Augury: acc=1.25, str=1.0 (magic prayers don't boost damage)
  // EffAtkLevel: 99+13=112, floor(112*1.25)=floor(140)=140, +0(autocast?)+8=148
  // Wait, attack style for magic. Let's use "autocast".
  // getAccuracyStyleBonus for autocast = 0
  // So EffAtk = 140+0+8 = 148
  //
  // AtkRoll: 148*(471+64) = 148*535 = 79180
  // But wait — Shadow triples the equipment magic attack IN the attack roll calc.
  // Let me re-read the code:
  // ```
  // if (weapon?.id === "shadow" && style === "magic") {
  //   equipAtk = bonuses.amagic * 3;
  // }
  // ```
  // So equipAtk = 157*3 = 471 ← but bonuses.amagic = sum of ALL equip amagic INCLUDING shadow itself
  //
  // Actually wait, shadow has amagic=35. Let me recount:
  // shadow: amagic=35
  // ancestral hat: amagic=8
  // ancestral top: amagic=35
  // ancestral bottom: amagic=26
  // occult: amagic=12
  // imbued god cape: amagic=15
  // tormented: amagic=10
  // eternal: amagic=8
  // magus ring: amagic=8
  // Total amagic = 35+8+35+26+12+15+10+8+8 = 157
  // Shadow triples: 157*3 = 471
  //
  // AtkRoll: 148*(471+64) = 148*535 = 79180
  //
  // Wardens P3: def=200, magic=200, dmagic=-60
  // DefRoll (magic attack): uses target magic level → (200+9)*(-60+64) = 209*4 = 836
  //
  // Accuracy: 79180 > 836 → 1-(836+2)/(2*79181) = 1-838/158362 = 0.99471
  //
  // EffStr for magic: base=99, magic pot +13=112, augury str=1.0 → floor(112*1.0)=112
  // +0+8 = 120
  // Wait but that's for the effective STR level which feeds into... actually for powered staves,
  // the max hit uses visible magic level directly, not effective level.
  //
  // DPS: (64/2*0.99471)/(5*0.6) = (32*0.99471)/3.0 = 31.831/3.0 = 10.610

  const wardens = getBoss("wardens-p3")!;
  const ctx = makeCtx(
    { combatStyle: "magic", attackStyle: "autocast", potion: "magic", prayerType: "augury" },
    {
      weapon: getItem("shadow")!,
      head: getItem("ancestral-hat")!,
      body: getItem("ancestral-top")!,
      legs: getItem("ancestral-bottom")!,
      neck: getItem("occult")!,
      cape: getItem("imbued-god-cape")!,
      hands: getItem("tormented")!,
      feet: getItem("eternal")!,
      ring: getItem("magus")!,
    },
    wardens,
  );
  const result = calculateDps(ctx);

  // Shadow visible magic = 99+13 = 112 → base = floor(112/3)+1 = 38
  // Shadow equipStr = min(100, 23*3) = 69
  // Max hit = floor(38*(1+69/100)) = floor(38*1.69) = floor(64.22) = 64
  assertEqual(result.maxHit, 64, "T6: max hit (shadow)");

  // Defence roll: (200+9)*(-60+64) = 209*4 = 836
  assertEqual(result.breakdown.defenceRoll, 836, "T6: defence roll");

  assertClose(result.accuracy, 0.9947, "T6: accuracy", 0.005);
  assertClose(result.dps, 10.61, "T6: DPS", 0.15);
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 7: Scythe of Vitur — 3-hit mechanic
// ═══════════════════════════════════════════════════════════════════════

section("TEST 7: Scythe — 3-hit mechanic vs Custom");
{
  // Scythe: 5t, slash, mstr=75, aslash=125
  // No potion, no prayer, accurate style
  // EffStr: 99+0+8=107
  // Max hit: floor(0.5+107*(75+64)/640) = floor(0.5+107*139/640) = floor(0.5+23.234) = floor(23.734) = 23
  //
  // EffAtk: 99+3+8=110
  // AtkRoll: 110*(125+64)=110*189=20790
  // DefRoll: 640
  // Acc: 1-642/(2*20791) = 1-642/41582 = 0.98456
  //
  // Scythe hits:
  // hit1: max=23, avg=23/2*acc = 11.5*0.98456 = 11.322
  // hit2: max=floor(23/2)=11, avg=11/2*acc = 5.5*0.98456 = 5.415
  // hit3: max=floor(23/4)=5, avg=5/2*acc = 2.5*0.98456 = 2.461
  // Total avg per attack = 19.198
  // DPS = 19.198/(5*0.6) = 19.198/3.0 = 6.399

  const ctx = makeCtx(
    { combatStyle: "melee", attackStyle: "accurate" },
    { weapon: getItem("scythe")! },
    customTarget,
  );
  const result = calculateDps(ctx);

  assertEqual(result.maxHit, 23, "T7: scythe max hit");
  assertClose(result.accuracy, 0.98456, "T7: accuracy", 0.001);
  assertClose(result.dps, 6.399, "T7: scythe DPS", 0.05);
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 8: Osmumten's Fang — double roll + min hit mechanic
// ═══════════════════════════════════════════════════════════════════════

section("TEST 8: Fang — double roll + damage compression vs Graardor");
{
  // Fang: 5t, stab, mstr=103, astab=105
  // Super combat, Piety, accurate style
  // Graardor: def=250, dstab=90
  //
  // EffStr: 99+19=118, floor(118*1.23)=145, +0+8=153
  // Base max: floor(0.5+153*(103+64)/640) = floor(0.5+153*167/640) = floor(0.5+39.928) = floor(40.428) = 40
  // Fang 0.85x: floor(40*0.85) = 34
  //
  // Fang min hit = floor(34*15/64) = floor(7.96875) = 7
  // Average damage on hit = (34+7)/2 = 20.5
  //
  // EffAtk: 99+19=118, floor(118*1.20)=141, +3+8=152
  // AtkRoll: 152*(105+64)=152*169=25688
  // DefRoll: (250+9)*(90+64)=259*154=39886
  //
  // Base accuracy: A<D → A/(2*(D+1)) = 25688/(2*39887) = 25688/79774 = 0.32200
  // Double roll: 1-(1-0.32200)^2 = 1-(0.678)^2 = 1-0.45968 = 0.54032
  //
  // DPS: (20.5*0.54032)/(5*0.6) = 11.077/3.0 = 3.692

  const graardor = getBoss("graardor")!;
  const ctx = makeCtx(
    { combatStyle: "melee", attackStyle: "accurate", potion: "super-combat", prayerType: "piety" },
    { weapon: getItem("fang")! },
    graardor,
  );
  const result = calculateDps(ctx);

  // Check base max before Fang modification
  assertEqual(result.breakdown.baseMaxHit, 40, "T8: base max hit (before fang)");
  assertEqual(result.maxHit, 34, "T8: final max hit (after 0.85x)");
  assertEqual(result.breakdown.defenceRoll, 39886, "T8: defence roll");
  assertClose(result.breakdown.baseAccuracy, 0.32200, "T8: base accuracy", 0.005);
  assertClose(result.accuracy, 0.54032, "T8: double-roll accuracy", 0.005);
  // Fang avg = (34 + floor(34*3/20)) / 2 = (34+5)/2 = 19.5
  // DPS = 19.5 * 0.54032 / 3.0 = 3.512
  assertClose(result.dps, 3.512, "T8: fang DPS", 0.1);
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 9: Potion boost formulas
// ═══════════════════════════════════════════════════════════════════════

section("TEST 9: Potion boost formulas");
{
  // Super combat (melee): 5 + floor(99*0.15) = 5+14 = 19
  // EffStr with super combat, no prayer, accurate: (99+19)+0+8 = 126
  const ctx1 = makeCtx(
    { combatStyle: "melee", attackStyle: "accurate", potion: "super-combat" },
    { weapon: getItem("whip")! },
    customTarget,
  );
  assertEqual(calculateEffectiveStrengthLevel(ctx1), 126, "T9: super combat eff str");

  // Ranging potion: 4 + floor(99*0.10) = 4+9 = 13
  // EffStr with ranging, no prayer, rapid: (99+13)+0+8 = 120
  const ctx2 = makeCtx(
    { combatStyle: "ranged", attackStyle: "rapid", potion: "ranging" },
    { weapon: getItem("tbow")! },
    customTarget,
  );
  assertEqual(calculateEffectiveStrengthLevel(ctx2), 120, "T9: ranging pot eff str");

  // Magic potion: 4 + floor(99*0.10) = 13
  // EffStr with magic, no prayer, autocast: (99+13)+0+8 = 120
  const ctx3 = makeCtx(
    { combatStyle: "magic", attackStyle: "autocast", potion: "magic" },
    { weapon: getItem("kodai")! },
    customTarget,
  );
  assertEqual(calculateEffectiveStrengthLevel(ctx3), 120, "T9: magic pot eff str");

  // Overload (melee): should be 5 + floor(99*0.15) = 19 → 99+19=118
  // But wiki says overload for ranged is 4+floor(99*0.10)=13, not 5+15%
  const ctx4 = makeCtx(
    { combatStyle: "melee", attackStyle: "accurate", potion: "overload" },
    { weapon: getItem("whip")! },
    customTarget,
  );
  assertEqual(calculateEffectiveStrengthLevel(ctx4), 126, "T9: overload melee eff str (=super combat)");

  // Overload (ranged): WIKI says should be 4+floor(99*0.10)=13
  // Our code gives 5+floor(99*0.15)=19 — POTENTIAL BUG
  const ctx5 = makeCtx(
    { combatStyle: "ranged", attackStyle: "rapid", potion: "overload" },
    { weapon: getItem("tbow")! },
    customTarget,
  );
  const overloadRangedStr = calculateEffectiveStrengthLevel(ctx5);
  // After fix: overload ranged uses ranging formula: 4+floor(99*0.10)=13 → (99+13)+0+8 = 120
  assertEqual(overloadRangedStr, 120, "T9: overload ranged eff str (should match ranging pot)");

  // Smelling salts: 11 + floor(99*0.16) = 11+15 = 26 → 99+26 = 125
  const ctx6 = makeCtx(
    { combatStyle: "melee", attackStyle: "accurate", potion: "smelling-salts" },
    { weapon: getItem("whip")! },
    customTarget,
  );
  assertEqual(calculateEffectiveStrengthLevel(ctx6), 133, "T9: smelling salts melee eff str (99+26+8=133)");
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 10: Prayer multipliers
// ═══════════════════════════════════════════════════════════════════════

section("TEST 10: Prayer multipliers");
{
  // Piety: str 1.23, acc 1.20
  // 99 base, no potion → floor(99*1.23) = floor(121.77) = 121, +8 = 129
  const ctxPiety = makeCtx(
    { combatStyle: "melee", attackStyle: "accurate", prayerType: "piety" },
    { weapon: getItem("whip")! },
    customTarget,
  );
  assertEqual(calculateEffectiveStrengthLevel(ctxPiety), 129, "T10: piety str level");

  // Rigour: str 1.23, acc 1.20
  // 99 base, no potion → floor(99*1.23)=121, +8=129
  const ctxRigour = makeCtx(
    { combatStyle: "ranged", attackStyle: "rapid", prayerType: "rigour" },
    { weapon: getItem("tbow")! },
    customTarget,
  );
  assertEqual(calculateEffectiveStrengthLevel(ctxRigour), 129, "T10: rigour str level");

  // Augury: str 1.0 (no damage bonus), acc 1.25
  const ctxAugury = makeCtx(
    { combatStyle: "magic", attackStyle: "autocast", prayerType: "augury" },
    { weapon: getItem("kodai")! },
    customTarget,
  );
  assertEqual(calculateEffectiveStrengthLevel(ctxAugury), 107, "T10: augury str level (no dmg bonus, 99+8)");
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 11: Slayer Helm (i) accuracy + damage
// ═══════════════════════════════════════════════════════════════════════

section("TEST 11: Slayer Helm (i) — on task");
{
  // Whip + slayer helm, on task, no pot/prayer, accurate, vs custom
  // Slayer helm mstr=3
  //
  // EffStr: 99+0+8=107
  // Equip str: whip 82 + slayer helm 3 = 85
  // Max hit: floor(0.5+107*(85+64)/640) = floor(0.5+107*149/640) = floor(0.5+24.91) = floor(25.41) = 25
  // Slayer helm melee dmg: floor(25*7/6) = floor(29.166) = 29

  // EffAtk: 99+3+8=110
  // whip aslash=82, slayer helm has no aslash contribution relevant
  // AtkRoll before helm: 110*(82+64)=110*146=16060
  // Slayer helm acc melee: floor(16060*7/6) = floor(18736.666) = 18736

  const ctx = makeCtx(
    { combatStyle: "melee", attackStyle: "accurate", onSlayerTask: true },
    { weapon: getItem("whip")!, head: getItem("slayer-helm-i")! },
    customTarget,
  );
  const result = calculateDps(ctx);

  // Check multiplier chain includes slayer helm
  const chain = result.breakdown.multiplierChain;
  const slayerStep = chain.find(s => s.name.includes("Slayer"));
  if (slayerStep) {
    assertClose(slayerStep.factor, 7/6, "T11: slayer helm melee factor", 0.001);
  } else {
    failed++;
    failures.push("  FAIL: T11: No slayer helm step in multiplier chain");
  }

  // Final max hit should be floor(25 * 7/6) = 29
  assertEqual(result.maxHit, 29, "T11: max hit with slayer helm");

  // Attack roll should include slayer helm accuracy
  assertEqual(result.breakdown.attackRoll, 18736, "T11: attack roll with slayer helm acc");
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 12: Salve (ei) accuracy + damage vs undead
// ═══════════════════════════════════════════════════════════════════════

section("TEST 12: Salve (ei) vs Undead (Vorkath)");
{
  // Whip + salve, no potion/prayer, accurate, vs Vorkath (undead+dragon)
  // Vorkath: def=214, dslash=108, magic=150
  //
  // EffStr: 99+0+8=107
  // Equip str: whip 82 (salve has 0 mstr)
  // Max hit: floor(0.5+107*(82+64)/640) = floor(0.5+24.4187) = 24
  // Salve 20% dmg: floor(24*1.20) = floor(28.8) = 28
  //
  // EffAtk: 99+3+8=110
  // AtkRoll: 110*(82+64)=16060
  // Salve 20% acc: floor(16060*1.20) = floor(19272) = 19272 ← THIS IS WHAT SHOULD HAPPEN
  //
  // DefRoll: (214+9)*(108+64) = 223*172 = 38356
  // Accuracy with salve acc: 16060/2*38357 (A<D) or 1-38358/(2*19273) etc.
  // Without salve acc: 16060 vs 38356 → A<D → 16060/(2*38357) = 0.20932
  // With salve acc: 19272 vs 38356 → A<D → 19272/(2*38357) = 0.25122

  const vorkath = getBoss("vorkath")!;
  const ctx = makeCtx(
    { combatStyle: "melee", attackStyle: "accurate" },
    { weapon: getItem("whip")!, neck: getItem("salve-ei")! },
    vorkath,
  );
  const result = calculateDps(ctx);

  // Salve should give 20% damage boost
  const salveStep = result.breakdown.multiplierChain.find(s => s.name.includes("Salve"));
  if (salveStep) {
    assertClose(salveStep.factor, 1.20, "T12: salve damage factor", 0.001);
  } else {
    failed++;
    failures.push("  FAIL: T12: No salve step in multiplier chain");
  }
  assertEqual(result.maxHit, 28, "T12: max hit with salve");

  // CRITICAL: Salve should also boost accuracy by 20%
  // Expected attack roll = floor(16060 * 1.20) = 19272
  // Our code may not apply salve accuracy at all!
  const expectedAtkRoll = Math.floor(16060 * 1.20);
  console.log(`  INFO: Attack roll = ${result.breakdown.attackRoll} (expected with salve acc: ${expectedAtkRoll}, without: 16060)`);
  if (result.breakdown.attackRoll === 16060) {
    failed++;
    failures.push("  FAIL: T12: Salve (ei) accuracy NOT applied! Attack roll = 16060 (should be ~19272)");
    console.log("  BUG CONFIRMED: Salve amulet (ei) does not apply +20% accuracy vs undead");
  } else {
    assertEqual(result.breakdown.attackRoll, expectedAtkRoll, "T12: attack roll with salve accuracy");
  }
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 13: Salve (ei) + Slayer Helm interaction (should NOT stack)
// ═══════════════════════════════════════════════════════════════════════

section("TEST 13: Salve + Slayer Helm — should not stack");
{
  // Both equipped, on task, undead target — salve should override
  const vorkath = getBoss("vorkath")!;
  const ctx = makeCtx(
    { combatStyle: "melee", attackStyle: "accurate", onSlayerTask: true },
    { weapon: getItem("whip")!, neck: getItem("salve-ei")!, head: getItem("slayer-helm-i")! },
    vorkath,
  );
  const result = calculateDps(ctx);

  // Damage chain should only have Salve, not both
  const chain = result.breakdown.multiplierChain;
  const salveStep = chain.find(s => s.name.includes("Salve"));
  const slayerStep = chain.find(s => s.name.includes("Slayer"));

  if (salveStep && !slayerStep) {
    passed++;
    console.log("  OK: Damage chain correctly uses Salve only (no stacking)");
  } else if (salveStep && slayerStep) {
    failed++;
    failures.push("  FAIL: T13: Both Salve AND Slayer Helm in damage chain (should not stack!)");
  }

  // Accuracy should also use Salve (20%), not Slayer Helm (16.67%)
  // With just whip (aslash=82) + slayer helm:
  // Base atk roll = 110 * (82+64) = 16060 (where 82 is whip aslash, slayer has aslash=0 but contributes dstab etc.)
  // Actually, let me recalculate with slayer helm stats:
  // slayer-helm-i bonuses: amagic=3, aranged=3, dstab=30, dslash=32, dcrush=27, dranged=30, dmagic=10, mstr=3
  // Total aslash = whip 82 + slayer 0 = 82
  // (slayer helm has no aslash/astab/acrush bonus for melee attack)
  // So aslash = 82

  // If slayer helm accuracy is being applied when it shouldn't be:
  // AtkRoll_base = 110*(82+64) = 16060
  // With slayer helm acc: floor(16060 * 7/6) = 18736
  // With salve acc: floor(16060 * 1.20) = 19272
  // Correct: only salve acc (19272)

  console.log(`  INFO: Attack roll = ${result.breakdown.attackRoll}`);
  console.log(`  Expected (salve acc only): ${Math.floor(16060 * 1.20)} = 19272`);
  console.log(`  Wrong (slayer acc only): ${Math.floor(16060 * 7/6)} = 18736`);
  console.log(`  Wrong (both stacked): ${Math.floor(Math.floor(16060 * 7/6) * 1.20)}`);
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 14: Dragon Hunter Lance vs Dragon
// ═══════════════════════════════════════════════════════════════════════

section("TEST 14: DHL vs Vorkath (dragon)");
{
  // DHL: stab, 4t, astab=85, mstr=82
  // Piety, super combat, accurate
  // Vorkath: def=214, dstab=26, isDragon
  //
  // EffStr: 99+19=118, floor(118*1.23)=145, +0+8=153
  // Base max: floor(0.5+153*(82+64)/640) = floor(0.5+153*146/640) = floor(0.5+34.903) = 35
  // DHL +20% dmg: floor(35*1.20) = 42
  //
  // EffAtk: 99+19=118, floor(118*1.20)=141, +3+8=152
  // AtkRoll_base: 152*(85+64) = 152*149 = 22648
  // DHL +20% acc: floor(22648*1.20) = floor(27177.6) = 27177
  //
  // DefRoll: (214+9)*(26+64) = 223*90 = 20070
  // Accuracy: A>D → 1-20072/(2*27178) = 1-20072/54356 = 0.63081
  //
  // DPS: (42/2*0.63081)/(4*0.6) = (21*0.63081)/2.4 = 13.247/2.4 = 5.520

  const vorkath = getBoss("vorkath")!;
  const ctx = makeCtx(
    { combatStyle: "melee", attackStyle: "accurate", potion: "super-combat", prayerType: "piety" },
    { weapon: getItem("dhl")! },
    vorkath,
  );
  const result = calculateDps(ctx);

  assertEqual(result.maxHit, 42, "T14: DHL max hit vs dragon");
  assertEqual(result.breakdown.attackRoll, 27177, "T14: DHL attack roll vs dragon");
  assertEqual(result.breakdown.defenceRoll, 20070, "T14: defence roll");
  assertClose(result.accuracy, 0.6308, "T14: accuracy", 0.005);
  assertClose(result.dps, 5.52, "T14: DPS", 0.1);
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 15: DHCB vs Dragon
// ═══════════════════════════════════════════════════════════════════════

section("TEST 15: DHCB + ruby bolts vs KBD (dragon)");
{
  // DHCB: crossbow, 5t, aranged=95
  // ruby bolts: rstr=122
  // anguish: aranged=15, rstr=5
  // Rigour, ranging pot, rapid
  // KBD: def=240, magic=240, dranged=20, isDragon
  //
  // Total aranged: 95+15 = 110
  // Total rstr: 0+122+5 = 127
  //
  // EffStr: 99+13=112, floor(112*1.23)=137, +0+8=145
  // Base max: floor(0.5+145*(127+64)/640) = floor(0.5+145*191/640) = floor(0.5+43.289) = floor(43.789) = 43
  // DHCB +25% dmg: floor(43*1.25) = floor(53.75) = 53
  //
  // EffAtk: 99+13=112, floor(112*1.20)=134, +0+8=142
  // AtkRoll: 142*(110+64) = 142*174 = 24708
  // DHCB +30% acc: floor(24708*1.30) = floor(32120.4) = 32120
  //
  // DefRoll: (240+9)*(20+64) = 249*84 = 20916
  //
  // Accuracy: A>D → 1-20918/(2*32121) = 1-20918/64242 = 0.67438
  // Speed: 5-1(rapid)=4 → 2.4s
  // DPS: (53/2*0.67438)/2.4 = (26.5*0.67438)/2.4 = 17.871/2.4 = 7.446

  const kbd = getBoss("kbd")!;
  const ctx = makeCtx(
    { combatStyle: "ranged", attackStyle: "rapid", potion: "ranging", prayerType: "rigour" },
    { weapon: getItem("dhcb")!, ammo: getItem("ruby-bolts-e")!, neck: getItem("anguish")! },
    kbd,
  );
  const result = calculateDps(ctx);

  assertEqual(result.maxHit, 53, "T15: DHCB max hit vs dragon");
  assertEqual(result.breakdown.defenceRoll, 20916, "T15: defence roll");
  assertClose(result.accuracy, 0.6744, "T15: accuracy", 0.005);
  // DPS includes ruby bolt spec: 6% proc for min(100, 20% of 240hp)=48 dmg
  // Bolt bonus = 0.06*acc*(48-26.5)/interval ≈ 0.362
  assertClose(result.dps, 7.809, "T15: DPS (includes ruby bolt spec)", 0.1);
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 16: Arclight vs Demon
// ═══════════════════════════════════════════════════════════════════════

section("TEST 16: Arclight vs K'ril (demon)");
{
  // Arclight: slash, 4t, aslash=72, mstr=72
  // Piety, super combat, accurate
  // K'ril: def=270, dslash=80, isDemon, magic=200
  //
  // EffStr: 99+19=118, floor(118*1.23)=145, +0+8=153
  // Base max: floor(0.5+153*(72+64)/640) = floor(0.5+153*136/640) = floor(0.5+32.513) = floor(33.013) = 33
  // Arclight +70% dmg: floor(33*1.70) = floor(56.1) = 56
  //
  // EffAtk: 152
  // AtkRoll: 152*(72+64) = 152*136 = 20672
  // Arclight +70% acc: floor(20672*1.70) = floor(35142.4) = 35142
  //
  // DefRoll: (270+9)*(80+64) = 279*144 = 40176
  // Accuracy: A<D → 35142/(2*40177) = 35142/80354 = 0.43734
  //
  // DPS: (56/2*0.43734)/(4*0.6) = (28*0.43734)/2.4 = 12.246/2.4 = 5.102

  const kril = getBoss("kril")!;
  const ctx = makeCtx(
    { combatStyle: "melee", attackStyle: "accurate", potion: "super-combat", prayerType: "piety" },
    { weapon: getItem("arclight")! },
    kril,
  );
  const result = calculateDps(ctx);

  assertEqual(result.maxHit, 56, "T16: arclight max hit vs demon");
  assertClose(result.accuracy, 0.4373, "T16: accuracy", 0.005);
  assertClose(result.dps, 5.102, "T16: DPS", 0.1);
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 17: Void Knight set bonus
// ═══════════════════════════════════════════════════════════════════════

section("TEST 17: Void melee — accuracy and strength multipliers");
{
  // Whip, void melee, accurate, no pot/prayer vs custom
  // EffStr: 99+0+8=107, void melee str 1.10 → floor(107*1.10) = floor(117.7) = 117
  // Max hit: floor(0.5+117*(82+64)/640) = floor(0.5+117*146/640) = floor(0.5+26.7) = floor(27.2) = 27
  //
  // EffAtk: 99+3+8=110, void melee acc 1.10 → floor(110*1.10) = floor(121) = 121
  // AtkRoll: 121*(82+64) = 121*146 = 17666
  //
  // DPS: (27/2 * acc)/(4*0.6)

  const ctx = makeCtx(
    { combatStyle: "melee", attackStyle: "accurate", voidSet: "void" },
    { weapon: getItem("whip")! },
    customTarget,
  );
  const result = calculateDps(ctx);

  assertEqual(result.breakdown.effectiveLevel, 117, "T17: void melee eff str");
  assertEqual(result.maxHit, 27, "T17: void melee max hit");
  assertEqual(result.breakdown.attackRoll, 17666, "T17: void melee attack roll");
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 18: Elite Void ranged
// ═══════════════════════════════════════════════════════════════════════

section("TEST 18: Elite Void ranged — MSB(i) + rune arrows");
{
  // MSB(i): bow, 3t (4 normal - 1 rapid = 3), aranged=75
  // rune arrows: rstr=49
  // elite void ranged: acc 1.10, str 1.125
  //
  // Total aranged: 75
  // Total rstr: 49
  //
  // EffStr: 99+0+8=107, elite void str 1.125 → floor(107*1.125) = floor(120.375) = 120
  // Max hit: floor(0.5+120*(49+64)/640) = floor(0.5+120*113/640) = floor(0.5+21.1875) = floor(21.6875) = 21
  //
  // EffAtk: 99+0+8=107, void acc 1.10 → floor(107*1.10)=floor(117.7)=117
  // AtkRoll: 117*(75+64) = 117*139 = 16263

  const ctx = makeCtx(
    { combatStyle: "ranged", attackStyle: "rapid", voidSet: "elite-void" },
    { weapon: getItem("msb-i")!, ammo: getItem("rune-arrows")! },
    customTarget,
  );
  const result = calculateDps(ctx);

  assertEqual(result.breakdown.effectiveLevel, 120, "T18: elite void ranged eff str");
  assertEqual(result.maxHit, 21, "T18: elite void ranged max hit");
  assertEqual(result.breakdown.attackRoll, 16263, "T18: elite void ranged atk roll");
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 19: Crystal armour + Bowfa accuracy bonus
// ═══════════════════════════════════════════════════════════════════════

section("TEST 19: Crystal armour + Bowfa — accuracy bonus check");
{
  // Bowfa: bow, 4t, aranged=128, rstr=106
  // Crystal helm: aranged=6, +5% acc, +2.5% dmg
  // Crystal body: aranged=26, +10% acc, +5% dmg  (wiki values; our code has different %)
  // Crystal legs: aranged=13, +5% acc, +2.5% dmg
  //
  // Total aranged: 128+6+26+13 = 173
  // Total rstr: 106
  //
  // EffStr: 99+0+8=107
  // Base max: floor(0.5+107*(106+64)/640) = floor(0.5+107*170/640) = floor(0.5+28.422) = floor(28.922) = 28
  // Crystal dmg: our code gives 2.5+7.5+5 = 15% → floor(28*1.15) = floor(32.2) = 32
  //
  // EffAtk: 99+0+8=107
  // AtkRoll (base): 107*(173+64) = 107*237 = 25359
  //
  // Crystal accuracy bonus should also be applied here.
  // Wiki says full crystal = +15% acc → floor(25359*1.15) = 29162
  // Our code: does NOT apply crystal accuracy bonus to attack roll

  const ctx = makeCtx(
    { combatStyle: "ranged", attackStyle: "rapid" },
    {
      weapon: getItem("bowfa")!,
      head: getItem("crystal-helm")!,
      body: getItem("crystal-body")!,
      legs: getItem("crystal-legs")!,
    },
    customTarget,
  );
  const result = calculateDps(ctx);

  assertEqual(result.maxHit, 32, "T19: bowfa+crystal max hit");

  // Check if crystal accuracy bonus is applied
  console.log(`  INFO: Bowfa+crystal attack roll = ${result.breakdown.attackRoll}`);
  console.log(`  Expected without crystal acc: 25359`);
  console.log(`  Expected with crystal acc: ${Math.floor(25359 * 1.15)} (full set +15%)`);

  if (result.breakdown.attackRoll === 25359) {
    failed++;
    failures.push("  FAIL: T19: Crystal armour accuracy bonus NOT applied to attack roll!");
    console.log("  BUG: Crystal armour accuracy bonus is missing from calculateAttackRoll");
  }
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 20: Inquisitor's accuracy bonus
// ═══════════════════════════════════════════════════════════════════════

section("TEST 20: Inquisitor's set — accuracy + damage");
{
  // Inq mace: crush, 4t, acrush=95, mstr=89
  // Full inquisitor: helm(acrush=4,mstr=2), body(acrush=8,mstr=4), legs(acrush=6,mstr=2)
  //
  // Total acrush: 95+4+8+6 = 113
  // Total mstr: 89+2+4+2 = 97
  //
  // No potion/prayer, accurate
  // EffStr: 99+0+8 = 107
  // Base max: floor(0.5+107*(97+64)/640) = floor(0.5+107*161/640) = floor(0.5+26.923) = floor(27.423) = 27
  //
  // Full inq (+4% dmg): floor(27*1.04) = floor(28.08) = 28
  //
  // EffAtk: 99+3+8 = 110
  // AtkRoll base: 110*(113+64) = 110*177 = 19470
  // Full inq acc should be +4%: floor(19470*1.04) = floor(20248.8) = 20248
  //
  // Our code: only applies damage, not accuracy

  const ctx = makeCtx(
    { combatStyle: "melee", attackStyle: "accurate" },
    {
      weapon: getItem("inq-mace")!,
      head: getItem("inq-helm")!,
      body: getItem("inq-body")!,
      legs: getItem("inq-legs")!,
    },
    customTarget,
  );
  const result = calculateDps(ctx);

  assertEqual(result.maxHit, 28, "T20: inquisitor max hit");

  console.log(`  INFO: Inquisitor attack roll = ${result.breakdown.attackRoll}`);
  console.log(`  Expected without inq acc: 19470`);
  console.log(`  Expected with inq acc (+4%): ${Math.floor(19470 * 1.04)}`);

  if (result.breakdown.attackRoll === 19470) {
    failed++;
    failures.push("  FAIL: T20: Inquisitor's accuracy bonus NOT applied to attack roll!");
    console.log("  BUG: Inquisitor's accuracy bonus is missing from calculateAttackRoll");
  }
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 21: Defence roll formula
// ═══════════════════════════════════════════════════════════════════════

section("TEST 21: Defence roll formula verification");
{
  // Wiki: DefRoll = (def_level + 9) * (def_bonus + 64)
  // Magic attacks use target's magic level, not defence level

  // Custom target: def=1, all bonuses=0
  assertEqual(calculateDefenceRoll(customTarget, "slash"), (1+9)*(0+64), "T21: custom slash def roll");
  assertEqual(calculateDefenceRoll(customTarget, "magic"), (1+9)*(0+64), "T21: custom magic def roll");

  // Graardor: def=250, dstab=90, magic=80
  const graardor = getBoss("graardor")!;
  assertEqual(calculateDefenceRoll(graardor, "stab"), (250+9)*(90+64), "T21: graardor stab def roll");
  assertEqual(calculateDefenceRoll(graardor, "magic"), (80+9)*(298+64), "T21: graardor magic def roll");

  // Zulrah: def=300, magic=300, dranged=50, dmagic=-45
  const zulrah = getBoss("zulrah")!;
  assertEqual(calculateDefenceRoll(zulrah, "ranged"), (300+9)*(50+64), "T21: zulrah ranged def roll");
  assertEqual(calculateDefenceRoll(zulrah, "magic"), (300+9)*(-45+64), "T21: zulrah magic def roll");
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 22: Accuracy formula
// ═══════════════════════════════════════════════════════════════════════

section("TEST 22: Accuracy formula — standard roll");
{
  // When A > D: accuracy = 1 - (D+2)/(2*(A+1))
  // When A <= D: accuracy = A/(2*(D+1))

  // A=10000, D=5000: A>D → 1-5002/20002 = 1-0.25008 = 0.74992
  // A=5000, D=10000: A<=D → 5000/20002 = 0.24999

  // We can't call standardAccuracy directly (it's private), but we can verify through full calc
  // Let's verify with known boss setups

  // Simple check: whip vs custom (A >> D)
  const ctx1 = makeCtx(
    { combatStyle: "melee", attackStyle: "accurate" },
    { weapon: getItem("whip")! },
    customTarget,
  );
  const r1 = calculateDps(ctx1);
  // AtkRoll=16060, DefRoll=640
  // A>D: 1-642/32122 = 0.98002
  assertClose(r1.accuracy, 0.98002, "T22: accuracy A>>D", 0.001);

  // whip vs Nightmare (high defence, 40 crush)
  const nightmare = getBoss("nightmare")!;
  const ctx2 = makeCtx(
    { combatStyle: "melee", attackStyle: "accurate" },
    { weapon: getItem("whip")! },
    nightmare,
  );
  const r2 = calculateDps(ctx2);
  // AtkRoll=16060 (slash), DefRoll = (150+9)*(180+64)=159*244=38796
  // A<D: 16060/(2*38797) = 16060/77594 = 0.20697
  assertClose(r2.accuracy, 0.20697, "T22: accuracy A<D (whip vs Nightmare)", 0.005);
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 23: TBow formula at various magic levels
// ═══════════════════════════════════════════════════════════════════════

section("TEST 23: TBow damage/accuracy scaling");
{
  // Helper to test TBow multipliers (matching wiki calc source formula)
  function tbowDmg(magic: number): number {
    const M = Math.min(250, magic);
    const t2 = Math.trunc((3 * M - 14) / 100);
    const t3 = Math.trunc(Math.pow(Math.trunc(3 * M / 10) - 140, 2) / 100);
    return Math.min(250, Math.max(0, 250 + t2 - t3));
  }
  function tbowAcc(magic: number): number {
    const M = Math.min(250, magic);
    const t2 = Math.trunc((3 * M - 10) / 100);
    const t3 = Math.trunc(Math.pow(Math.trunc(3 * M / 10) - 100, 2) / 100);
    return Math.min(140, Math.max(0, 140 + t2 - t3));
  }

  // Wiki calc source formula: t2=trunc((3M-factor)/100), t3=trunc((trunc(3M/10)-10*factor)^2/100)
  // Accuracy: factor=10, base=140. Damage: factor=14, base=250.
  //
  // M=1: dmg: t2=trunc(-11/100)=0 (trunc toward zero), t3=trunc((0-140)^2/100)=196 → 250+0-196=54
  //      acc: t2=trunc(-7/100)=0, t3=trunc((0-100)^2/100)=100 → 140+0-100=40
  // M=100: dmg: t2=trunc(286/100)=2, t3=trunc((30-140)^2/100)=121 → 250+2-121=131
  //        acc: t2=trunc(290/100)=2, t3=trunc((30-100)^2/100)=49 → 140+2-49=93
  // M=150: dmg: t2=trunc(436/100)=4, t3=trunc((45-140)^2/100)=90 → 250+4-90=164
  //        acc: t2=trunc(440/100)=4, t3=trunc((45-100)^2/100)=30 → 140+4-30=114
  // M=200: dmg: t2=trunc(586/100)=5, t3=trunc((60-140)^2/100)=64 → 250+5-64=191
  //        acc: t2=trunc(590/100)=5, t3=trunc((60-100)^2/100)=16 → 140+5-16=129
  // M=250: dmg: t2=trunc(736/100)=7, t3=trunc((75-140)^2/100)=42 → 250+7-42=215
  //        acc: t2=trunc(740/100)=7, t3=trunc((75-100)^2/100)=6 → 140+7-6=141→clamped 140

  assertEqual(tbowDmg(1), 54, "T23: tbow dmg% at magic 1");
  assertEqual(tbowAcc(1), 40, "T23: tbow acc% at magic 1");
  assertEqual(tbowDmg(100), 131, "T23: tbow dmg% at magic 100");
  assertEqual(tbowAcc(100), 93, "T23: tbow acc% at magic 100");
  assertEqual(tbowDmg(150), 164, "T23: tbow dmg% at magic 150");
  assertEqual(tbowAcc(150), 114, "T23: tbow acc% at magic 150");
  assertEqual(tbowDmg(200), 191, "T23: tbow dmg% at magic 200");
  assertEqual(tbowAcc(200), 129, "T23: tbow acc% at magic 200");
  assertEqual(tbowDmg(250), 215, "T23: tbow dmg% at magic 250");
  assertEqual(tbowAcc(250), 140, "T23: tbow acc% at magic 250");
  assertEqual(tbowDmg(350), 215, "T23: tbow dmg% at magic 350 (capped)");
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 24: Powered staff max hit formulas
// ═══════════════════════════════════════════════════════════════════════

section("TEST 24: Powered staff base damage formulas");
{
  // Shadow: floor(magic/3) + 1
  // At magic 112 (99+13 from magic pot): floor(112/3)+1 = 37+1 = 38
  //
  // Sang: floor(magic/3) - 1
  // At 112: 37-1 = 36
  //
  // Trident swamp: floor(magic/3) - 2
  // At 112: 37-2 = 35
  //
  // These are tested implicitly in Test 6, but let me verify the formulas directly

  // We can't call getPoweredStaffBaseDamage directly, but we can verify through max hit calc
  // For Shadow at 99 magic, no pot: visible=99, base=floor(99/3)+1=33+1=34
  // mdmg from shadow: 0, tripled=0, max=floor(34*(1+0/100))=34
  const ctxShadow = makeCtx(
    { combatStyle: "magic", attackStyle: "autocast" },
    { weapon: getItem("shadow")! },
    customTarget,
  );
  assertEqual(calculateMaxHit(ctxShadow), 34, "T24: shadow max hit (99 magic, no pot, no gear)");

  // Sang at 99 magic, no pot, no gear: base=floor(99/3)-1=33-1=32, max=32
  const ctxSang = makeCtx(
    { combatStyle: "magic", attackStyle: "autocast" },
    { weapon: getItem("sang")! },
    customTarget,
  );
  assertEqual(calculateMaxHit(ctxSang), 32, "T24: sang max hit (99 magic, no gear)");

  // Trident swamp at 99, no gear: base=floor(99/3)-2=33-2=31, max=31
  const ctxTrident = makeCtx(
    { combatStyle: "magic", attackStyle: "autocast" },
    { weapon: getItem("trident-swamp")! },
    customTarget,
  );
  assertEqual(calculateMaxHit(ctxTrident), 31, "T24: trident max hit (99 magic, no gear)");
}

// ═══════════════════════════════════════════════════════════════════════
// TEST 25: Shadow tripling verification
// ═══════════════════════════════════════════════════════════════════════

section("TEST 25: Shadow tripling of magic attack and damage %");
{
  // Shadow + occult (mdmg 5) + tormented (mdmg 5) = 10% mdmg
  // Tripled = 30%
  // At 99 magic: base=34, max=floor(34*(1+30/100))=floor(34*1.30)=floor(44.2)=44
  const ctx = makeCtx(
    { combatStyle: "magic", attackStyle: "autocast" },
    { weapon: getItem("shadow")!, neck: getItem("occult")!, hands: getItem("tormented")! },
    customTarget,
  );
  const result = calculateDps(ctx);
  assertEqual(result.maxHit, 44, "T25: shadow with 10% mdmg (tripled to 30%)");

  // Attack roll check: shadow amagic=35, occult amagic=12, tormented amagic=10
  // Total = 57, tripled = 171
  // EffAtk: 99+0+8=107 (autocast=0, no prayer)
  // AtkRoll: 107*(171+64)=107*235=25145
  assertEqual(result.breakdown.attackRoll, 25145, "T25: shadow attack roll with tripled amagic");
}

// ═══════════════════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════════════════

console.log(`\n${"═".repeat(70)}`);
console.log("  VALIDATION SUMMARY");
console.log(`${"═".repeat(70)}`);
console.log(`  Passed: ${passed}`);
console.log(`  Failed: ${failed}`);

if (failures.length > 0) {
  console.log("\n  FAILURES:");
  for (const f of failures) {
    console.log(f);
  }
}

console.log(`\n${"═".repeat(70)}`);
process.exit(failed > 0 ? 1 : 0);
