/**
 * Player Scoring System — "Gielinor Score" (GS)
 *
 * Inspired by Raider.io for WoW, this calculates a composite score
 * for a player's league performance based on multiple dimensions:
 *
 * - Task Score: weighted by difficulty (master tasks worth more)
 * - Speed Score: how quickly tasks were completed (time-weighted)
 * - Build Score: synergy quality of chosen relics + pacts
 * - Completion Score: breadth across categories
 * - Risk Score: bonus for running high-penalty pact combinations
 *
 * Scores are normalized to a 0-3000 scale, similar to M+ scores.
 */

import { LeagueBuild, LeagueData, Pact, Relic } from "@/types/league";

export interface GielinorScore {
  total: number;
  breakdown: {
    tasks: number;
    completion: number;
    build: number;
    risk: number;
  };
  rank: ScoreRank;
  percentile: number;
}

export type ScoreRank =
  | "Unranked"
  | "Bronze"
  | "Iron"
  | "Steel"
  | "Mithril"
  | "Adamant"
  | "Rune"
  | "Dragon"
  | "Infernal";

const RANK_THRESHOLDS: { rank: ScoreRank; min: number; color: string }[] = [
  { rank: "Infernal", min: 2700, color: "#ff4444" },
  { rank: "Dragon", min: 2400, color: "#dc2626" },
  { rank: "Rune", min: 2000, color: "#00b4d8" },
  { rank: "Adamant", min: 1600, color: "#2e8b57" },
  { rank: "Mithril", min: 1200, color: "#4a5d8a" },
  { rank: "Steel", min: 800, color: "#71797E" },
  { rank: "Iron", min: 400, color: "#a8a8a8" },
  { rank: "Bronze", min: 100, color: "#cd7f32" },
  { rank: "Unranked", min: 0, color: "#555555" },
];

export function getRankInfo(score: number): { rank: ScoreRank; color: string } {
  for (const tier of RANK_THRESHOLDS) {
    if (score >= tier.min) {
      return { rank: tier.rank, color: tier.color };
    }
  }
  return { rank: "Unranked", color: "#555555" };
}

export function calculateGielinorScore(
  build: LeagueBuild,
  league: LeagueData
): GielinorScore {
  // Task Score (0-1500): weighted by difficulty
  const difficultyWeights = { easy: 1, medium: 3, hard: 8, elite: 20, master: 50 };
  const maxTaskScore = league.tasks.reduce(
    (sum, t) => sum + (difficultyWeights[t.difficulty] || 1),
    0
  );
  const earnedTaskScore = league.tasks
    .filter((t) => build.completedTasks.includes(t.id))
    .reduce((sum, t) => sum + (difficultyWeights[t.difficulty] || 1), 0);
  const taskScore = Math.round((earnedTaskScore / maxTaskScore) * 1500);

  // Completion Score (0-500): breadth across categories
  const categories = new Set(league.tasks.map((t) => t.category));
  const completedCategories = new Set(
    league.tasks
      .filter((t) => build.completedTasks.includes(t.id))
      .map((t) => t.category)
  );
  const completionScore = Math.round(
    (completedCategories.size / categories.size) * 500
  );

  // Build Score (0-500): relic synergy quality
  const allRelics = league.relicTiers.flatMap((t) => t.relics);
  const selectedRelics = allRelics.filter((r) => build.relics.includes(r.id));
  const selectedPacts = league.pacts.filter((p) => build.pacts.includes(p.id));
  const buildScore = calculateBuildSynergy(selectedRelics, selectedPacts);

  // Risk Score (0-500): bonus for dangerous pact combinations
  const riskScore = calculateRiskScore(selectedPacts);

  const total = taskScore + completionScore + buildScore + riskScore;
  const { rank } = getRankInfo(total);

  // Simulate percentile (in production this would come from a real leaderboard)
  const percentile = Math.min(99.9, Math.max(0.1, (total / 3000) * 100));

  return {
    total,
    breakdown: {
      tasks: taskScore,
      completion: completionScore,
      build: buildScore,
      risk: riskScore,
    },
    rank,
    percentile,
  };
}

