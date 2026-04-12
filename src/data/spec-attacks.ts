/**
 * Special Attack Data Dictionary
 *
 * Declarative spec attack data for 35+ weapons.
 * Source: weirdgloop/osrs-dps-calc PlayerVsNPCCalc.ts + Equipment.ts (Apr 2026)
 *
 * The DPS engine reads this data to compute blended DPS (spec attacks on cooldown
 * + normal attacks while recharging).
 */

export interface SpecAttack {
  name: string;           // Display name (e.g. "Armadyl Godsword")
  energyCost: number;     // 25-100
  accMultiplier?: number; // Multiplier to attack roll (2.0 = doubled)
  dmgMultiplier?: number; // Multiplier to max hit (1.375 = AGS)
  hits?: number;          // Number of hits per spec (default 1)
  perHitMaxFraction?: number;    // Each hit at X% of max (webweaver: 0.4)
  flatDmgBonus?: number;         // Flat damage added even on miss (granite hammer: +5)
  guaranteedHit?: boolean;       // Always hits (voidwaker, magic longbow)
  useMagicDefence?: boolean;     // Roll vs magic defence (voidwaker)
  minHitFraction?: number;       // Min damage as fraction of max (voidwaker: 0.5)
  maxHitBonusFraction?: number;  // Max hit becomes X% higher (voidwaker: 0.5 → 150%)
  speedOverride?: number;        // Override attack speed for spec (eye of ayak: 5)
  targetSizeMultiHit?: boolean;  // 2 hits if target size > 1 (halberds)
  secondHitAccFraction?: number; // 2nd hit accuracy fraction (halberds: 0.75)
  cascadeType?: "dragon-claws" | "burning-claws"; // Dedicated cascade calc
  customMaxHit?: (magicLevel: number) => number;  // Custom max hit formula
  burnDpt?: number;              // Extra burn damage per tick (arkan blade: 10)
  magicBonusHit?: [number, number]; // [min, max] bonus magic hit (sara sword)
  darkBowMinHit?: number;        // Min per arrow (8 dragon, 5 other)
  darkBowCap?: number;           // Cap per arrow (48)
  secondHitGuaranteedOnAccurate?: boolean; // 2nd hit guaranteed if 1st hits (abyssal dagger)
  soulreaperSpecDmg?: boolean;             // Soulreaper: (100+6*stacks)/100 dmg multiplier during spec
  zcbGuaranteedBoltProc?: boolean;         // ZCB: bolt spec guaranteed during spec
}

