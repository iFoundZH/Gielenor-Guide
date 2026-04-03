import type { LeagueData, LeagueTask, TaskDifficulty } from "@/types/league";
import type {
  PathGoal,
  ProgressionPhase,
  ProgressionResult,
  RegionRecommendation,
  CategoryFocusEntry,
  RewardTierMilestone,
} from "@/types/optimal-path";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DIFFICULTY_ORDER: TaskDifficulty[] = [
  "easy",
  "medium",
  "hard",
  "elite",
  "master",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function emptyDifficultyBreakdown(): Record<TaskDifficulty, number> {
  return { easy: 0, medium: 0, hard: 0, elite: 0, master: 0 };
}

function countDifficulty(tasks: LeagueTask[]): Record<TaskDifficulty, number> {
  const counts = emptyDifficultyBreakdown();
  for (const t of tasks) counts[t.difficulty]++;
  return counts;
}

// ---------------------------------------------------------------------------
// Public: Goal builder
// ---------------------------------------------------------------------------

/** Generate preset goal options from a league's reward tiers + an "all relics" goal. */
export function buildGoals(league: LeagueData): PathGoal[] {
  const goals: PathGoal[] = league.rewardTiers.map((tier) => ({
    type: "reward-tier" as const,
    targetPoints: tier.pointsRequired,
    label: `${tier.name} Tier`,
    color: tier.color,
  }));

  const maxRelicPoints = Math.max(
    ...league.relicTiers.map((t) => t.pointsToUnlock ?? 0)
  );
  if (maxRelicPoints > 0) {
    goals.push({
      type: "all-relics",
      targetPoints: maxRelicPoints,
      label: "All Relics Unlocked",
      color: "#a855f7",
    });
  }

  return goals;
}

// ---------------------------------------------------------------------------
// Public: Region recommendations
// ---------------------------------------------------------------------------

/** Rank choosable regions by accessible task points, with echo boss bonus. */
export function recommendRegions(
  league: LeagueData
): RegionRecommendation[] {
  const choosable = league.regions.filter((r) => r.type === "choosable");

  const recommendations: RegionRecommendation[] = choosable.map((region) => {
    const regionTasks = league.tasks.filter((t) => t.region === region.id);
    const rawPoints = regionTasks.reduce((sum, t) => sum + t.points, 0);
    const hasEchoBoss = !!region.echoBoss;
    const accessiblePoints = hasEchoBoss
      ? Math.round(rawPoints * 1.1)
      : rawPoints;

    return {
      regionId: region.id,
      regionName: region.name,
      accessiblePoints,
      accessibleTasks: regionTasks.length,
      rank: 0,
      hasEchoBoss,
      efficiencyScore: 0,
    };
  });

  recommendations.sort((a, b) => b.accessiblePoints - a.accessiblePoints);
  recommendations.forEach((r, i) => {
    r.rank = i + 1;
  });

  return recommendations;
}

// ---------------------------------------------------------------------------
// Internal: Task filtering
// ---------------------------------------------------------------------------

function filterAccessibleTasks(
  tasks: LeagueTask[],
  regionIds: string[],
  league: LeagueData
): LeagueTask[] {
  const accessibleRegions = new Set(regionIds);
  for (const r of league.regions) {
    if (r.type === "starting" || r.type === "auto-unlock") {
      accessibleRegions.add(r.id);
    }
  }
  return tasks.filter((t) => !t.region || accessibleRegions.has(t.region));
}

// ---------------------------------------------------------------------------
// Internal: Multi-factor task sorting
// ---------------------------------------------------------------------------

function sortByPriority(
  tasks: LeagueTask[],
  league: LeagueData
): LeagueTask[] {
  const startingIds = new Set<string>();
  const autoUnlockIds = new Set<string>();
  for (const r of league.regions) {
    if (r.type === "starting") startingIds.add(r.id);
    else if (r.type === "auto-unlock") autoUnlockIds.add(r.id);
  }

  function regionPriority(task: LeagueTask): number {
    if (!task.region) return 2;
    if (startingIds.has(task.region)) return 0;
    if (autoUnlockIds.has(task.region)) return 1;
    return 3;
  }

  return [...tasks].sort((a, b) => {
    const da = DIFFICULTY_ORDER.indexOf(a.difficulty);
    const db = DIFFICULTY_ORDER.indexOf(b.difficulty);
    if (da !== db) return da - db;

    const ra = regionPriority(a);
    const rb = regionPriority(b);
    if (ra !== rb) return ra - rb;

    const ca = a.category.toLowerCase();
    const cb = b.category.toLowerCase();
    if (ca !== cb) return ca < cb ? -1 : 1;

    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
  });
}

// ---------------------------------------------------------------------------
// Internal: Highlighted task selection
// ---------------------------------------------------------------------------

/**
 * Pick a representative sample of key tasks for a phase.
 * Up to 4 easy, 3 medium, 2 hard, 1 elite — max 10 total.
 * Tasks are already sorted by region priority so starting-region tasks come first.
 */
function pickHighlightedTasks(tasks: LeagueTask[]): LeagueTask[] {
  const limits: Record<TaskDifficulty, number> = {
    easy: 4,
    medium: 3,
    hard: 2,
    elite: 1,
    master: 0,
  };
  const counts: Record<TaskDifficulty, number> = emptyDifficultyBreakdown();
  const highlighted: LeagueTask[] = [];

  for (const task of tasks) {
    if (counts[task.difficulty] < limits[task.difficulty]) {
      highlighted.push(task);
      counts[task.difficulty]++;
      if (highlighted.length >= 10) break;
    }
  }

  return highlighted;
}

// ---------------------------------------------------------------------------
// Internal: Category focus computation
// ---------------------------------------------------------------------------

function computeCategoryFocus(tasks: LeagueTask[]): CategoryFocusEntry[] {
  const map = new Map<string, { count: number; points: number }>();
  for (const t of tasks) {
    const existing = map.get(t.category);
    if (existing) {
      existing.count++;
      existing.points += t.points;
    } else {
      map.set(t.category, { count: 1, points: t.points });
    }
  }
  return [...map.entries()]
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.points - a.points)
    .slice(0, 5);
}

