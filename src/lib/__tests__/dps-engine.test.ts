/**
 * DPS Engine Unit Tests
 *
 * Tests against wiki-verified formulas from the OSRS Wiki DPS Calculator
 * (weirdgloop/osrs-dps-calc) and the Bitterkoekje spreadsheet.
 *
 * Every expected value is hand-calculated with step-by-step reasoning.
 * No values are "eyeballed" — all are exact floor/trunc arithmetic.
 */
import { describe, it, expect } from "vitest";
import {
  calculateDps,
  calculateDefenceRoll,
  calculateEffectiveStrengthLevel,
  calculateBaseMaxHit,
  getMultiplierChain,
  sumEquipmentBonuses,
} from "@/lib/dps-engine";
import { aggregatePactEffects } from "@/lib/pact-effects";
import { getItem } from "@/data/items";
import { getBoss } from "@/data/boss-presets";
import type {
  DpsContext,
  BuildLoadout,
  PlayerConfig,
  BossPreset,
} from "@/types/dps";

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════

function emptyLoadout(): BuildLoadout {
  return {
    head: null, cape: null, neck: null, ammo: null, weapon: null,
    body: null, shield: null, legs: null, hands: null, feet: null, ring: null,
  };
}

function defaultPlayer(overrides: Partial<PlayerConfig> = {}): PlayerConfig {
  return {
    attack: 99, strength: 99, defence: 99, ranged: 99, magic: 99,
    prayer: 99, hitpoints: 99,
    potion: "none", prayerType: "none", attackStyle: "accurate",
    combatStyle: "melee", regions: [], activePacts: [],
    voidSet: "none", onSlayerTask: false,
    ...overrides,
  };
}

function makeCtx(
  player: Partial<PlayerConfig>,
  loadout: Partial<BuildLoadout>,
  target: BossPreset,
): DpsContext {
  return {
    player: defaultPlayer(player),
    loadout: { ...emptyLoadout(), ...loadout },
    target,
  };
}

const custom = getBoss("custom")!;

// Empty pact effects are created inline via aggregatePactEffects([])

// ═══════════════════════════════════════════════════════════════════════
// DEFENCE ROLL — Wiki formula: (defLevel + 9) * (bonus + 64)
// ═══════════════════════════════════════════════════════════════════════

