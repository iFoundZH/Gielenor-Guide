/**
 * Relic Metrics — computed analysis for relics and builds
 *
 * AFK Score: keyword-match against relic effect text for automation indicators
 * Power Rating: multi-axis relic scoring (dps/skilling/qol/pointGen/afk)
 * Point Ceiling: accessible tasks/points given selected regions
 */

import type { Relic, LeagueBuild, LeagueData, TaskDifficulty } from "@/types/league";

// ─── AFK Score ──────────────────────────────────────────────────────────

export interface RelicAfkScore {
  relicId: string;
  relicName: string;
  score: number;
  breakdown: { category: string; points: number; matched: boolean }[];
}

const AFK_CATEGORIES: { category: string; points: number; keywords: string[] }[] = [
  { category: "Auto-banking", points: 15, keywords: ["sent to your bank", "sent to the bank", "auto-bank", "bank automatically", "automatically sent to your bank"] },
  { category: "Auto-processing", points: 15, keywords: ["auto-cook", "auto-smelt", "auto-fletch", "auto-burn", "automatically cooked", "automatically smelted", "automatically burned", "all items are processed at once", "instant fletching"] },
  { category: "No depletion", points: 10, keywords: ["never deplete", "not deplete", "endlessly gather"] },
  { category: "100% success", points: 10, keywords: ["never fail", "100% success", "always succeed", "traps never fail"] },
  { category: "Auto-repeat / AoE", points: 15, keywords: ["auto-repeat", "automatically re-pickpocket", "11x11", "chain", "aoe attack"] },
  { category: "Instant teleport", points: 10, keywords: ["teleport to any", "teleport to the entrance", "teleport back", "teleport to their current"] },
  { category: "Noted / auto-loot", points: 10, keywords: ["noted loot", "auto-loot", "noted drops", "automatically loot", "turn them into banknotes"] },
  { category: "Auto-alch", points: 10, keywords: ["automatically be recast", "free alchemy", "no rune cost"] },
  { category: "Reduced drain", points: 5, keywords: ["prayer drain", "stats restored", "prayer restoration", "prayer points will be restored"] },
];

export function computeRelicAfkScore(relic: Relic): RelicAfkScore {
  const effectText = relic.effects.join(" ").toLowerCase();

  const breakdown = AFK_CATEGORIES.map((cat) => {
    const matched = cat.keywords.some((kw) => effectText.includes(kw.toLowerCase()));
    return { category: cat.category, points: cat.points, matched };
  });

  const rawScore = breakdown.filter((b) => b.matched).reduce((sum, b) => sum + b.points, 0);

  return {
    relicId: relic.id,
    relicName: relic.name,
    score: Math.min(100, rawScore),
    breakdown,
  };
}

/**
 * Compute the maximum achievable AFK score for a league.
 * For each tier with relic choices, takes the highest-scoring relic.
 * Returns the sum of those maximums = the league's AFK ceiling.
 * Also returns the max single-relic raw score for per-relic normalization.
 */
export function computeLeagueAfkCeiling(league: LeagueData): { maxBuildTotal: number; maxSingleRelic: number } {
  let maxBuildTotal = 0;
  let maxSingleRelic = 0;

  for (const tier of league.relicTiers) {
    if (tier.relics.length === 0) continue;
    const tierMax = Math.max(...tier.relics.map(r => computeRelicAfkScore(r).score));
    maxBuildTotal += tierMax;
    maxSingleRelic = Math.max(maxSingleRelic, tierMax);
  }

  return { maxBuildTotal: maxBuildTotal || 1, maxSingleRelic: maxSingleRelic || 1 };
}

/**
 * Build-level AFK score, normalized 0-100 within the league.
 * Picking the most AFK relic at every tier = 100.
 */