// ---------------------------------------------------------------------------
// Internal: Phase boundary computation
// ---------------------------------------------------------------------------

interface PhaseBoundary {
  endPoints: number;
  relicTier: number | null;
  passiveEffects: string[];
  relicChoices: import("@/types/league").Relic[];
  name: string;
}

/**
 * Build phase boundaries from relic tiers (preferred) or reward tiers (fallback).
 * Returns boundaries sorted ascending by endPoints, deduplicated.
 */
function buildPhaseBoundaries(
  league: LeagueData,
  targetPoints: number
): { boundaries: PhaseBoundary[]; hasRelicThresholds: boolean } {
  // Check if relic tiers have pointsToUnlock values
  const relicTiersWithPoints = league.relicTiers.filter(
    (t) => t.pointsToUnlock != null && t.pointsToUnlock > 0
  );

  const hasRelicThresholds = relicTiersWithPoints.length > 0;

  const boundaries: PhaseBoundary[] = [];

  if (hasRelicThresholds) {
    // Use relic tiers as phase boundaries
    let prevPoints = 0;
    for (const tier of relicTiersWithPoints.sort(
      (a, b) => (a.pointsToUnlock ?? 0) - (b.pointsToUnlock ?? 0)
    )) {
      const pts = tier.pointsToUnlock ?? 0;
      if (pts <= targetPoints && pts > prevPoints) {
        boundaries.push({
          endPoints: pts,
          relicTier: tier.tier,
          passiveEffects: tier.passiveEffects,
          relicChoices: tier.relics,
          name: `Tier ${tier.tier} Relic`,
        });
        prevPoints = pts;
      }
    }
    // If target goes beyond last relic tier, add a final phase
    const lastBoundary = boundaries[boundaries.length - 1];
    if (!lastBoundary || lastBoundary.endPoints < targetPoints) {
      boundaries.push({
        endPoints: targetPoints,
        relicTier: null,
        passiveEffects: [],
        relicChoices: [],
        name: "Goal Reached",
      });
    }
  } else {
    // Fallback: use reward tiers as boundaries
    for (const tier of league.rewardTiers) {
      if (tier.pointsRequired <= targetPoints) {
        boundaries.push({
          endPoints: tier.pointsRequired,
          relicTier: null,
          passiveEffects: [],
          relicChoices: [],
          name: `${tier.name} Trophy`,
        });
      }
    }
    // Ensure the exact goal is a boundary
    if (!boundaries.some((b) => b.endPoints === targetPoints)) {
      boundaries.push({
        endPoints: targetPoints,
        relicTier: null,
        passiveEffects: [],
        relicChoices: [],
        name: "Goal Reached",
      });
    }
    boundaries.sort((a, b) => a.endPoints - b.endPoints);
  }

  // Deduplicate by endPoints (keep first)
  const seen = new Set<number>();
  const deduped = boundaries.filter((b) => {
    if (seen.has(b.endPoints)) return false;
    seen.add(b.endPoints);
    return true;
  });

  return { boundaries: deduped, hasRelicThresholds };
}

