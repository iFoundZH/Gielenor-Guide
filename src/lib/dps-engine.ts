import type {
  DpsContext,
  DpsResult,
  DpsBreakdown,
  MultiplierStep,
  BuildLoadout,
  EquipmentBonuses,
  PlayerConfig,
  BossPreset,
  Item,
  AttackType,
  SpellElement,
  WeaponCategory,
} from "@/types/dps";
import { aggregatePactEffects, type AggregatedPactEffects } from "@/lib/pact-effects";
import { getSpecAttack, type SpecAttack } from "@/data/spec-attacks";

// ═══════════════════════════════════════════════════════════════════════
// PUBLIC API
// ═══════════════════════════════════════════════════════════════════════

export function calculateDps(ctx: DpsContext): DpsResult {
  if (process.env.NODE_ENV !== "production") {
    const p = ctx.player;
    if (p.potion === "auto" || p.prayerType === "auto" || p.attackStyle === "auto" || p.voidSet === "auto") {
      throw new Error("calculateDps received unresolved 'auto' values — resolve before calling");
    }
  }

  // Lazily compute aggregated pact effects
  ctx.pactEffects ??= aggregatePactEffects(ctx.player.activePacts);
  const pe = ctx.pactEffects;

  const weapon = ctx.loadout.weapon;
  const weaponCat = weapon?.weaponCategory;
  const speed = getAttackSpeed(ctx, pe);
  const interval = speed * 0.6;

  const totalBonuses = sumEquipmentBonuses(ctx.loadout);

  // Apply off-hand stat boost pact
  applyOffhandStatBoost(ctx, pe, totalBonuses);

  const equipStr = getEquipmentStrength(ctx, pe, totalBonuses);
  const effStrLevel = calculateEffectiveStrengthLevel(ctx, pe);
  let baseMax = calculateBaseMaxHit(ctx, effStrLevel, equipStr, weapon);

  // Additive bonuses applied before multiplier chain
  baseMax += getAdditiveMaxHitBonus(ctx, baseMax);

  const chain = getMultiplierChain(ctx, pe, baseMax);
  let finalMax = baseMax;
  for (const step of chain) {
    finalMax = Math.floor(finalMax * step.factor);
  }

  // Fang max hit reduction: maxHit - trunc(maxHit * 3/20) per wiki formula
  // Save pre-reduction shrink for min hit calculation below
  let fangShrink = 0;
  if (weapon?.id === "fang") {
    fangShrink = Math.trunc(finalMax * 3 / 20);
    finalMax = finalMax - fangShrink;
  }

  // Apply flat max hit modifiers (powered staff speed pact -8 for 1H)
  finalMax += getFlatMaxHitMod(ctx, pe);
  if (finalMax < 0) finalMax = 0;

  const atkRoll = calculateAttackRoll(ctx, pe, totalBonuses);
  const defRoll = calculateDefenceRoll(ctx.target, getAttackType(ctx), ctx.loadout.weapon?.weaponCategory);
  const baseAcc = standardAccuracy(atkRoll, defRoll);

  // Store rolls for Fang exact formula
  ctx._fangAtkRoll = atkRoll;
  ctx._fangDefRoll = defRoll;

  // Double accuracy roll (crossbow pact, Fang, Drygore)
  let finalAcc = applyDoubleRoll(ctx, pe, baseAcc);

  // Brimstone Ring: 25% chance to ignore 10% of target's magic defence
  if (ctx.loadout.ring?.id === "brimstone-ring" && ctx.player.combatStyle === "magic") {
    const reducedDefRoll = Math.floor(defRoll * 0.9);
    const reducedAcc = standardAccuracy(atkRoll, reducedDefRoll);
    finalAcc = 0.75 * finalAcc + 0.25 * reducedAcc;
  }

  // Max accuracy roll from range pact: proc chance of min(1, 0.05 * distance)
  // "Max accuracy" means you roll the maximum on your attack die.
  // Source: weirdgloop PlayerVsNPCCalc.ts — getMaxAccuracyHitChance()
  // If atkRoll > defRoll: guaranteed hit (1.0)
  // If atkRoll <= defRoll: atkRoll / (defRoll + 1)
  if (pe.maxAccuracyRollFromRange) {
    const dist = getEffectiveDistance(ctx, pe);
    const procChance = Math.min(1, 0.05 * dist);
    const maxAccHitChance = atkRoll > defRoll ? 1 : atkRoll / (defRoll + 1);
    finalAcc = procChance * maxAccHitChance + (1 - procChance) * finalAcc;
  }

  // Track min hit for display
  let minHit = 0;

  // Base DPS
  let baseDps: number;
  const alwaysMax = pe.crossbowMaxHit && weapon?.weaponCategory === "crossbow";
  if (alwaysMax) {
    baseDps = (finalMax * finalAcc) / interval;
    minHit = finalMax;
  } else if (weapon?.id === "fang") {
    // Min hit = shrink from pre-reduction max (not from the already-reduced finalMax)
    baseDps = ((finalMax + fangShrink) / 2 * finalAcc) / interval;
    minHit = fangShrink;
  } else {
    baseDps = ((finalMax / 2) * finalAcc) / interval;
  }

  // Distance melee min hit: +3 + 3 per tile
  if (pe.distanceMeleeMinHit > 0 && ctx.player.combatStyle === "melee") {
    const dist = getEffectiveDistance(ctx, pe);
    const newMin = pe.distanceMeleeMinHit + pe.distanceMeleeMinHit * dist;
    if (newMin > minHit) {
      const avgAdjust = (newMin - minHit) / 2;
      baseDps += (avgAdjust * finalAcc) / interval;
      minHit = newMin;
    }
  }

  // Overheal consumption boost: +5 min hit when overheal active
  if (pe.overhealConsumptionBoost && ctx.player.hasOverheal && ctx.player.combatStyle === "melee") {
    minHit += 5;
    baseDps += (5 / 2 * finalAcc) / interval;
  }

  // Bow stacking avg model: hits increment min/max toward 15% of base max
  if (weapon?.weaponCategory === "bow") {
    if (pe.bowMinHitStackingIncrease) {
      const stackCap = Math.floor(finalMax * 0.15);
      const avgMinIncrease = stackCap / 2;
      baseDps += (avgMinIncrease / 2 * finalAcc) / interval;
      minHit += Math.floor(stackCap / 2);
    }
    if (pe.bowMaxHitStackingIncrease) {
      const stackCap = Math.floor(finalMax * 0.15);
      const avgMaxIncrease = stackCap / 2;
      baseDps += (avgMaxIncrease / 2 * finalAcc) / interval;
    }
  }

  // Bonus DPS from light weapon double-hit, heavy weapon blindbag
  let bonusDps = 0;
  bonusDps += calculateBonusHitDps(ctx, pe, finalMax, finalAcc, interval);
  bonusDps += calculateBlindbagDps(ctx, pe, finalMax, finalAcc, interval);

  // Unique blindbag chance/damage scaling
  if ((pe.uniqueBlindBagChance || pe.uniqueBlindBagDamage > 0) && ctx.player.combatStyle === "melee") {
    if (isHeavyMeleeWeapon(weaponCat)) {
      // Assume full inventory of heavy weapons (20); capped at 5 per pact
      const uniqueCount = Math.min(5, ctx.player.uniqueHeavyWeapons ?? 20);
      if (uniqueCount > 0) {
        if (pe.uniqueBlindBagChance) {
          const extraChance = 0.02 * uniqueCount;
          bonusDps += extraChance * (finalMax * finalAcc) / interval;
        }
        if (pe.uniqueBlindBagDamage > 0) {
          const dmgBoost = pe.uniqueBlindBagDamage * uniqueCount / 100;
          const totalBlindbag = (pe.blindbagChance / 100);
          if (totalBlindbag > 0) {
            bonusDps += totalBlindbag * dmgBoost * (finalMax * finalAcc) / interval;
          }
        }
      }
    }
  }

  // Bolt special effects
  bonusDps += calculateBoltSpecDps(ctx, pe, finalMax, finalAcc, interval);

  // Keris 1/51 triple-damage proc vs kalphites
  if (weapon?.id === "keris-breaching" && ctx.target.isKalphite) {
    const avgDmg = (finalMax / 2) * finalAcc;
    bonusDps += (1 / 51) * 2 * avgDmg / interval;
  }

  // Scythe: multi-hit based on target size
  if (weapon?.id === "scythe") {
    const targetSize = ctx.target.size ?? 3;
    if (targetSize >= 2) {
      const hit2Max = Math.floor(finalMax / 2);
      baseDps += ((hit2Max / 2) * finalAcc) / interval;
    }
    if (targetSize >= 3) {
      const hit3Max = Math.floor(finalMax / 4);
      baseDps += ((hit3Max / 2) * finalAcc) / interval;
    }
  }

  // Infernal Tecpatl: hits twice per attack
  // Store single-hit DPS before doubling for echo calc
  const singleHitBaseDps = baseDps;
  if (weapon?.id === "echo-tecpatl") {
    baseDps *= 2;
  }

  // Thrown weapon multi: attacks hit an additional nearby target
  if (pe.thrownWeaponMulti && weapon?.weaponCategory === "thrown") {
    baseDps *= 2;
  }

  // Fang of the Hound: 5% Flames of Cerberus proc (base max 10, always hits, scales with mdmg%)
  if (weapon?.id === "echo-fang-hound") {
    const fireMax = Math.floor(10 * (1 + totalBonuses.mdmg / 100));
    bonusDps += 0.05 * (fireMax / 2) / interval;
  }

  // Fire HP consume for damage: burn 6% of max HP to add 2x that as damage
  // Element pacts only apply to standard spells (not powered staves)
  if (pe.fireHpConsumeForDamage && ctx.player.combatStyle === "magic" && weaponCat !== "powered-staff") {
    const element = resolveSpellElement(ctx, pe);
    if (element === "fire") {
      const hp = ctx.player.currentHitpoints ?? ctx.player.hitpoints;
      const flatDmg = Math.floor(hp * 0.06) * 2;
      bonusDps += (flatDmg * finalAcc) / interval;
    }
  }

  // Fire spell burn bounce: add burn DoT estimate
  if (pe.fireSpellBurnBounce && ctx.player.combatStyle === "magic" && weaponCat !== "powered-staff") {
    const element = resolveSpellElement(ctx, pe);
    if (element === "fire") {
      // Estimate: burn deals ~3 damage per attack on average (bounce + DoT)
      bonusDps += (3 * finalAcc) / interval;
    }
  }

  // Air spell max hit prayer bonus: +X% chance to max hit per prayer bonus
  // Source: weirdgloop — effect chance is DOUBLED against targets weak to air
  if (pe.airSpellMaxHitPrayerBonus > 0 && ctx.player.combatStyle === "magic" && weaponCat !== "powered-staff") {
    const element = resolveSpellElement(ctx, pe);
    if (element === "air") {
      const prayerBonus = totalBonuses.prayer;
      const weakToAir = ctx.target.elementalWeakness === "air";
      const maxHitChance = Math.min(1, pe.airSpellMaxHitPrayerBonus * prayerBonus * (weakToAir ? 2 : 1) / 100);
      // Extra DPS from some hits being max instead of avg
      const avgGain = maxHitChance * (finalMax / 2);
      bonusDps += (avgGain * finalAcc) / interval;
    }
  }

  // Fire rune regen damage boost: +regenRate * 1 flat per attack
  // Only procs when fire runes are regenerated: fire/smoke standard spells (smoke uses fire runes),
  // or powered staves with the Staff Regen Fire pact
  if (pe.fireRuneRegenDamageBoost > 0 && ctx.player.combatStyle === "magic") {
    const baseElement = ctx.player.spellElement ?? "none";
    const usesFireRunes = weaponCat !== "powered-staff" && (baseElement === "fire" || baseElement === "smoke");
    const poweredStaffFireRegen = weaponCat === "powered-staff" && pe.regenStaveChargesFire;
    if (usesFireRunes || poweredStaffFireRegen) {
      const regenRate = Math.min(1, pe.regenAmmoChance / 100);
      const flatDmg = pe.fireRuneRegenDamageBoost * regenRate;
      bonusDps += (flatDmg * finalAcc) / interval;
    }
  }

  // 2H melee echo: 5% chance to trigger a ranged echo (use single-hit for tecpatl)
  if (pe.twohMeleeEchos && weapon?.weaponCategory === "2h-melee") {
    const echoBase = weapon.id === "echo-tecpatl" ? singleHitBaseDps : baseDps;
    bonusDps += 0.05 * (echoBase + bonusDps);
  }

  // Echo cascade DPS (ranged echo system)
  const echoDps = calculateEchoDps(ctx, pe, baseDps + bonusDps, finalAcc);

  // Earth spell defence scaling: flat damage per 12 defence levels — earth-element standard spells only
  if (pe.earthScaleDefenceStat > 0 && ctx.player.combatStyle === "magic" && weaponCat !== "powered-staff") {
    const element = resolveSpellElement(ctx, pe);
    if (element === "earth") {
      const defLevel = ctx.player.defence + pe.defenceBoost;
      const flatDmg = Math.floor(defLevel / pe.earthScaleDefenceStat);
      if (flatDmg > 0) {
        bonusDps += (flatDmg * finalAcc) / interval;
      }
    }
  }

  // Earth reduce defence: model average defence reduction over fight — standard spells only
  if (pe.earthReduceDefence && ctx.player.combatStyle === "magic" && weaponCat !== "powered-staff") {
    const element = resolveSpellElement(ctx, pe);
    if (element === "earth") {
      // Each hit reduces def & magic def by 2, model avg fight as ~50% through
      // Estimate +2% effective accuracy from cumulative def reduction
      const defReductionBonus = 0.02;
      bonusDps += defReductionBonus * baseDps;
    }
  }

  // Style swap: +12.5% when distance >= 3 (averaged: assume 50% of attacks qualify)
  if (pe.maxHitStyleSwap) {
    const dist = getEffectiveDistance(ctx, pe);
    if (dist >= 3) {
      // +25% on style swap hits, ~50% of attacks qualify on avg
      bonusDps += 0.125 * baseDps;
    }
  }

  // Thorns DPS
  const thornsDps = calculateThornsDps(ctx, pe, totalBonuses);

  // Sustain info
  const sustainInfo = buildSustainInfo(ctx, pe, totalBonuses);

  let totalDps = baseDps + bonusDps + echoDps + thornsDps;

  // Boss-specific damage modifiers
  totalDps = applyBossModifier(ctx, totalDps, finalMax);

  // ── Special Attack Blended DPS ──────────────────────────────────────
  let specInfo: DpsBreakdown["specInfo"] = undefined;
  if (ctx.player.usingSpecialAttack && weapon) {
    const spec = getSpecAttack(weapon.id);
    if (spec) {
      const blended = calculateBlendedSpecDps(
        ctx, pe, spec, weapon, atkRoll, defRoll, finalMax, finalAcc, speed, totalDps,
      );
      if (blended) {
        totalDps = blended.blendedDps;
        specInfo = blended.specInfo;
      }
    }
  }

  return {
    dps: totalDps,
    maxHit: finalMax,
    accuracy: finalAcc,
    speed,
    echoDps,
    breakdown: {
      effectiveLevel: effStrLevel,
      equipmentStrength: equipStr,
      baseMaxHit: baseMax,
      multiplierChain: chain,
      finalMaxHit: finalMax,
      attackRoll: atkRoll,
      defenceRoll: defRoll,
      baseAccuracy: baseAcc,
      finalAccuracy: finalAcc,
      attackSpeed: speed,
      baseDps,
      echoDps,
      bonusDps,
      thornsDps,
      minHit,
      effectiveDistance: getEffectiveDistance(ctx, pe),
      sustainInfo,
      specInfo,
    },
  };
}

