import { getNode } from "@/data/pacts";

// ═══════════════════════════════════════════════════════════════════════
// AGGREGATED PACT EFFECTS
// Iterates all selected pact nodes once, sums/collects all effects
// into a flat object for fast reads in the DPS engine.
// ═══════════════════════════════════════════════════════════════════════

export interface AggregatedPactEffects {
  // Accuracy (sum of all +X% accuracy nodes)
  allStyleAccuracyPercent: number;

  // Style damage % (sum of +1% nodes per style)
  rangedDamagePercent: number;
  meleeDamagePercent: number;
  magicDamagePercent: number;

  // Regen
  regenAmmoChance: number;

  // Ranged echo system
  rangedRegenEchoChance: number;
  crossbowEchoReprocChance: number;
  rangedEchoCyclical: boolean;

  // Ranged weapon mods
  bowFastHits: boolean;
  crossbowSlowBigHits: boolean;
  crossbowMaxHit: boolean;
  crossbowDoubleRoll: boolean;
  thrownMeleeStrScale: boolean;
  thrownFlatAccuracy: number;
  buffedRangedPrayers: boolean;

  // NEW ranged
  bowAlwaysPassAccuracy: boolean;
  thrownMaxhitEchoes: number;
  rangedStrengthHpDifference: boolean;
  bowMinHitStackingIncrease: boolean;
  bowMaxHitStackingIncrease: boolean;
  thrownWeaponMulti: boolean;

  // Melee weapon mods
  lightWeaponDoubleHit: boolean;
  lightWeaponFaster: boolean;
  blindbagChance: number;
  multiHitStrIncrease: boolean;
  meleePrayerStrBonus: boolean;
  meleeDistanceDamagePercent: number;
  twohMeleeEchos: boolean;

  // NEW melee
  distanceMeleeMinHit: number;
  meleeRangeMultiplier: number;
  meleeRangeConditionalBoost: boolean;
  overhealConsumptionBoost: boolean;
  uniqueBlindBagChance: boolean;
  uniqueBlindBagDamage: number;

  // Magic speed
  magicSpellSpeedReduction: number;
  poweredStaffSpeedReduction: number;

  // Elemental spell effects
  airSpellDamagePerPrayer: number;
  waterSpellDamageHighHp: boolean;
  earthScaleDefenceStat: number;

  // NEW magic
  fireHpConsumeForDamage: boolean;
  earthReduceDefence: boolean;
  smokeCountsAsAir: boolean;
  iceCountsAsWater: boolean;
  bloodCountsAsFire: boolean;
  shadowCountsAsEarth: boolean;
  airSpellMaxHitPrayerBonus: number;
  fireRuneRegenDamageBoost: number;
  regenMagicLevelBoost: number;

  // Defensive/counter-DPS
  thornsDamage: number;
  thornsDoubleHit: boolean;
  defenceRecoilScaling: boolean;
  shieldReflect: boolean;
  shieldBlockHeal: boolean;

  // Utility/sustain (informational)
  prayerPenAll: number;
  prayerRestoreNoOverhead: boolean;
  specForFree: number;
  restoreSaEnergyFromDistance: boolean;
  hitRestoreSpecEnergy: number;
  meleeDistanceHealingChance: number;
  overhealingViaTalents: number;
  maxHitStyleSwap: boolean;
  airRuneRegenPrayerRestore: number;
  waterRuneRegenHealing: number;
  earthRuneRegenDefenceBoost: number;
  regenStaveChargesAir: boolean;
  regenStaveChargesWater: boolean;
  regenStaveChargesFire: boolean;
  regenStaveChargesEarth: boolean;
  waterSpellBounceHeal: boolean;
  fireSpellBurnBounce: boolean;

  // General
  offhandStatBoost: boolean;
  maxAccuracyRollFromRange: boolean;
  defenceBoost: number;
}

