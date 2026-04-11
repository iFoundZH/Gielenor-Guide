import type { PactNode } from "@/types/dps";

export const PACTS: PactNode[] = [
  // ══════════════════════════════════════════════════════════════════════
  // CATEGORY A — GENERAL COMBAT
  // ══════════════════════════════════════════════════════════════════════

  { id: "CA", name: "Combatant's Accord", description: "+15% accuracy on all combat styles", category: "combat",
    dpsRelevant: true, modifiers: [{ type: "accuracy-percent", value: 15 }] },

  { id: "GA", name: "Guardian's Aspect (Melee)", description: "+1% melee damage per style level invested", category: "combat",
    dpsRelevant: true, modifiers: [{ type: "damage-percent", value: 1, condition: "melee" }] },

  { id: "HA", name: "Hunter's Aspect (Ranged)", description: "+1% ranged damage per style level invested", category: "combat",
    dpsRelevant: true, modifiers: [{ type: "damage-percent", value: 1, condition: "ranged" }] },

  { id: "FA", name: "Forsaken's Aspect (Magic)", description: "+1% magic damage per style level invested", category: "combat",
    dpsRelevant: true, modifiers: [{ type: "damage-percent", value: 1, condition: "magic" }] },

  // ══════════════════════════════════════════════════════════════════════
  // CATEGORY B — ECHO MECHANICS
  // ══════════════════════════════════════════════════════════════════════

  { id: "B2", name: "Echo Resonance", description: "+25% ranged echo damage on HP regen tick", category: "echo",
    dpsRelevant: true, modifiers: [{ type: "echo-percent", value: 25, condition: "ranged" }] },

  // ══════════════════════════════════════════════════════════════════════
  // CATEGORY D — MELEE SPECIFIC
  // ══════════════════════════════════════════════════════════════════════

  { id: "D2", name: "Swift Strikes", description: "Light melee weapons: +40% bonus hit after each attack", category: "melee",
    dpsRelevant: true, modifiers: [{ type: "bonus-hit-percent", value: 40, condition: "1h-light" }] },

  { id: "D3", name: "Blindside Blows", description: "Heavy melee weapons: 15% chance of bonus max-hit attack", category: "melee",
    dpsRelevant: true, modifiers: [{ type: "blindbag-percent", value: 15, condition: "1h-heavy" }] },

  // ══════════════════════════════════════════════════════════════════════
  // CATEGORY E — BOW / RANGED ECHO
  // ══════════════════════════════════════════════════════════════════════

  { id: "E1", name: "True Shot", description: "Bow echo attacks never miss", category: "echo",
    dpsRelevant: true, modifiers: [{ type: "echo-never-miss", value: 1, condition: "bow" }] },

  { id: "E2", name: "Bolt Echo", description: "Crossbow echo hits deal +15% damage", category: "echo",
    dpsRelevant: true, modifiers: [{ type: "echo-percent", value: 15, condition: "crossbow" }] },

  // ══════════════════════════════════════════════════════════════════════
  // CATEGORY F — SPEED MODIFICATIONS
  // ══════════════════════════════════════════════════════════════════════

  { id: "F1", name: "Focused Fury", description: "+35% accuracy on all combat styles", category: "combat",
    dpsRelevant: true, modifiers: [{ type: "accuracy-percent", value: 35 }] },

  { id: "F7", name: "Hastened Spells", description: "Spell attack speed -2 ticks", category: "speed",
    dpsRelevant: true, modifiers: [{ type: "speed-ticks", value: -2, condition: "spell" }] },

  { id: "F8", name: "Powered Haste", description: "Powered staff attack speed -3 ticks, max hit -8", category: "speed",
    dpsRelevant: true, modifiers: [
      { type: "speed-ticks", value: -3, condition: "powered-staff" },
      { type: "max-hit-flat", value: -8, condition: "powered-staff" },
    ] },

  // ══════════════════════════════════════════════════════════════════════
  // CATEGORY G — STRENGTH SCALING
  // ══════════════════════════════════════════════════════════════════════

  { id: "G6", name: "Brutal Force", description: "+20% of STR level added as melee strength bonus", category: "melee",
    dpsRelevant: true, modifiers: [{ type: "strength-percent", value: 20, condition: "melee" }] },

  { id: "G7", name: "Pious Might", description: "+50% of Prayer level added as melee strength bonus", category: "melee",
    dpsRelevant: true, modifiers: [{ type: "strength-percent", value: 50, condition: "prayer-to-melee" }] },

  // ══════════════════════════════════════════════════════════════════════
  // CATEGORY H — ACCURACY / DISTANCE
  // ══════════════════════════════════════════════════════════════════════

  { id: "H1", name: "Distant Precision", description: "5% + 5% per tile accuracy (max 100% accuracy at distance)", category: "combat",
    dpsRelevant: true, modifiers: [{ type: "custom", value: 0, condition: "distance-accuracy" }] },

  { id: "H4", name: "Empowered Arms", description: "+5 flat melee strength bonus", category: "melee",
    dpsRelevant: true, modifiers: [{ type: "max-hit-flat", value: 5, condition: "melee" }] },

  // ══════════════════════════════════════════════════════════════════════
  // CATEGORY J — HALBERD / MELEE RANGE
  // ══════════════════════════════════════════════════════════════════════

  { id: "J2", name: "Light Swiftness", description: "Light melee attack speed -1 tick", category: "speed",
    dpsRelevant: true, modifiers: [{ type: "speed-ticks", value: -1, condition: "1h-light" }] },

  { id: "J4", name: "Reaching Strikes", description: "Halberd: +4% damage per 3 tiles of distance", category: "melee",
    dpsRelevant: true, modifiers: [{ type: "custom", value: 0, condition: "halberd-distance" }] },

  // ══════════════════════════════════════════════════════════════════════
  // CATEGORY K — CROSSBOW / RANGED
  // ══════════════════════════════════════════════════════════════════════

  { id: "K3", name: "Echo Cascade", description: "Echo attacks cascade up to 4 times (each at half power)", category: "echo",
    dpsRelevant: true, modifiers: [{ type: "custom", value: 4, condition: "cascade" }] },

  { id: "K4", name: "Rapid Fire", description: "Bow attack speed -1 tick", category: "speed",
    dpsRelevant: true, modifiers: [{ type: "speed-ticks", value: -1, condition: "bow" }] },

  { id: "K8", name: "Crossbow Mastery", description: "Crossbow: +70% damage, -2 tick speed", category: "ranged",
    dpsRelevant: true, modifiers: [
      { type: "damage-percent", value: 70, condition: "crossbow" },
      { type: "speed-ticks", value: -2, condition: "crossbow" },
    ] },

  { id: "K10", name: "Regen Echo", description: "+5% echo damage on HP regen tick", category: "echo",
    dpsRelevant: true, modifiers: [{ type: "echo-percent", value: 5 }] },

  // ══════════════════════════════════════════════════════════════════════
  // CATEGORY N — CROSSBOW SPECIAL
  // ══════════════════════════════════════════════════════════════════════

  { id: "N6", name: "Maximum Force", description: "Crossbow always hits max damage", category: "ranged",
    dpsRelevant: true, modifiers: [{ type: "always-max", value: 1, condition: "crossbow" }] },

  { id: "N7", name: "Double Roll", description: "Crossbow: double accuracy roll", category: "ranged",
    dpsRelevant: true, modifiers: [{ type: "double-roll", value: 1, condition: "crossbow" }] },

  // ══════════════════════════════════════════════════════════════════════
  // NON-DPS PACTS (sample — for UI completeness)
  // ══════════════════════════════════════════════════════════════════════

  { id: "A1", name: "Soul Tithe", description: "Lose 1 prayer point per game tick", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "A2", name: "Frail Form", description: "Maximum HP reduced by 15", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "A3", name: "Glass Cannon", description: "Defence level locked to 1", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "A4", name: "No Retreat", description: "Cannot teleport during combat", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "A5", name: "Weighted Steps", description: "Run energy drains 3x faster", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "C1", name: "Shared Pain", description: "Take 10% of damage dealt to yourself", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "C2", name: "Curse of Greed", description: "Cannot pick up items for 5 ticks after a kill", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "C3", name: "Shattered Supplies", description: "Food heals 25% less", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "C4", name: "Bound Spirit", description: "Cannot use protection prayers", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "C5", name: "Chaotic Inventory", description: "Inventory slots shuffle randomly every 30s", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "L1", name: "Mark of the Hunted", description: "Bosses deal 10% more damage to you", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "L2", name: "Enfeebled", description: "Stat restore effects are halved", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "L3", name: "Corrupted Prayers", description: "Prayer drain rate doubled", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "L4", name: "Shackled", description: "Attack speed +1 tick when below 50% HP", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "L5", name: "Waning Power", description: "Damage reduced by 1% per 5% HP missing", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "M1", name: "Brittle Armour", description: "Equipment has 50% less defence bonuses", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "M2", name: "Burning Soul", description: "Take 1 damage per game tick in combat", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "M3", name: "Forsaken Healing", description: "Cannot use healing spells", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "M4", name: "Unstable Ground", description: "Standing still for 5+ ticks deals damage", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "M5", name: "Draining Strikes", description: "Each attack costs 1% of current HP", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "P1", name: "Pack Rat's Curse", description: "Inventory reduced to 20 slots", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "P2", name: "Toxic Cloud", description: "Poison damage you take is doubled", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "P3", name: "Reckless Abandon", description: "Special attack costs 25% more energy", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "P4", name: "Fading Light", description: "Screen dims gradually, full blackout every 60s", category: "survival",
    dpsRelevant: false, modifiers: [] },

  { id: "P5", name: "Echoing Screams", description: "All damage taken echoes 25% after 3 ticks", category: "survival",
    dpsRelevant: false, modifiers: [] },

  // Flask of Fervour (special — flat DPS addition from relic-like effect)
  { id: "FLASK", name: "Flask of Fervour", description: "Adds flat DPS equivalent to a damage-over-time effect", category: "relic",
    dpsRelevant: true, modifiers: [{ type: "flat-dps", value: 1.5 }] },
];

// ═══════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════

const pactMap = new Map(PACTS.map(p => [p.id, p]));

export function getPact(id: string): PactNode | undefined {
  return pactMap.get(id);
}

export function getDpsRelevantPacts(): PactNode[] {
  return PACTS.filter(p => p.dpsRelevant);
}

export function getPactsByCategory(category: string): PactNode[] {
  return PACTS.filter(p => p.category === category);
}

export function getPactCategories(): string[] {
  return [...new Set(PACTS.map(p => p.category))];
}