// ═══════════════════════════════════════════════════════════════════════
// SPELL ELEMENT RESOLUTION
// ═══════════════════════════════════════════════════════════════════════

function resolveSpellElement(ctx: DpsContext, pe: AggregatedPactEffects): SpellElement {
  const base = ctx.player.spellElement ?? "none";
  if (base === "smoke" && pe.smokeCountsAsAir) return "air";
  if (base === "ice" && pe.iceCountsAsWater) return "water";
  if (base === "blood" && pe.bloodCountsAsFire) return "fire";
  if (base === "shadow" && pe.shadowCountsAsEarth) return "earth";
  return base;
}

/**
 * Returns the elemental weakness severity (0-100) if the current spell matches
 * the target's elemental weakness. Only standard elements (air/water/fire/earth)
 * can match; ancient elements must be converted via pacts first.
 *
 * Source: weirdgloop/osrs-dps-calc PlayerVsNPCCalc.ts — spellement bonus.
 */
function getElementalWeaknessMatch(ctx: DpsContext, pe: AggregatedPactEffects): number {
  if (ctx.player.combatStyle !== "magic") return 0;
  if (ctx.loadout.weapon?.weaponCategory === "powered-staff") return 0;
  const element = resolveSpellElement(ctx, pe);
  if (element === "none") return 0;
  const weakness = ctx.target.elementalWeakness;
  if (!weakness || weakness === "none") return 0;
  if (element === weakness) return ctx.target.elementalWeaknessPercent ?? 0;
  return 0;
}

// ═══════════════════════════════════════════════════════════════════════
// EFFECTIVE LEVEL (for Strength / Max Hit)
// Wiki order: base → potion (additive) → prayer (floor) → style + 8 → void (floor)
// ═══════════════════════════════════════════════════════════════════════

export function calculateEffectiveStrengthLevel(ctx: DpsContext, pe?: AggregatedPactEffects): number {
  pe ??= aggregatePactEffects(ctx.player.activePacts);
  const { player } = ctx;
  const style = player.combatStyle;

  let base: number;
  switch (style) {
    case "melee": base = player.strength; break;
    case "ranged": base = player.ranged; break;
    case "magic": base = player.magic; break;
  }

  // Step 1: Potion boost (additive to base level)
  base += getPotionStrengthBoost(base, player.potion, style);

  // Step 2: Prayer multiplier (floor after)
  // Buffed ranged prayers: multiply prayer factor by 1.30
  let prayerMult = getPrayerStrengthMultiplier(player);
  if (pe.buffedRangedPrayers && style === "ranged" && prayerMult > 1) {
    const prayerBonus = prayerMult - 1;
    prayerMult = 1 + prayerBonus * 1.30;
  }
  base = Math.floor(base * prayerMult);

  // Step 3: Style bonus + 8
  base += getStrengthStyleBonus(player) + 8;

  // Step 4: Void multiplier (floor after)
  if (player.voidSet !== "none") {
    const voidMult = getVoidStrengthMultiplier(player.voidSet, style);
    base = Math.floor(base * voidMult);
  }

  // Step 5: Soulreaper Axe — additive to effective level (non-spec only)
  // Source: weirdgloop — floor(baseStrLevel * stacks * 6 / 100) added to effective level
  if (ctx.loadout.weapon?.id === "soulreaper-axe" && style === "melee") {
    const stacks = Math.max(0, Math.min(5, player.soulreaperStacks ?? 0));
    if (stacks > 0) {
      base += Math.floor(player.strength * stacks * 6 / 100);
    }
  }

  return base;
}

/** Returns the additive boost amount, not the boosted level */
function getPotionStrengthBoost(baseLevel: number, potion: PlayerConfig["potion"], style: string): number {
  switch (potion) {
    case "super-combat":
    case "super-strength":
      if (style === "melee") return 5 + Math.floor(baseLevel * 0.15);
      return 0;
    case "super-attack":
      return 0; // attack only, no strength boost
    case "ranging":
      if (style === "ranged") return 4 + Math.floor(baseLevel * 0.10);
      return 0;
    case "magic":
      if (style === "magic") return 4 + Math.floor(baseLevel * 0.10);
      return 0;
    case "overload":
      if (style === "melee") return 5 + Math.floor(baseLevel * 0.15);
      if (style === "ranged") return 4 + Math.floor(baseLevel * 0.10);
      if (style === "magic") return 4 + Math.floor(baseLevel * 0.10);
      return 0;
    case "smelling-salts":
      if (style === "melee" || style === "ranged" || style === "magic") return 11 + Math.floor(baseLevel * 0.16);
      return 0;
    default:
      return 0;
  }
}

function getPrayerStrengthMultiplier(player: PlayerConfig): number {
  switch (player.prayerType) {
    case "piety": return 1.23;
    case "chivalry": return 1.18;
    case "ultimate-strength": return 1.15;
    case "superhuman-strength": return 1.10;
    case "burst-of-strength": return 1.05;
    case "rigour": return 1.23;
    case "eagle-eye": return 1.15;
    case "hawk-eye": return 1.10;
    case "sharp-eye": return 1.05;
    case "augury": return 1.0;
    case "mystic-might": return 1.0;
    case "mystic-lore": return 1.0;
    case "mystic-will": return 1.0;
    default: return 1.0;
  }
}

function getStrengthStyleBonus(player: PlayerConfig): number {
  switch (player.attackStyle) {
    case "aggressive": return 3;
    case "controlled": return 1;
    default: return 0;
  }
}

function getVoidStrengthMultiplier(voidSet: PlayerConfig["voidSet"], style: string): number {
  if (voidSet === "elite-void") {
    if (style === "ranged") return 1.125;
    if (style === "magic") return 1.025;
    return 1.10;
  }
  if (style === "magic") return 1.0;
  return 1.10;
}

function getPrayerAccuracyMultiplier(player: PlayerConfig, pe?: AggregatedPactEffects): number {
  let mult: number;
  switch (player.prayerType) {
    case "piety": mult = 1.20; break;
    case "chivalry": mult = 1.15; break;
    case "rigour": mult = 1.20; break;
    case "eagle-eye": mult = 1.15; break;
    case "hawk-eye": mult = 1.10; break;
    case "sharp-eye": mult = 1.05; break;
    case "augury": mult = 1.25; break;
    case "mystic-might": mult = 1.15; break;
    case "mystic-lore": mult = 1.10; break;
    case "mystic-will": mult = 1.05; break;
    default: mult = 1.0; break;
  }

  // Buffed ranged prayers: also boosts accuracy by 30%
  if (pe?.buffedRangedPrayers && player.combatStyle === "ranged" && mult > 1) {
    const bonus = mult - 1;
    mult = 1 + bonus * 1.30;
  }

  return mult;
}

// ═══════════════════════════════════════════════════════════════════════
// EQUIPMENT BONUSES
// ═══════════════════════════════════════════════════════════════════════

