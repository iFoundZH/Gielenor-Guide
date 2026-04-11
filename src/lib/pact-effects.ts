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
  bowEchoNeverMiss: boolean;
  crossbowEchoReprocChance: number;
  thrownMaxhitEchoes: number;
  rangedEchoCyclical: boolean;

  // Ranged weapon mods
  bowFastHits: boolean;
  crossbowSlowBigHits: boolean;
  crossbowMaxHit: boolean;
  crossbowDoubleRoll: boolean;
  thrownMeleeStrScale: boolean;
  thrownFlatAccuracy: number;
  buffedRangedPrayers: boolean;

  // Melee weapon mods
  lightWeaponDoubleHit: boolean;
  lightWeaponFaster: boolean;
  blindbagChance: number;
  multiHitStrIncrease: boolean;
  meleePrayerStrBonus: boolean;
  meleeDistanceDamagePercent: number;
  twohMeleeEchos: boolean;

  // Magic speed
  magicSpellSpeedReduction: number;
  poweredStaffSpeedReduction: number;

  // Elemental spell effects
  airSpellDamagePerPrayer: number;
  waterSpellDamageHighHp: boolean;
  earthScaleDefenceStat: number;
  smokeCountsAsAir: boolean;
  iceCountsAsWater: boolean;
  bloodCountsAsFire: boolean;
  shadowCountsAsEarth: boolean;

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
  bowEchoNeverMiss: false,
  crossbowEchoReprocChance: 0,
  thrownMaxhitEchoes: 0,
  rangedEchoCyclical: false,
  bowFastHits: false,
  crossbowSlowBigHits: false,
  crossbowMaxHit: false,
  crossbowDoubleRoll: false,
  thrownMeleeStrScale: false,
  thrownFlatAccuracy: 0,
  buffedRangedPrayers: false,
  lightWeaponDoubleHit: false,
  lightWeaponFaster: false,
  blindbagChance: 0,
  multiHitStrIncrease: false,
  meleePrayerStrBonus: false,
  meleeDistanceDamagePercent: 0,
  twohMeleeEchos: false,
  magicSpellSpeedReduction: 0,
  poweredStaffSpeedReduction: 0,
  airSpellDamagePerPrayer: 0,
  waterSpellDamageHighHp: false,
  earthScaleDefenceStat: 0,
  smokeCountsAsAir: false,
  iceCountsAsWater: false,
  bloodCountsAsFire: false,
  shadowCountsAsEarth: false,
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
      if (eff.unsupported) continue;

      switch (eff.type) {
        case "talent_all_style_accuracy":
          pe.allStyleAccuracyPercent += eff.value as number;
          break;
        case "talent_percentage_ranged_damage":
          pe.rangedDamagePercent += eff.value as number;
          break;
        case "talent_percentage_melee_damage":
          pe.meleeDamagePercent += eff.value as number;
          break;
        case "talent_percentage_magic_damage":
          pe.magicDamagePercent += eff.value as number;
          break;
        case "talent_regen_ammo":
          pe.regenAmmoChance += eff.value as number;
          break;
        case "talent_ranged_regen_echo_chance":
          pe.rangedRegenEchoChance += eff.value as number;
          break;
        case "talent_bow_always_pass_accuracy":
          pe.bowEchoNeverMiss = true;
          break;
        case "talent_crossbow_echo_reproc_chance":
          pe.crossbowEchoReprocChance += eff.value as number;
          break;
        case "talent_thrown_maxhit_echoes":
          pe.thrownMaxhitEchoes += eff.value as number;
          break;
        case "talent_ranged_echo_cyclical":
          pe.rangedEchoCyclical = true;
          break;
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
        case "talent_magic_attack_speed_traditional":
          pe.magicSpellSpeedReduction += eff.value as number;
          break;
        case "talent_magic_attack_speed_powered":
          pe.poweredStaffSpeedReduction += eff.value as number;
          break;
        case "talent_air_spell_damage_active_prayers":
          pe.airSpellDamagePerPrayer += eff.value as number;
          break;
        case "talent_water_spell_damage_high_hp":
          pe.waterSpellDamageHighHp = true;
          break;
        case "talent_earth_scale_defence_stat":
          pe.earthScaleDefenceStat += eff.value as number;
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