export function computeBuildAfkScore(relicScores: RelicAfkScore[], league: LeagueData): number {
  if (relicScores.length === 0) return 0;
  const { maxBuildTotal } = computeLeagueAfkCeiling(league);
  const rawTotal = relicScores.reduce((sum, rs) => sum + rs.score, 0);
  return Math.min(100, Math.round((rawTotal / maxBuildTotal) * 100));
}

/**
 * Normalize per-relic AFK scores for display.
 * The most AFK relic in the league = 100.
 */
export function normalizeRelicAfkScores(scores: RelicAfkScore[], league: LeagueData): RelicAfkScore[] {
  const { maxSingleRelic } = computeLeagueAfkCeiling(league);
  return scores.map(s => ({
    ...s,
    score: Math.min(100, Math.round((s.score / maxSingleRelic) * 100)),
  }));
}

// ─── Power Rating ───────────────────────────────────────────────────────

export interface RelicPowerRating {
  relicId: string;
  relicName: string;
  dps: number;      // 0-10: combat damage/speed impact
  skilling: number;  // 0-10: non-combat skill speed
  qol: number;       // 0-10: convenience/time savings
  pointGen: number;  // 0-10: task completion acceleration
  afk: number;       // 0-10: from AFK score (normalized)
  total: number;     // sum of all axes
}

