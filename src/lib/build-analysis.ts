/**
 * Build Analysis Engine
 *
 * Performs deep analysis of a player's build to surface:
 * - What content they're missing out on (bosses, raids, skills)
 * - Whether the build is skewed toward specific skill types
 * - Synergies they've activated and ones they're missing
 * - XP/drop rate multiplier timeline
 * - Task accessibility (how many tasks require missing regions)
 * - Pact trade-off analysis
 * - Warnings about dangerous combos or gaps
 */

import { LeagueBuild, LeagueData, Region, Relic, Pact } from "@/types/league";
import {
  computeRelicAfkScore,
  computeBuildAfkScore,
  computeRelicPowerRating,
  computePointCeiling,
  type RelicAfkScore,
  type RelicPowerRating,
  type BuildPointCeiling,
} from "./relic-metrics";

export interface BuildAnalysis {
  /** Content you're locking yourself out of */
  missedContent: MissedContent;
  /** How balanced the build is across combat/skilling/utility */
  buildBalance: BuildBalance;
  /** Active synergies between relics and pacts */
  synergies: Synergy[];
  /** Synergies you're close to but haven't activated */
  missedSynergies: Synergy[];
  /** XP and drop multiplier progression through tiers */
  multiplierTimeline: MultiplierTier[];
  /** Task accessibility breakdown */
  taskAccess: TaskAccessibility;
  /** Warnings and tips */
  warnings: Warning[];
  /** Pact tradeoff summary */
  pactTradeoffs: PactTradeoff[];
  /** Overall build archetype classification */
  archetype: BuildArchetype;
  /** Key bosses accessible/inaccessible */
  bossAccess: BossAccess[];
  /** AFK score: 0-100 aggregate of automation keywords in selected relics */
  afkScore: number;
  /** Per-relic AFK score breakdown */
  relicAfkScores: RelicAfkScore[];
  /** Per-relic multi-axis power ratings */
  relicPowerRatings: RelicPowerRating[];
  /** Accessible tasks/points given selected regions */
  pointCeiling: BuildPointCeiling;
}

export interface MissedContent {
  regions: { region: Region; notableLosses: string[] }[];
  totalKeyContentMissed: number;
  totalKeyContentAvailable: number;
}

export interface BuildBalance {
  combat: number;   // 0-100
  gathering: number; // 0-100
  production: number; // 0-100
  utility: number;   // 0-100
  slayer: number;    // 0-100
  /** "combat-heavy" | "gathering-heavy" | "well-rounded" | "specialist" etc */
  label: string;
  /** Percentage of build power going to the dominant category */
  dominance: number;
}

export interface Synergy {
  name: string;
  description: string;
  strength: "strong" | "moderate" | "minor";
  components: string[]; // Names of relics/pacts involved
}

export interface MultiplierTier {
  tier: number;
  xpMultiplier: number;
  dropMultiplier: number;
  label: string;
}

export interface TaskAccessibility {
  accessible: number;
  inaccessible: number;
  total: number;
  byRegion: { regionName: string; tasks: number; accessible: boolean }[];
  accessiblePoints: number;
  totalPoints: number;
}

export interface Warning {
  severity: "critical" | "caution" | "tip";
  message: string;
}

export interface PactTradeoff {
  pactName: string;
  gain: string;
  cost: string;
  riskLevel: "low" | "medium" | "high" | "extreme";
}

export interface BuildArchetype {
  name: string;
  description: string;
  icon: string;
}

export interface BossAccess {
  name: string;
  region: string;
  accessible: boolean;
  difficulty: "mid" | "high" | "endgame";
}

// ─── Region → Content mapping ───────────────────────────────────────────

export const REGION_BOSSES: Record<string, { name: string; difficulty: "mid" | "high" | "endgame" }[]> = {
  varlamore: [
    { name: "Vardorvis", difficulty: "endgame" },
    { name: "Amoxliatl", difficulty: "mid" },
    { name: "Hueycoatl", difficulty: "high" },
    { name: "Fortis Colosseum (Sol Heredit)", difficulty: "endgame" },
    { name: "Moons of Peril", difficulty: "endgame" },
  ],
  karamja: [
    { name: "TzTok-Jad (Fight Caves)", difficulty: "high" },
    { name: "TzKal-Zuk (Inferno)", difficulty: "endgame" },
  ],
  asgarnia: [
    { name: "General Graardor (Bandos)", difficulty: "high" },
    { name: "Commander Zilyana (Sara)", difficulty: "high" },
    { name: "K'ril Tsutsaroth (Zammy)", difficulty: "high" },
    { name: "Kree'arra (Arma)", difficulty: "high" },
  ],
  fremennik: [
    { name: "Vorkath", difficulty: "high" },
    { name: "Nex", difficulty: "endgame" },
    { name: "Dagannoth Kings", difficulty: "mid" },
  ],
  kandarin: [
    { name: "Zulrah", difficulty: "high" },
  ],
  desert: [
    { name: "Tombs of Amascut", difficulty: "endgame" },
    { name: "Kalphite Queen", difficulty: "mid" },
  ],
  morytania: [
    { name: "Theatre of Blood", difficulty: "endgame" },
    { name: "The Nightmare", difficulty: "endgame" },
    { name: "Phosani's Nightmare", difficulty: "endgame" },
    { name: "Barrows", difficulty: "mid" },
  ],
  tirannwn: [
    { name: "Corrupted Gauntlet", difficulty: "endgame" },
    { name: "Zalcano", difficulty: "mid" },
  ],
  wilderness: [
    { name: "Callisto / Artio", difficulty: "high" },
    { name: "Venenatis / Spindel", difficulty: "high" },
    { name: "Vet'ion / Calvar'ion", difficulty: "high" },
    { name: "Corporeal Beast", difficulty: "endgame" },
  ],
  kebos: [
    { name: "Chambers of Xeric", difficulty: "endgame" },
    { name: "Alchemical Hydra", difficulty: "high" },
  ],
  kourend: [
    { name: "Chambers of Xeric", difficulty: "endgame" },
    { name: "Alchemical Hydra", difficulty: "high" },
  ],
  misthalin: [
    { name: "Giant Mole", difficulty: "mid" },
  ],
};