export function sumEquipmentBonuses(loadout: BuildLoadout): EquipmentBonuses {
  const total: EquipmentBonuses = {
    astab: 0, aslash: 0, acrush: 0, aranged: 0, amagic: 0,
    dstab: 0, dslash: 0, dcrush: 0, dranged: 0, dmagic: 0,
    mstr: 0, rstr: 0, mdmg: 0, prayer: 0,
  };

  const slots = Object.values(loadout) as (Item | null)[];
  for (const item of slots) {
    if (!item) continue;
    for (const key of Object.keys(total) as (keyof EquipmentBonuses)[]) {
      total[key] += item.bonuses[key];
    }
  }

  return total;
}

/** Mutate bonuses to add off-hand stat boost pact */
function applyOffhandStatBoost(ctx: DpsContext, pe: AggregatedPactEffects, bonuses: EquipmentBonuses): void {
  if (!pe.offhandStatBoost) return;
  // Off-hand equipped means shield slot has an item
  if (!ctx.loadout.shield) return;
  bonuses.mstr += 5;
  bonuses.rstr += 5;
  bonuses.mdmg += 2;
}

function getPrayerMagicDamageBonus(player: PlayerConfig): number {
  switch (player.prayerType) {
    case "augury": return 4;
    case "mystic-might": return 2;
    case "mystic-lore": return 1;
    default: return 0;
  }
}

function getEquipmentStrength(ctx: DpsContext, pe: AggregatedPactEffects, bonuses: EquipmentBonuses): number {
  const style = ctx.player.combatStyle;
  let str: number;

  switch (style) {
    case "melee": str = bonuses.mstr; break;
    case "ranged": str = bonuses.rstr; break;
    case "magic": {
      // Shadow triples equipment mdmg only; prayer bonus added after triple+cap
      const prayerMdmg = getPrayerMagicDamageBonus(ctx.player);
      if (ctx.loadout.weapon?.id === "shadow") {
        str = Math.min(100, bonuses.mdmg * 3) + prayerMdmg;
      } else {
        str = bonuses.mdmg + prayerMdmg;
      }
      break;
    }
  }

  // Multi-hit str increase: +20% of Strength level for light/1H melee
  if (style === "melee" && pe.multiHitStrIncrease) {
    const weaponCat = ctx.loadout.weapon?.weaponCategory;
    if (weaponCat === "1h-light" || weaponCat === "1h-heavy" || weaponCat === "standard") {
      str += Math.floor(ctx.player.strength * 0.20);
    }
  }

  // Melee prayer str bonus: +50% of worn prayer bonus as melee str
  if (style === "melee" && pe.meleePrayerStrBonus) {
    str += Math.floor(bonuses.prayer * 0.50);
  }

  // Thrown weapon melee str scale: +80% of melee str as ranged str
  if (style === "ranged" && pe.thrownMeleeStrScale && ctx.loadout.weapon?.weaponCategory === "thrown") {
    str += Math.floor(bonuses.mstr * 0.80);
  }

  // Ranged str HP difference: +1 per 10 HP difference (current vs max)
  if (style === "ranged" && pe.rangedStrengthHpDifference) {
    const maxHp = ctx.player.hitpoints;
    const currentHp = ctx.player.currentHitpoints ?? maxHp;
    const diff = maxHp - currentHp;
    str += Math.floor(diff / 10);
  }

  return str;
}

// ═══════════════════════════════════════════════════════════════════════
// MAX HIT
// ═══════════════════════════════════════════════════════════════════════

export function calculateBaseMaxHit(
  ctx: DpsContext,
  effectiveLevel: number,
  equipStr: number,
  weapon: Item | null,
): number {
  const style = ctx.player.combatStyle;
  const pe = ctx.pactEffects;

  if (style === "magic") {
    if (weapon?.weaponCategory === "powered-staff") {
      let visibleMagic = ctx.player.magic + getPotionStrengthBoost(ctx.player.magic, ctx.player.potion, "magic");
      // Regen magic level boost: +min(cap, regenRate*5) to magic level for powered staves
      if (pe && pe.regenMagicLevelBoost > 0) {
        const regenRate = Math.min(1, pe.regenAmmoChance / 100);
        visibleMagic += Math.min(pe.regenMagicLevelBoost, Math.floor(regenRate * 5));
      }
      const baseDmg = getPoweredStaffBaseDamage(weapon.id, visibleMagic);
      return Math.floor(baseDmg * (1 + equipStr / 100));
    }
    const spellBaseMax = ctx.player.spellMaxHit ?? 24;
    return Math.floor(spellBaseMax * (1 + equipStr / 100));
  }

  return Math.floor(0.5 + effectiveLevel * (equipStr + 64) / 640);
}

function getPoweredStaffBaseDamage(weaponId: string, visibleMagic: number): number {
  switch (weaponId) {
    case "shadow":
      return Math.floor(visibleMagic / 3) + 1;
    case "sang":
      return Math.floor(visibleMagic / 3) - 1;
    case "echo-lithic-sceptre":
      return Math.max(10, Math.floor(visibleMagic / 3) - 10);
    case "trident-swamp":
      return Math.floor(visibleMagic / 3) - 2;
    case "thammarons-sceptre":
      return Math.floor(visibleMagic / 3) - 8;
    case "accursed-sceptre":
      return Math.floor(visibleMagic / 3) - 6;
    default:
      return Math.floor(visibleMagic / 3) - 5;
  }
}

export function calculateMaxHit(ctx: DpsContext): number {
  ctx.pactEffects ??= aggregatePactEffects(ctx.player.activePacts);
  const pe = ctx.pactEffects;
  const weapon = ctx.loadout.weapon;
  const totalBonuses = sumEquipmentBonuses(ctx.loadout);
  applyOffhandStatBoost(ctx, pe, totalBonuses);
  const equipStr = getEquipmentStrength(ctx, pe, totalBonuses);
  const effLevel = calculateEffectiveStrengthLevel(ctx, pe);
  let baseMax = calculateBaseMaxHit(ctx, effLevel, equipStr, weapon);
  baseMax += getAdditiveMaxHitBonus(ctx, baseMax);

  const chain = getMultiplierChain(ctx, pe, baseMax);
  let finalMax = baseMax;
  for (const step of chain) {
    finalMax = Math.floor(finalMax * step.factor);
  }
  if (weapon?.id === "fang") {
    finalMax = finalMax - Math.trunc(finalMax * 3 / 20);
  }
  finalMax += getFlatMaxHitMod(ctx, pe);
  return Math.max(0, finalMax);
}

// ═══════════════════════════════════════════════════════════════════════
// MULTIPLIER CHAIN
// ═══════════════════════════════════════════════════════════════════════

