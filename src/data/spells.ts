/**
 * Spell data — single source of truth for all spell max hits.
 *
 * Max hits sourced from weirdgloop/osrs-dps-calc spells.json:
 * https://github.com/weirdgloop/osrs-dps-calc/blob/main/cdn/json/spells.json
 */
import type { SpellElement } from "@/types/dps";

export interface SpellData {
  name: string;
  spellMaxHit: number;
  spellElement: SpellElement;
  spellbook: "standard" | "ancient";
}

/**
 * Ancient spells (highest-tier barrages only — these are what matter for DPS).
 * Max hits from weirdgloop spells.json.
 */
export const ANCIENT_SPELLS: SpellData[] = [
  { name: "Ice Barrage", spellMaxHit: 30, spellElement: "ice", spellbook: "ancient" },
  { name: "Blood Barrage", spellMaxHit: 29, spellElement: "blood", spellbook: "ancient" },
  { name: "Shadow Barrage", spellMaxHit: 28, spellElement: "shadow", spellbook: "ancient" },
  { name: "Smoke Barrage", spellMaxHit: 27, spellElement: "smoke", spellbook: "ancient" },
];

/**
 * Standard spells (surge tier only — highest DPS options).
 * Max hits from weirdgloop spells.json (base max hit per spell, NOT the
 * "all surges unlocked" scaled value of 24).
 */
export const STANDARD_SPELLS: SpellData[] = [
  { name: "Fire Surge", spellMaxHit: 24, spellElement: "fire", spellbook: "standard" },
  { name: "Earth Surge", spellMaxHit: 23, spellElement: "earth", spellbook: "standard" },
  { name: "Water Surge", spellMaxHit: 22, spellElement: "water", spellbook: "standard" },
  { name: "Wind Surge", spellMaxHit: 21, spellElement: "air", spellbook: "standard" },
];

/**
 * Additional standard spells for the UI (lower tiers users might pick manually).
 */
export const EXTRA_STANDARD_SPELLS: SpellData[] = [
  { name: "Ice Burst", spellMaxHit: 22, spellElement: "ice", spellbook: "ancient" },
  { name: "Fire Wave", spellMaxHit: 20, spellElement: "fire", spellbook: "standard" },
  { name: "Fire Blast", spellMaxHit: 16, spellElement: "fire", spellbook: "standard" },
];

/** All spells for the UI spell picker (sorted by max hit descending). */
export const ALL_SPELLS: SpellData[] = [
  ...ANCIENT_SPELLS,
  ...STANDARD_SPELLS,
  ...EXTRA_STANDARD_SPELLS,
].sort((a, b) => b.spellMaxHit - a.spellMaxHit);