export const SPEC_ATTACKS: Record<string, SpecAttack> = {
  // ═══════════════════════════════════════════════════════════════════════
  // MELEE — Godswords
  // ═══════════════════════════════════════════════════════════════════════
  "ags": {
    name: "Armadyl Godsword",
    energyCost: 50,
    accMultiplier: 2.0,
    dmgMultiplier: 5 / 4, // 1.25 — post-Equipment Rebalance (was 1.375)
  },
  "bgs": {
    name: "Bandos Godsword",
    energyCost: 50,
    accMultiplier: 2.0,
    dmgMultiplier: 11 / 10, // 1.10 — post-Equipment Rebalance (was 1.21)
  },
  "sgs": {
    name: "Saradomin Godsword",
    energyCost: 50,
    accMultiplier: 2.0,
    dmgMultiplier: 1.1,
  },
  "zgs": {
    name: "Zamorak Godsword",
    energyCost: 50,
    accMultiplier: 2.0,
    dmgMultiplier: 1.1,
  },

  // ═══════════════════════════════════════════════════════════════════════
  // MELEE — Dragon weapons
  // ═══════════════════════════════════════════════════════════════════════
  "dwh": {
    name: "Dragon Warhammer",
    energyCost: 50,
    dmgMultiplier: 1.5,
  },
  "dclaws": {
    name: "Dragon Claws",
    energyCost: 50,
    hits: 4,
    cascadeType: "dragon-claws",
  },
  "dds": {
    name: "Dragon Dagger",
    energyCost: 25,
    accMultiplier: 1.15,
    dmgMultiplier: 1.15,
    hits: 2,
  },
  "d-sword": {
    name: "Dragon Sword",
    energyCost: 40,
    accMultiplier: 1.25,
    dmgMultiplier: 1.25,
  },
  "d-mace": {
    name: "Dragon Mace",
    energyCost: 25,
    accMultiplier: 1.25,
    dmgMultiplier: 1.5,
  },
  "d-long": {
    name: "Dragon Longsword",
    energyCost: 25,
    dmgMultiplier: 1.25,
  },
  "d-scim": {
    name: "Dragon Scimitar",
    energyCost: 55,
    accMultiplier: 1.25,
  },
  "d-halberd": {
    name: "Dragon Halberd",
    energyCost: 30,
    dmgMultiplier: 1.1,
    hits: 2,
    targetSizeMultiHit: true,
    secondHitAccFraction: 0.75,
  },

  // ═══════════════════════════════════════════════════════════════════════
  // MELEE — Other
  // ═══════════════════════════════════════════════════════════════════════
  "abyssal-dagger": {
    name: "Abyssal Dagger",
    energyCost: 25,
    accMultiplier: 1.25,
    dmgMultiplier: 0.85,
    hits: 2,
    secondHitGuaranteedOnAccurate: true,
  },
  "crystal-halberd": {
    name: "Crystal Halberd",
    energyCost: 30,
    dmgMultiplier: 1.1,
    hits: 2,
    targetSizeMultiHit: true,
    secondHitAccFraction: 0.75,
  },
  "whip": {
    name: "Abyssal Whip",
    energyCost: 50,
    accMultiplier: 1.25,
  },
  "elder-maul": {
    name: "Elder Maul",
    energyCost: 50,
    accMultiplier: 1.25,
  },
  "granite-hammer": {
    name: "Granite Hammer",
    energyCost: 60,
    accMultiplier: 1.5,
    flatDmgBonus: 5,
  },
  "anchor": {
    name: "Barrelchest Anchor",
    energyCost: 50,
    accMultiplier: 2.0,
    dmgMultiplier: 1.1,
  },
  "arkan-blade": {
    name: "Arkan Blade",
    energyCost: 30,
    accMultiplier: 1.5,
    dmgMultiplier: 1.5,
    burnDpt: 10,
  },
  "sara-sword": {
    name: "Saradomin Sword",
    energyCost: 100,
    dmgMultiplier: 1.1,
    magicBonusHit: [1, 16],
  },
  "fang": {
    name: "Osmumten's Fang",
    energyCost: 25,
    accMultiplier: 1.5,
    // Fang spec: 1.5x on attack roll, then fang double-roll formula still applies
  },
  "dual-macuahuitl": {
    name: "Dual Macuahuitl",
    energyCost: 25,
    hits: 2,
    // Split damage: each hit at 50% of max
    perHitMaxFraction: 0.5,
  },
  "voidwaker": {
    name: "Voidwaker",
    energyCost: 50,
    guaranteedHit: true,
    useMagicDefence: true,
    minHitFraction: 0.5,
    maxHitBonusFraction: 0.5,
  },
  "burning-claws": {
    name: "Burning Claws",
    energyCost: 30,
    hits: 3,
    cascadeType: "burning-claws",
  },
  "brine-sabre": {
    name: "Brine Sabre",
    energyCost: 75,
    accMultiplier: 2.0,
  },
  "soulreaper-axe": {
    name: "Soulreaper Axe",
    energyCost: 50,
    accMultiplier: 2.0,
    // Spec: (100 + 6*stacks)/100 multiplier — handled in engine via soulreaperSpecDmg flag
    soulreaperSpecDmg: true,
  },

  // ═══════════════════════════════════════════════════════════════════════
  // RANGED
  // ═══════════════════════════════════════════════════════════════════════
  "blowpipe": {
    name: "Toxic Blowpipe",
    energyCost: 50,
    accMultiplier: 2.0,
    dmgMultiplier: 1.5,
  },
  "rosewood-blowpipe": {
    name: "Rosewood Blowpipe",
    energyCost: 25,
    accMultiplier: 0.8,
    dmgMultiplier: 1.1,
    hits: 2,
  },
  "dark-bow": {
    name: "Dark Bow",
    energyCost: 55,
    // dmgMultiplier handled in engine: dragon arrows 15/10, non-dragon 13/10
    hits: 2,
    darkBowMinHit: 8,  // 8 for dragon arrows, 5 for other — engine checks ammo
    darkBowCap: 48,
  },
  "msb-i": {
    name: "Magic Shortbow (i)",
    energyCost: 50,
    accMultiplier: 10 / 7, // weirdgloop: [10, 7] ≈ 1.4286
    hits: 2,
  },
  "magic-longbow": {
    name: "Magic Longbow",
    energyCost: 35,
    guaranteedHit: true,
  },
  "heavy-ballista": {
    name: "Heavy Ballista",
    energyCost: 65,
    accMultiplier: 1.25,
    dmgMultiplier: 1.25,
  },
  "light-ballista": {
    name: "Light Ballista",
    energyCost: 65,
    accMultiplier: 1.25,
    dmgMultiplier: 1.25,
  },
  "webweaver-bow": {
    name: "Webweaver Bow",
    energyCost: 50,
    accMultiplier: 2.0,
    hits: 4,
    perHitMaxFraction: 0.4,
  },
  "zcb": {
    name: "Zaryte Crossbow",
    energyCost: 75,
    accMultiplier: 2.0,
    zcbGuaranteedBoltProc: true, // Guaranteed bolt spec on hit
  },
  "tonalztics": {
    name: "Tonalztics of Ralos",
    energyCost: 50,
    dmgMultiplier: 0.75,
    hits: 2,
  },
  "seercull": {
    name: "Seercull",
    energyCost: 100,
    guaranteedHit: true,
  },
  "eye-of-ayak": {
    name: "Eye of Ayak",
    energyCost: 50,
    accMultiplier: 2.0,
    dmgMultiplier: 1.3,
    speedOverride: 5,
  },

  // ═══════════════════════════════════════════════════════════════════════
  // MAGIC
  // ═══════════════════════════════════════════════════════════════════════
  "accursed-sceptre": {
    name: "Accursed Sceptre",
    energyCost: 50,
    accMultiplier: 1.5,
    dmgMultiplier: 1.5,
  },
  "volatile-staff": {
    name: "Volatile Nightmare Staff",
    energyCost: 55,
    accMultiplier: 1.5,
    // Source: weirdgloop — min(58, floor((99 + 58*M)/99))
    customMaxHit: (magicLevel: number) => Math.max(1, Math.min(58, Math.trunc((99 + 58 * magicLevel) / 99))),
  },
  "eldritch-staff": {
    name: "Eldritch Nightmare Staff",
    energyCost: 55,
    // Source: weirdgloop — min(44, floor((99 + 44*M)/99))
    customMaxHit: (magicLevel: number) => Math.max(1, Math.min(44, Math.trunc((99 + 44 * magicLevel) / 99))),
  },
};

/**
 * Look up the spec attack data for a weapon by its item ID.
 */
export function getSpecAttack(weaponId: string): SpecAttack | undefined {
  return SPEC_ATTACKS[weaponId];
}

/**
 * Check if a weapon has a special attack.
 */
export function hasSpecAttack(weaponId: string): boolean {
  return weaponId in SPEC_ATTACKS;
}
