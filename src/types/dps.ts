/* ── Equipment Slots ─────────────────────────────────────────────────── */

export type EquipmentSlot =
  | "head"
  | "cape"
  | "neck"
  | "ammo"
  | "weapon"
  | "body"
  | "shield"
  | "legs"
  | "hands"
  | "feet"
  | "ring";

/* ── Combat & Attack Typing ──────────────────────────────────────────── */

export type CombatStyle = "melee" | "ranged" | "magic";

export type AttackType = "stab" | "slash" | "crush" | "ranged" | "magic";

export type SpellElement = "air" | "water" | "fire" | "earth" | "smoke" | "ice" | "blood" | "shadow" | "none";

export type AmmoCategory = "arrow" | "bolt" | "dart" | "javelin" | "blessing" | "other";

export type WeaponCategory =
  | "bow"
  | "crossbow"
  | "thrown"
  | "powered-staff"
  | "2h-melee"
  | "1h-light"
  | "1h-heavy"
  | "halberd"
  | "standard"
  | "staff"
  | "scythe"
  | "blowpipe";

/* ── Equipment Bonuses ───────────────────────────────────────────────── */

export interface EquipmentBonuses {
  astab: number;
  aslash: number;
  acrush: number;
  aranged: number;
  amagic: number;
  dstab: number;
  dslash: number;
  dcrush: number;
  dranged: number;
  dmagic: number;
  mstr: number;
  rstr: number;
  mdmg: number;
  prayer: number;
}

/* ── Items ────────────────────────────────────────────────────────────── */

export interface Item {
  id: string;
  name: string;
  slot: EquipmentSlot;
  bonuses: EquipmentBonuses;
  region?: string;
  isTwoHanded?: boolean;
  weaponCategory?: WeaponCategory;
  attackSpeed?: number;
  combatStyle?: CombatStyle;
  attackType?: AttackType;
  passive?: string;
}

/* ── Pacts (Skill Tree) ────────────────────────────────────────────────── */

export const PACT_POINT_LIMIT = 40;

export type PactNodeSize = "node_minor" | "node_major" | "node_capstone";

export type PactBranch = "melee" | "ranged" | "magic" | null;

export type PactEffectType =
  | "talent_regen_ammo"
  | "talent_all_style_accuracy"
  | "talent_defence_boost"
  | "talent_percentage_ranged_damage"
  | "talent_percentage_melee_damage"
  | "talent_percentage_magic_damage"
  | "talent_ranged_regen_echo_chance"
  | "talent_bow_always_pass_accuracy"
  | "talent_crossbow_echo_reproc_chance"
  | "talent_thrown_maxhit_echoes"
  | "talent_ranged_echo_cyclical"
  | "talent_bow_fast_hits"
  | "talent_crossbow_slow_big_hits"
  | "talent_thrown_weapon_melee_str_scale"
  | "talent_buffed_ranged_prayers"
  | "talent_ranged_strength_hp_difference"
  | "talent_bow_min_hit_stacking_increase"
  | "talent_bow_max_hit_stacking_increase"
  | "talent_crossbow_max_hit"
  | "talent_crossbow_double_accuracy_roll"
  | "talent_thrown_weapon_accuracy"
  | "talent_thrown_weapon_multi"
  | "talent_distance_melee_minhit"
  | "talent_melee_range_multiplier"
  | "talent_light_weapon_doublehit"
  | "talent_free_random_weapon_attack_chance"
  | "talent_thorns_damage"
  | "talent_offhand_stat_boost"
  | "talent_multi_hit_str_increase"
  | "talent_light_weapon_faster"
  | "talent_melee_strength_prayer_bonus"
  | "talent_2h_melee_echos"
  | "talent_percentage_melee_maxhit_distance"
  | "talent_overheal_consumption_boost"
  | "talent_thorns_double_hit"
  | "talent_hit_restore_spec_energy"
  | "talent_unique_blindbag_damage"
  | "talent_unique_blindbag_chance"
  | "talent_melee_range_conditional_boost"
  | "talent_regen_magic_level_boost"
  | "talent_magic_attack_speed_traditional"
  | "talent_magic_attack_speed_powered"
  | "talent_air_spell_damage_active_prayers"
  | "talent_air_spell_max_hit_prayer_bonus"
  | "talent_water_spell_damage_high_hp"
  | "talent_water_spell_bouce_heal"
  | "talent_fire_hp_consume_for_damage"
  | "talent_fire_spell_burn_bounce"
  | "talent_earth_reduce_defence"
  | "talent_earth_scale_defence_stat"
  | "talent_smoke_counts_as_air"
  | "talent_ice_counts_as_water"
  | "talent_blood_counts_as_fire"
  | "talent_shadow_counts_as_earth"
  | "talent_firerune_regen_damage_boost"
  | "talent_regen_stave_charges_air"
  | "talent_regen_stave_charges_water"
  | "talent_regen_stave_charges_fire"
  | "talent_regen_stave_charges_earth"
  | "talent_max_accuracy_roll_from_range"
  | "talent_overhealing_via_talents"
  | "talent_max_hit_style_swap"
  | "talent_shield_reflect"
  | "talent_spec_for_free"
  | "talent_restore_sa_energy_from_distance"
  | "talent_prayer_pen_all"
  | "talent_prayer_restore_no_overhead"
  | "talent_shield_block_heal"
  | "talent_defence_recoil_scaling"
  | "talent_melee_distance_healing_chance"
  | "talent_airrune_regen_prayer_restore"
  | "talent_waterrune_regen_healing"
  | "talent_earthrune_regen_defence_boost";

export interface PactEffect {
  type: PactEffectType;
  value: number | boolean;
}