// Tags for what each relic focuses on
const RELIC_TAGS: Record<string, string[]> = {
  // DP relics
  "relic-t1-1": ["gathering", "fishing", "woodcutting", "mining", "banking"],
  "relic-t1-2": ["gathering", "agility", "strength", "early-game"],
  "relic-t1-3": ["skilling", "money", "all-skills", "production"],
  "relic-t2-1": ["agility", "production", "cooking", "mining", "gathering"],  // Hotfoot
  "relic-t2-2": ["production", "fletching", "firemaking", "hunter", "gathering"],  // Woodsman
  "relic-t3-1": ["combat", "bossing", "teleport", "utility"],
  "relic-t4-1": ["clues", "utility", "teleport"],
  "relic-t6-1": ["combat", "slayer", "clues", "utility"],
  "relic-t8-1": ["combat", "bossing", "utility", "auto-loot"],
  // RE relics (real wiki names)
  "re-t1-1": ["gathering", "mining", "banking", "production"],       // Power Miner
  "re-t1-2": ["gathering", "woodcutting", "banking", "firemaking"],  // Lumberjack
  "re-t1-3": ["gathering", "fishing", "hunter", "cooking"],          // Animal Wrangler
  "re-t2-1": ["utility", "agility"],                                 // Corner Cutter
  "re-t2-2": ["utility", "herblore", "gathering"],                   // Friendly Forager
  "re-t2-3": ["utility", "thieving", "money"],                       // Dodgy Deals
  "re-t3-1": ["clues", "teleport", "utility"],                       // Clue Compass
  "re-t3-2": ["utility", "banking", "teleport"],                     // Bank Heist
  "re-t3-3": ["utility", "teleport", "farming"],                     // Fairy's Flight
  "re-t4-1": ["utility", "money", "prayer"],                         // Golden God
  "re-t4-2": ["utility"],                                            // Reloaded
  "re-t4-3": ["skilling", "all-skills"],                             // Equilibrium
  "re-t5-1": ["clues", "utility"],                                   // Treasure Arbiter
  "re-t5-2": ["production", "skilling"],                             // Production Master
  "re-t5-3": ["combat", "slayer"],                                   // Slayer Master
  "re-t6-1": ["utility", "teleport", "combat"],                      // Total Recall
  "re-t6-2": ["utility", "banking"],                                 // Banker's Note
  "re-t7-1": ["utility", "gathering", "money"],                      // Pocket Kingdom
  "re-t7-2": ["combat", "utility", "magic"],                         // Grimoire
  "re-t7-3": ["gathering", "farming"],                               // Overgrown
  "re-t8-1": ["combat", "bossing"],                                  // Specialist
  "re-t8-2": ["combat", "bossing"],                                  // Guardian
  "re-t8-3": ["combat", "utility"],                                  // Last Stand
};

// ─── Main Analysis Function ─────────────────────────────────────────────