// ---------------------------------------------------------------------------
// Internal: Reward tier milestones within a range
// ---------------------------------------------------------------------------

function findRewardTiersCrossed(
  league: LeagueData,
  startPoints: number,
  endPoints: number
): RewardTierMilestone[] {
  return league.rewardTiers
    .filter(
      (t) => t.pointsRequired > startPoints && t.pointsRequired <= endPoints
    )
    .map((t) => ({
      name: `${t.name} Trophy`,
      pointsRequired: t.pointsRequired,
      color: t.color,
    }));
}

// ---------------------------------------------------------------------------
// Public: Main algorithm
// ---------------------------------------------------------------------------

/**
 * Compute a progression guide organized by relic-tier milestones.
 *
 * Algorithm:
 *   1. Filter to accessible tasks (by region + exclusions)
 *   2. Sort by composite priority (difficulty -> region -> category -> name)
 *   3. Build phase boundaries from relic tiers (or reward tiers as fallback)
 *   4. Greedily assign sorted tasks to phases until each boundary is met
 *   5. Compute highlighted tasks, category focus, reward tiers crossed per phase
 */
export function computeProgression(
  league: LeagueData,
  regionIds: string[],
  goal: PathGoal,
  excludeTaskIds?: Set<string>
): ProgressionResult {
  const recommendations = recommendRegions(league);

  let accessibleTasks = filterAccessibleTasks(league.tasks, regionIds, league);
  if (excludeTaskIds && excludeTaskIds.size > 0) {
    accessibleTasks = accessibleTasks.filter(
      (t) => !excludeTaskIds.has(t.id)
    );
  }

  const sorted = sortByPriority(accessibleTasks, league);

  const totalAccessiblePoints = sorted.reduce((s, t) => s + t.points, 0);
  const isAchievable = totalAccessiblePoints >= goal.targetPoints;
  const pointsShortfall = isAchievable
    ? 0
    : goal.targetPoints - totalAccessiblePoints;

  const { boundaries, hasRelicThresholds } = buildPhaseBoundaries(
    league,
    goal.targetPoints
  );

  // Build phases from boundaries
  const phases: ProgressionPhase[] = [];
  let taskIndex = 0;
  let cumulativePoints = 0;

  for (let i = 0; i < boundaries.length; i++) {
    const boundary = boundaries[i];
    const startPoints = i === 0 ? 0 : boundaries[i - 1].endPoints;
    const phaseTasks: LeagueTask[] = [];
    let phasePoints = 0;

    // Add tasks until we reach this boundary or run out
    while (
      taskIndex < sorted.length &&
      cumulativePoints + phasePoints < boundary.endPoints
    ) {
      phaseTasks.push(sorted[taskIndex]);
      phasePoints += sorted[taskIndex].points;
      taskIndex++;
    }

    cumulativePoints += phasePoints;

    // Skip empty phases
    if (phaseTasks.length === 0) continue;

    const phaseName = i === 0 && hasRelicThresholds
      ? `Start \u2192 ${boundary.name}`
      : boundary.name;

    phases.push({
      phaseNumber: phases.length + 1,
      name: phaseName,
      startPoints,
      endPoints: boundary.endPoints,
      targetRelicTier: boundary.relicTier,
      passiveEffects: boundary.passiveEffects,
      relicChoices: boundary.relicChoices,
      highlightedTasks: pickHighlightedTasks(phaseTasks),
      allTasks: phaseTasks,
      categoryFocus: computeCategoryFocus(phaseTasks),
      tasksByDifficulty: countDifficulty(phaseTasks),
      totalPoints: phasePoints,
      cumulativePoints,
      rewardTiersCrossed: findRewardTiersCrossed(league, startPoints, boundary.endPoints),
    });
  }

  // Overall difficulty breakdown
  const difficultyBreakdown = emptyDifficultyBreakdown();
  for (const phase of phases) {
    for (const d of DIFFICULTY_ORDER) {
      difficultyBreakdown[d] += phase.tasksByDifficulty[d];
    }
  }

  return {
    goal,
    phases,
    totalTasks: phases.reduce((s, p) => s + p.allTasks.length, 0),
    totalPoints: cumulativePoints,
    isAchievable,
    pointsShortfall,
    difficultyBreakdown,
    regionIds,
    recommendedRegions: recommendations,
    hasRelicThresholds,
  };
}