// Static lookup keyed by relic ID — derived from analyzing each relic's effects
export const POWER_RATINGS: Record<string, Omit<RelicPowerRating, "relicId" | "relicName" | "afk" | "total">> = {
  // DP relics
  "relic-t1-1": { dps: 0, skilling: 8, qol: 7, pointGen: 7 },  // Endless Harvest — auto-bank gathering, 2x resources
  "relic-t1-2": { dps: 0, skilling: 6, qol: 5, pointGen: 5 },  // Barbarian Gathering — knapsack, agility+strength
  "relic-t1-3": { dps: 2, skilling: 7, qol: 6, pointGen: 6 },  // Abundance — +10 all skills, coin gen
  "relic-t2-1": { dps: 0, skilling: 7, qol: 7, pointGen: 6 },  // Hotfoot — agility XP while running, auto-cook/smelt, 100% success agility+cooking
  "relic-t2-2": { dps: 0, skilling: 7, qol: 6, pointGen: 6 },  // Friendly Forager — herb pouch, batch herblore, 4-dose pots
  "relic-t2-3": { dps: 0, skilling: 8, qol: 6, pointGen: 7 },  // Woodsman — hunter traps to bank, auto-burn logs, instant fletching, 2x hunter loot
  "relic-t3-1": { dps: 3, skilling: 0, qol: 9, pointGen: 6 },  // Evil Eye — boss teleports
  "relic-t4-1": { dps: 0, skilling: 0, qol: 7, pointGen: 5 },  // Conniving Clues — clue contracts, teleport steps
  "relic-t5-1": { dps: 0, skilling: 8, qol: 8, pointGen: 7 },  // Nature's Accord — fairy mushroom teleports, 10x farming yield, auto-note, plants never die
  "relic-t5-2": { dps: 0, skilling: 7, qol: 8, pointGen: 6 },  // Larcenist — 100% thieving success, auto-pickpocket, noted loot, 10x coin pouches
  "relic-t6-1": { dps: 2, skilling: 0, qol: 8, pointGen: 4 },  // Grimoire — arcane grimoire, spellbook swap, book of the dead
  "relic-t6-2": { dps: 4, skilling: 0, qol: 7, pointGen: 8 },  // Culling Spree — pick slayer tasks, superiors chain
  "relic-t7-1": { dps: 0, skilling: 0, qol: 5, pointGen: 3 },  // Reloaded — pick another relic
  "relic-t8-1": { dps: 7, skilling: 0, qol: 5, pointGen: 6 },  // Minion — combat companion, auto-loot
  "relic-t8-2": { dps: 6, skilling: 0, qol: 4, pointGen: 5 },  // Flask of Fervour — full restore, AoE damage

  // RE relics
  "re-t1-1": { dps: 0, skilling: 8, qol: 7, pointGen: 7 },  // Power Miner — auto-bank mining, 50% bonus
  "re-t1-2": { dps: 0, skilling: 8, qol: 7, pointGen: 7 },  // Lumberjack — auto-bank WC, auto-burn
  "re-t1-3": { dps: 0, skilling: 8, qol: 7, pointGen: 7 },  // Animal Wrangler — auto-bank fishing, auto-cook
  "re-t2-1": { dps: 0, skilling: 6, qol: 5, pointGen: 4 },  // Corner Cutter — agility XP while running
  "re-t2-2": { dps: 0, skilling: 7, qol: 5, pointGen: 5 },  // Friendly Forager — herb finding, 4-dose pots
  "re-t2-3": { dps: 0, skilling: 9, qol: 6, pointGen: 8 },  // Dodgy Deals — 100% pickpocket, AoE, noted loot
  "re-t3-1": { dps: 0, skilling: 0, qol: 8, pointGen: 5 },  // Clue Compass — teleport STASH/clue steps
  "re-t3-2": { dps: 0, skilling: 0, qol: 9, pointGen: 4 },  // Bank Heist — instant bank teleport
  "re-t3-3": { dps: 0, skilling: 3, qol: 7, pointGen: 4 },  // Fairy's Flight — fairy ring/spirit tree/leprechaun
  "re-t4-1": { dps: 0, skilling: 3, qol: 7, pointGen: 6 },  // Golden God — free alch, prayer from GP
  "re-t4-2": { dps: 0, skilling: 0, qol: 5, pointGen: 3 },  // Reloaded — pick another relic (empty effects)
  "re-t4-3": { dps: 0, skilling: 7, qol: 3, pointGen: 5 },  // Equilibrium — 10-20% total level XP bonus
  "re-t5-1": { dps: 0, skilling: 0, qol: 5, pointGen: 6 },  // Treasure Arbiter — 10x clue drops, max rewards
  "re-t5-2": { dps: 0, skilling: 9, qol: 6, pointGen: 7 },  // Production Master — batch-process all at once
  "re-t5-3": { dps: 5, skilling: 0, qol: 6, pointGen: 8 },  // Slayer Master — always on task, free perks
  "re-t6-1": { dps: 3, skilling: 0, qol: 10, pointGen: 7 },  // Total Recall — save/restore position+stats
  "re-t6-2": { dps: 0, skilling: 2, qol: 7, pointGen: 3 },  // Banker's Note — note/unnote items anywhere
  "re-t7-1": { dps: 0, skilling: 4, qol: 5, pointGen: 3 },  // Pocket Kingdom — Miscellania from anywhere
  "re-t7-2": { dps: 4, skilling: 0, qol: 8, pointGen: 5 },  // Grimoire — all spellbooks + Book of Dead
  "re-t7-3": { dps: 0, skilling: 8, qol: 6, pointGen: 5 },  // Overgrown — auto-harvest, auto-replant, 75% seed save
  "re-t8-1": { dps: 10, skilling: 0, qol: 3, pointGen: 7 },  // Specialist — 20% spec cost, +100% accuracy
  "re-t8-2": { dps: 8, skilling: 0, qol: 4, pointGen: 6 },  // Guardian — thrall companion, AoE, adaptive style
  "re-t8-3": { dps: 5, skilling: 0, qol: 4, pointGen: 4 },  // Last Stand — lethal damage → 1 HP + 255 stats
};

/**
 * Compute power rating for a single relic.
 * @param maxAfkRaw - the max raw AFK score of any relic in the league (for normalizing the afk axis)
 */