export function analyzeBuild(build: LeagueBuild, league: LeagueData): BuildAnalysis {
  const allAreasOpen = league.maxRegions === 0;
  const accessibleRegionIds = allAreasOpen
    ? new Set(Object.keys(REGION_BOSSES))
    : getAccessibleRegions(build, league);
  const allRelics = league.relicTiers.flatMap((t) => t.relics);
  const selectedRelics = allRelics.filter((r) => build.relics.includes(r.id));
  const selectedPacts = league.pacts.filter((p) => build.pacts.includes(p.id));
  const masteryStyleCount = new Set(
    build.pacts
      .filter((id) => id.startsWith("re-mastery-"))
      .map((id) => { const parts = id.split("-"); parts.pop(); return parts.join("-"); })
  ).size;
  const hasMasteries = masteryStyleCount > 0;

  const relicAfkScores = selectedRelics.map(computeRelicAfkScore);
  const relicPowerRatings = selectedRelics.map(computeRelicPowerRating);

  return {
    missedContent: analyzeMissedContent(build, league, accessibleRegionIds),
    buildBalance: analyzeBuildBalance(selectedRelics, selectedPacts, hasMasteries),
    synergies: findActiveSynergies(selectedRelics, selectedPacts, hasMasteries),
    missedSynergies: findMissedSynergies(selectedRelics, selectedPacts, allRelics, league.pacts, hasMasteries),
    multiplierTimeline: getMultiplierTimeline(league),
    taskAccess: analyzeTaskAccessibility(build, league, accessibleRegionIds),
    warnings: generateWarnings(build, league, selectedRelics, selectedPacts, accessibleRegionIds, hasMasteries),
    pactTradeoffs: analyzePactTradeoffs(selectedPacts),
    archetype: classifyArchetype(selectedRelics, selectedPacts, build, hasMasteries, masteryStyleCount),
    bossAccess: analyzeBossAccess(accessibleRegionIds),
    afkScore: computeBuildAfkScore(relicAfkScores),
    relicAfkScores,
    relicPowerRatings,
    pointCeiling: computePointCeiling(build, league),
  };
}

function getAccessibleRegions(build: LeagueBuild, league: LeagueData): Set<string> {
  const ids = new Set<string>();
  for (const r of league.regions) {
    if (r.type === "starting" || r.type === "auto-unlock") ids.add(r.id);
  }
  for (const id of build.regions) ids.add(id);
  return ids;
}

// ─── Missed Content ─────────────────────────────────────────────────────

function analyzeMissedContent(
  build: LeagueBuild,
  league: LeagueData,
  accessible: Set<string>,
): MissedContent {
  const missed: MissedContent["regions"] = [];
  let totalMissed = 0;
  let totalAvailable = 0;

  for (const region of league.regions) {
    if (region.type === "inaccessible") continue;
    const content = region.keyContent.filter((c) => c !== "Not available — all content locked");
    totalAvailable += content.length;
    if (!accessible.has(region.id)) {
      totalMissed += content.length;
      missed.push({ region, notableLosses: content });
    }
  }

  return { regions: missed, totalKeyContentMissed: totalMissed, totalKeyContentAvailable: totalAvailable };
}

// ─── Build Balance ──────────────────────────────────────────────────────

function analyzeBuildBalance(relics: Relic[], pacts: Pact[], hasMasteries = false): BuildBalance {
  const scores = { combat: 0, gathering: 0, production: 0, utility: 0, slayer: 0 };

  for (const relic of relics) {
    const tags = RELIC_TAGS[relic.id] || [];
    if (tags.includes("combat") || tags.includes("bossing")) scores.combat += 25;
    if (tags.includes("gathering") || tags.includes("fishing") || tags.includes("mining") || tags.includes("woodcutting")) scores.gathering += 25;
    if (tags.includes("production") || tags.includes("fletching") || tags.includes("firemaking")) scores.production += 25;
    if (tags.includes("utility") || tags.includes("teleport") || tags.includes("banking")) scores.utility += 20;
    if (tags.includes("slayer") || tags.includes("clues")) scores.slayer += 25;
    if (tags.includes("skilling") || tags.includes("all-skills")) {
      scores.gathering += 10;
      scores.production += 10;
    }
  }

  for (const pact of pacts) {
    if (pact.category === "combat") scores.combat += 20;
  }
  if (hasMasteries) scores.combat += 20;

  // Normalize to 0-100
  const maxVal = Math.max(scores.combat, scores.gathering, scores.production, scores.utility, scores.slayer, 1);
  const norm = (v: number) => Math.min(100, Math.round((v / maxVal) * 100));

  const combat = norm(scores.combat);
  const gathering = norm(scores.gathering);
  const production = norm(scores.production);
  const utility = norm(scores.utility);
  const slayer = norm(scores.slayer);

  const values = [combat, gathering, production, utility, slayer];
  const maxScore = Math.max(...values);
  const dominance = maxScore;
  const spread = maxScore - Math.min(...values.filter((v) => v > 0));

  let label: string;
  if (maxScore === 0) {
    label = "No selections yet";
  } else if (spread <= 30 && values.filter((v) => v > 0).length >= 3) {
    label = "Well-rounded";
  } else if (combat >= 70 && combat === maxScore) {
    label = "Combat-focused";
  } else if (gathering >= 70 && gathering === maxScore) {
    label = "Gathering-focused";
  } else if (slayer >= 70 && slayer === maxScore) {
    label = "Slayer-focused";
  } else if (production >= 70 && production === maxScore) {
    label = "Production-focused";
  } else {
    label = "Specialized";
  }

  return { combat, gathering, production, utility, slayer, label, dominance };
}

// ─── Synergies ──────────────────────────────────────────────────────────