export function getMultiplierChain(ctx: DpsContext, pe: AggregatedPactEffects, _baseMax: number): MultiplierStep[] {
  const chain: MultiplierStep[] = [];
  const style = ctx.player.combatStyle;
  const weapon = ctx.loadout.weapon;
  const weaponCat = weapon?.weaponCategory;

  // 1. Slayer helm / V's Helm / Salve amulet (mutually exclusive)
  // V's Helm provides its bonus ALWAYS (no slayer task required)
  // Regular Slayer Helm (i) requires onSlayerTask
  const head = ctx.loadout.head;
  const hasSalve = ctx.loadout.neck?.id === "salve-ei" && ctx.target.isUndead;
  const hasVsHelm = head?.id === "echo-vs-helm";
  const hasSlayerHelm = hasVsHelm || (ctx.player.onSlayerTask === true && head?.id === "slayer-helm-i");

  if (hasSalve && hasSlayerHelm) {
    chain.push({ name: "Salve (ei) vs Undead", factor: 1.20 });
  } else if (hasSalve) {
    chain.push({ name: "Salve (ei) vs Undead", factor: 1.20 });
  } else if (hasSlayerHelm) {
    if (style === "melee") {
      chain.push({ name: head!.name, factor: 7 / 6 });
    } else {
      chain.push({ name: head!.name, factor: 1.15 });
    }
  }

  // 2. Style % pacts (sum of +1% nodes)
  if (style === "melee" && pe.meleeDamagePercent > 0) {
    chain.push({ name: `Melee Pacts +${pe.meleeDamagePercent}%`, factor: 1 + pe.meleeDamagePercent / 100 });
  }
  if (style === "ranged" && pe.rangedDamagePercent > 0) {
    chain.push({ name: `Ranged Pacts +${pe.rangedDamagePercent}%`, factor: 1 + pe.rangedDamagePercent / 100 });
  }
  if (style === "magic" && pe.magicDamagePercent > 0) {
    chain.push({ name: `Magic Pacts +${pe.magicDamagePercent}%`, factor: 1 + pe.magicDamagePercent / 100 });
  }

  // 3. Crossbow +70% / +2t (crossbow slow big hits pact)
  if (weaponCat === "crossbow" && pe.crossbowSlowBigHits) {
    chain.push({ name: "Crossbow Mastery", factor: 1.70 });
  }

  // 4. Melee distance damage: +4% + 4% per 3 tiles
  if (pe.meleeDistanceDamagePercent > 0 && style === "melee") {
    const dist = getEffectiveDistance(ctx, pe);
    const pct = pe.meleeDistanceDamagePercent;
    const bonus = 1 + (pct * (Math.floor(dist / 3) + 1)) / 100;
    if (bonus > 1) {
      chain.push({ name: "Distance Max Hit", factor: bonus });
    }
  }

  // 5. Twisted Bow passive (scales with target magic level)
  if (weapon?.id === "tbow") {
    const M = Math.min(250, ctx.target.magicLevel);
    const t2 = Math.trunc((3 * M - 14) / 100);
    const t3 = Math.trunc(Math.pow(Math.trunc(3 * M / 10) - 140, 2) / 100);
    const tbowDmg = Math.min(250, Math.max(0, 250 + t2 - t3));
    chain.push({ name: "Twisted Bow", factor: tbowDmg / 100 });
  }

  // 6. Osmumten's Fang: max hit reduction handled post-chain (subtraction, not multiplication)

  // 7. Shadowflame 40% bonus spell damage
  if (weapon?.id === "echo-shadowflame") {
    chain.push({ name: "Shadowflame 40%", factor: 1.40 });
  }

  // 8. Arclight vs demons (+70%)
  if (weapon?.id === "arclight" && ctx.target.isDemon) {
    chain.push({ name: "Arclight vs Demons", factor: 1.70 });
  }

  // 8b. Infernal Tecpatl vs demons (+10%)
  if (weapon?.id === "echo-tecpatl" && ctx.target.isDemon) {
    chain.push({ name: "Tecpatl vs Demons", factor: 1.10 });
  }

  // 9. Devil's Element: +30% elemental weakness to all elements (elemental spells only, not powered staves)
  if (ctx.loadout.shield?.id === "echo-devils-element" && style === "magic" && weaponCat !== "powered-staff") {
    chain.push({ name: "Devil's Element", factor: 1.30 });
  }

  // 10. Dragon Hunter Crossbow vs dragons (+25% dmg)
  if (weapon?.id === "dhcb" && ctx.target.isDragon) {
    chain.push({ name: "DHCB vs Dragons", factor: 1.25 });
  }

  // 11. Dragon Hunter Lance vs dragons (+20% dmg)
  if (weapon?.id === "dhl" && ctx.target.isDragon) {
    chain.push({ name: "DHL vs Dragons", factor: 1.20 });
  }

  // 11b. Dragon Hunter Wand vs dragons (+40% dmg) — weirdgloop: [7, 5]
  if (weapon?.id === "dh-wand" && ctx.target.isDragon) {
    chain.push({ name: "DH Wand vs Dragons", factor: 7 / 5 });
  }

  // 12. Wilderness weapons (+50% dmg)
  const wildernessWeapons = ["craws-bow", "webweaver-bow", "viggoras-chainmace", "ursine-chainmace"];
  if (weapon && wildernessWeapons.includes(weapon.id) && ctx.target.region === "wilderness") {
    chain.push({ name: `${weapon.name} (Wilderness)`, factor: 1.50 });
  }

  // 13. Wilderness sceptres (+25% magic dmg)
  const wildernessSceptres = ["thammarons-sceptre", "accursed-sceptre"];
  if (weapon && wildernessSceptres.includes(weapon.id) && ctx.target.region === "wilderness") {
    chain.push({ name: `${weapon.name} (Wilderness)`, factor: 1.25 });
  }

  // 14. Keris Partisan vs kalphites (+33% dmg) — exact fraction from weirdgloop: 133/100
  if (weapon?.id === "keris-breaching" && ctx.target.isKalphite) {
    chain.push({ name: "Keris vs Kalphites", factor: 133 / 100 });
  }

  // 15. Crystal armour set bonus (Bow of Faerdhinen, or any weapon with Crystal blessing)
  if (weapon?.id === "bowfa" || ctx.loadout.ammo?.id === "echo-crystal-blessing") {
    let crystalDmg = 0;
    if (ctx.loadout.head?.id === "crystal-helm") crystalDmg += 0.025;
    if (ctx.loadout.body?.id === "crystal-body") crystalDmg += 0.075;
    if (ctx.loadout.legs?.id === "crystal-legs") crystalDmg += 0.05;
    if (crystalDmg > 0) {
      chain.push({ name: "Crystal Armour", factor: 1 + crystalDmg });
    }
  }

  // 16. Inquisitor's armour set bonus (crush weapons only)
  // Source: weirdgloop — with mace: 2.5% per piece; without mace: 0.5% per piece, full set = 2.5%
  if (style === "melee" && getAttackType(ctx) === "crush") {
    let inqPieces = 0;
    if (ctx.loadout.head?.id === "inq-helm") inqPieces++;
    if (ctx.loadout.body?.id === "inq-body") inqPieces++;
    if (ctx.loadout.legs?.id === "inq-legs") inqPieces++;
    if (inqPieces > 0) {
      let inqValue = inqPieces; // each piece = 1 unit
      if (weapon?.id === "inq-mace") {
        inqValue = inqPieces * 5; // each piece = 5 units (2.5%)
      } else if (inqPieces === 3) {
        inqValue = 5; // full set without mace = 2.5% total
      }
      const label = weapon?.id === "inq-mace" ? `Inquisitor's+Mace (${inqPieces}pc)` : `Inquisitor's (${inqPieces}pc)`;
      chain.push({ name: label, factor: (200 + inqValue) / 200 });
    }
  }

  // 17. Air spell pact: +X% damage per active prayer (standard spells only, not powered staves)
  if (pe.airSpellDamagePerPrayer > 0 && style === "magic" && weaponCat !== "powered-staff") {
    const element = resolveSpellElement(ctx, pe);
    if (element === "air" && ctx.player.prayerType !== "none") {
      const prayerCount = ctx.player.activePrayerCount ?? 1;
      const airBonus = pe.airSpellDamagePerPrayer * prayerCount;
      chain.push({ name: `Air Spell Prayers +${airBonus}%`, factor: 1 + airBonus / 100 });
    }
  }

  // 18. Smoke Battlestaff: +10% damage for standard spells
  if (weapon?.id === "smoke-battlestaff" && style === "magic" && weaponCat === "staff") {
    chain.push({ name: "Smoke Battlestaff", factor: 1.10 });
  }

  // 19. Tome of Fire/Water/Earth: +10% spell damage (PvE) when element matches
  // All nerfed to 10% vs NPCs on 29 May 2024 (was 50%/20%/10%) to account for elemental weaknesses
  // Source: weirdgloop [11, 10], OSRS wiki
  if (style === "magic" && weaponCat !== "powered-staff") {
    const shield = ctx.loadout.shield;
    const element = ctx.player.spellElement ?? "none";
    if ((shield?.id === "tome-of-fire" && element === "fire")
      || (shield?.id === "tome-of-water" && element === "water")
      || (shield?.id === "tome-of-earth" && element === "earth")) {
      chain.push({ name: shield.name, factor: 11 / 10 });
    }
  }

  // 19b. Elemental weakness: +severity% max hit when spell element matches weakness
  // Source: weirdgloop/osrs-dps-calc PlayerVsNPCCalc.ts (spellement bonus)
  {
    const severity = getElementalWeaknessMatch(ctx, pe);
    if (severity > 0) {
      chain.push({ name: `Elemental Weakness +${severity}%`, factor: 1 + severity / 100 });
    }
  }

  // 20. Berserker Necklace + TzHaar (obsidian) weapons: +20% damage
  if (ctx.loadout.neck?.id === "berserker-necklace" && style === "melee") {
    const obsidianWeapons = ["toktz-xil-ak", "tzhaar-ket-om", "tzhaar-ket-em", "toktz-xil-ek", "toktz-mej-tal"];
    if (weapon && obsidianWeapons.includes(weapon.id)) {
      chain.push({ name: "Berserker Necklace", factor: 1.20 });
    }
  }

  // 21. Soulreaper Axe — non-spec bonus handled in effective level (calculateEffectiveStrengthLevel)
  // Spec bonus (multiplicative on max hit) handled in calculateBlendedSpecDps via SPEC_ATTACKS

  // 22. Water spell pact: +20% at full HP (scales with HP%) — standard spells only
  if (pe.waterSpellDamageHighHp && style === "magic" && weaponCat !== "powered-staff") {
    const element = resolveSpellElement(ctx, pe);
    if (element === "water") {
      const maxHp = ctx.player.hitpoints;
      const currentHp = ctx.player.currentHitpoints ?? maxHp;
      const hpPct = currentHp / maxHp;
      chain.push({ name: "Water Spell HP Bonus", factor: 1 + 0.20 * hpPct });
    }
  }

  return chain;
}

// ═══════════════════════════════════════════════════════════════════════
// ACCURACY
// ═══════════════════════════════════════════════════════════════════════

export function calculateAttackRoll(ctx: DpsContext, pe: AggregatedPactEffects, bonuses: EquipmentBonuses): number {
  const style = ctx.player.combatStyle;
  const weapon = ctx.loadout.weapon;

  let base: number;
  switch (style) {
    case "melee": base = ctx.player.attack; break;
    case "ranged": base = ctx.player.ranged; break;
    case "magic": base = ctx.player.magic; break;
  }

  // Step 1: Potion boost
  base += getPotionAttackBoost(base, ctx.player.potion, style);

  // Step 2: Prayer (with buffed ranged prayers)
  base = Math.floor(base * getPrayerAccuracyMultiplier(ctx.player, pe));

  // Step 3: Style + 8
  base += getAccuracyStyleBonus(ctx.player) + 8;

  // Step 4: Void accuracy
  // Magic: both regular and elite void = 1.45 (29/20) per wiki DPS calc source
  // Melee/Ranged: both void variants = 1.10
  if (ctx.player.voidSet !== "none") {
    let voidAccMult: number;
    if (style === "magic") {
      voidAccMult = 1.45;
    } else {
      voidAccMult = 1.10;
    }
    if (voidAccMult > 1) {
      base = Math.floor(base * voidAccMult);
    }
  }

  // Step 5: Soulreaper Axe — additive to effective attack level (non-spec)
  // Source: weirdgloop — floor(baseAtkLevel * stacks * 6 / 100) added to effective level
  if (weapon?.id === "soulreaper-axe" && style === "melee") {
    const stacks = Math.max(0, Math.min(5, ctx.player.soulreaperStacks ?? 0));
    if (stacks > 0) {
      base += Math.floor(ctx.player.attack * stacks * 6 / 100);
    }
  }

  // Get equipment attack bonus for the attack type
  let equipAtk: number;
  const atkType = getAttackType(ctx);
  switch (atkType) {
    case "stab": equipAtk = bonuses.astab; break;
    case "slash": equipAtk = bonuses.aslash; break;
    case "crush": equipAtk = bonuses.acrush; break;
    case "ranged": equipAtk = bonuses.aranged; break;
    case "magic": equipAtk = bonuses.amagic; break;
  }

  // Shadow triples magic attack from equipment
  if (weapon?.id === "shadow" && style === "magic") {
    equipAtk = bonuses.amagic * 3;
  }

  // Smoke Battlestaff: +10 magic attack for standard spells
  if (weapon?.id === "smoke-battlestaff" && style === "magic" && weapon.weaponCategory === "staff") {
    equipAtk += 10;
  }

  // Thrown weapon flat accuracy pact
  if (pe.thrownFlatAccuracy > 0 && weapon?.weaponCategory === "thrown") {
    equipAtk += pe.thrownFlatAccuracy;
  }

  let roll = base * (equipAtk + 64);

  // Slayer helm / V's Helm / Salve amulet accuracy (mutually exclusive)
  // V's Helm provides its bonus ALWAYS (no slayer task required)
  {
    const head = ctx.loadout.head;
    const hasSalve = ctx.loadout.neck?.id === "salve-ei" && ctx.target.isUndead;
    const hasVsHelm = head?.id === "echo-vs-helm";
    const hasSlayerHelm = hasVsHelm || (ctx.player.onSlayerTask === true && head?.id === "slayer-helm-i");

    if (hasSalve && hasSlayerHelm) {
      roll = Math.floor(roll * 1.20);
    } else if (hasSalve) {
      roll = Math.floor(roll * 1.20);
    } else if (hasSlayerHelm) {
      if (style === "melee") {
        roll = Math.floor(roll * (7 / 6));
      } else {
        roll = Math.floor(roll * 1.15);
      }
    }
  }

  // Pact accuracy bonus (sum of all accuracy nodes)
  if (pe.allStyleAccuracyPercent > 0) {
    roll = Math.floor(roll * (1 + pe.allStyleAccuracyPercent / 100));
  }

  // Twisted Bow accuracy scaling
  if (weapon?.id === "tbow") {
    const M = Math.min(250, ctx.target.magicLevel);
    const t2 = Math.trunc((3 * M - 10) / 100);
    const t3 = Math.trunc(Math.pow(Math.trunc(3 * M / 10) - 100, 2) / 100);
    const tbowAcc = Math.min(140, Math.max(0, 140 + t2 - t3));
    roll = Math.floor(roll * tbowAcc / 100);
  }

  // Arclight accuracy vs demons
  if (weapon?.id === "arclight" && ctx.target.isDemon) {
    roll = Math.floor(roll * 1.70);
  }

  // Dragon Hunter Crossbow accuracy vs dragons (+30%)
  if (weapon?.id === "dhcb" && ctx.target.isDragon) {
    roll = Math.floor(roll * 1.30);
  }

  // Dragon Hunter Lance accuracy vs dragons (+20%)
  if (weapon?.id === "dhl" && ctx.target.isDragon) {
    roll = Math.floor(roll * 1.20);
  }

  // Dragon Hunter Wand accuracy vs dragons (+75%) — weirdgloop: [7, 4]
  if (weapon?.id === "dh-wand" && ctx.target.isDragon) {
    roll = Math.floor(roll * (7 / 4));
  }

  // Wilderness weapon accuracy
  const wildernessWeapons = ["craws-bow", "webweaver-bow", "viggoras-chainmace", "ursine-chainmace"];
  if (weapon && wildernessWeapons.includes(weapon.id) && ctx.target.region === "wilderness") {
    roll = Math.floor(roll * 1.50);
  }
  const wildernessSceptres = ["thammarons-sceptre", "accursed-sceptre"];
  if (weapon && wildernessSceptres.includes(weapon.id) && ctx.target.region === "wilderness") {
    roll = Math.floor(roll * 2.0);
  }

  // Crystal armour set accuracy bonus (Bowfa or any weapon with Crystal blessing)
  if (weapon?.id === "bowfa" || ctx.loadout.ammo?.id === "echo-crystal-blessing") {
    let crystalAcc = 0;
    if (ctx.loadout.head?.id === "crystal-helm") crystalAcc += 0.05;
    if (ctx.loadout.body?.id === "crystal-body") crystalAcc += 0.15;
    if (ctx.loadout.legs?.id === "crystal-legs") crystalAcc += 0.10;
    if (crystalAcc > 0) {
      roll = Math.floor(roll * (1 + crystalAcc));
    }
  }

  // Soulreaper Axe accuracy — handled in effective attack level above (Step 5)

  // Obsidian armour set accuracy: +10% attack roll with tzhaar weapon + 3 obsidian pieces
  if (style === "melee" && weapon && OBSIDIAN_WEAPONS.includes(weapon.id)) {
    let obsidianPieces = 0;
    if (ctx.loadout.head?.id === "obsidian-helm") obsidianPieces++;
    if (ctx.loadout.body?.id === "obsidian-body") obsidianPieces++;
    if (ctx.loadout.legs?.id === "obsidian-legs") obsidianPieces++;
    if (obsidianPieces === 3) {
      roll = Math.floor(roll * 1.10);
    }
  }

  // Inquisitor's armour accuracy bonus (crush only) — same formula as damage
  if (style === "melee" && atkType === "crush") {
    let inqPieces = 0;
    if (ctx.loadout.head?.id === "inq-helm") inqPieces++;
    if (ctx.loadout.body?.id === "inq-body") inqPieces++;
    if (ctx.loadout.legs?.id === "inq-legs") inqPieces++;
    if (inqPieces > 0) {
      let inqValue = inqPieces;
      if (weapon?.id === "inq-mace") {
        inqValue = inqPieces * 5;
      } else if (inqPieces === 3) {
        inqValue = 5;
      }
      roll = Math.floor(roll * ((200 + inqValue) / 200));
    }
  }

  // Elemental weakness: +severity% attack roll when spell element matches weakness
  // Source: weirdgloop/osrs-dps-calc PlayerVsNPCCalc.ts (spellement bonus)
  {
    const severity = getElementalWeaknessMatch(ctx, pe);
    if (severity > 0) {
      roll += Math.floor(roll * severity / 100);
    }
  }

  return roll;
}