export function computeRelicPowerRating(relic: Relic, maxAfkRaw?: number): RelicPowerRating {
  const afkScore = computeRelicAfkScore(relic);
  const normalizer = maxAfkRaw || 100;
  const afk = Math.min(10, Math.round((afkScore.score / normalizer) * 10));
  const base = POWER_RATINGS[relic.id];

  if (!base) {
    return { relicId: relic.id, relicName: relic.name, dps: 0, skilling: 0, qol: 0, pointGen: 0, afk, total: afk };
  }

  return {
    relicId: relic.id,
    relicName: relic.name,
    ...base,
    afk,
    total: base.dps + base.skilling + base.qol + base.pointGen + afk,
  };
}

/**
 * Compute power ratings for all relics, normalizing the AFK axis within the league.
 */
export function computeAllPowerRatings(relics: Relic[], league?: LeagueData): Record<string, RelicPowerRating> {
  // Pre-compute the max AFK score across all relics in the league
  const allRelics = league ? league.relicTiers.flatMap(t => t.relics) : relics;
  const maxAfkRaw = Math.max(1, ...allRelics.map(r => computeRelicAfkScore(r).score));

  const map: Record<string, RelicPowerRating> = {};
  for (const relic of relics) {
    map[relic.id] = computeRelicPowerRating(relic, maxAfkRaw);
  }
  return map;
}

// ─── Point Ceiling ──────────────────────────────────────────────────────

export interface BuildPointCeiling {
  accessibleTasks: number;
  accessiblePoints: number;
  totalTasks: number;
  totalPoints: number;
  taskPercent: number;
  pointPercent: number;
  categoryGaps: string[];
  byDifficulty: Record<TaskDifficulty, { accessible: number; total: number }>;
}

export function computePointCeiling(build: LeagueBuild, league: LeagueData): BuildPointCeiling {
  const accessibleRegions = new Set<string>();
  for (const r of league.regions) {
    if (r.type === "starting" || r.type === "auto-unlock") accessibleRegions.add(r.id);
  }
  for (const id of build.regions) accessibleRegions.add(id);

  const allAreasOpen = league.maxRegions === 0;

  const totalTasks = league.tasks.length;
  const totalPoints = league.tasks.reduce((s, t) => s + t.points, 0);

  const accessibleTasks = league.tasks.filter(
    (t) => allAreasOpen || !t.region || accessibleRegions.has(t.region),
  );
  const accessibleTaskCount = accessibleTasks.length;
  const accessiblePointCount = accessibleTasks.reduce((s, t) => s + t.points, 0);

  // Category gaps: categories where accessible count is 0 but total > 0
  const categoryTotals: Record<string, number> = {};
  const categoryAccessible: Record<string, number> = {};
  for (const task of league.tasks) {
    categoryTotals[task.category] = (categoryTotals[task.category] || 0) + 1;
    if (allAreasOpen || !task.region || accessibleRegions.has(task.region)) {
      categoryAccessible[task.category] = (categoryAccessible[task.category] || 0) + 1;
    }
  }
  const categoryGaps = Object.keys(categoryTotals).filter(
    (cat) => (categoryAccessible[cat] || 0) === 0 && categoryTotals[cat] > 0,
  );

  // By difficulty
  const difficulties: TaskDifficulty[] = ["easy", "medium", "hard", "elite", "master"];
  const byDifficulty = {} as Record<TaskDifficulty, { accessible: number; total: number }>;
  for (const diff of difficulties) {
    const total = league.tasks.filter((t) => t.difficulty === diff).length;
    const accessible = league.tasks.filter(
      (t) => t.difficulty === diff && (allAreasOpen || !t.region || accessibleRegions.has(t.region)),
    ).length;
    byDifficulty[diff] = { accessible, total };
  }

  return {
    accessibleTasks: accessibleTaskCount,
    accessiblePoints: accessiblePointCount,
    totalTasks,
    totalPoints,
    taskPercent: totalTasks > 0 ? Math.round((accessibleTaskCount / totalTasks) * 100) : 0,
    pointPercent: totalPoints > 0 ? Math.round((accessiblePointCount / totalPoints) * 100) : 0,
    categoryGaps,
    byDifficulty,
  };
}