function findActiveSynergies(relics: Relic[], pacts: Pact[], hasMasteries = false): Synergy[] {
  const synergies: Synergy[] = [];
  const relicIds = new Set(relics.map((r) => r.id));
  const pactIds = new Set(pacts.map((p) => p.id));
  const hasCombatPower = pacts.some((p) => p.category === "combat") || hasMasteries;

  // DP synergies
  if (relicIds.has("relic-t1-1") && relicIds.has("relic-t2-2")) {
    synergies.push({
      name: "Gathering Pipeline",
      description: "Resources auto-bank from Endless Harvest, then Woodsman doubles Hunter loot and provides instant Fletching. Seeds from traps fuel farming loop.",
      strength: "strong",
      components: ["Endless Harvest", "Woodsman"],
    });
  }
  if (relicIds.has("relic-t3-1") && pacts.some((p) => p.category === "combat")) {
    synergies.push({
      name: "Boss Blitz",
      description: "Evil Eye teleports directly to boss lairs. Combat pacts boost your damage there. Minimizes travel time between kills.",
      strength: "strong",
      components: ["Evil Eye", ...pacts.filter((p) => p.category === "combat").map((p) => p.name)],
    });
  }
  if (relicIds.has("relic-t6-1") && (pactIds.has("pact-melee-might") || pactIds.has("pact-ranged-fury") || pactIds.has("pact-magic-surge"))) {
    synergies.push({
      name: "Slayer Machine",
      description: "Culling Spree's configurable tasks + combat pact damage boost = rapid task completions. Passive slayer helm frees a gear slot.",
      strength: "strong",
      components: ["Culling Spree", ...pacts.filter((p) => ["pact-melee-might", "pact-ranged-fury", "pact-magic-surge"].includes(p.id)).map((p) => p.name)],
    });
  }
  if (relicIds.has("relic-t8-1") && pactIds.has("pact-glass-cannon")) {
    synergies.push({
      name: "Glass Cannon + Minion",
      description: "You deal massive damage but take more. Your Minion companion adds extra DPS and auto-loots, reducing time exposed to danger.",
      strength: "strong",
      components: ["Minion", "Glass Cannon"],
    });
  }
  if (relicIds.has("relic-t8-1") && pactIds.has("pact-vampiric-touch")) {
    synergies.push({
      name: "Vampiric Army",
      description: "Lifesteal from your attacks while Minion adds extra damage. Sustain through content without food.",
      strength: "moderate",
      components: ["Minion", "Vampiric Touch"],
    });
  }
  if (relicIds.has("relic-t1-3") && pacts.length >= 2) {
    synergies.push({
      name: "Boosted Economy",
      description: "Abundance's +10 skill boost lets you access high-level content early. Coin generation from XP funds supplies for pact-boosted combat.",
      strength: "moderate",
      components: ["Abundance", "Multiple Pacts"],
    });
  }
  if (pactIds.has("pact-glass-cannon") && pactIds.has("pact-vampiric-touch")) {
    synergies.push({
      name: "Lifesteal Tank",
      description: "Glass Cannon makes you fragile but Vampiric Touch heals you back. Net survivability depends on DPS output.",
      strength: "moderate",
      components: ["Glass Cannon", "Vampiric Touch"],
    });
  }
  if (relicIds.has("relic-t6-1") && relicIds.has("relic-t8-1")) {
    synergies.push({
      name: "Slayer Companion",
      description: "Culling Spree picks optimal tasks while Minion helps kill and auto-loots. Superiors chain-spawning generates massive clue scrolls.",
      strength: "strong",
      components: ["Culling Spree", "Minion"],
    });
  }
  if (relicIds.has("relic-t3-1") && relicIds.has("relic-t4-1")) {
    synergies.push({
      name: "Clue Blitz",
      description: "Evil Eye teleports to bosses for fast kills. Conniving Clues turns every casket into more clue contracts. Infinite clue farming loop.",
      strength: "strong",
      components: ["Evil Eye", "Conniving Clues"],
    });
  }

  // RE synergies (real wiki relic names)
  if (relicIds.has("re-t1-1") && relicIds.has("re-t5-2")) {
    synergies.push({
      name: "Mining Pipeline",
      description: "Power Miner auto-banks ores with auto-smelting. Production Master batch-processes all smithing at once. Mine ore → instantly get finished items.",
      strength: "strong",
      components: ["Power Miner", "Production Master"],
    });
  }
  if (relicIds.has("re-t1-3") && relicIds.has("re-t5-3")) {
    synergies.push({
      name: "Hunter-Slayer",
      description: "Animal Wrangler's enhanced Hunter traps + Slayer Master's always-on-task synergy. Everything you kill counts for Slayer; everything you catch is doubled.",
      strength: "strong",
      components: ["Animal Wrangler", "Slayer Master"],
    });
  }
  if (relicIds.has("re-t8-1") && hasCombatPower) {
    synergies.push({
      name: "Special Attack Engine",
      description: "Specialist's 20% spec cost + energy on kills/misses pairs with combat mastery damage boosts. Infinite special attacks with increasing power.",
      strength: "strong",
      components: ["Specialist", "Combat Mastery"],
    });
  }
  if (relicIds.has("re-t8-2") && hasCombatPower) {
    synergies.push({
      name: "Guardian Force",
      description: "Guardian thrall fights alongside you with adaptive combat style + AoE. Combat mastery stacks boost both your and the Guardian's effectiveness.",
      strength: "strong",
      components: ["Guardian", "Combat Mastery"],
    });
  }
  if (relicIds.has("re-t8-3") && relicIds.has("re-t8-1")) {
    // Can't pick both (same tier) but defensive check
  }
  if (relicIds.has("re-t5-1") && relicIds.has("re-t3-1")) {
    synergies.push({
      name: "Clue Master",
      description: "Clue Compass teleports to STASH units and clue steps. Treasure Arbiter gives 10x clue drops and max casket rewards. Complete clues at light speed.",
      strength: "strong",
      components: ["Clue Compass", "Treasure Arbiter"],
    });
  }
  if (relicIds.has("re-t2-3") && relicIds.has("re-t4-1")) {
    synergies.push({
      name: "Thieving Empire",
      description: "Dodgy Deals gives 100% pickpocket success with noted loot across all nearby NPCs. Golden God's free alchemy converts everything to GP instantly.",
      strength: "strong",
      components: ["Dodgy Deals", "Golden God"],
    });
  }
  if (relicIds.has("re-t6-1") && relicIds.has("re-t8-1")) {
    synergies.push({
      name: "Recall Specialist",
      description: "Total Recall saves your location/stats. Specialist gives cheap spec attacks. Teleport away, restore, recall back with full HP/prayer/spec.",
      strength: "strong",
      components: ["Total Recall", "Specialist"],
    });
  }
  if (relicIds.has("re-t7-3") && relicIds.has("re-t1-2")) {
    synergies.push({
      name: "Farming Pipeline",
      description: "Lumberjack auto-banks and auto-burns/fletches logs. Overgrown's auto-harvest/replant with 75% seed preservation means infinite farming loops.",
      strength: "moderate",
      components: ["Lumberjack", "Overgrown"],
    });
  }
  if (relicIds.has("re-t2-2") && relicIds.has("re-t5-2")) {
    synergies.push({
      name: "Potion Factory",
      description: "Friendly Forager auto-finds herbs with 90% secondary preservation and 4-dose potions. Production Master batch-processes all potions at once.",
      strength: "moderate",
      components: ["Friendly Forager", "Production Master"],
    });
  }

  return synergies;
}