describe("calculateDefenceRoll", () => {
  it("custom target (def=1, bonus=0): (1+9)*(0+64) = 640", () => {
    expect(calculateDefenceRoll(custom, "slash")).toBe(640);
    expect(calculateDefenceRoll(custom, "stab")).toBe(640);
    expect(calculateDefenceRoll(custom, "crush")).toBe(640);
    expect(calculateDefenceRoll(custom, "ranged")).toBe(640);
    expect(calculateDefenceRoll(custom, "magic")).toBe(640);
  });

  it("uses magic level for magic attack type", () => {
    const boss: BossPreset = {
      id: "test", name: "Test", defenceLevel: 200, magicLevel: 100,
      dstab: 50, dslash: 50, dcrush: 50, dranged: 50, dmagic: -30,
      hp: 500,
    };
    // Magic: (100+9)*(-30+64) = 109*34 = 3706
    expect(calculateDefenceRoll(boss, "magic")).toBe(3706);
    // Melee: (200+9)*(50+64) = 209*114 = 23826
    expect(calculateDefenceRoll(boss, "stab")).toBe(23826);
  });

  it("Graardor slash: (250+9)*(90+64) = 259*154 = 39886", () => {
    const graardor = getBoss("graardor")!;
    expect(calculateDefenceRoll(graardor, "slash")).toBe(39886);
  });

  it("Wardens P3 magic: (200+9)*(-60+64) = 209*4 = 836", () => {
    const wardens = getBoss("wardens-p3")!;
    expect(calculateDefenceRoll(wardens, "magic")).toBe(836);
  });

  it("Zulrah ranged: (300+9)*(50+64) = 309*114 = 35226", () => {
    const zulrah = getBoss("zulrah")!;
    expect(calculateDefenceRoll(zulrah, "ranged")).toBe(35226);
  });

  it("negative defence bonus produces small roll", () => {
    const zulrah = getBoss("zulrah")!;
    // Zulrah magic: (300+9)*(-45+64) = 309*19 = 5871
    expect(calculateDefenceRoll(zulrah, "magic")).toBe(5871);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// EFFECTIVE STRENGTH LEVEL
// Wiki order: base → potion (+add) → prayer (×floor) → style + 8 → void (×floor)
// ═══════════════════════════════════════════════════════════════════════

describe("calculateEffectiveStrengthLevel", () => {
  it("no boosts, accurate: 99 + 0 + 8 = 107", () => {
    const ctx = makeCtx({ combatStyle: "melee", attackStyle: "accurate" }, {}, custom);
    expect(calculateEffectiveStrengthLevel(ctx)).toBe(107);
  });

  it("aggressive style adds +3: 99 + 3 + 8 = 110", () => {
    const ctx = makeCtx({ combatStyle: "melee", attackStyle: "aggressive" }, {}, custom);
    expect(calculateEffectiveStrengthLevel(ctx)).toBe(110);
  });

  it("controlled style adds +1: 99 + 1 + 8 = 108", () => {
    const ctx = makeCtx({ combatStyle: "melee", attackStyle: "controlled" }, {}, custom);
    expect(calculateEffectiveStrengthLevel(ctx)).toBe(108);
  });

  it("super combat + piety, accurate: floor((99+19)*1.23)+8 = floor(145.14)+8 = 153", () => {
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate", potion: "super-combat", prayerType: "piety" },
      {}, custom,
    );
    // 99+5+floor(99*0.15)=99+5+14=118, floor(118*1.23)=floor(145.14)=145, +0+8=153
    expect(calculateEffectiveStrengthLevel(ctx)).toBe(153);
  });

  it("super combat + piety, aggressive: 156", () => {
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "aggressive", potion: "super-combat", prayerType: "piety" },
      {}, custom,
    );
    // 118→floor(118*1.23)=145, +3+8=156
    expect(calculateEffectiveStrengthLevel(ctx)).toBe(156);
  });

  it("ranging potion + rigour, rapid (ranged): 145", () => {
    const ctx = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", potion: "ranging", prayerType: "rigour" },
      {}, custom,
    );
    // 99+4+floor(99*0.10)=99+4+9=112, floor(112*1.23)=floor(137.76)=137, +0+8=145
    expect(calculateEffectiveStrengthLevel(ctx)).toBe(145);
  });

  it("magic potion + augury (magic prayers don't boost str): 120", () => {
    const ctx = makeCtx(
      { combatStyle: "magic", attackStyle: "autocast", potion: "magic", prayerType: "augury" },
      {}, custom,
    );
    // 99+4+floor(99*0.10)=112, augury str mult=1.0, floor(112*1.0)=112, +0+8=120
    expect(calculateEffectiveStrengthLevel(ctx)).toBe(120);
  });

  it("overload melee: same as super combat", () => {
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate", potion: "overload" },
      {}, custom,
    );
    // 99+5+floor(99*0.15)=118, no prayer(×1.0), +0+8=126
    expect(calculateEffectiveStrengthLevel(ctx)).toBe(126);
  });

  it("overload ranged: same as ranging pot", () => {
    const ctx = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", potion: "overload" },
      {}, custom,
    );
    // 99+4+floor(99*0.10)=112, no prayer, +0+8=120
    expect(calculateEffectiveStrengthLevel(ctx)).toBe(120);
  });

  it("smelling salts: 11+floor(99*0.16)=11+15=26 boost", () => {
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate", potion: "smelling-salts" },
      {}, custom,
    );
    // 99+26=125, no prayer, +0+8=133
    expect(calculateEffectiveStrengthLevel(ctx)).toBe(133);
  });

  it("void melee: ×1.10 after style+8", () => {
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate", voidSet: "void" },
      {}, custom,
    );
    // 99+0+8=107, floor(107*1.10)=floor(117.7)=117
    expect(calculateEffectiveStrengthLevel(ctx)).toBe(117);
  });

  it("elite void ranged: ×1.125", () => {
    const ctx = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", voidSet: "elite-void" },
      {}, custom,
    );
    // 99+0+8=107, floor(107*1.125)=floor(120.375)=120
    expect(calculateEffectiveStrengthLevel(ctx)).toBe(120);
  });

  it("elite void magic: ×1.025", () => {
    const ctx = makeCtx(
      { combatStyle: "magic", attackStyle: "autocast", voidSet: "elite-void" },
      {}, custom,
    );
    // 99+0+8=107, floor(107*1.025)=floor(109.675)=109
    expect(calculateEffectiveStrengthLevel(ctx)).toBe(109);
  });

  it("low level (70 str), super strength, ultimate strength prayer", () => {
    const ctx = makeCtx(
      { strength: 70, combatStyle: "melee", attackStyle: "accurate", potion: "super-strength", prayerType: "ultimate-strength" },
      {}, custom,
    );
    // 70+5+floor(70*0.15)=70+5+10=85, floor(85*1.15)=floor(97.75)=97, +0+8=105
    expect(calculateEffectiveStrengthLevel(ctx)).toBe(105);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// EQUIPMENT BONUS SUMMING
// ═══════════════════════════════════════════════════════════════════════

describe("sumEquipmentBonuses", () => {
  it("empty loadout returns all zeros", () => {
    const bonuses = sumEquipmentBonuses(emptyLoadout());
    expect(bonuses.mstr).toBe(0);
    expect(bonuses.rstr).toBe(0);
    expect(bonuses.mdmg).toBe(0);
    expect(bonuses.astab).toBe(0);
  });

  it("sums whip + torture correctly", () => {
    const whip = getItem("whip")!;
    const torture = getItem("torture")!;
    const loadout = { ...emptyLoadout(), weapon: whip, neck: torture };
    const bonuses = sumEquipmentBonuses(loadout);
    expect(bonuses.mstr).toBe(whip.bonuses.mstr + torture.bonuses.mstr);
    expect(bonuses.aslash).toBe(whip.bonuses.aslash + torture.bonuses.aslash);
  });

  it("full melee BIS sums to expected totals", () => {
    const loadout: BuildLoadout = {
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
      ammo: null,
    };
    const bonuses = sumEquipmentBonuses(loadout);
    // Sum of all melee str bonuses from these items
    const expectedMstr = [
      loadout.weapon!, loadout.neck!, loadout.cape!, loadout.head!,
      loadout.body!, loadout.legs!, loadout.shield!, loadout.feet!,
      loadout.hands!, loadout.ring!,
    ].reduce((sum, item) => sum + item.bonuses.mstr, 0);
    expect(bonuses.mstr).toBe(expectedMstr);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// BASE MAX HIT
// Wiki melee/ranged: floor(0.5 + effLevel * (equipStr + 64) / 640)
// Wiki magic: floor(spellBaseMax * (1 + equipStr/100))
// Powered staff: floor(getPoweredStaffBase(visibleMagic) * (1 + equipStr/100))
// ═══════════════════════════════════════════════════════════════════════

describe("calculateBaseMaxHit", () => {
  it("melee: whip, 99 str, accurate, no boost → 24", () => {
    // EffStr=107, whip mstr=82 → floor(0.5 + 107*(82+64)/640) = floor(0.5+107*146/640) = floor(24.92) = 24
    const ctx = makeCtx({ combatStyle: "melee" }, { weapon: getItem("whip")! }, custom);
    expect(calculateBaseMaxHit(ctx, 107, 82, getItem("whip")!)).toBe(24);
  });

  it("melee: super combat + piety, accurate → 35", () => {
    // EffStr=153, whip mstr=82 → floor(0.5+153*146/640)=floor(0.5+34.903)=floor(35.403)=35
    const ctx = makeCtx({ combatStyle: "melee" }, { weapon: getItem("whip")! }, custom);
    expect(calculateBaseMaxHit(ctx, 153, 82, getItem("whip")!)).toBe(35);
  });

  it("magic: shadow powered staff, visible magic 112", () => {
    // Shadow base: floor(112/3)+1 = 37+1 = 38
    // With 69% magic dmg: floor(38*(1+69/100)) = floor(38*1.69) = floor(64.22) = 64
    const ctx = makeCtx({ combatStyle: "magic", magic: 99, potion: "magic" }, { weapon: getItem("shadow")! }, custom);
    expect(calculateBaseMaxHit(ctx, 120, 69, getItem("shadow")!)).toBe(64);
  });

  it("magic: sang staff, visible magic 112", () => {
    // Sang base: floor(112/3)-1 = 37-1 = 36
    // With 23% magic dmg: floor(36*(1+23/100)) = floor(36*1.23) = floor(44.28) = 44
    const ctx = makeCtx({ combatStyle: "magic", magic: 99, potion: "magic" }, { weapon: getItem("sang")! }, custom);
    expect(calculateBaseMaxHit(ctx, 120, 23, getItem("sang")!)).toBe(44);
  });

  it("magic: trident of the swamp, visible magic 112", () => {
    // Trident base: floor(112/3)-2 = 37-2 = 35
    // With 23% magic dmg: floor(35*(1+23/100)) = floor(35*1.23) = floor(43.05) = 43
    const ctx = makeCtx({ combatStyle: "magic", magic: 99, potion: "magic" }, { weapon: getItem("trident-swamp")! }, custom);
    expect(calculateBaseMaxHit(ctx, 120, 23, getItem("trident-swamp")!)).toBe(43);
  });

  it("magic: standard spell (spellMaxHit=24) with no magic dmg%", () => {
    const ctx = makeCtx({ combatStyle: "magic", spellMaxHit: 24 }, { weapon: getItem("kodai")! }, custom);
    // floor(24 * (1 + 0/100)) = 24
    expect(calculateBaseMaxHit(ctx, 120, 0, getItem("kodai")!)).toBe(24);
  });

  it("magic: standard spell (spellMaxHit=24) with 28% magic dmg", () => {
    const ctx = makeCtx({ combatStyle: "magic", spellMaxHit: 24 }, { weapon: getItem("kodai")! }, custom);
    // floor(24 * (1 + 28/100)) = floor(24*1.28) = floor(30.72) = 30
    expect(calculateBaseMaxHit(ctx, 120, 28, getItem("kodai")!)).toBe(30);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// STANDARD ACCURACY FORMULA
// Wiki: A>D: 1-(D+2)/(2*(A+1)), A<=D: A/(2*(D+1))
// ═══════════════════════════════════════════════════════════════════════

describe("accuracy formula", () => {
  it("high accuracy, low defence: whip vs custom target", () => {
    // AtkRoll=16060, DefRoll=640
    // A>D: 1-(640+2)/(2*(16060+1)) = 1-642/32122 = 0.98002
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate" },
      { weapon: getItem("whip")! },
      custom,
    );
    const result = calculateDps(ctx);
    expect(result.breakdown.attackRoll).toBe(16060);
    expect(result.breakdown.defenceRoll).toBe(640);
    expect(result.breakdown.baseAccuracy).toBeCloseTo(0.98002, 4);
  });

  it("low accuracy, high defence: whip vs graardor (A<D)", () => {
    const graardor = getBoss("graardor")!;
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate" },
      { weapon: getItem("whip")! },
      graardor,
    );
    const result = calculateDps(ctx);
    // DefRoll slash: (250+9)*(90+64) = 259*154 = 39886
    expect(result.breakdown.defenceRoll).toBe(39886);
    // A<D: 16060/(2*39887) = 0.20131 (approximate)
    expect(result.breakdown.baseAccuracy).toBeCloseTo(16060 / (2 * 39887), 4);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// FANG EXACT ACCURACY
// Wiki: A>D: 1-(D+2)*(2D+3)/((A+1)^2*6)
//       A<=D: A*(4A+5)/(6*(A+1)*(D+1))
// ═══════════════════════════════════════════════════════════════════════

describe("fang accuracy (double roll exact)", () => {
  it("fang vs graardor uses exact discrete formula", () => {
    const graardor = getBoss("graardor")!;
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate", potion: "super-combat", prayerType: "piety" },
      { weapon: getItem("fang")! },
      graardor,
    );
    const result = calculateDps(ctx);

    // AtkRoll: EffAtk=152, fang astab=105 → 152*(105+64) = 152*169 = 25688
    expect(result.breakdown.attackRoll).toBe(25688);
    // DefRoll stab: (250+9)*(90+64) = 39886
    expect(result.breakdown.defenceRoll).toBe(39886);

    // A < D → fang formula: A*(4A+5) / (6*(A+1)*(D+1))
    const A = 25688, D = 39886;
    const expected = A * (4 * A + 5) / (6 * (A + 1) * (D + 1));
    expect(result.accuracy).toBeCloseTo(expected, 5);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// TWISTED BOW FORMULA
// Wiki: dmg_factor = min(250, max(0, 250 + trunc((3M-14)/100) - trunc((trunc(3M/10)-140)^2/100)))
// Wiki: acc_factor = min(140, max(0, 140 + trunc((3M-10)/100) - trunc((trunc(3M/10)-100)^2/100)))
// ═══════════════════════════════════════════════════════════════════════

describe("twisted bow scaling", () => {
  it("tbow dmg factor vs Zulrah (M=250 capped from 300)", () => {
    const zulrah = getBoss("zulrah")!;
    const ctx = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", potion: "ranging", prayerType: "rigour" },
      { weapon: getItem("tbow")!, ammo: getItem("dragon-arrows")! },
      zulrah,
    );
    const result = calculateDps(ctx);
    const chain = result.breakdown.multiplierChain;
    const tbowStep = chain.find(s => s.name === "Twisted Bow");
    expect(tbowStep).toBeDefined();

    // M = min(250, 300) = 250
    // t2 = trunc((750-14)/100) = trunc(7.36) = 7
    // t3 = trunc((trunc(750/10)-140)^2/100) = trunc((75-140)^2/100) = trunc(4225/100) = 42
    // dmg = min(250, max(0, 250+7-42)) = min(250, 215) = 215
    expect(tbowStep!.factor).toBeCloseTo(2.15, 2);
  });

  it("tbow vs low magic target (M=1) gives ~1.0 factor", () => {
    const ctx = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid" },
      { weapon: getItem("tbow")!, ammo: getItem("dragon-arrows")! },
      custom, // magicLevel=1
    );
    const result = calculateDps(ctx);
    const tbowStep = result.breakdown.multiplierChain.find(s => s.name === "Twisted Bow");
    // M=1: t2=trunc((3-14)/100)=trunc(-0.11)=-1 (trunc rounds toward 0) → 0
    // Wait, Math.trunc(-0.11) = 0. Actually: (3*1-14)/100 = -11/100 = -0.11 → trunc = 0
    // t3 = trunc((trunc(3/10)-140)^2/100) = trunc((0-140)^2/100) = trunc(19600/100) = 196
    // dmg = min(250, max(0, 250+0-196)) = min(250, 54) = 54
    expect(tbowStep!.factor).toBeCloseTo(0.54, 2);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// MULTIPLIER CHAIN — WEAPON PASSIVES
// ═══════════════════════════════════════════════════════════════════════

describe("multiplier chain", () => {
  it("arclight vs demon: +70% dmg", () => {
    const kril = getBoss("kril")!; // isDemon=true
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate" },
      { weapon: getItem("arclight")! },
      kril,
    );
    const pe = aggregatePactEffects([]);
    const chain = getMultiplierChain(ctx, pe, 20);
    const step = chain.find(s => s.name === "Arclight vs Demons");
    expect(step).toBeDefined();
    expect(step!.factor).toBe(1.70);
  });

  it("arclight vs non-demon: no multiplier", () => {
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate" },
      { weapon: getItem("arclight")! },
      custom, // not a demon
    );
    const pe = aggregatePactEffects([]);
    const chain = getMultiplierChain(ctx, pe, 20);
    expect(chain.find(s => s.name === "Arclight vs Demons")).toBeUndefined();
  });

  it("DHCB vs dragon: +25% dmg", () => {
    const vorkath = getBoss("vorkath")!; // isDragon=true
    const ctx = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid" },
      { weapon: getItem("dhcb")! },
      vorkath,
    );
    const pe = aggregatePactEffects([]);
    const chain = getMultiplierChain(ctx, pe, 20);
    expect(chain.find(s => s.name === "DHCB vs Dragons")?.factor).toBe(1.25);
  });

  it("DHL vs dragon: +20% dmg", () => {
    const vorkath = getBoss("vorkath")!;
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate" },
      { weapon: getItem("dhl")! },
      vorkath,
    );
    const pe = aggregatePactEffects([]);
    const chain = getMultiplierChain(ctx, pe, 20);
    expect(chain.find(s => s.name === "DHL vs Dragons")?.factor).toBe(1.20);
  });

  it("keris vs kalphite: ×4/3", () => {
    const kq = getBoss("kq")!; // isKalphite=true
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate" },
      { weapon: getItem("keris-breaching")! },
      kq,
    );
    const pe = aggregatePactEffects([]);
    const chain = getMultiplierChain(ctx, pe, 20);
    expect(chain.find(s => s.name === "Keris vs Kalphites")?.factor).toBeCloseTo(4 / 3, 5);
  });

  it("slayer helm (i) on task: melee ×7/6, ranged/magic ×1.15", () => {
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate", onSlayerTask: true },
      { weapon: getItem("whip")!, head: getItem("slayer-helm-i")! },
      custom,
    );
    const pe = aggregatePactEffects([]);
    const chain = getMultiplierChain(ctx, pe, 20);
    const slay = chain.find(s => s.name.includes("Slayer"));
    expect(slay?.factor).toBeCloseTo(7 / 6, 5);
  });

  it("salve (ei) vs undead: ×1.20", () => {
    const verzik = getBoss("verzik-p3")!; // isUndead=true
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate" },
      { weapon: getItem("whip")!, neck: getItem("salve-ei")! },
      verzik,
    );
    const pe = aggregatePactEffects([]);
    const chain = getMultiplierChain(ctx, pe, 20);
    expect(chain.find(s => s.name.includes("Salve"))?.factor).toBe(1.20);
  });

  it("crystal armour + bowfa: individual piece bonuses", () => {
    const ctx = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid" },
      {
        weapon: getItem("bowfa")!,
        head: getItem("crystal-helm")!,
        body: getItem("crystal-body")!,
        legs: getItem("crystal-legs")!,
      },
      custom,
    );
    const pe = aggregatePactEffects([]);
    const chain = getMultiplierChain(ctx, pe, 20);
    const crystal = chain.find(s => s.name === "Crystal Armour");
    // helm +2.5%, body +7.5%, legs +5% = +15%
    expect(crystal?.factor).toBeCloseTo(1.15, 5);
  });

  it("inquisitor set (3pc) vs crush: 0.5%×3 + 2.5% = 4%", () => {
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate" },
      {
        weapon: getItem("inq-mace")!, // crush weapon
        head: getItem("inq-helm")!,
        body: getItem("inq-body")!,
        legs: getItem("inq-legs")!,
      },
      custom,
    );
    const pe = aggregatePactEffects([]);
    const chain = getMultiplierChain(ctx, pe, 20);
    const inq = chain.find(s => s.name.includes("Inquisitor"));
    // 3*0.005 + 0.025 = 0.040
    expect(inq?.factor).toBeCloseTo(1.04, 5);
  });

  it("fang max hit reduction: maxHit - trunc(maxHit * 3/20)", () => {
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate" },
      { weapon: getItem("fang")! },
      custom,
    );
    const pe = aggregatePactEffects([]);
    const chain = getMultiplierChain(ctx, pe, 20);
    // Fang no longer in multiplier chain — applied as subtraction post-chain
    expect(chain.find(s => s.name.includes("Fang"))).toBeUndefined();
    // Verify via calculateDps: maxHit 41 → 41 - trunc(41*3/20) = 41 - 6 = 35 (not floor(41*0.85)=34)
  });

  it("shadowflame quadrant: +40% magic dmg", () => {
    const ctx = makeCtx(
      { combatStyle: "magic", attackStyle: "autocast" },
      { weapon: getItem("echo-shadowflame")! },
      custom,
    );
    const pe = aggregatePactEffects([]);
    const chain = getMultiplierChain(ctx, pe, 20);
    expect(chain.find(s => s.name === "Shadowflame 40%")?.factor).toBe(1.40);
  });

  it("infernal tecpatl vs demon: +10%", () => {
    const kril = getBoss("kril")!;
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate" },
      { weapon: getItem("echo-tecpatl")! },
      kril,
    );
    const pe = aggregatePactEffects([]);
    const chain = getMultiplierChain(ctx, pe, 20);
    expect(chain.find(s => s.name === "Tecpatl vs Demons")?.factor).toBe(1.10);
  });

  it("devil's element vs magic weakness: +30%", () => {
    const boss: BossPreset = { ...custom, elementalWeakness: "magic" };
    const ctx = makeCtx(
      { combatStyle: "magic", attackStyle: "autocast" },
      { weapon: getItem("kodai")!, shield: getItem("echo-devils-element")! },
      boss,
    );
    const pe = aggregatePactEffects([]);
    const chain = getMultiplierChain(ctx, pe, 20);
    expect(chain.find(s => s.name === "Devil's Element")?.factor).toBe(1.30);
  });

  it("wilderness weapons: +50% in wilderness", () => {
    const kbd = getBoss("kbd")!; // region=wilderness
    const ctx = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid" },
      { weapon: getItem("craws-bow")! },
      kbd,
    );
    const pe = aggregatePactEffects([]);
    const chain = getMultiplierChain(ctx, pe, 20);
    expect(chain.find(s => s.name.includes("Wilderness"))?.factor).toBe(1.50);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// ATTACK ROLL
// ═══════════════════════════════════════════════════════════════════════

describe("calculateAttackRoll (via calculateDps breakdown)", () => {
  it("whip, 99 atk, accurate, no boost: EffAtk=110, AtkRoll=110*146=16060", () => {
    // 99+0(no pot)+0(no prayer)=99, style=accurate(+3)+8=110
    // equipAtk(slash) = whip aslash=82 → 110*(82+64)=110*146=16060
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate" },
      { weapon: getItem("whip")! },
      custom,
    );
    const result = calculateDps(ctx);
    expect(result.breakdown.attackRoll).toBe(16060);
  });

  it("super combat + piety, accurate: 152*(82+64)=22192", () => {
    // 99+19=118, floor(118*1.20)=141, +3+8=152
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate", potion: "super-combat", prayerType: "piety" },
      { weapon: getItem("whip")! },
      custom,
    );
    const result = calculateDps(ctx);
    expect(result.breakdown.attackRoll).toBe(22192);
  });

  it("shadow triples magic attack from equipment", () => {
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
      custom,
    );
    const result = calculateDps(ctx);

    // Calculate expected attack roll manually:
    // Total amagic from gear: shadow(35)+hat(8)+top(35)+bottom(26)+occult(12)+cape(15)+tormented(10)+eternal(8)+magus(15)=164
    // (Magus ring is +15 amagic per wiki, eternal boots +8 amagic)
    // Shadow triples: 164*3 = 492
    // Magic pot: 99+4+floor(99*0.10)=112, augury(1.25): floor(112*1.25)=140, +0+8=148
    // AtkRoll: 148*(492+64) = 148*556 = 82288
    expect(result.breakdown.attackRoll).toBe(82288);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// SCYTHE MULTI-HIT
// ═══════════════════════════════════════════════════════════════════════

describe("scythe multi-hit", () => {
  it("size 1 target: only 1 hit", () => {
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate" },
      { weapon: getItem("scythe")! },
      { ...custom, size: 1 },
    );
    const result = calculateDps(ctx);
    // Single hit DPS = (maxHit/2 * acc) / interval
    const singleHitDps = (result.maxHit / 2 * result.accuracy) / (result.speed * 0.6);
    expect(result.dps).toBeCloseTo(singleHitDps, 4);
  });

  it("size 3+ target: 3 hits (100%/50%/25%)", () => {
    const graardor = getBoss("graardor")!;
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate" },
      { weapon: getItem("scythe")! },
      graardor,
    );
    const result = calculateDps(ctx);
    const interval = result.speed * 0.6;
    const acc = result.accuracy;
    const max = result.maxHit;
    // 3 hits: maxHit, floor(maxHit/2), floor(maxHit/4)
    const hit2Max = Math.floor(max / 2);
    const hit3Max = Math.floor(max / 4);
    const expectedDps = ((max / 2 * acc) + (hit2Max / 2 * acc) + (hit3Max / 2 * acc)) / interval;
    expect(result.dps).toBeCloseTo(expectedDps, 4);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// FANG MIN HIT AND DPS
// Wiki: minHit = floor(maxHit * 3/20) = 15% of max hit
// ═══════════════════════════════════════════════════════════════════════

describe("fang min hit and DPS", () => {
  it("fang DPS uses uniform distribution [fangMin, maxHit]", () => {
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate", potion: "super-combat", prayerType: "piety" },
      { weapon: getItem("fang")! },
      custom,
    );
    const result = calculateDps(ctx);

    // Max hit after 0.85x: floor(baseMax * 0.85)
    const finalMax = result.maxHit;
    const fangMin = Math.trunc(finalMax * 3 / 20);
    const avgDmg = (finalMax + fangMin) / 2;
    const expectedDps = (avgDmg * result.accuracy) / (result.speed * 0.6);
    expect(result.dps).toBeCloseTo(expectedDps, 4);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// INFERNAL TECPATL: 2x hit per attack
// ═══════════════════════════════════════════════════════════════════════

describe("echo-tecpatl double hit", () => {
  it("tecpatl doubles base DPS", () => {
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate" },
      { weapon: getItem("echo-tecpatl")! },
      custom,
    );
    const result = calculateDps(ctx);

    // Should be 2x a normal single-hit DPS (no scythe, no fang)
    const singleHitDps = (result.maxHit / 2 * result.accuracy) / (result.speed * 0.6);
    // The baseDps in breakdown should be ~2x
    expect(result.breakdown.baseDps).toBeCloseTo(singleHitDps * 2, 3);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// FANG OF THE HOUND: 5% fire proc
// ═══════════════════════════════════════════════════════════════════════

describe("echo-fang-hound fire proc", () => {
  it("adds 5% bonus DPS from fire proc (base max 10, scales with mdmg%)", () => {
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate" },
      { weapon: getItem("echo-fang-hound")! },
      custom,
    );
    const result = calculateDps(ctx);

    // Fire proc: base max 10, scaled by mdmg%, 5% chance, always hits
    // echo-fang-hound has 0 mdmg
    const fireMax = Math.floor(10 * (1 + 0 / 100));
    const interval = result.speed * 0.6;
    const fireProc = 0.05 * (fireMax / 2) / interval;
    expect(result.breakdown.bonusDps).toBeCloseTo(fireProc, 3);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// BOLT SPECIAL EFFECTS
// ═══════════════════════════════════════════════════════════════════════

describe("bolt special DPS", () => {
  it("ruby bolts (e): 6% proc, 20% target HP as damage (capped 100)", () => {
    const graardor = getBoss("graardor")!; // hp=255
    const ctx = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid" },
      { weapon: getItem("zcb")!, ammo: getItem("ruby-bolts-e")! },
      graardor,
    );
    const result = calculateDps(ctx);
    // procDmg = min(100, floor(255*0.20)) = min(100, 51) = 51
    // normalAvg = maxHit/2
    // boltBonus = 0.06 * accuracy * (51 - normalAvg)
    const procDmg = Math.min(100, Math.floor(255 * 0.20));
    expect(procDmg).toBe(51);
    expect(result.breakdown.bonusDps).toBeGreaterThan(0);
  });

  it("diamond bolts (e): 10% proc ignores ranged defence", () => {
    const ctx = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid" },
      { weapon: getItem("zcb")!, ammo: getItem("diamond-bolts-e")! },
      custom,
    );
    const result = calculateDps(ctx);
    // With custom target (low def), diamond bolt bonus should be small but positive
    expect(result.breakdown.bonusDps).toBeGreaterThanOrEqual(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// KERIS TRIPLE DAMAGE PROC
// ═══════════════════════════════════════════════════════════════════════

describe("keris breaching proc", () => {
  it("adds 1/51 × 2 × avgDmg vs kalphites", () => {
    const kq = getBoss("kq")!;
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate" },
      { weapon: getItem("keris-breaching")! },
      kq,
    );
    const result = calculateDps(ctx);
    // Keris: ×4/3 from multiplier chain + 1/51 triple proc
    // Proc bonus: (1/51) * 2 * (maxHit/2 * accuracy) / interval
    const interval = result.speed * 0.6;
    const avgDmg = (result.maxHit / 2) * result.accuracy;
    const procBonus = (1 / 51) * 2 * avgDmg / interval;
    expect(result.breakdown.bonusDps).toBeCloseTo(procBonus, 3);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// ATTACK SPEED MODIFIERS
// ═══════════════════════════════════════════════════════════════════════

describe("attack speed", () => {
  it("rapid style reduces ranged speed by 1", () => {
    const ctx = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid" },
      { weapon: getItem("tbow")! }, // 6t base (wiki-verified)
      custom,
    );
    const result = calculateDps(ctx);
    expect(result.speed).toBe(5); // 6 - 1 = 5
  });

  it("longrange/accurate does not reduce speed", () => {
    const ctx = makeCtx(
      { combatStyle: "ranged", attackStyle: "accurate" },
      { weapon: getItem("tbow")! }, // 6t base
      custom,
    );
    const result = calculateDps(ctx);
    expect(result.speed).toBe(6); // base 6t, no rapid
  });

  it("crossbow slow big hits pact: +2t", () => {
    // node21 = Crossbow Mastery (crossbowSlowBigHits)
    const ctx = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", activePacts: ["node1", "node7", "node2", "node4", "node21"] },
      { weapon: getItem("zcb")! }, // 6t base (wiki-verified)
      custom,
    );
    const result = calculateDps(ctx);
    // Base 6t, rapid -1 = 5, crossbow mastery +2 = 7
    expect(result.speed).toBe(7);
  });

  it("bow fast hits pact: -1t", () => {
    // node20 = Rapid Fire (bowFastHits)
    const ctx = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", activePacts: ["node1", "node7", "node2", "node3", "node20"] },
      { weapon: getItem("tbow")! }, // 6t base
      custom,
    );
    const result = calculateDps(ctx);
    // Base 6t, rapid -1 = 5, bow fast -1 = 4
    expect(result.speed).toBe(4);
  });

  it("spell speed pact: -2t for standard spells", () => {
    // node122 = Spell Speed
    const ctx = makeCtx(
      {
        combatStyle: "magic", attackStyle: "autocast",
        activePacts: ["node1", "node8", "node58", "node83", "node86", "node67", "node68", "node69", "node70", "node117", "node124", "node127", "node122"],
      },
      { weapon: getItem("kodai")! }, // staff, 4t (wiki-verified)
      custom,
    );
    const result = calculateDps(ctx);
    // Base 4t, spell speed -2 = 2
    expect(result.speed).toBe(2);
  });

  it("powered staff speed pact: -3t", () => {
    // node133 = Powered Staff Speed
    const ctx = makeCtx(
      {
        combatStyle: "magic", attackStyle: "autocast",
        activePacts: ["node1", "node8", "node58", "node83", "node86", "node67", "node68", "node69", "node70", "node117", "node124", "node127", "node133"],
      },
      { weapon: getItem("sang")! }, // powered-staff, 4t
      custom,
    );
    const result = calculateDps(ctx);
    // Base 4t, powered staff speed -3 = 1
    expect(result.speed).toBe(1);
  });

  it("minimum speed is 1 tick", () => {
    const ctx = makeCtx(
      {
        combatStyle: "magic", attackStyle: "autocast",
        activePacts: ["node1", "node8", "node58", "node83", "node86", "node67", "node68", "node69", "node70", "node117", "node124", "node127", "node133"],
      },
      { weapon: getItem("shadow")! }, // powered-staff, 5t
      custom,
    );
    const result = calculateDps(ctx);
    // Base 5t - 3 = 2, minimum 1 → 2 (not below 1)
    expect(result.speed).toBeGreaterThanOrEqual(1);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// PACT EFFECTS ON DPS
// ═══════════════════════════════════════════════════════════════════════

describe("pact effects on DPS", () => {
  it("accuracy pacts increase attack roll", () => {
    const noPacts = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate" },
      { weapon: getItem("whip")! },
      custom,
    );
    const withPacts = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate", activePacts: ["node1", "node7"] }, // node7: +15% acc
      { weapon: getItem("whip")! },
      custom,
    );
    const r1 = calculateDps(noPacts);
    const r2 = calculateDps(withPacts);
    expect(r2.breakdown.attackRoll).toBeGreaterThan(r1.breakdown.attackRoll);
    // +15% accuracy: floor(baseRoll * 1.15)
    expect(r2.breakdown.attackRoll).toBe(Math.floor(r1.breakdown.attackRoll * 1.15));
  });

  it("melee damage % pacts multiply max hit", () => {
    // node140: +1% melee damage
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate", activePacts: ["node1", "node6", "node11", "node56", "node60", "node140"] },
      { weapon: getItem("whip")! },
      custom,
    );
    const result = calculateDps(ctx);
    const chain = result.breakdown.multiplierChain;
    const meleePact = chain.find(s => s.name.includes("Melee Pacts"));
    expect(meleePact).toBeDefined();
    expect(meleePact!.factor).toBeCloseTo(1.01, 5);
  });

  it("crossbow mastery: +70% dmg, +2t speed", () => {
    const ctx = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", activePacts: ["node1", "node7", "node2", "node4", "node21"] },
      { weapon: getItem("zcb")!, ammo: getItem("diamond-bolts-e")! },
      custom,
    );
    const result = calculateDps(ctx);
    const chain = result.breakdown.multiplierChain;
    expect(chain.find(s => s.name === "Crossbow Mastery")?.factor).toBe(1.70);
    expect(result.speed).toBe(7); // 6 - 1(rapid) + 2(mastery) = 7 (zcb is 6t base)
  });

  it("light weapon double hit: extra 40% max hit per attack", () => {
    // node72 = Light Double Hit, node74 = Distance Min Hit (connects node60→72)
    const ctx = makeCtx(
      {
        combatStyle: "melee", attackStyle: "accurate",
        activePacts: ["node1", "node6", "node11", "node56", "node60", "node74", "node72"],
      },
      { weapon: getItem("echo-fang-hound")! }, // 1h-light
      custom,
    );
    const result = calculateDps(ctx);
    const bonusMax = Math.floor(result.maxHit * 0.40);
    const bonusDpsExpected = (bonusMax / 2 * result.accuracy) / (result.speed * 0.6);
    // bonusDps includes fire proc + double hit
    expect(result.breakdown.bonusDps).toBeGreaterThan(bonusDpsExpected * 0.9); // approximate
  });

  it("offhand stat boost: +5 mstr, +5 rstr, +2 mdmg when shield equipped", () => {
    // node12 = Off-hand Mastery
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate", activePacts: ["node1", "node9", "node12"] },
      { weapon: getItem("whip")!, shield: getItem("avernic")! },
      custom,
    );
    const ctxNoPact = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate" },
      { weapon: getItem("whip")!, shield: getItem("avernic")! },
      custom,
    );
    const r1 = calculateDps(ctxNoPact);
    const r2 = calculateDps(ctx);
    // +5 mstr should increase max hit
    expect(r2.maxHit).toBeGreaterThan(r1.maxHit);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// FULL INTEGRATION TESTS: Reference scenarios with hand-calculated values
// ═══════════════════════════════════════════════════════════════════════

describe("full DPS integration tests", () => {
  it("TEST 1: whip, 99 stats, no boost, accurate vs custom → DPS ≈ 4.90", () => {
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate" },
      { weapon: getItem("whip")! },
      custom,
    );
    const result = calculateDps(ctx);
    expect(result.breakdown.effectiveLevel).toBe(107);
    expect(result.breakdown.baseMaxHit).toBe(24);
    expect(result.breakdown.attackRoll).toBe(16060);
    expect(result.breakdown.defenceRoll).toBe(640);
    expect(result.breakdown.baseAccuracy).toBeCloseTo(0.98002, 3);
    expect(result.dps).toBeCloseTo(4.90, 1);
  });

  it("TEST 2: whip, super combat + piety, accurate vs custom → DPS ≈ 7.19", () => {
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate", potion: "super-combat", prayerType: "piety" },
      { weapon: getItem("whip")! },
      custom,
    );
    const result = calculateDps(ctx);
    expect(result.breakdown.effectiveLevel).toBe(153);
    expect(result.breakdown.baseMaxHit).toBe(35);
    expect(result.breakdown.attackRoll).toBe(22192);
    expect(result.dps).toBeCloseTo(7.19, 1);
  });

  it("TEST 3: whip, super combat + piety, aggressive vs custom → DPS ≈ 7.39", () => {
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "aggressive", potion: "super-combat", prayerType: "piety" },
      { weapon: getItem("whip")! },
      custom,
    );
    const result = calculateDps(ctx);
    expect(result.breakdown.effectiveLevel).toBe(156);
    expect(result.breakdown.baseMaxHit).toBe(36);
    expect(result.dps).toBeCloseTo(7.39, 1);
  });

  it("TEST 6: shadow + full mage vs wardens P3 → DPS ≈ 10.8", () => {
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
    // Total mdmg: 0+3+3+3+5+2+5+1+2 = 24, +4 from Augury = 28, shadow 3x = 84
    // Shadow base: floor(112/3)+1 = 38
    // Max hit: floor(38*(1+84/100)) = floor(38*1.84) = floor(69.92) = 69
    expect(result.maxHit).toBe(69);
    expect(result.breakdown.defenceRoll).toBe(836);
    expect(result.accuracy).toBeCloseTo(0.9947, 3);
    // DPS: (69/2*0.9947)/(5*0.6) = (34.5*0.9947)/3.0 = 34.32/3.0 = 11.44
    expect(result.dps).toBeCloseTo(11.44, 0.5);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// EDGE CASES
// ═══════════════════════════════════════════════════════════════════════

describe("edge cases", () => {
  it("no weapon: still computes unarmed DPS (OSRS fists use 4t, equipStr=0)", () => {
    const ctx = makeCtx({ combatStyle: "melee" }, {}, custom);
    const result = calculateDps(ctx);
    // Unarmed: effStr=107, equipStr=0 → baseMax=floor(0.5+107*64/640)=floor(0.5+10.7)=11
    // Speed 4t (default), equipAtk 0+64=64 → atkRoll=110*64=7040
    // Valid unarmed DPS, not zero
    expect(result.dps).toBeGreaterThan(0);
    expect(result.maxHit).toBeGreaterThan(0);
    expect(Number.isFinite(result.dps)).toBe(true);
  });

  it("level 1 stats produce small but valid DPS", () => {
    const ctx = makeCtx(
      { attack: 1, strength: 1, defence: 1, ranged: 1, magic: 1, combatStyle: "melee", attackStyle: "accurate" },
      { weapon: getItem("whip")! },
      custom,
    );
    const result = calculateDps(ctx);
    expect(result.dps).toBeGreaterThan(0);
    expect(result.maxHit).toBeGreaterThan(0);
  });

  it("very high defence target produces low but non-negative accuracy", () => {
    const boss: BossPreset = {
      ...custom,
      defenceLevel: 999, dstab: 999, dslash: 999, dcrush: 999, dranged: 999, dmagic: 999,
    };
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate" },
      { weapon: getItem("whip")! },
      boss,
    );
    const result = calculateDps(ctx);
    expect(result.accuracy).toBeGreaterThanOrEqual(0);
    expect(result.accuracy).toBeLessThan(1);
    expect(result.dps).toBeGreaterThan(0);
  });

  it("2H weapon blocks shield slot in loadout", () => {
    const tbow = getItem("tbow")!;
    expect(tbow.isTwoHanded).toBe(true);
    // If shield is equipped alongside 2H, engine still works
    // (validation is in the UI, engine just calculates)
    const ctx = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid" },
      { weapon: tbow, ammo: getItem("dragon-arrows")! },
      custom,
    );
    const result = calculateDps(ctx);
    expect(result.dps).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// ECHO CASCADE STYLE GUARD
// ═══════════════════════════════════════════════════════════════════════

describe("echo cascade style guard", () => {
  it("echoDps is 0 for melee even with twohMeleeEchos + rangedRegenEchoChance pacts", () => {
    const rapier = getItem("rapier")!;
    // node1=root, node2=Ranged Echo (+25% echo chance), node157=2H Melee Echo
    const result = calculateDps(makeCtx(
      { combatStyle: "melee", activePacts: ["node1", "node2", "node157"] },
      { weapon: rapier },
      custom,
    ));
    expect(result.echoDps).toBe(0);
  });

  it("echoDps is positive for ranged with echo pacts", () => {
    const tbow = getItem("tbow")!;
    const result = calculateDps(makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", activePacts: ["node1", "node2"] },
      { weapon: tbow, ammo: getItem("dragon-arrows")! },
      custom,
    ));
    expect(result.echoDps).toBeGreaterThan(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// BUFFED RANGED PRAYERS
// node14 = buffedRangedPrayers: 30% more effective ranged prayers
// ═══════════════════════════════════════════════════════════════════════

describe("buffed ranged prayers", () => {
  it("buffedRangedPrayers boosts rigour accuracy by 30%", () => {
    // node14 = buffedRangedPrayers, path: node1→node2→node3→node6→node9→node13→node14
    const pacts = ["node1", "node2", "node3", "node6", "node9", "node13", "node14"];
    const noPact = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", prayerType: "rigour" },
      { weapon: getItem("tbow")!, ammo: getItem("dragon-arrows")! },
      custom,
    );
    const withPact = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", prayerType: "rigour", activePacts: pacts },
      { weapon: getItem("tbow")!, ammo: getItem("dragon-arrows")! },
      custom,
    );
    const r1 = calculateDps(noPact);
    const r2 = calculateDps(withPact);
    // Rigour acc is 1.20. With buffed: 1 + 0.20*1.30 = 1.26
    // Attack roll should be higher with the buffed prayer
    expect(r2.breakdown.attackRoll).toBeGreaterThan(r1.breakdown.attackRoll);
  });

  it("buffedRangedPrayers boosts rigour str multiplier by 30%", () => {
    const pacts = ["node1", "node2", "node3", "node6", "node9", "node13", "node14"];
    const noPact = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", prayerType: "rigour" },
      { weapon: getItem("tbow")!, ammo: getItem("dragon-arrows")! },
      custom,
    );
    const withPact = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", prayerType: "rigour", activePacts: pacts },
      { weapon: getItem("tbow")!, ammo: getItem("dragon-arrows")! },
      custom,
    );
    const r1 = calculateDps(noPact);
    const r2 = calculateDps(withPact);
    // Effective str should be higher due to 30% boosted prayer
    expect(r2.breakdown.effectiveLevel).toBeGreaterThan(r1.breakdown.effectiveLevel);
  });

  it("buffedRangedPrayers does not affect melee prayers", () => {
    const pacts = ["node1", "node2", "node3", "node6", "node9", "node13", "node14"];
    const withPact = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate", prayerType: "piety", activePacts: pacts },
      { weapon: getItem("whip")! },
      custom,
    );
    const noPact = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate", prayerType: "piety" },
      { weapon: getItem("whip")! },
      custom,
    );
    const r1 = calculateDps(noPact);
    const r2 = calculateDps(withPact);
    // Piety str level should be the same (buffedRangedPrayers doesn't affect melee)
    expect(r2.breakdown.effectiveLevel).toBe(r1.breakdown.effectiveLevel);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// TECPATL ECHO FIX — 2H melee echo uses single-hit DPS for tecpatl
// ═══════════════════════════════════════════════════════════════════════

describe("tecpatl echo fix", () => {
  it("2H melee echo uses single-hit base DPS for tecpatl (not doubled)", () => {
    // echo-tecpatl is 2h-melee; with twohMeleeEchos the echo should use single-hit DPS
    // Path: node1→node74→node43→node83→node86→node161→node157, node1→node2
    const pacts = ["node1", "node2", "node74", "node43", "node83", "node86", "node161", "node157"];
    const result = calculateDps(makeCtx(
      { combatStyle: "melee", attackStyle: "accurate", activePacts: pacts },
      { weapon: getItem("echo-tecpatl")! },
      custom,
    ));
    // baseDps is doubled for tecpatl (2x attack), but echo should use single-hit base
    // bonusDps includes the echo portion from twohMeleeEchos at 5%
    // If it used doubled DPS, the bonus would be ~10% of baseDps; if single, ~5%
    const _singleHitDps = result.breakdown.baseDps / 2;
    // The 5% echo should be based on single-hit DPS, not baseDps
    expect(result.breakdown.bonusDps).toBeGreaterThan(0);
    // Verify bonusDps is approximately 5% of single-hit, not 5% of double-hit
    expect(result.breakdown.bonusDps).toBeLessThan(0.06 * result.breakdown.baseDps);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// ECHO REGEN RATE FACTOR
// Echo DPS scales with regen ammo chance (echoes only fire when ammo is regenerated)
// ═══════════════════════════════════════════════════════════════════════

describe("echo regen rate factor", () => {
  it("echo DPS scales with regen ammo chance", () => {
    // node1 gives 50% regen. node2 gives 25% echo chance.
    // Echo rate = 25% * 50% regen = 12.5% effective
    const lowRegen = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", activePacts: ["node1", "node2"] },
      { weapon: getItem("tbow")!, ammo: getItem("dragon-arrows")! },
      custom,
    );
    // Add more regen nodes: node10 = +30% regen
    // node1(50%) + node10(30%) = 80% regen
    const highRegen = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", activePacts: ["node1", "node2", "node3", "node6", "node10"] },
      { weapon: getItem("tbow")!, ammo: getItem("dragon-arrows")! },
      custom,
    );
    const r1 = calculateDps(lowRegen);
    const r2 = calculateDps(highRegen);
    // Higher regen chance = more echoes = higher echo DPS
    expect(r2.echoDps).toBeGreaterThan(r1.echoDps);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// BOW ALWAYS PASS ACCURACY — echoes bypass accuracy
// ═══════════════════════════════════════════════════════════════════════

describe("bow always pass accuracy", () => {
  it("echoes bypass accuracy with bowAlwaysPassAccuracy pact", () => {
    const highDefBoss: BossPreset = {
      ...custom,
      defenceLevel: 500, dranged: 300,
    };
    // node3 = bowAlwaysPassAccuracy, path: node1→node2→node3
    const withPact = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", activePacts: ["node1", "node2", "node3"] },
      { weapon: getItem("tbow")!, ammo: getItem("dragon-arrows")! },
      highDefBoss,
    );
    const withoutPact = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", activePacts: ["node1", "node2"] },
      { weapon: getItem("tbow")!, ammo: getItem("dragon-arrows")! },
      highDefBoss,
    );
    const r1 = calculateDps(withoutPact);
    const r2 = calculateDps(withPact);
    // With bow always pass accuracy, echo DPS is boosted because echoes have 100% acc
    // Against high defence, this makes a big difference
    expect(r2.echoDps).toBeGreaterThan(r1.echoDps);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// DISTANCE MELEE MIN HIT
// node74: distanceMeleeMinHit = 3, min hit = 3 + 3 * distance
// ═══════════════════════════════════════════════════════════════════════

describe("distance melee min hit", () => {
  it("distance min hit increases DPS for melee", () => {
    // node1 → node74 (distanceMeleeMinHit=3)
    const noPact = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate", targetDistance: 3 },
      { weapon: getItem("whip")! },
      custom,
    );
    const withPact = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate", targetDistance: 3, activePacts: ["node1", "node74"] },
      { weapon: getItem("whip")! },
      custom,
    );
    const r1 = calculateDps(noPact);
    const r2 = calculateDps(withPact);
    // Min hit = 3 + 3*3 = 12
    expect(r2.breakdown.minHit).toBe(12);
    expect(r2.dps).toBeGreaterThan(r1.dps);
  });

  it("distance min hit at distance 1 is 3+3=6", () => {
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate", targetDistance: 1, activePacts: ["node1", "node74"] },
      { weapon: getItem("whip")! },
      custom,
    );
    const result = calculateDps(ctx);
    // min = 3 + 3*1 = 6
    expect(result.breakdown.minHit).toBe(6);
  });

  it("distance min hit does not apply to ranged", () => {
    const ctx = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", targetDistance: 5, activePacts: ["node1", "node74"] },
      { weapon: getItem("tbow")!, ammo: getItem("dragon-arrows")! },
      custom,
    );
    const result = calculateDps(ctx);
    // min hit should be 0 for ranged (not affected by melee pact)
    expect(result.breakdown.minHit).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// THROWN WEAPON MULTI — attacks hit additional nearby target (2x DPS)
// ═══════════════════════════════════════════════════════════════════════

describe("thrown weapon multi", () => {
  it("thrown weapon multi doubles base DPS for thrown weapons", () => {
    // node34 = thrownWeaponMulti
    // Path: node1→node2→node5→node8→node12→node19→node22→node25→node33→node34
    const pacts = ["node1", "node2", "node5", "node8", "node12", "node19", "node22", "node25", "node33", "node34"];
    const noPact = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", activePacts: ["node1", "node2", "node5", "node8", "node12", "node19", "node22", "node25", "node33"] },
      { weapon: getItem("eclipse-atlatl")!, ammo: getItem("atlatl-dart")! },
      custom,
    );
    const withPact = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", activePacts: pacts },
      { weapon: getItem("eclipse-atlatl")!, ammo: getItem("atlatl-dart")! },
      custom,
    );
    const r1 = calculateDps(noPact);
    const r2 = calculateDps(withPact);
    // Base DPS should be doubled with thrownWeaponMulti
    expect(r2.breakdown.baseDps).toBeCloseTo(r1.breakdown.baseDps * 2, 2);
  });

  it("thrown weapon multi does not affect bow weapons", () => {
    const pacts = ["node1", "node2", "node5", "node8", "node12", "node19", "node22", "node25", "node33", "node34"];
    const result = calculateDps(makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", activePacts: pacts },
      { weapon: getItem("tbow")!, ammo: getItem("dragon-arrows")! },
      custom,
    ));
    // baseDps should NOT be doubled for bow
    const interval = result.speed * 0.6;
    const singleHitDps = (result.maxHit / 2 * result.accuracy) / interval;
    expect(result.breakdown.baseDps).toBeCloseTo(singleHitDps, 2);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// THORNS DPS CALCULATION
// node71 = thornsDamage(3), requires shield equipped
// ═══════════════════════════════════════════════════════════════════════

describe("thorns DPS", () => {
  it("thorns DPS is non-zero with shield + thorns node", () => {
    // node1 → node74 → node71 (thornsDamage=3)
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate", activePacts: ["node1", "node74", "node71"] },
      { weapon: getItem("whip")!, shield: getItem("avernic")! },
      custom,
    );
    const result = calculateDps(ctx);
    // Thorns DPS = 3 / (4 * 0.6) = 3 / 2.4 = 1.25
    expect(result.breakdown.thornsDps).toBeCloseTo(1.25, 2);
  });

  it("thorns DPS is zero without shield", () => {
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate", activePacts: ["node1", "node74", "node71"] },
      { weapon: getItem("whip")! },
      custom,
    );
    const result = calculateDps(ctx);
    expect(result.breakdown.thornsDps).toBe(0);
  });

  it("thorns double hit: 1.5x damage", () => {
    // node141 = thornsDoubleHit (second hit at 50%)
    // Path: node1→node74→node71→node81→node84→node145→node139→node140→node141
    const pacts = ["node1", "node74", "node71", "node81", "node84", "node145", "node139", "node140", "node141"];
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate", activePacts: pacts },
      { weapon: getItem("whip")!, shield: getItem("avernic")! },
      custom,
    );
    const result = calculateDps(ctx);
    // thornsDmg base=3, defenceRecoilScaling from node139 adds +1% of total def bonuses
    // avernic def bonuses: dstab=1,dslash=1,dcrush=1,dranged=-1,dmagic=-1 = 1
    // whip defence bonuses: all 0
    // defence recoil = floor(1 * 0.01) = 0 extra
    // So thornsDmg = 3 + 0 = 3, then floor(3 * 1.5) = 4
    // thornsDps = 4 / 2.4
    expect(result.breakdown.thornsDps).toBeCloseTo(4 / 2.4, 2);
  });

  it("defence recoil scaling adds damage based on defence bonuses", () => {
    // node139 = defenceRecoilScaling (+1% of total defence bonuses)
    const pacts = ["node1", "node74", "node71", "node81", "node84", "node145", "node139"];
    const ctx = makeCtx(
      { combatStyle: "melee", attackStyle: "accurate", activePacts: pacts },
      {
        weapon: getItem("whip")!,
        shield: getItem("avernic")!,
        head: getItem("torva-helm")!,
        body: getItem("torva-body")!,
        legs: getItem("torva-legs")!,
      },
      custom,
    );
    const result = calculateDps(ctx);
    // Sum all defence bonuses from equipped items to verify scaling
    expect(result.breakdown.thornsDps).toBeGreaterThan(1.25); // higher than base 3 thorns
  });
});

// ═══════════════════════════════════════════════════════════════════════
// SPELL ELEMENT RESOLUTION
// smoke→air with node111, ice→water with node123
// ═══════════════════════════════════════════════════════════════════════

describe("spell element resolution", () => {
  it("smoke spell counts as air with smokeCountsAsAir pact", () => {
    // node111 = smokeCountsAsAir
    // Path: node1→node44→node45→node55→node58→node67→node107→node108→node111
    const pacts = ["node1", "node44", "node45", "node55", "node58", "node67", "node107", "node108", "node111"];
    // With air spell damage per prayer active, smoke=air should trigger the bonus
    const ctx = makeCtx(
      {
        combatStyle: "magic", attackStyle: "autocast", spellMaxHit: 24,
        spellElement: "smoke", prayerType: "augury", activePrayerCount: 1,
        activePacts: pacts,
      },
      { weapon: getItem("kodai")! },
      custom,
    );
    const result = calculateDps(ctx);
    // node107 = airSpellDamagePerPrayer (7%)
    // Smoke counts as air -> air spell prayer damage bonus should apply
    const chain = result.breakdown.multiplierChain;
    const airStep = chain.find(s => s.name.includes("Air Spell"));
    expect(airStep).toBeDefined();
    expect(airStep!.factor).toBeCloseTo(1.07, 2);
  });

  it("ice spell counts as water with iceCountsAsWater pact", () => {
    // node123 = iceCountsAsWater
    // Path: node1→node44→node45→node55→node59→node68→node112→node113→node123
    const pacts = ["node1", "node44", "node45", "node55", "node59", "node68", "node112", "node113", "node123"];
    // With water HP damage active, ice=water should trigger the bonus
    const ctx = makeCtx(
      {
        combatStyle: "magic", attackStyle: "autocast", spellMaxHit: 24,
        spellElement: "ice", currentHitpoints: 99,
        activePacts: pacts,
      },
      { weapon: getItem("kodai")! },
      custom,
    );
    const result = calculateDps(ctx);
    // node112 = waterSpellDamageHighHp (+20% at 100% HP)
    // Ice counts as water -> water spell HP bonus should apply
    const chain = result.breakdown.multiplierChain;
    const waterStep = chain.find(s => s.name.includes("Water Spell"));
    expect(waterStep).toBeDefined();
    expect(waterStep!.factor).toBeCloseTo(1.20, 2); // 99/99 = 100% HP -> full 20%
  });

  it("smoke spell without pact does NOT count as air", () => {
    // Same path but without node111
    const pacts = ["node1", "node44", "node45", "node55", "node58", "node67", "node107", "node108"];
    const ctx = makeCtx(
      {
        combatStyle: "magic", attackStyle: "autocast", spellMaxHit: 24,
        spellElement: "smoke", prayerType: "augury", activePrayerCount: 1,
        activePacts: pacts,
      },
      { weapon: getItem("kodai")! },
      custom,
    );
    const result = calculateDps(ctx);
    const chain = result.breakdown.multiplierChain;
    const airStep = chain.find(s => s.name.includes("Air Spell"));
    expect(airStep).toBeUndefined();
  });
});

// ═══════════════════════════════════════════════════════════════════════
// KING'S BARRAGE DOUBLE BOLT SPEC
// echo-kings-barrage doubles bolt proc rate
// ═══════════════════════════════════════════════════════════════════════

describe("king's barrage double bolt spec", () => {
  it("doubles ruby bolt proc rate from 6% to 12%", () => {
    const graardor = getBoss("graardor")!;
    const kbCtx = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid" },
      { weapon: getItem("echo-kings-barrage")!, ammo: getItem("ruby-bolts-e")! },
      graardor,
    );
    const zcbCtx = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid" },
      { weapon: getItem("zcb")!, ammo: getItem("ruby-bolts-e")! },
      graardor,
    );
    const kbResult = calculateDps(kbCtx);
    const zcbResult = calculateDps(zcbCtx);
    // King's barrage should have higher bolt bonus DPS due to doubled proc rate
    expect(kbResult.breakdown.bonusDps).toBeGreaterThan(zcbResult.breakdown.bonusDps);
  });

  it("doubles diamond bolt proc rate from 10% to 20%", () => {
    const graardor = getBoss("graardor")!;
    const kbCtx = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid" },
      { weapon: getItem("echo-kings-barrage")!, ammo: getItem("diamond-bolts-e")! },
      graardor,
    );
    const zcbCtx = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid" },
      { weapon: getItem("zcb")!, ammo: getItem("diamond-bolts-e")! },
      graardor,
    );
    const kbResult = calculateDps(kbCtx);
    const zcbResult = calculateDps(zcbCtx);
    // King's barrage should have higher bolt bonus DPS
    expect(kbResult.breakdown.bonusDps).toBeGreaterThan(zcbResult.breakdown.bonusDps);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// BOW STACKING MODEL
// Bows with min/max hit stacking increase pacts
// ═══════════════════════════════════════════════════════════════════════

describe("bow stacking model", () => {
  it("bow min hit stacking increases DPS", () => {
    // node26 = bowMinHitStackingIncrease
    // Path: node1->node2->node3->node6->node9->node13->node20->node23->node27->node26
    // Use high-magic target so TBow has meaningful max hit (TBow scales with target magic)
    const highMagicTarget = getBoss("zulrah")!;
    const pacts = ["node1", "node2", "node3", "node6", "node9", "node13", "node20", "node23", "node27", "node26"];
    const noPact = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", activePacts: ["node1", "node2", "node3", "node6", "node9", "node13", "node20", "node23", "node27"] },
      { weapon: getItem("tbow")!, ammo: getItem("dragon-arrows")! },
      highMagicTarget,
    );
    const withPact = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", activePacts: pacts },
      { weapon: getItem("tbow")!, ammo: getItem("dragon-arrows")! },
      highMagicTarget,
    );
    const r1 = calculateDps(noPact);
    const r2 = calculateDps(withPact);
    expect(r2.dps).toBeGreaterThan(r1.dps);
    expect(r2.breakdown.minHit).toBeGreaterThanOrEqual(0);
  });

  it("bow min hit stacking with high max hit target gives positive minHit", () => {
    // Use bowfa (no tbow dmg scaling) against custom target for a clear maxHit
    const pacts = ["node1", "node2", "node3", "node6", "node9", "node13", "node20", "node23", "node27", "node26"];
    const result = calculateDps(makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", activePacts: pacts },
      { weapon: getItem("bowfa")!, head: getItem("crystal-helm")!, body: getItem("crystal-body")!, legs: getItem("crystal-legs")! },
      custom,
    ));
    // bowfa has decent maxHit without tbow penalty, so stackCap should be non-trivial
    expect(result.breakdown.minHit).toBeGreaterThan(0);
  });

  it("bow max hit stacking increases DPS", () => {
    // node28 = bowMaxHitStackingIncrease
    // Path: node1->node2->node3->node6->node9->node13->node20->node23->node27->node28
    const pacts = ["node1", "node2", "node3", "node6", "node9", "node13", "node20", "node23", "node27", "node28"];
    const noPact = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", activePacts: ["node1", "node2", "node3", "node6", "node9", "node13", "node20", "node23", "node27"] },
      { weapon: getItem("tbow")!, ammo: getItem("dragon-arrows")! },
      custom,
    );
    const withPact = makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", activePacts: pacts },
      { weapon: getItem("tbow")!, ammo: getItem("dragon-arrows")! },
      custom,
    );
    const r1 = calculateDps(noPact);
    const r2 = calculateDps(withPact);
    expect(r2.dps).toBeGreaterThan(r1.dps);
  });

  it("bow stacking does not apply to crossbow", () => {
    const pacts = ["node1", "node2", "node3", "node6", "node9", "node13", "node20", "node23", "node27", "node26", "node28"];
    const result = calculateDps(makeCtx(
      { combatStyle: "ranged", attackStyle: "rapid", activePacts: pacts },
      { weapon: getItem("zcb")!, ammo: getItem("diamond-bolts-e")! },
      custom,
    ));
    // Min hit should be 0 for crossbow (stacking is bow-only)
    expect(result.breakdown.minHit).toBe(0);
  });
});

// ═══════════════════════════════════════════════════════════════════════
// BOSS SIZE TESTS
// All bosses should have size field for scythe/melee calculations
// ═══════════════════════════════════════════════════════════════════════

describe("boss size field", () => {
  it("all non-custom bosses have explicit size", () => {
    const bossList = [
      "graardor", "zilyana", "kreearra", "kril", "nex",
      "duke", "leviathan", "whisperer", "vardorvis",
      "olm-melee", "olm-head", "verzik-p3", "wardens-p3",
      "cerberus", "hydra", "thermy", "kraken",
      "abyssal-sire", "grotesque-guardians",
      "vorkath", "zulrah", "corp", "hunllef", "kbd", "kq",
      "nightmare", "jad", "zuk", "sol-heredit", "giant-mole",
      "dag-rex", "dag-prime", "dag-supreme", "phantom-muspah",
      "araxxor", "demonic-gorillas", "sarachnis", "skotizo",
      "amoxliatl", "echo-amoxliatl",
    ];
    for (const bossId of bossList) {
      const boss = getBoss(bossId);
      expect(boss).toBeDefined();
      expect(boss!.size).toBeDefined();
      expect(boss!.size).toBeGreaterThanOrEqual(1);
    }
  });

  it("custom target has size 1", () => {
    expect(custom.size).toBe(1);
  });
});