function getPotionAttackBoost(baseLevel: number, potion: PlayerConfig["potion"], style: string): number {
  switch (potion) {
    case "super-combat":
    case "super-attack":
      if (style === "melee") return 5 + Math.floor(baseLevel * 0.15);
      return 0;
    case "ranging":
      if (style === "ranged") return 4 + Math.floor(baseLevel * 0.10);
      return 0;
    case "magic":
      if (style === "magic") return 4 + Math.floor(baseLevel * 0.10);
      return 0;
    case "overload":
      if (style === "melee") return 5 + Math.floor(baseLevel * 0.15);
      if (style === "ranged") return 4 + Math.floor(baseLevel * 0.10);
      if (style === "magic") return 4 + Math.floor(baseLevel * 0.10);
      return 0;
    case "smelling-salts":
      return 11 + Math.floor(baseLevel * 0.16);
    default:
      return 0;
  }
}

function getAccuracyStyleBonus(player: PlayerConfig): number {
  switch (player.attackStyle) {
    case "accurate": return 3;
    case "controlled": return 1;
    default: return 0;
  }
}

export function calculateDefenceRoll(
  target: BossPreset,
  attackType: AttackType,
  weaponCategory?: WeaponCategory,
): number {
  const defLevel = attackType === "magic" ? target.magicLevel : target.defenceLevel;

  let defBonus: number;
  switch (attackType) {
    case "stab": defBonus = target.dstab; break;
    case "slash": defBonus = target.dslash; break;
    case "crush": defBonus = target.dcrush; break;
    case "ranged":
      // Use ranged defence split based on weapon category
      if (weaponCategory === "thrown" || weaponCategory === "blowpipe") {
        defBonus = target.dranged_light;
      } else if (weaponCategory === "bow") {
        defBonus = target.dranged_standard;
      } else if (weaponCategory === "crossbow") {
        defBonus = target.dranged_heavy;
      } else {
        defBonus = target.dranged;
      }
      break;
    case "magic": defBonus = target.dmagic; break;
  }

  return (defLevel + 9) * (defBonus + 64);
}

export function calculateAccuracy(ctx: DpsContext): number {
  ctx.pactEffects ??= aggregatePactEffects(ctx.player.activePacts);
  const totalBonuses = sumEquipmentBonuses(ctx.loadout);
  applyOffhandStatBoost(ctx, ctx.pactEffects, totalBonuses);
  const atkRoll = calculateAttackRoll(ctx, ctx.pactEffects, totalBonuses);
  const defRoll = calculateDefenceRoll(ctx.target, getAttackType(ctx), ctx.loadout.weapon?.weaponCategory);
  const baseAcc = standardAccuracy(atkRoll, defRoll);
  return applyDoubleRoll(ctx, ctx.pactEffects, baseAcc);
}

function standardAccuracy(attackRoll: number, defenceRoll: number): number {
  if (attackRoll > defenceRoll) {
    return 1 - (defenceRoll + 2) / (2 * (attackRoll + 1));
  } else {
    return attackRoll / (2 * (defenceRoll + 1));
  }
}

function applyDoubleRoll(ctx: DpsContext, pe: AggregatedPactEffects, baseAcc: number): number {
  const weapon = ctx.loadout.weapon;
  const weaponCat = weapon?.weaponCategory;

  // Crossbow double roll pact: uses exact Fang discrete formula per weirdgloop
  if (weaponCat === "crossbow" && pe.crossbowDoubleRoll) {
    const atkRoll = ctx._fangAtkRoll ?? 0;
    const defRoll = ctx._fangDefRoll ?? 0;
    return fangExactAccuracy(atkRoll, defRoll);
  }

  // Osmumten's Fang: exact discrete double-roll
  if (weapon?.id === "fang") {
    const atkRoll = ctx._fangAtkRoll ?? 0;
    const defRoll = ctx._fangDefRoll ?? 0;
    return fangExactAccuracy(atkRoll, defRoll);
  }

  // Drygore Blowpipe double roll
  if (weapon?.id === "echo-drygore-blowpipe") {
    return 1 - (1 - baseAcc) * (1 - baseAcc);
  }

  return baseAcc;
}

function fangExactAccuracy(attackRoll: number, defenceRoll: number): number {
  const A = attackRoll;
  const D = defenceRoll;
  if (A > D) {
    return 1 - (D + 2) * (2 * D + 3) / ((A + 1) * (A + 1) * 6);
  } else {
    return A * (4 * A + 5) / (6 * (A + 1) * (D + 1));
  }
}

// ═══════════════════════════════════════════════════════════════════════
// WEAPON ATTACK RANGE
// Source: https://oldschool.runescape.wiki/w/Attack_range
// ══════════════════════════════════════════════��════════════════════════

/** Default attack range by weapon category (rapid/accurate style, not longrange). */
const WEAPON_CATEGORY_RANGE: Record<string, number> = {
  "standard": 1,
  "1h-light": 1,
  "1h-heavy": 1,
  "2h-melee": 1,
  "halberd": 2,
  "scythe": 1,
  "bow": 10,           // Longbows/crystal/tbow = 10; shortbows overridden to 7
  "crossbow": 7,       // Most crossbows; ACB/ZCB overridden to 8
  "blowpipe": 5,
  "thrown": 4,          // Knives/axes = 4; darts = 3, atlatl = 6 (overridden)
  "staff": 10,          // Standard spell casting range
  "powered-staff": 7,   // Trident/sang/accursed = 7; Shadow = 8 (overridden)
};

/** Per-weapon range overrides where category default is wrong. */
const WEAPON_RANGE_OVERRIDES: Record<string, number> = {
  // Shortbows (range 7, category default is 10)
  "msb-i": 7,
  "craws-bow": 7,
  "webweaver-bow": 7,
  "seercull": 7,
  // Crossbows with range 8 (ACB, ZCB)
  "acb": 8,
  "zcb": 8,
  // Ballistas: range 9
  "heavy-ballista": 9,
  "light-ballista": 9,
  // Powered staves with non-default range
  "shadow": 8,          // Tumeken's shadow
  "eye-of-ayak": 6,     // Eye of Ayak
  // Thrown with non-default range
  "eclipse-atlatl": 6,  // Atlatl range 6
  "tonalztics": 6,      // Tonalztics of ralos
};

/**
 * Get the base attack range of a weapon (before pact modifiers).
 * Source: https://oldschool.runescape.wiki/w/Attack_range
 */
export function getBaseWeaponRange(weapon: Item | null | undefined): number {
  if (!weapon) return 1;
  const override = WEAPON_RANGE_OVERRIDES[weapon.id];
  if (override !== undefined) return override;
  return WEAPON_CATEGORY_RANGE[weapon.weaponCategory ?? "standard"] ?? 1;
}

/**
 * Compute effective attack distance for distance-dependent pacts.
 * Always uses weapon's max attack range (assumes optimal positioning).
 * For melee: base weapon range + pact modifiers (node43, node155).
 * For ranged/magic: weapon's base attack range from wiki data.
 */
function getEffectiveDistance(ctx: DpsContext, pe: AggregatedPactEffects): number {
  const weapon = ctx.loadout.weapon;

  if (ctx.player.combatStyle === "melee") {
    // Base weapon range: halberds = 2, all other melee = 1
    let range = weapon?.weaponCategory === "halberd" ? 2 : 1;

    // Node 43: 2H weapons melee range doubled
    if (pe.meleeRangeMultiplier > 0 && weapon?.isTwoHanded) {
      range *= pe.meleeRangeMultiplier;
    }

    // Node 155: if melee range >= 4, increase to 7
    if (pe.meleeRangeConditionalBoost && range >= 4) {
      range = 7;
    }

    return range;
  }

  // Ranged/magic: use weapon's base attack range
  return getBaseWeaponRange(weapon);
}

// ═══════════════════════════════════════════════════════════════════════
// ATTACK SPEED
// ═══════════════════════════════════════════════════════════════════════