function findMissedSynergies(
  selectedRelics: Relic[],
  selectedPacts: Pact[],
  allRelics: Relic[],
  allPacts: Pact[],
  hasMasteries = false,
): Synergy[] {
  const missed: Synergy[] = [];
  const relicIds = new Set(selectedRelics.map((r) => r.id));
  const pactIds = new Set(selectedPacts.map((p) => p.id));
  const hasCombatPower = selectedPacts.some((p) => p.category === "combat") || hasMasteries;

  // DP missed synergies
  if (relicIds.has("relic-t1-1") && !relicIds.has("relic-t2-2")) {
    missed.push({
      name: "Gathering Pipeline",
      description: "Add Woodsman (T2) to double Hunter loot and auto-process gathered resources. Your Endless Harvest would feed perfectly into it.",
      strength: "strong",
      components: ["Endless Harvest", "Woodsman (not selected)"],
    });
  }
  if (selectedPacts.some((p) => p.category === "combat") && !relicIds.has("relic-t3-1")) {
    missed.push({
      name: "Boss Blitz",
      description: "You have combat pacts but no Evil Eye (T3). Adding it would let you teleport directly to every boss, maximizing your combat power.",
      strength: "strong",
      components: [...selectedPacts.filter((p) => p.category === "combat").map((p) => p.name), "Evil Eye (not selected)"],
    });
  }
  if (pactIds.has("pact-glass-cannon") && !pactIds.has("pact-vampiric-touch")) {
    missed.push({
      name: "Lifesteal Safety Net",
      description: "Glass Cannon makes you take more damage. Adding Vampiric Touch would give you sustain to offset the fragility.",
      strength: "moderate",
      components: ["Glass Cannon", "Vampiric Touch (not selected)"],
    });
  }
  if (relicIds.has("relic-t6-1") && !selectedPacts.some((p) => p.category === "combat")) {
    missed.push({
      name: "Slayer Machine",
      description: "You have Culling Spree for optimized Slayer but no combat pacts to boost kill speed. A combat pact would complete this combo.",
      strength: "moderate",
      components: ["Culling Spree", "Any combat pact (not selected)"],
    });
  }

  // RE missed synergies (real wiki names)
  if (relicIds.has("re-t1-1") && !relicIds.has("re-t5-2")) {
    missed.push({
      name: "Mining Pipeline",
      description: "Add Production Master (T5) to batch-process all your auto-banked ores and gems. Power Miner + Production Master = instant finished items.",
      strength: "strong",
      components: ["Power Miner", "Production Master (not selected)"],
    });
  }
  if (relicIds.has("re-t3-1") && !relicIds.has("re-t5-1")) {
    missed.push({
      name: "Clue Master",
      description: "You have Clue Compass for teleporting to clue steps. Add Treasure Arbiter (T5) for 10x clue drops and max casket rewards.",
      strength: "strong",
      components: ["Clue Compass", "Treasure Arbiter (not selected)"],
    });
  }
  if (relicIds.has("re-t8-1") && !hasCombatPower) {
    missed.push({
      name: "Special Attack Engine",
      description: "Specialist gives cheap spec attacks with energy on kills. Add a combat mastery to amplify your damage per hit.",
      strength: "moderate",
      components: ["Specialist", "Any mastery (not selected)"],
    });
  }
  if (relicIds.has("re-t2-3") && !relicIds.has("re-t4-1")) {
    missed.push({
      name: "Thieving Empire",
      description: "Dodgy Deals gives 100% pickpocket with noted loot. Add Golden God (T4) for free alchemy to convert everything to GP.",
      strength: "strong",
      components: ["Dodgy Deals", "Golden God (not selected)"],
    });
  }

  return missed;
}