const EMPTY: AggregatedPactEffects = {
  allStyleAccuracyPercent: 0,
  rangedDamagePercent: 0,
  meleeDamagePercent: 0,
  magicDamagePercent: 0,
  regenAmmoChance: 0,
  rangedRegenEchoChance: 0,
  crossbowEchoReprocChance: 0,
  rangedEchoCyclical: false,
  bowFastHits: false,
  crossbowSlowBigHits: false,
  crossbowMaxHit: false,
  crossbowDoubleRoll: false,
  thrownMeleeStrScale: false,
  thrownFlatAccuracy: 0,
  buffedRangedPrayers: false,
  bowAlwaysPassAccuracy: false,
  thrownMaxhitEchoes: 0,
  rangedStrengthHpDifference: false,
  bowMinHitStackingIncrease: false,
  bowMaxHitStackingIncrease: false,
  thrownWeaponMulti: false,
  lightWeaponDoubleHit: false,
  lightWeaponFaster: false,
  blindbagChance: 0,
  multiHitStrIncrease: false,
  meleePrayerStrBonus: false,
  meleeDistanceDamagePercent: 0,
  twohMeleeEchos: false,
  distanceMeleeMinHit: 0,
  meleeRangeMultiplier: 0,
  meleeRangeConditionalBoost: false,
  overhealConsumptionBoost: false,
  uniqueBlindBagChance: false,
  uniqueBlindBagDamage: 0,
  magicSpellSpeedReduction: 0,
  poweredStaffSpeedReduction: 0,
  airSpellDamagePerPrayer: 0,
  waterSpellDamageHighHp: false,
  earthScaleDefenceStat: 0,
  fireHpConsumeForDamage: false,
  earthReduceDefence: false,
  smokeCountsAsAir: false,
  iceCountsAsWater: false,
  bloodCountsAsFire: false,
  shadowCountsAsEarth: false,
  airSpellMaxHitPrayerBonus: 0,
  fireRuneRegenDamageBoost: 0,
  regenMagicLevelBoost: 0,
  thornsDamage: 0,
  thornsDoubleHit: false,
  defenceRecoilScaling: false,
  shieldReflect: false,
  shieldBlockHeal: false,
  prayerPenAll: 0,
  prayerRestoreNoOverhead: false,
  specForFree: 0,
  restoreSaEnergyFromDistance: false,
  hitRestoreSpecEnergy: 0,
  meleeDistanceHealingChance: 0,
  overhealingViaTalents: 0,
  maxHitStyleSwap: false,
  airRuneRegenPrayerRestore: 0,
  waterRuneRegenHealing: 0,
  earthRuneRegenDefenceBoost: 0,
  regenStaveChargesAir: false,
  regenStaveChargesWater: false,
  regenStaveChargesFire: false,
  regenStaveChargesEarth: false,
  waterSpellBounceHeal: false,
  fireSpellBurnBounce: false,
  offhandStatBoost: false,
  maxAccuracyRollFromRange: false,
  defenceBoost: 0,
};