function getAttackSpeed(ctx: DpsContext, pe: AggregatedPactEffects): number {
  const weapon = ctx.loadout.weapon;
  let speed = weapon?.attackSpeed ?? 4;

  // Harmonised nightmare staff: 4t for standard spells only, 5t for ancient spells.
  // The ATTACK_SPEED_OVERRIDES in items.ts sets harm-staff to 4t unconditionally,
  // but the harmonised orb passive only reduces standard spell speed.
  // Source: OSRS Wiki "Harmonised nightmare staff"
  if (weapon?.id === "harm-staff") {
    const el = ctx.player.spellElement;
    const isStandard = el === "fire" || el === "earth" || el === "water" || el === "air";
    speed = isStandard ? 4 : 5;
  }

  // Rapid style: -1 tick for ranged
  if (ctx.player.attackStyle === "rapid" && ctx.player.combatStyle === "ranged") {
    speed -= 1;
  }

  const weaponCat = weapon?.weaponCategory;

  // Spell speed pact: -2t for standard spells (min 2t)
  if (weaponCat === "staff" && pe.magicSpellSpeedReduction > 0) {
    speed -= pe.magicSpellSpeedReduction;
    speed = Math.max(2, speed);
  }

  // Powered staff speed pact: -3t (min 2t, same floor as standard spells)
  if (weaponCat === "powered-staff" && pe.poweredStaffSpeedReduction > 0) {
    speed -= pe.poweredStaffSpeedReduction;
    speed = Math.max(2, speed);
  }

  // Light weapon faster pact: -1t for <1kg melee
  if (weaponCat === "1h-light" && pe.lightWeaponFaster) {
    speed -= 1;
  }

  // Bow fast hits pact: -1t
  if (weaponCat === "bow" && pe.bowFastHits) {
    speed -= 1;
  }

  // Crossbow slow big hits pact: +2t (damage handled in multiplier chain)
  if (weaponCat === "crossbow" && pe.crossbowSlowBigHits) {
    speed += 2;
  }

  // Melee range conditional boost: halberds >5t → 5t
  if (pe.meleeRangeConditionalBoost && weaponCat === "halberd" && speed > 5) {
    speed = 5;
  }

  return Math.max(1, speed);
}

// ═══════════════════════════════════════════════════════════════════════
// ECHO CASCADE
// ═══════════════════════════════════════════════════════════════════════

function calculateEchoDps(ctx: DpsContext, pe: AggregatedPactEffects, baseDps: number, _accuracy: number): number {
  // Base echo chance from pact nodes (before regen scaling)
  // Source: weirdgloop PlayerVsNPCCalc.ts — crossbow reproc added to echoChance BEFORE regen scaling
  let echoChance = pe.rangedRegenEchoChance / 100;
  if (echoChance <= 0) return 0;
  if (ctx.player.combatStyle !== "ranged") return 0;

  // Crossbow echo reproc chance (added to base echo chance, before regen scaling)
  if (ctx.loadout.weapon?.weaponCategory === "crossbow") {
    echoChance += pe.crossbowEchoReprocChance / 100;
  }

  // Combined rate: base echo chance scaled by regen chance
  const regenChance = Math.min(1, pe.regenAmmoChance / 100);
  const echoRate = echoChance * regenChance;

  if (echoRate <= 0) return 0;

  let echoDps: number;

  // Echo cascade: each cyclical echo fires independently at half base echo chance (up to 4 total)
  // Source: weirdgloop PlayerVsNPCCalc.ts — adds 3 copies of echoDist scaled by echoChance/2
  if (pe.rangedEchoCyclical) {
    const cascadeMult = 1 + 3 * (echoChance / 2);
    echoDps = baseDps * echoRate * cascadeMult;
  } else {
    echoDps = baseDps * echoRate;
  }

  // Bow echoes always pass accuracy: effective accuracy is 1.0
  if (pe.bowAlwaysPassAccuracy && ctx.loadout.weapon?.weaponCategory === "bow") {
    // Echoes normally use weapon accuracy, but with this pact they always hit
    // Boost: echoDps * (1/accuracy - 1) * accuracy = echoDps * (1 - accuracy)
    // But more precisely: echoRate * (maxHit/2) / interval instead of echoRate * (maxHit/2 * acc) / interval
    // Since baseDps already includes accuracy, we adjust by dividing by acc and multiplying by 1
    const finalAcc = _accuracy;
    if (finalAcc > 0 && finalAcc < 1) {
      echoDps = echoDps / finalAcc; // remove accuracy factor from echo DPS
    }
  }

  // Thrown maxhit echoes: X% of echoes deal max hit
  if (pe.thrownMaxhitEchoes > 0 && ctx.loadout.weapon?.weaponCategory === "thrown") {
    // X% of echoes hit max instead of avg (avg is maxHit/2, max is maxHit)
    // Extra DPS = echoRate * (thrownMaxhitEchoes/100) * (maxHit/2) / interval
    // But echoDps already models this at avg, so multiply the echo portion
    const maxHitFraction = pe.thrownMaxhitEchoes / 100;
    echoDps *= (1 + maxHitFraction);
  }

  return echoDps;
}

// ═══════════════════════════════════════════════════════════════════════
// THORNS DPS
// ═══════════════════════════════════════════════════════════════════════

function calculateThornsDps(ctx: DpsContext, pe: AggregatedPactEffects, bonuses: EquipmentBonuses): number {
  if (pe.thornsDamage <= 0) return 0;
  if (!ctx.loadout.shield) return 0; // thorns requires shield

  let thornsDmg = pe.thornsDamage;

  // Defence recoil scaling: +1% of total defence bonuses
  if (pe.defenceRecoilScaling) {
    const totalDefBonus = bonuses.dstab + bonuses.dslash + bonuses.dcrush + bonuses.dranged + bonuses.dmagic;
    thornsDmg += Math.floor(totalDefBonus * 0.01);
  }

  // Thorns double hit: second hit at 50% damage
  const hitMult = pe.thornsDoubleHit ? 1.5 : 1;
  thornsDmg = Math.floor(thornsDmg * hitMult);

  // Boss attack interval from wiki data (default 4 ticks if not available)
  const bossSpeed = ctx.target.attackSpeed ?? 4;
  const bossInterval = Math.max(1, bossSpeed) * 0.6;
  return thornsDmg / bossInterval;
}

// ═══════════════════════════════════════════════════════════════════════
// SUSTAIN INFO
// ═══════════════════════════════════════════════════════════════════════

function buildSustainInfo(ctx: DpsContext, pe: AggregatedPactEffects, _bonuses: EquipmentBonuses): string[] {
  const info: string[] = [];
  const style = ctx.player.combatStyle;

  if (pe.prayerPenAll > 0) {
    info.push(`+${pe.prayerPenAll}% prayer penetration`);
  }
  if (pe.prayerRestoreNoOverhead) {
    info.push("Restore 1 prayer/15t without overhead prayers");
  }
  if (pe.specForFree > 0) {
    info.push(`${pe.specForFree}% chance special attacks are free`);
  }
  if (pe.restoreSaEnergyFromDistance) {
    info.push("Restore 2% spec energy from 2+ tile attacks");
  }
  if (pe.hitRestoreSpecEnergy > 0) {
    info.push(`Melee hits restore ${pe.hitRestoreSpecEnergy}% spec energy`);
  }
  if (pe.meleeDistanceHealingChance > 0 && style === "melee") {
    info.push(`+${pe.meleeDistanceHealingChance}% chance to heal based on distance`);
  }
  if (pe.overhealingViaTalents > 0) {
    info.push(`Pact healing overheals up to +${pe.overhealingViaTalents}% HP`);
  }
  if (pe.airRuneRegenPrayerRestore > 0) {
    info.push(`Air rune regen: ${pe.airRuneRegenPrayerRestore}% chance to restore 1 prayer`);
  }
  if (pe.waterRuneRegenHealing > 0) {
    info.push(`Water rune regen: heal ${pe.waterRuneRegenHealing} per rune`);
  }
  if (pe.earthRuneRegenDefenceBoost > 0) {
    info.push(`Earth rune regen: +${pe.earthRuneRegenDefenceBoost} Defence per rune for 30t`);
  }
  if (pe.regenStaveChargesAir) info.push("Powered staff regen generates air runes");
  if (pe.regenStaveChargesWater) info.push("Powered staff regen generates water runes");
  if (pe.regenStaveChargesFire) info.push("Powered staff regen generates fire runes");
  if (pe.regenStaveChargesEarth) info.push("Powered staff regen generates earth runes");
  if (pe.waterSpellBounceHeal && style === "magic") {
    info.push("Water spell hits heal 60% of damage dealt");
  }
  if (pe.shieldBlockHeal && ctx.loadout.shield) {
    info.push("0-damage hits: heal 2 + restore 2 prayer");
  }
  if (pe.shieldReflect && ctx.loadout.shield) {
    const defLevel = ctx.player.defence + pe.defenceBoost;
    const reflectChance = (defLevel * 0.001 * 100).toFixed(1);
    info.push(`${reflectChance}% chance to reflect all damage (shield)`);
  }
  if (pe.regenMagicLevelBoost > 0 && style === "magic") {
    info.push(`Regen runes: Magic level +1 per regen (cap +${pe.regenMagicLevelBoost})`);
  }
  if (pe.maxHitStyleSwap) {
    info.push("Max hit from 3+ tiles: next different-style hit +25%");
  }
  {
    const effectiveDist = getEffectiveDistance(ctx, pe);
    if (effectiveDist > 1) {
      info.push(`Attack distance: ${effectiveDist} tiles`);
    }
  }

  // Defensive bonuses display
  if (pe.defenceBoost > 0) {
    info.push(`+${pe.defenceBoost} Defence boost from pacts`);
  }

  return info;
}

// ═══════════════════════════════════════════════════════════════════════
// BONUS HITS
// ═══════════════════════════════════════════════════════════════════════

function calculateBonusHitDps(_ctx: DpsContext, pe: AggregatedPactEffects, maxHit: number, accuracy: number, interval: number): number {
  if (!pe.lightWeaponDoubleHit) return 0;
  if (_ctx.loadout.weapon?.weaponCategory !== "1h-light") return 0;
  const bonusMax = Math.floor(maxHit * 0.40);
  return (bonusMax / 2 * accuracy) / interval;
}

/** Blindbag pact triggers on "heavy weapons (>=1kg)". We don't track weight, so use
 *  weapon category as a proxy: all melee categories except 1h-light (daggers, rapiers)
 *  are typically >=1kg. Halberds (2-3kg), godswords (10kg), scythe, maces all qualify. */
function isHeavyMeleeWeapon(weaponCat: string | undefined): boolean {
  if (!weaponCat) return false;
  // 1h-light includes rapiers (~1.8kg, borderline) and whips (0.45kg, excluded).
  // Conservative: exclude the entire category. Could add weight data for precision later.
  const heavyCats = new Set(["1h-heavy", "2h-melee", "halberd", "scythe", "standard"]);
  return heavyCats.has(weaponCat);
}

function calculateBlindbagDps(_ctx: DpsContext, pe: AggregatedPactEffects, maxHit: number, accuracy: number, interval: number): number {
  if (pe.blindbagChance <= 0) return 0;
  if (!isHeavyMeleeWeapon(_ctx.loadout.weapon?.weaponCategory)) return 0;
  return (pe.blindbagChance / 100) * (maxHit * accuracy) / interval;
}