// ─── Multiplier Timeline ────────────────────────────────────────────────

function getMultiplierTimeline(league: LeagueData): MultiplierTier[] {
  let xp = league.baseXpMultiplier;
  let drop = league.baseDropMultiplier;

  return league.relicTiers.map((rt) => {
    for (const eff of rt.passiveEffects) {
      // Match "XP multiplier increased to Nx", "XP multiplier is increased from Nx to Mx", "XP multiplier is Nx"
      const xpMatch = eff.match(/XP multiplier.*\b(\d+)x/i);
      if (xpMatch) xp = parseInt(xpMatch[1]);
      // Match "Drop rate multiplier increased to Nx" or "items...Nx as common"
      const dropMatch = eff.match(/Drop rate multiplier.*?(\d+)x/i) ?? eff.match(/items.*?(\d+)x\s+as\s+common/i);
      if (dropMatch) drop = parseInt(dropMatch[1]);
    }
    return {
      tier: rt.tier,
      xpMultiplier: xp,
      dropMultiplier: drop,
      label: `Tier ${rt.tier}`,
    };
  });
}

// ─── Task Accessibility ─────────────────────────────────────────────────

function analyzeTaskAccessibility(
  build: LeagueBuild,
  league: LeagueData,
  accessible: Set<string>,
): TaskAccessibility {
  const byRegion: TaskAccessibility["byRegion"] = [];
  const regionTaskCounts: Record<string, number> = {};

  for (const task of league.tasks) {
    if (task.region) {
      regionTaskCounts[task.region] = (regionTaskCounts[task.region] || 0) + 1;
    }
  }

  for (const [regionId, count] of Object.entries(regionTaskCounts)) {
    const region = league.regions.find((r) => r.id === regionId);
    byRegion.push({
      regionName: region?.name || regionId,
      tasks: count,
      accessible: accessible.has(regionId),
    });
  }

  const accessibleTasks = league.tasks.filter(
    (t) => !t.region || accessible.has(t.region),
  );
  const inaccessibleTasks = league.tasks.filter(
    (t) => t.region && !accessible.has(t.region),
  );

  return {
    accessible: accessibleTasks.length,
    inaccessible: inaccessibleTasks.length,
    total: league.tasks.length,
    byRegion: byRegion.sort((a, b) => b.tasks - a.tasks),
    accessiblePoints: accessibleTasks.reduce((s, t) => s + t.points, 0),
    totalPoints: league.tasks.reduce((s, t) => s + t.points, 0),
  };
}

// ─── Warnings ───────────────────────────────────────────────────────────