function calculateBuildSynergy(relics: Relic[], pacts: Pact[]): number {
  let score = 0;

  // Base score for having relics selected
  score += relics.length * 40;

  const relicIds = new Set(relics.map((r) => r.id));
  const pactIds = new Set(pacts.map((p) => p.id));

  // Demonic Pacts synergies
  // Endless Harvest + Woodsman: gathering auto-banks + instant fletching/doubled hunter
  if (relicIds.has("relic-t1-1") && relicIds.has("relic-t2-1")) score += 60;
  // Evil Eye (boss teleports) + any combat pact
  if (relicIds.has("relic-t3-1") && pacts.some((p) => p.category === "combat")) score += 50;
  // Culling Spree (slayer relic) + Melee Might or Ranged Fury or Magic Surge
  if (relicIds.has("relic-t6-1") && (pactIds.has("pact-melee-might") || pactIds.has("pact-ranged-fury") || pactIds.has("pact-magic-surge"))) score += 70;
  // Minion + Glass Cannon: companion deals damage while you're fragile
  if (relicIds.has("relic-t8-1") && pactIds.has("pact-glass-cannon")) score += 80;
  // Minion + Vampiric Touch: companion attacks while you lifesteal
  if (relicIds.has("relic-t8-1") && pactIds.has("pact-vampiric-touch")) score += 60;
  // Abundance (+10 skill boost) + any T2+ pact: strong early-game synergy
  if (relicIds.has("relic-t1-3") && pacts.length >= 2) score += 50;

  // Raging Echoes synergies
  // Endless Harvest + Infernal Gathering: auto-bank + auto-process
  if (relicIds.has("re-t1-2") && relicIds.has("re-t3-2")) score += 70;
  // Knife's Edge (3x dmg at 10hp) + Berserker (dmg scales with missing hp)
  if (relicIds.has("re-t3-3") && relicIds.has("re-t6-2")) score += 80;
  // Weapon Specialist (fast attacks) + any combat mastery
  if (relicIds.has("re-t6-1") && pacts.some((p) => p.category === "combat")) score += 60;
  // Trickster + Dodgy Dealings: thieving synergy
  if (relicIds.has("re-t1-1") && relicIds.has("re-t8-3")) score += 70;
  // Echo Augmentation + Treasure Seeker: boss loot synergy
  if (relicIds.has("re-t7-1") && relicIds.has("re-t7-2")) score += 0; // same tier, can't pick both
  // Last Recall + Soul Stealer: teleport-kill-return cycle
  if (relicIds.has("re-t5-2") && relicIds.has("re-t4-2")) score += 60;
  // Production Prodigy + Pocket Crafter: production everywhere
  if (relicIds.has("re-t1-3") && relicIds.has("re-t7-3")) score += 50;

  return Math.min(500, score);
}

function calculateRiskScore(pacts: Pact[]): number {
  let score = 0;

  // More pacts = more risk = more score
  score += pacts.length * 50;

  // High-tier pacts worth more
  score += pacts.filter((p) => p.tier >= 3).length * 80;
  score += pacts.filter((p) => p.tier >= 2).length * 40;

  // Demonic Pacts dangerous combos
  const pactIds = new Set(pacts.map((p) => p.id));
  // Glass Cannon (increased damage taken) + Berserker's Oath (no protection prayers) = extreme risk
  if (pactIds.has("pact-glass-cannon") && pactIds.has("pact-berserker")) score += 100;
  // Glass Cannon + any combat style pact = high risk, high reward
  if (pactIds.has("pact-glass-cannon") && (pactIds.has("pact-melee-might") || pactIds.has("pact-ranged-fury") || pactIds.has("pact-magic-surge"))) score += 60;
  // Vampiric Touch + Berserker's Oath = lifesteal without prayers
  if (pactIds.has("pact-vampiric-touch") && pactIds.has("pact-berserker")) score += 70;

  return Math.min(500, score);
}

/**
 * Format a score for display with color
 */
export function formatScore(score: number): { text: string; color: string } {
  const { color } = getRankInfo(score);
  return { text: score.toLocaleString(), color };
}

/**
 * Get all rank tiers for display
 */
export function getAllRanks() {
  return RANK_THRESHOLDS;
}
