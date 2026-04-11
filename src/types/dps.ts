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
  astab: number;   // attack stab
  aslash: number;  // attack slash
  acrush: number;  // attack crush
  aranged: number; // attack ranged
  amagic: number;  // attack magic
  dstab: number;   // defence stab
  dslash: number;  // defence slash
  dcrush: number;  // defence crush
  dranged: number; // defence ranged
  dmagic: number;  // defence magic
  mstr: number;    // melee strength
  rstr: number;    // ranged strength
  mdmg: number;    // magic damage % (integer, e.g. 15 = 15%)
  prayer: number;  // prayer bonus
}

/* ── Items ────────────────────────────────────────────────────────────── */

export interface Item {
  id: string;
  name: string;
  slot: EquipmentSlot;
  bonuses: EquipmentBonuses;
  region?: string;          // region required to access (undefined = always available)
  isTwoHanded?: boolean;    // true → blocks shield slot
  weaponCategory?: WeaponCategory;
  attackSpeed?: number;     // ticks between attacks (e.g. 4 = 2.4s)
  combatStyle?: CombatStyle;
  attackType?: AttackType;  // primary attack type for this weapon
  passive?: string;         // human-readable passive effect description
}

/* ── Pacts ────────────────────────────────────────────────────────────── */

export type PactModifierType =
  | "accuracy-percent"       // flat accuracy % boost
  | "damage-percent"         // multiplicative damage modifier
  | "speed-ticks"            // attack speed change in ticks
  | "max-hit-flat"           // flat max hit addition
  | "strength-percent"       // % of stat added as strength
  | "echo-percent"           // echo cascade damage modifier
  | "echo-never-miss"        // echo attacks have 100% accuracy
  | "always-max"             // always hit max
  | "double-roll"            // double accuracy roll
  | "bonus-hit-percent"      // extra hit at % of max
  | "blindbag-percent"       // % chance of bonus damage
  | "min-hit-per-tile"       // minimum hit based on distance
  | "flat-dps"               // flat DPS addition (Flask)
  | "custom";                // complex modifier handled in engine

export interface PactModifier {
  type: PactModifierType;
  value: number;
  condition?: string;       // e.g. "crossbow", "light-melee", "halberd", "bow", "powered-staff", "spell"
}

export interface PactNode {
  id: string;
  name: string;
  description: string;
  category: string;
  dpsRelevant: boolean;
  modifiers: PactModifier[];
  prerequisites?: string[]; // IDs of prerequisite pacts
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
  dmagic: number;
  magicLevel: number;   // used for magic defence roll
  region?: string;
  hp: number;
  elementalWeakness?: AttackType;
  elementalWeaknessPercent?: number;
  isDragon?: boolean;
  isDemon?: boolean;
  isUndead?: boolean;
  isKalphite?: boolean;
}

/* ── Player Config ───────────────────────────────────────────────────── */

export type PotionType =
  | "none"
  | "super-attack"
  | "super-strength"
  | "super-combat"
  | "ranging"
  | "magic"
  | "overload"
  | "smelling-salts";

export type PrayerType =
  | "none"
  // melee
  | "piety"
  | "chivalry"
  | "ultimate-strength"
  | "superhuman-strength"
  | "burst-of-strength"
  // ranged
  | "rigour"
  | "eagle-eye"
  | "hawk-eye"
  | "sharp-eye"
  // magic
  | "augury"
  | "mystic-might"
  | "mystic-lore"
  | "mystic-will";

export type AttackStyleBonus = "accurate" | "aggressive" | "controlled" | "defensive" | "rapid" | "longrange" | "autocast";

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
  regions: string[];         // unlocked region IDs
  activePacts: string[];     // active pact IDs
  voidSet: "none" | "void" | "elite-void";
  onSlayerTask: boolean;
  targetDistance?: number;    // tiles from target (for halberd/tbow pacts)
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
  bonusDps: number;     // from passives like D2, D3, Flask
}

export interface DpsResult {
  dps: number;          // total DPS including all modifiers
  maxHit: number;
  accuracy: number;
  speed: number;        // ticks
  echoDps: number;
  breakdown: DpsBreakdown;
}

/* ── Gear Optimizer ──────────────────────────────────────────────────── */

export interface OptimizerConfig {
  player: PlayerConfig;
  target: BossPreset;
  lockedSlots: Partial<BuildLoadout>;  // slots the user has forced
  topN: number;                         // how many results to return
}

export interface OptimizerResult {
  loadout: BuildLoadout;
  result: DpsResult;
}

/* ── Saved Builds ────────────────────────────────────────────────────── */

export interface SavedBuild {
  id: string;
  name: string;
  createdAt: number;
  player: PlayerConfig;
  loadout: { [slot in EquipmentSlot]: string | null }; // item IDs
  targetId?: string;
}