function calculateBoltSpecDps(ctx: DpsContext, pe: AggregatedPactEffects, maxHit: number, accuracy: number, interval: number): number {
  const ammo = ctx.loadout.ammo;
  if (!ammo) return 0;
  const weaponCat = ctx.loadout.weapon?.weaponCategory;
  if (weaponCat !== "crossbow") return 0;

  // King's Barrage: double bolt proc rate
  const procMultiplier = ctx.loadout.weapon?.id === "echo-kings-barrage" ? 2 : 1;

  // Kandarin Hard Diary: +10% relative proc rate increase
  const diaryMultiplier = ctx.player.kandarinDiary ? 1.1 : 1;

  // ZCB: +10% bolt spec damage
  const zcbDmgMult = ctx.loadout.weapon?.id === "zcb" ? 1.10 : 1;

  if (ammo.id === "ruby-dragon-bolts-e") {
    const procDmg = Math.min(100, Math.floor(ctx.target.hp * 0.20));
    const normalAvg = maxHit / 2;
    const procRate = 0.06 * procMultiplier * diaryMultiplier;
    // ZCB boosts the proc damage, not the normal hit
    const boltBonus = procRate * accuracy * (procDmg * zcbDmgMult - normalAvg);
    return Math.max(0, boltBonus) / interval;
  }

  if (ammo.id === "diamond-dragon-bolts-e") {
    const procRate = 0.10 * procMultiplier * diaryMultiplier;
    const boostedAcc = procRate + (1 - procRate) * accuracy;
    const normalDps = (maxHit / 2 * accuracy) / interval;
    const boostedDps = (maxHit / 2 * boostedAcc) / interval;
    return boostedDps - normalDps;
  }

  if (ammo.id === "onyx-dragon-bolts-e") {
    // 11% proc rate, +20% extra damage on proc, does NOT bypass accuracy
    const procRate = 0.11 * procMultiplier * diaryMultiplier;
    const normalAvg = maxHit / 2;
    const procDmg = maxHit * 1.20 * zcbDmgMult;
    const boltBonus = procRate * accuracy * (procDmg / 2 - normalAvg);
    return Math.max(0, boltBonus) / interval;
  }

  if (ammo.id === "dragonstone-dragon-bolts-e") {
    // 6% proc rate, extra damage = floor(rangedLevel * 0.20), does NOT bypass accuracy
    const procRate = 0.06 * procMultiplier * diaryMultiplier;
    const extraDmg = Math.floor(ctx.player.ranged * 0.20) * zcbDmgMult;
    return procRate * accuracy * extraDmg / interval;
  }

  return 0;
}

/**
 * ZCB spec: guaranteed bolt proc — returns extra average damage per spec attack.
 * The bolt proc fires at 100% rate (instead of the normal 6-11%).
 * ZCB +10% bolt spec damage also applies.
 */
function getZcbBoltProcDmg(ctx: DpsContext, specMax: number, specAcc: number): number {
  const ammo = ctx.loadout.ammo;
  if (!ammo) return 0;

  const zcbDmgMult = 1.10; // ZCB always boosts bolt spec damage by 10%

  if (ammo.id === "ruby-dragon-bolts-e") {
    // 100% proc: deal floor(20% of boss HP), capped at 100, instead of normal hit
    const procDmg = Math.min(100, Math.floor(ctx.target.hp * 0.20)) * zcbDmgMult;
    const normalAvg = specMax / 2;
    return Math.max(0, procDmg - normalAvg) * specAcc;
  }

  if (ammo.id === "diamond-dragon-bolts-e") {
    // 100% proc: guaranteed accuracy (spec already has doubled acc, but diamond ignores defence entirely)
    // Extra value: (1 - specAcc) * specMax/2 — the damage gained from the extra accuracy
    return (1 - specAcc) * specMax / 2;
  }

  if (ammo.id === "onyx-dragon-bolts-e") {
    // 100% proc: +20% extra damage on the hit
    return specMax * 0.20 * zcbDmgMult / 2 * specAcc;
  }

  if (ammo.id === "dragonstone-dragon-bolts-e") {
    // 100% proc: extra damage = floor(rangedLevel * 0.20)
    const extraDmg = Math.floor(ctx.player.ranged * 0.20) * zcbDmgMult;
    return extraDmg * specAcc;
  }

  return 0;
}

// ═══════════════════════════════════════════════════════════════════════
// BOSS DAMAGE MODIFIERS
// ═══════════════════════════════════════════════════════════════════════

function applyBossModifier(ctx: DpsContext, dps: number, _maxHit: number): number {
  const mod = ctx.target.damageModifier;
  if (!mod) return dps;

  const style = ctx.player.combatStyle;
  const weapon = ctx.loadout.weapon;
  const weaponCat = weapon?.weaponCategory;

  switch (mod.type) {
    case "corp":
      // Corp: only spears, hastas, and halberds deal full damage; everything else halved
      if (weaponCat === "halberd") return dps;
      if (weapon && isSpearOrHasta(weapon)) return dps;
      return dps * 0.5;
    case "tekton-magic":
      // Tekton: magic deals 80% reduced damage
      if (style === "magic") return dps * 0.20;
      return dps;
    case "kraken-ranged":
      // Kraken: only magic deals full damage; ranged deals 1/7; melee immune
      if (style === "melee") return 0;
      if (style === "ranged") return dps * (1 / 7);
      return dps;
    case "zulrah-cap":
      // Zulrah: max hit capped at 50
      if (_maxHit > 50) {
        // Scale DPS proportionally to the cap
        return dps * (50 / _maxHit);
      }
      return dps;
  }
}

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════

function isSpearOrHasta(weapon: Item): boolean {
  const name = weapon.name.toLowerCase();
  return name.includes("spear") || name.includes("hasta");
}

const OBSIDIAN_WEAPONS = ["toktz-xil-ak", "tzhaar-ket-om", "tzhaar-ket-em", "toktz-xil-ek", "toktz-mej-tal"];

/**
 * Additive max hit bonuses applied before the multiplier chain.
 * Source: weirdgloop/osrs-dps-calc PlayerVsNPCCalc.ts
 */
function getAdditiveMaxHitBonus(ctx: DpsContext, baseMax: number): number {
  let bonus = 0;
  const weapon = ctx.loadout.weapon;
  const style = ctx.player.combatStyle;

  // Obsidian armour set: +floor(baseMax / 10) with tzhaar weapon + 3 obsidian pieces
  // Source: wiki — "grants a 10% melee damage and accuracy boost"
  if (style === "melee" && weapon && OBSIDIAN_WEAPONS.includes(weapon.id)) {
    let obsidianPieces = 0;
    if (ctx.loadout.head?.id === "obsidian-helm") obsidianPieces++;
    if (ctx.loadout.body?.id === "obsidian-body") obsidianPieces++;
    if (ctx.loadout.legs?.id === "obsidian-legs") obsidianPieces++;
    if (obsidianPieces === 3) {
      bonus += Math.floor(baseMax / 10);
    }
  }

  // Colossal blade: +min(target_size * 2, 10) melee damage bonus
  // Source: wiki — "extra damage equal to twice the target's size, capped at 10"
  if (weapon?.id === "colossal-blade" && style === "melee") {
    const targetSize = ctx.target.size ?? 1;
    bonus += Math.min(targetSize * 2, 10);
  }

  return bonus;
}

function getAttackType(ctx: DpsContext): AttackType {
  return ctx.loadout.weapon?.attackType ?? (ctx.player.combatStyle === "ranged" ? "ranged" : ctx.player.combatStyle === "magic" ? "magic" : "slash");
}

function getFlatMaxHitMod(ctx: DpsContext, pe: AggregatedPactEffects): number {
  let mod = 0;
  // Powered staff speed pact: 1H staves lose 8 max hit
  if (ctx.loadout.weapon?.weaponCategory === "powered-staff" && pe.poweredStaffSpeedReduction > 0) {
    // Only 1H staves lose max hit — check if weapon is NOT two-handed
    if (!ctx.loadout.weapon.isTwoHanded) {
      mod -= 8;
    }
  }
  return mod;
}

// ═══════════════════════════════════════════════════════════════════════
// SPECIAL ATTACK — BLENDED DPS
// Source: weirdgloop/osrs-dps-calc PlayerVsNPCCalc.ts
// ═══════════════════════════════════════════════════════════════════════

interface BlendedResult {
  blendedDps: number;
  specInfo: NonNullable<DpsBreakdown["specInfo"]>;
}