function generateWarnings(
  build: LeagueBuild,
  league: LeagueData,
  relics: Relic[],
  pacts: Pact[],
  accessible: Set<string>,
  hasMasteries = false,
): Warning[] {
  const warnings: Warning[] = [];
  const pactIds = new Set(pacts.map((p) => p.id));
  const relicIds = new Set(relics.map((r) => r.id));

  // No regions selected
  if (build.regions.length === 0 && league.maxRegions > 0) {
    warnings.push({
      severity: "critical",
      message: `You haven't selected any regions yet. Choose ${league.maxRegions} regions to unlock content.`,
    });
  } else if (build.regions.length < league.maxRegions && league.maxRegions > 0) {
    warnings.push({
      severity: "caution",
      message: `You've only selected ${build.regions.length}/${league.maxRegions} regions. You're leaving ${league.maxRegions - build.regions.length} region slot(s) empty.`,
    });
  }

  // No relics selected
  const relicTiersWithChoices = league.relicTiers.filter((t) => t.relics.length > 0);
  if (relics.length === 0 && relicTiersWithChoices.length > 0) {
    warnings.push({
      severity: "caution",
      message: "No relics selected. Relics provide massive power boosts — pick one for each tier with choices.",
    });
  }

  // DP-specific warnings
  if (pactIds.has("pact-glass-cannon") && pactIds.has("pact-berserker")) {
    warnings.push({
      severity: "critical",
      message: "Glass Cannon + Berserker's Oath: you take extra damage AND can't use protection prayers. This is extremely dangerous for bossing. Consider Vampiric Touch for sustain.",
    });
  }
  if (pactIds.has("pact-glass-cannon") && !pactIds.has("pact-vampiric-touch")) {
    warnings.push({
      severity: "caution",
      message: "Glass Cannon active without Vampiric Touch. You'll take increased damage with no lifesteal. Bring extra food.",
    });
  }
  const t1CombatPacts = pacts.filter((p) => p.tier === 1 && p.category === "combat");
  if (t1CombatPacts.length >= 2) {
    warnings.push({
      severity: "caution",
      message: `You have ${t1CombatPacts.length} combat style pacts active. Each one reduces other styles — spreading across styles diminishes returns. Consider focusing on one.`,
    });
  }

  // No raid access
  const hasRaidAccess = accessible.has("kebos") || accessible.has("kourend") || accessible.has("morytania") || accessible.has("desert");
  if (!hasRaidAccess && league.maxRegions > 0) {
    warnings.push({
      severity: "caution",
      message: "No raid access! You're missing Chambers of Xeric (Kourend), Theatre of Blood (Morytania), and Tombs of Amascut (Desert).",
    });
  }

  // Has gathering relic but no gathering regions
  if ((relicIds.has("relic-t1-1") || relicIds.has("relic-t1-2")) && build.regions.length > 0) {
    const gatheringRegions = ["kebos", "kourend", "kandarin", "fremennik"];
    const hasGathering = gatheringRegions.some((r) => accessible.has(r));
    if (!hasGathering) {
      warnings.push({
        severity: "tip",
        message: "You have a gathering relic but limited gathering regions. Kebos/Kourend (Wintertodt, GOTR) and Kandarin (Catherby fishing) are great for gathering.",
      });
    }
  }

  // Endgame boss tips
  if (accessible.has("karamja") && (pacts.some((p) => p.category === "combat") || hasMasteries)) {
    warnings.push({
      severity: "tip",
      message: "Karamja + combat pacts = Inferno access. This is the highest-prestige task in the league.",
    });
  }

  if (relicIds.has("relic-t1-3")) {
    warnings.push({
      severity: "tip",
      message: "Abundance generates coins from all XP. With 16x multiplier at T7, this generates massive GP — great for buying supplies as an ironman.",
    });
  }

  // RE-specific warnings
  if (relicIds.has("re-t8-3")) {
    warnings.push({
      severity: "tip",
      message: "Last Stand saves you from lethal damage with stats boosted to 255. Has a 3-minute cooldown — don't rely on it for sustained tanking.",
    });
  }
  if (relicIds.has("re-t4-2")) {
    warnings.push({
      severity: "tip",
      message: "Reloaded lets you pick a second relic from a previous tier. Choose the tier that synergizes best with your other selections.",
    });
  }
  // Count distinct mastery styles from build.pacts (tier IDs like "re-mastery-melee-1")
  const masteryStyles = new Set(
    build.pacts
      .filter((id) => id.startsWith("re-mastery-"))
      .map((id) => { const parts = id.split("-"); parts.pop(); return parts.join("-"); })
  );
  if (masteryStyles.size >= 2) {
    warnings.push({
      severity: "tip",
      message: "Multiple masteries active. You only have 10 mastery points total — spreading across styles means fewer high-tier unlocks per style.",
    });
  }
  if (relicIds.has("re-t2-1") && relicIds.has("re-t2-3")) {
    // Can't happen (same tier) but defensive
  }
  if (relicIds.has("re-t8-1") && relicIds.has("re-t7-2")) {
    warnings.push({
      severity: "tip",
      message: "Specialist + Grimoire: cheap spec attacks + all prayers and spells unlocked. You can use any special attack with any prayer book.",
    });
  }
  if (relicIds.has("re-t5-3") && !relics.some((r) => RELIC_TAGS[r.id]?.includes("combat")) && !hasMasteries) {
    warnings.push({
      severity: "caution",
      message: "Slayer Master makes you always on-task but you have no combat relics. You'll struggle to kill efficiently.",
    });
  }

  return warnings;
}

// ─── Pact Tradeoffs ─────────────────────────────────────────────────────

function analyzePactTradeoffs(pacts: Pact[]): PactTradeoff[] {
  return pacts.map((p) => ({
    pactName: p.name,
    gain: p.bonus,
    cost: p.penalty,
    riskLevel:
      p.id === "pact-berserker" ? "extreme" :
      p.id === "pact-glass-cannon" ? "high" :
      p.id === "pact-vampiric-touch" ? "medium" :
      p.tier >= 3 ? "high" :
      p.tier >= 2 ? "medium" :
      "low",
  }));
}

// ─── Archetype Classification ───────────────────────────────────────────