export function aggregatePactEffects(nodeIds: string[]): AggregatedPactEffects {
  if (nodeIds.length === 0) return { ...EMPTY };

  const pe = { ...EMPTY };

  for (const nodeId of nodeIds) {
    const node = getNode(nodeId);
    if (!node) continue;

    for (const eff of node.effects) {
      switch (eff.type) {
        // ── Accuracy ──
        case "talent_all_style_accuracy":
          pe.allStyleAccuracyPercent += eff.value as number;
          break;

        // ── Style damage % ──
        case "talent_percentage_ranged_damage":
          pe.rangedDamagePercent += eff.value as number;
          break;
        case "talent_percentage_melee_damage":
          pe.meleeDamagePercent += eff.value as number;
          break;
        case "talent_percentage_magic_damage":
          pe.magicDamagePercent += eff.value as number;
          break;

        // ── Regen ──
        case "talent_regen_ammo":
          pe.regenAmmoChance += eff.value as number;
          break;

        // ── Ranged echo system ──
        case "talent_ranged_regen_echo_chance":
          pe.rangedRegenEchoChance += eff.value as number;
          break;
        case "talent_crossbow_echo_reproc_chance":
          pe.crossbowEchoReprocChance += eff.value as number;
          break;
        case "talent_ranged_echo_cyclical":
          pe.rangedEchoCyclical = true;
          break;

        // ── Ranged weapon mods ──
        case "talent_bow_fast_hits":
          pe.bowFastHits = true;
          break;
        case "talent_crossbow_slow_big_hits":
          pe.crossbowSlowBigHits = true;
          break;
        case "talent_crossbow_max_hit":
          pe.crossbowMaxHit = true;
          break;
        case "talent_crossbow_double_accuracy_roll":
          pe.crossbowDoubleRoll = true;
          break;
        case "talent_thrown_weapon_melee_str_scale":
          pe.thrownMeleeStrScale = true;
          break;
        case "talent_thrown_weapon_accuracy":
          pe.thrownFlatAccuracy += eff.value as number;
          break;
        case "talent_buffed_ranged_prayers":
          pe.buffedRangedPrayers = true;
          break;
        case "talent_bow_always_pass_accuracy":
          pe.bowAlwaysPassAccuracy = true;
          break;
        case "talent_thrown_maxhit_echoes":
          pe.thrownMaxhitEchoes += eff.value as number;
          break;
        case "talent_ranged_strength_hp_difference":
          pe.rangedStrengthHpDifference = true;
          break;
        case "talent_bow_min_hit_stacking_increase":
          pe.bowMinHitStackingIncrease = true;
          break;
        case "talent_bow_max_hit_stacking_increase":
          pe.bowMaxHitStackingIncrease = true;
          break;
        case "talent_thrown_weapon_multi":
          pe.thrownWeaponMulti = true;
          break;

        // ── Melee weapon mods ──
        case "talent_light_weapon_doublehit":
          pe.lightWeaponDoubleHit = true;
          break;
        case "talent_light_weapon_faster":
          pe.lightWeaponFaster = true;
          break;
        case "talent_free_random_weapon_attack_chance":
          pe.blindbagChance += eff.value as number;
          break;
        case "talent_multi_hit_str_increase":
          pe.multiHitStrIncrease = true;
          break;
        case "talent_melee_strength_prayer_bonus":
          pe.meleePrayerStrBonus = true;
          break;
        case "talent_percentage_melee_maxhit_distance":
          pe.meleeDistanceDamagePercent += eff.value as number;
          break;
        case "talent_2h_melee_echos":
          pe.twohMeleeEchos = true;
          break;
        case "talent_distance_melee_minhit":
          pe.distanceMeleeMinHit += eff.value as number;
          break;
        case "talent_melee_range_multiplier":
          pe.meleeRangeMultiplier += eff.value as number;
          break;
        case "talent_melee_range_conditional_boost":
          pe.meleeRangeConditionalBoost = true;
          break;
        case "talent_overheal_consumption_boost":
          pe.overhealConsumptionBoost = true;
          break;
        case "talent_unique_blindbag_chance":
          pe.uniqueBlindBagChance = true;
          break;
        case "talent_unique_blindbag_damage":
          pe.uniqueBlindBagDamage += eff.value as number;
          break;

        // ── Magic speed ──
        case "talent_magic_attack_speed_traditional":
          pe.magicSpellSpeedReduction += eff.value as number;
          break;
        case "talent_magic_attack_speed_powered":
          pe.poweredStaffSpeedReduction += eff.value as number;
          break;

        // ── Elemental spell effects ──
        case "talent_air_spell_damage_active_prayers":
          pe.airSpellDamagePerPrayer += eff.value as number;
          break;
        case "talent_water_spell_damage_high_hp":
          pe.waterSpellDamageHighHp = true;
          break;
        case "talent_earth_scale_defence_stat":
          pe.earthScaleDefenceStat += eff.value as number;
          break;
        case "talent_fire_hp_consume_for_damage":
          pe.fireHpConsumeForDamage = true;
          break;
        case "talent_earth_reduce_defence":
          pe.earthReduceDefence = true;
          break;
        case "talent_smoke_counts_as_air":
          pe.smokeCountsAsAir = true;
          break;
        case "talent_ice_counts_as_water":
          pe.iceCountsAsWater = true;
          break;
        case "talent_blood_counts_as_fire":
          pe.bloodCountsAsFire = true;
          break;
        case "talent_shadow_counts_as_earth":
          pe.shadowCountsAsEarth = true;
          break;
        case "talent_air_spell_max_hit_prayer_bonus":
          pe.airSpellMaxHitPrayerBonus += eff.value as number;
          break;
        case "talent_firerune_regen_damage_boost":
          pe.fireRuneRegenDamageBoost += eff.value as number;
          break;
        case "talent_regen_magic_level_boost":
          pe.regenMagicLevelBoost += eff.value as number;
          break;

        // ── Defensive / counter-DPS ──
        case "talent_thorns_damage":
          pe.thornsDamage += eff.value as number;
          break;
        case "talent_thorns_double_hit":
          pe.thornsDoubleHit = true;
          break;
        case "talent_defence_recoil_scaling":
          pe.defenceRecoilScaling = true;
          break;
        case "talent_shield_reflect":
          pe.shieldReflect = true;
          break;
        case "talent_shield_block_heal":
          pe.shieldBlockHeal = true;
          break;

        // ── Utility / sustain ──
        case "talent_prayer_pen_all":
          pe.prayerPenAll += eff.value as number;
          break;
        case "talent_prayer_restore_no_overhead":
          pe.prayerRestoreNoOverhead = true;
          break;
        case "talent_spec_for_free":
          pe.specForFree += eff.value as number;
          break;
        case "talent_restore_sa_energy_from_distance":
          pe.restoreSaEnergyFromDistance = true;
          break;
        case "talent_hit_restore_spec_energy":
          pe.hitRestoreSpecEnergy += eff.value as number;
          break;
        case "talent_melee_distance_healing_chance":
          pe.meleeDistanceHealingChance += eff.value as number;
          break;
        case "talent_overhealing_via_talents":
          pe.overhealingViaTalents += eff.value as number;
          break;
        case "talent_max_hit_style_swap":
          pe.maxHitStyleSwap = true;
          break;
        case "talent_airrune_regen_prayer_restore":
          pe.airRuneRegenPrayerRestore += eff.value as number;
          break;
        case "talent_waterrune_regen_healing":
          pe.waterRuneRegenHealing += eff.value as number;
          break;
        case "talent_earthrune_regen_defence_boost":
          pe.earthRuneRegenDefenceBoost += eff.value as number;
          break;
        case "talent_regen_stave_charges_air":
          pe.regenStaveChargesAir = true;
          break;
        case "talent_regen_stave_charges_water":
          pe.regenStaveChargesWater = true;
          break;
        case "talent_regen_stave_charges_fire":
          pe.regenStaveChargesFire = true;
          break;
        case "talent_regen_stave_charges_earth":
          pe.regenStaveChargesEarth = true;
          break;
        case "talent_water_spell_bouce_heal":
          pe.waterSpellBounceHeal = true;
          break;
        case "talent_fire_spell_burn_bounce":
          pe.fireSpellBurnBounce = true;
          break;

        // ── General ──
        case "talent_offhand_stat_boost":
          pe.offhandStatBoost = true;
          break;
        case "talent_max_accuracy_roll_from_range":
          pe.maxAccuracyRollFromRange = true;
          break;
        case "talent_defence_boost":
          pe.defenceBoost += eff.value as number;
          break;
      }
    }
  }

  return pe;
}