function calculateBlendedSpecDps(
  ctx: DpsContext,
  pe: AggregatedPactEffects,
  spec: SpecAttack,
  weapon: Item,
  baseAtkRoll: number,
  baseDefRoll: number,
  normalMax: number,
  normalAcc: number,
  speed: number,
  normalDps: number,
): BlendedResult | null {
  // Compute spec max hit and accuracy
  const specAtkRoll = Math.floor(baseAtkRoll * (spec.accMultiplier ?? 1));
  let specDmgMult = spec.dmgMultiplier ?? 1;

  // Dark bow: dragon arrows 15/10 (1.5x), non-dragon 13/10 (1.3x)
  if (spec.darkBowMinHit !== undefined) {
    const isDragonArrow = ctx.loadout.ammo?.id === "dragon-arrows";
    specDmgMult = isDragonArrow ? 15 / 10 : 13 / 10;
  }

  // Soulreaper Axe spec: (100 + 6*stacks)/100 multiplier on max hit
  if (spec.soulreaperSpecDmg) {
    const stacks = Math.max(0, Math.min(5, ctx.player.soulreaperStacks ?? 0));
    specDmgMult = (100 + 6 * stacks) / 100;
  }

  let specMax = Math.floor(normalMax * specDmgMult);
  specMax += spec.flatDmgBonus ?? 0;

  // Fang spec: 1.5x on attack roll, then fang double-roll formula still applies
  // (accMultiplier already applied above; fang double-roll handled via specAcc below)

  // Custom max hit formulas (volatile/eldritch NM staff)
  if (spec.customMaxHit) {
    const visibleMagic = ctx.player.magic + getPotionAttackBoost(ctx.player.magic, ctx.player.potion, "magic");
    specMax = spec.customMaxHit(visibleMagic);
  }

  // Max hit bonus fraction (voidwaker: max becomes 150% of base max)
  if (spec.maxHitBonusFraction) {
    specMax = Math.floor(normalMax * (1 + spec.maxHitBonusFraction));
  }

  // Compute spec accuracy
  let specAcc: number;
  if (spec.guaranteedHit) {
    specAcc = 1.0;
  } else if (spec.useMagicDefence) {
    // Roll against magic defence instead of melee
    const magicDefRoll = calculateDefenceRoll(ctx.target, "magic");
    specAcc = standardAccuracy(specAtkRoll, magicDefRoll);
  } else if (weapon.id === "fang") {
    // Fang spec still uses fang exact formula after applying spec acc multiplier
    specAcc = fangExactAccuracy(specAtkRoll, baseDefRoll);
  } else {
    specAcc = standardAccuracy(specAtkRoll, baseDefRoll);
  }

  // Compute average damage per spec attack
  let specAvgDmg = calculateSpecAvgDmg(spec, specMax, specAcc, normalMax, ctx);

  // ZCB: guaranteed bolt proc on each spec hit (100% proc rate)
  if (spec.zcbGuaranteedBoltProc) {
    specAvgDmg += getZcbBoltProcDmg(ctx, specMax, specAcc);
  }

  // Spec speed (some specs have speed overrides)
  const specSpeed = spec.speedOverride ?? speed;

  // ── Duty cycle: how many specs per energy cycle ──────────────────────
  const specForFreeChance = pe.specForFree / 100;
  const effectiveCost = spec.energyCost * (1 - specForFreeChance);
  const specsPerCycle = effectiveCost > 0 ? Math.floor(100 / effectiveCost) : 1;

  // Time to regenerate full spec bar: 100% / 0.2% per tick = 500 ticks
  const cycleTimeTicks = 500;

  // Spec attacks consume time: each spec takes one attack interval
  let specPhaseTicks = specsPerCycle * specSpeed;

  // Pact: melee hits restore spec energy — reduces effective cycle time
  if (pe.hitRestoreSpecEnergy > 0 && ctx.player.combatStyle === "melee") {
    // Each normal attack restores R% spec energy
    // This means we accumulate extra spec energy during normal phase
    // Extra specs gained = floor(normalAttacks * R / energyCost)
    // For simplicity: reduce remaining ticks by the energy gained per normal hit
    const normalPhaseTicks = cycleTimeTicks - specPhaseTicks;
    const normalAttacks = Math.floor(normalPhaseTicks / speed);
    const extraEnergy = normalAttacks * pe.hitRestoreSpecEnergy;
    const extraSpecs = Math.floor(extraEnergy / spec.energyCost);
    if (extraSpecs > 0) {
      specPhaseTicks += extraSpecs * specSpeed;
    }
  }

  // Distance spec energy restoration
  if (pe.restoreSaEnergyFromDistance && getEffectiveDistance(ctx, pe) >= 2) {
    // Restore 2% per attack from 2+ tile distance
    const normalPhaseTicks = cycleTimeTicks - specPhaseTicks;
    const normalAttacks = Math.floor(normalPhaseTicks / speed);
    const extraEnergy = normalAttacks * 2;
    const extraSpecs = Math.floor(extraEnergy / spec.energyCost);
    if (extraSpecs > 0) {
      specPhaseTicks += extraSpecs * specSpeed;
    }
  }

  // Clamp spec phase to not exceed cycle
  specPhaseTicks = Math.min(specPhaseTicks, cycleTimeTicks);

  const normalPhaseTicks = cycleTimeTicks - specPhaseTicks;
  const normalAttackCount = Math.floor(normalPhaseTicks / speed);
  const totalSpecCount = Math.floor(specPhaseTicks / specSpeed);

  // Average damage per normal attack
  const normalAvgDmg = normalDps * speed * 0.6;

  // Total damage in cycle
  const totalSpecDmg = totalSpecCount * specAvgDmg;
  const totalNormalDmg = normalAttackCount * normalAvgDmg;
  const cycleTimeSec = cycleTimeTicks * 0.6;
  const blendedDps = (totalSpecDmg + totalNormalDmg) / cycleTimeSec;

  // Only use blended if it's better than normal
  if (blendedDps <= normalDps) return null;

  // Spec-only DPS (as if every attack was spec)
  const specDpsPerAttack = specAvgDmg / (specSpeed * 0.6);

  return {
    blendedDps,
    specInfo: {
      name: spec.name,
      energyCost: spec.energyCost,
      specDpsPerAttack,
      normalDps,
      specsPerCycle: totalSpecCount,
      cycleTimeSec,
      normalAttacksPerCycle: normalAttackCount,
      specMaxHit: specMax,
      specAccuracy: specAcc,
    },
  };
}

/**
 * Calculate average damage per spec attack for a given spec type.
 */
function calculateSpecAvgDmg(
  spec: SpecAttack,
  specMax: number,
  specAcc: number,
  normalMax: number,
  ctx: DpsContext,
): number {
  const hits = spec.hits ?? 1;

  // ── Cascade types ──────────────────────────────────────────────────
  if (spec.cascadeType === "dragon-claws") {
    return clawsAvgDamage(specAcc, normalMax);
  }
  if (spec.cascadeType === "burning-claws") {
    return burningClawsAvgDamage(specAcc, normalMax);
  }

  // ── Guaranteed hit with min/max range ──────────────────────────────
  if (spec.guaranteedHit && spec.minHitFraction !== undefined) {
    const minHit = Math.floor(normalMax * spec.minHitFraction);
    // maxHitBonusFraction already applied to specMax above
    return (minHit + specMax) / 2;
  }

  // ── Guaranteed hit (no range) ──────────────────────────────────────
  if (spec.guaranteedHit) {
    return specMax / 2;
  }

  // ── Multi-hit with per-hit max fraction ────────────────────────────
  if (spec.perHitMaxFraction) {
    const perHitMax = Math.floor(specMax * spec.perHitMaxFraction);
    return hits * (perHitMax / 2) * specAcc;
  }

  // ── Dark bow: 2 arrows with min/cap ────────────────────────────────
  if (spec.darkBowMinHit !== undefined && spec.darkBowCap !== undefined) {
    // Dragon arrows: min 8, cap 48. Other arrows: min 5, cap 48.
    const ammoId = ctx.loadout.ammo?.id;
    const min = ammoId === "dragon-arrows" ? 8 : 5;
    const cap = spec.darkBowCap;
    const cappedMax = Math.min(specMax, cap);
    const effectiveMin = Math.max(min, 0);
    const avgPerArrow = specAcc * (effectiveMin + cappedMax) / 2 + (1 - specAcc) * effectiveMin;
    return hits * avgPerArrow;
  }

  // ── Target-size multi-hit (halberds) ───────────────────────────────
  if (spec.targetSizeMultiHit) {
    const targetSize = ctx.target.size ?? 1;
    const firstHitDmg = (specMax / 2) * specAcc;
    if (targetSize > 1 && spec.secondHitAccFraction) {
      const secondAcc = specAcc * spec.secondHitAccFraction;
      const secondHitDmg = (specMax / 2) * secondAcc;
      return firstHitDmg + secondHitDmg;
    }
    return firstHitDmg;
  }

  // ── Abyssal dagger: 2nd hit guaranteed if 1st hits ─────────────────
  if (spec.secondHitGuaranteedOnAccurate && hits === 2) {
    // Hit 1: normal accuracy at reduced max. Hit 2: guaranteed if hit 1 lands.
    const perHitMax = specMax;
    const hit1 = (perHitMax / 2) * specAcc;
    const hit2 = (perHitMax / 2) * specAcc; // only fires when hit 1 hits → guaranteed damage
    return hit1 + hit2;
  }

  // ── Sara sword: bonus magic hit ────────────────────────────────────
  if (spec.magicBonusHit) {
    const [magicMin, magicMax] = spec.magicBonusHit;
    const meleeDmg = (specMax / 2) * specAcc;
    const magicDmg = ((magicMin + magicMax) / 2) * specAcc;
    return meleeDmg + magicDmg;
  }

  // ── Arkan blade burn DoT ───────────────────────────────────────────
  if (spec.burnDpt) {
    const hitDmg = (specMax / 2) * specAcc;
    // Burn: 10 damage per tick for a few ticks on successful hit
    // Estimate ~5 ticks of burn per successful spec
    const burnDmg = specAcc * spec.burnDpt * 5;
    return hitDmg + burnDmg;
  }

  // ── Granite hammer: flat bonus on miss ─────────────────────────────
  if (spec.flatDmgBonus && spec.flatDmgBonus > 0) {
    const hitDmg = (specMax / 2) * specAcc;
    const missDmg = spec.flatDmgBonus * (1 - specAcc);
    return hits * hitDmg + missDmg;
  }

  // ── Standard multi-hit ─────────────────────────────────────────────
  if (hits > 1) {
    return hits * (specMax / 2) * specAcc;
  }

  // ── Standard single-hit ────────────────────────────────────────────
  return (specMax / 2) * specAcc;
}

/**
 * Dragon Claws expected value — exact cascade formula.
 * Source: weirdgloop/osrs-dps-calc dists/claws.ts
 *
 * 4 cascading accuracy rolls. For roll i (0-3):
 *   low = floor(max * (4 - i) / 4)
 *   high = max + low - 1
 *   Total damage is uniform over [low, high], split into 4 hitsplats.
 *   P(exactly roll i succeeds) = (1-acc)^i * acc
 * All miss: 2/3 chance of 2 damage, 1/3 chance of 0.
 */
function clawsAvgDamage(acc: number, max: number): number {
  if (max <= 0) return 0;
  let avg = 0;

  // Roll 0: low=max, high=2*max-1. avg=(3*max-1)/2
  const p0 = acc;
  avg += p0 * (3 * max - 1) / 2;

  // Roll 1: low=floor(3*max/4), high=max+floor(3*max/4)-1. avg=(low+high)/2
  const low1 = Math.floor(3 * max / 4);
  const p1 = (1 - acc) * acc;
  avg += p1 * (low1 + max + low1 - 1) / 2;

  // Roll 2: low=floor(max/2), high=max+floor(max/2)-1. avg=(low+high)/2
  const low2 = Math.floor(max / 2);
  const p2 = (1 - acc) * (1 - acc) * acc;
  avg += p2 * (low2 + max + low2 - 1) / 2;

  // Roll 3: low=floor(max/4), high=max+floor(max/4)-1. avg=(low+high)/2
  const low3 = Math.floor(max / 4);
  const p3 = (1 - acc) * (1 - acc) * (1 - acc) * acc;
  avg += p3 * (low3 + max + low3 - 1) / 2;

  // All miss: 2/3 chance of [1,1,0,0]=2 damage, 1/3 chance of 0
  const pMiss = Math.pow(1 - acc, 4);
  avg += pMiss * (4 / 3);

  return avg;
}

/**
 * Burning Claws expected value — 3-hit cascade.
 * Source: weirdgloop/osrs-dps-calc dists/claws.ts
 *
 * 3 cascading accuracy rolls. For roll i (0-2):
 *   low = floor(max * (3 - i) / 4)
 *   high = max + low
 *   Total damage is uniform over [low, high].
 * All miss: 2/5 chance of 1, 2/5 chance of 2, 1/5 chance of 0.
 */
function burningClawsAvgDamage(acc: number, max: number): number {
  if (max <= 0) return 0;
  let avg = 0;

  // Roll 0: low=floor(3*max/4), high=max+floor(3*max/4). avg=(low+high)/2
  const low0 = Math.floor(3 * max / 4);
  const p0 = acc;
  avg += p0 * (low0 + max + low0) / 2;

  // Roll 1: low=floor(max/2), high=max+floor(max/2). avg=(low+high)/2
  const low1 = Math.floor(max / 2);
  const p1 = (1 - acc) * acc;
  avg += p1 * (low1 + max + low1) / 2;

  // Roll 2: low=floor(max/4), high=max+floor(max/4). avg=(low+high)/2
  const low2 = Math.floor(max / 4);
  const p2 = (1 - acc) * (1 - acc) * acc;
  avg += p2 * (low2 + max + low2) / 2;

  // All miss: 2/5 chance of 1 + 2/5 chance of 2 + 1/5 chance of 0
  const pMiss = Math.pow(1 - acc, 3);
  avg += pMiss * (2 / 5 * 1 + 2 / 5 * 2);

  return avg;
}