function classifyArchetype(relics: Relic[], pacts: Pact[], build: LeagueBuild, hasMasteries = false, masteryStyleCount = 0): BuildArchetype {
  const relicIds = new Set(relics.map((r) => r.id));
  const pactIds = new Set(pacts.map((p) => p.id));
  const combatPacts = pacts.filter((p) => p.category === "combat").length + masteryStyleCount;

  if (relics.length === 0 && pacts.length === 0 && !hasMasteries) {
    return { name: "Undecided", description: "Make some selections to see your build archetype.", icon: "🤔" };
  }

  // DP-specific archetypes
  if (relicIds.has("relic-t8-1") && pactIds.has("pact-glass-cannon") && pactIds.has("pact-berserker")) {
    return { name: "Demonlord", description: "Maximum risk, maximum power. You've gone all-in on damage with no safety net. True demon energy.", icon: "👹" };
  }
  if (relicIds.has("relic-t6-1") && combatPacts >= 1 && relicIds.has("relic-t3-1")) {
    return { name: "PvM Powerhouse", description: "Built to kill. Boss teleports, optimized Slayer, and combat pacts make you a boss-farming machine.", icon: "⚔️" };
  }
  if (relicIds.has("relic-t1-1") && relicIds.has("relic-t2-2")) {
    return { name: "Gathering Lord", description: "Resources flow endlessly. Auto-banking, doubled outputs, and instant processing create a resource empire.", icon: "⛏️" };
  }
  if (relicIds.has("relic-t1-3") && relics.length >= 2) {
    return { name: "Skill Prodigy", description: "+10 to all skills plus bonus XP. You rush high-level content that others need hours to unlock.", icon: "📚" };
  }
  if (relicIds.has("relic-t8-1")) {
    return { name: "Summoner", description: "Your Minion companion fights, loots, and powers up. You bring a friend to every fight.", icon: "🐾" };
  }

  // RE-specific archetypes (real wiki names)
  if (relicIds.has("re-t8-1") && relicIds.has("re-t6-1") && combatPacts >= 1) {
    return { name: "Spec Master", description: "Specialist + Total Recall with combat mastery. Cheap spec attacks, infinite energy restoration, and instant stat recovery. Bosses can't outlast you.", icon: "⚔️" };
  }
  if (relicIds.has("re-t8-2") && combatPacts >= 1) {
    return { name: "Summoner", description: "Guardian thrall fights alongside you with adaptive combat style + AoE. Combat mastery makes you both stronger.", icon: "🐾" };
  }
  if (relicIds.has("re-t8-3") && combatPacts >= 1) {
    return { name: "Unkillable", description: "Last Stand saves you from lethal damage with 255 stats. Combined with combat mastery, you're nearly impossible to kill.", icon: "🛡️" };
  }
  if (relicIds.has("re-t2-3") && relicIds.has("re-t4-1")) {
    return { name: "Master Thief", description: "100% pickpocket success across all nearby NPCs with noted loot, then alchemy everything for free GP. Rob the entire world.", icon: "🎭" };
  }
  if (relicIds.has("re-t1-1") && relicIds.has("re-t5-2")) {
    return { name: "Gathering Lord", description: "Power Miner + Production Master: auto-bank ores, auto-smelt, batch-process everything. Mine to bank in one step.", icon: "⛏️" };
  }
  if (relicIds.has("re-t5-1") && relicIds.has("re-t3-1")) {
    return { name: "Treasure Hunter", description: "Clue Compass + Treasure Arbiter: teleport to clue steps, 10x clue drops, max casket rewards. You are the clue scroll.", icon: "💎" };
  }
  if (relicIds.has("re-t5-3") && combatPacts >= 1) {
    return { name: "PvM Destroyer", description: "Slayer Master with combat mastery. Always on task, free perks, bonus XP milestones. Everything you fight counts.", icon: "⚔️" };
  }
  if (relicIds.has("re-t7-3") && (relicIds.has("re-t1-2") || relicIds.has("re-t1-3"))) {
    return { name: "Artisan", description: "Gathering relic + Overgrown: auto-harvest, auto-replant, 75% seed preservation. A self-sustaining farming empire.", icon: "🔨" };
  }

  // Generic archetypes (both leagues)
  if (combatPacts >= 3) {
    return { name: "Berserker", description: "Triple combat pacts make you devastating but also take heavy penalties. A high-risk glass cannon.", icon: "🔥" };
  }
  if (combatPacts >= 1 && relics.length >= 2) {
    return { name: "Adventurer", description: "A balanced mix of combat power and utility. Ready for whatever the league throws at you.", icon: "🗡️" };
  }
  if (relics.length >= 2 && combatPacts === 0) {
    return { name: "Skiller", description: "Focused on non-combat progression. Efficient skilling and resource generation without the combat risk.", icon: "🌿" };
  }

  return { name: "Explorer", description: "A flexible build that's still taking shape. Keep selecting to define your playstyle.", icon: "🧭" };
}

// ─── Boss Access ────────────────────────────────────────────────────────

function analyzeBossAccess(accessible: Set<string>): BossAccess[] {
  const bosses: BossAccess[] = [];

  for (const [regionId, regionBosses] of Object.entries(REGION_BOSSES)) {
    for (const boss of regionBosses) {
      bosses.push({
        name: boss.name,
        region: regionId,
        accessible: accessible.has(regionId),
        difficulty: boss.difficulty,
      });
    }
  }

  return bosses.sort((a, b) => {
    const diffOrder = { mid: 0, high: 1, endgame: 2 };
    return diffOrder[a.difficulty] - diffOrder[b.difficulty];
  });
}