export interface PactNode {
  id: string;
  name: string;
  description: string;
  branch: PactBranch;
  size: PactNodeSize;
  effects: PactEffect[];
  linkedNodes: string[];
  position: { x: number; y: number };
}

/* ── Boss Presets ─────────────────────────────────────────────────────── */

export interface BossPreset {
  id: string;
  name: string;
  defenceLevel: number;
  dstab: number;
  dslash: number;
  dcrush: number;
  dranged: number;
  dranged_light: number;    // vs thrown, blowpipe
  dranged_standard: number; // vs bows (twisted bow, bowfa)
  dranged_heavy: number;    // vs crossbows, chinchompas
  dmagic: number;
  magicLevel: number;
  region?: string;
  hp: number;
  size?: number;
  attackSpeed?: number;     // boss attack interval in game ticks (from wiki)
  elementalWeakness?: string;
  elementalWeaknessPercent?: number;
  isDragon?: boolean;
  isDemon?: boolean;
  isUndead?: boolean;
  isKalphite?: boolean;
  isSlayerMonster?: boolean; // eligible for slayer helm bonus on-task
  damageModifier?: {
    type: "corp" | "tekton-magic" | "kraken-ranged" | "zulrah-cap";
  };
  requiresSlayerTask?: boolean;
  typicalDistance?: number;
}

/* ── Player Config ───────────────────────────────────────────────────── */

export type PotionType =
  | "auto"
  | "none"
  | "super-attack"
  | "super-strength"
  | "super-combat"
  | "ranging"
  | "magic"
  | "overload"
  | "smelling-salts";

export type PrayerType =
  | "auto"
  | "none"
  | "piety"
  | "chivalry"
  | "ultimate-strength"
  | "superhuman-strength"
  | "burst-of-strength"
  | "rigour"
  | "eagle-eye"
  | "hawk-eye"
  | "sharp-eye"
  | "augury"
  | "mystic-might"
  | "mystic-lore"
  | "mystic-will";

export type AttackStyleBonus = "auto" | "accurate" | "aggressive" | "controlled" | "defensive" | "rapid" | "longrange" | "autocast";

export interface PlayerConfig {
  attack: number;
  strength: number;
  defence: number;
  ranged: number;
  magic: number;
  prayer: number;
  hitpoints: number;
  potion: PotionType;
  prayerType: PrayerType;
  attackStyle: AttackStyleBonus;
  combatStyle: CombatStyle;
  regions: string[];
  activePacts: string[];
  voidSet: "auto" | "none" | "void" | "elite-void";
  onSlayerTask: boolean | "auto";
  targetDistance?: number;
  spellMaxHit?: number;
  currentHitpoints?: number;
  activePrayerCount?: number;
  spellElement?: SpellElement;
  uniqueHeavyWeapons?: number;
  hasOverheal?: boolean;
  soulreaperStacks?: number;
  kandarinDiary?: boolean;
  usingSpecialAttack?: boolean;
}

/* ── Build Loadout ───────────────────────────────────────────────────── */

export interface BuildLoadout {
  head: Item | null;
  cape: Item | null;
  neck: Item | null;
  ammo: Item | null;
  weapon: Item | null;
  body: Item | null;
  shield: Item | null;
  legs: Item | null;
  hands: Item | null;
  feet: Item | null;
  ring: Item | null;
}

/* ── DPS Context (engine input) ──────────────────────────────────────── */

export interface DpsContext {
  player: PlayerConfig;
  loadout: BuildLoadout;
  target: BossPreset;
  pactEffects?: import("@/lib/pact-effects").AggregatedPactEffects;
  _fangAtkRoll?: number;
  _fangDefRoll?: number;
}

/* ── DPS Result (engine output) ──────────────────────────────────────── */

export interface MultiplierStep {
  name: string;
  factor: number;
}

export interface DpsBreakdown {
  effectiveLevel: number;
  equipmentStrength: number;
  baseMaxHit: number;
  multiplierChain: MultiplierStep[];
  finalMaxHit: number;
  attackRoll: number;
  defenceRoll: number;
  baseAccuracy: number;
  finalAccuracy: number;
  attackSpeed: number;
  baseDps: number;
  echoDps: number;
  bonusDps: number;
  thornsDps: number;
  minHit: number;
  sustainInfo: string[];
  specInfo?: {
    name: string;
    energyCost: number;
    specDpsPerAttack: number;
    normalDps: number;
    specsPerCycle: number;
    cycleTimeSec: number;
    normalAttacksPerCycle: number;
    specMaxHit: number;
    specAccuracy: number;
  };
}

export interface DpsResult {
  dps: number;
  maxHit: number;
  accuracy: number;
  speed: number;
  echoDps: number;
  breakdown: DpsBreakdown;
}

/* ── Gear Optimizer ──────────────────────────────────────────────────── */

export interface OptimizedConfig {
  potion?: PotionType;
  prayerType?: PrayerType;
  attackStyle?: AttackStyleBonus;
  voidSet?: "none" | "void" | "elite-void";
  activePacts?: string[];
  spellMaxHit?: number;
  spellElement?: SpellElement;
  activePrayerCount?: number;
  regions?: string[];
  onSlayerTask?: boolean;
  usingSpecialAttack?: boolean;
}

export interface OptimizerConfig {
  player: PlayerConfig;
  target: BossPreset;
  lockedSlots: Partial<BuildLoadout>;
  topN: number;
}

export interface OptimizerResult {
  loadout: BuildLoadout;
  result: DpsResult;
  optimizedConfig?: OptimizedConfig;
  combinationsEvaluated?: number;
}

/* ── Saved Builds ────────────────────────────────────────────────────── */

export interface SavedBuild {
  id: string;
  name: string;
  createdAt: number;
  player: PlayerConfig;
  loadout: { [slot in EquipmentSlot]: string | null };
  targetId?: string;
}
