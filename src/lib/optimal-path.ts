import type { LeagueData, LeagueTask, TaskDifficulty } from "@/types/league";
import type {
  PathGoal,
  PathMilestone,
  PathStage,
  TaskCluster,
  OptimalPathResult,
  RegionRecommendation,
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

/** Empirical average minutes per task by difficulty (from efficiency-calculator). */
const MINUTES_PER_TASK: Record<TaskDifficulty, number> = {
  easy: 2,
  medium: 8,
  hard: 25,
  elite: 60,
  master: 120,
};

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

function estimateMinutes(tasks: LeagueTask[]): number {
  let total = 0;
  for (const t of tasks) total += MINUTES_PER_TASK[t.difficulty] ?? 10;
  return total;
}

function estimatePointsPerHour(tasks: LeagueTask[]): number {
  if (tasks.length === 0) return 0;
  const mins = estimateMinutes(tasks);
  if (mins === 0) return 0;
  const pts = tasks.reduce((s, t) => s + t.points, 0);
  return Math.round((pts / mins) * 60);
}

/**
 * Build a region-name lookup from league data.
 */
function buildRegionNameMap(league: LeagueData): Map<string, string> {
  const map = new Map<string, string>();
  for (const r of league.regions) map.set(r.id, r.name);
  return map;
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
// Public: Milestones
// ---------------------------------------------------------------------------

/** Collect relic and reward tier milestones up to a target, sorted ascending. */
export function computeMilestones(
  league: LeagueData,
  targetPoints: number
): PathMilestone[] {
  const milestones: PathMilestone[] = [];

  for (const tier of league.relicTiers) {
    if (
      tier.pointsToUnlock != null &&
      tier.pointsToUnlock > 0 &&
      tier.pointsToUnlock <= targetPoints
    ) {
      milestones.push({
        type: "relic-unlock",
        pointsRequired: tier.pointsToUnlock,
        label: `Tier ${tier.tier} Relic`,
        passiveEffects: tier.passiveEffects,
      });
    }
  }

  for (const tier of league.rewardTiers) {
    if (tier.pointsRequired <= targetPoints) {
      milestones.push({
        type: "reward-tier",
        pointsRequired: tier.pointsRequired,
        label: `${tier.name} Trophy`,
        passiveEffects: [],
      });
    }
  }

  if (!milestones.some((m) => m.pointsRequired === targetPoints)) {
    milestones.push({
      type: "reward-tier",
      pointsRequired: targetPoints,
      label: "Goal Reached",
      passiveEffects: [],
    });
  }

  milestones.sort((a, b) => a.pointsRequired - b.pointsRequired);
  const seen = new Set<number>();
  return milestones.filter((m) => {
    if (seen.has(m.pointsRequired)) return false;
    seen.add(m.pointsRequired);
    return true;
  });
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
    // Echo boss bonus: 10% boost reflects the extra master-tier task potential
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
      efficiencyScore: estimatePointsPerHour(regionTasks),
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

/** Filter tasks to those accessible with given region IDs. */
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

/**
 * Sort tasks by composite priority:
 *   1. Difficulty ascending (easy tasks are most pts-per-minute efficient)
 *   2. Region priority (starting > auto-unlock > general > chosen)
 *   3. Category alphabetical (keeps related tasks adjacent for clustering)
 *   4. Task name (stable sort)
 */
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
    if (!task.region) return 2; // general — can do anywhere
    if (startingIds.has(task.region)) return 0;
    if (autoUnlockIds.has(task.region)) return 1;
    return 3; // chosen region — requires unlock
  }

  return [...tasks].sort((a, b) => {
    // 1. Difficulty ascending
    const da = DIFFICULTY_ORDER.indexOf(a.difficulty);
    const db = DIFFICULTY_ORDER.indexOf(b.difficulty);
    if (da !== db) return da - db;

    // 2. Region priority
    const ra = regionPriority(a);
    const rb = regionPriority(b);
    if (ra !== rb) return ra - rb;

    // 3. Category alphabetical (groups related tasks)
    const ca = a.category.toLowerCase();
    const cb = b.category.toLowerCase();
    if (ca !== cb) return ca < cb ? -1 : 1;

    // 4. Stable by name
    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
  });
}

// ---------------------------------------------------------------------------
// Internal: Task clustering
// ---------------------------------------------------------------------------

/**
 * Group tasks into activity clusters by (category, region).
 *
 * Tasks with the same category and region are grouped together because
 * in practice you do related tasks simultaneously (e.g., all Slayer tasks
 * while training Slayer in a specific area).
 */
function clusterTasks(
  tasks: LeagueTask[],
  regionNames: Map<string, string>
): TaskCluster[] {
  // Group by (category, region || "general")
  const groups = new Map<string, LeagueTask[]>();
  for (const task of tasks) {
    const regionKey = task.region ?? "general";
    const key = `${task.category}|${regionKey}`;
    let group = groups.get(key);
    if (!group) {
      group = [];
      groups.set(key, group);
    }
    group.push(task);
  }

  const clusters: TaskCluster[] = [];
  for (const [key, groupTasks] of groups) {
    const [category, regionKey] = key.split("|");
    const isGeneral = regionKey === "general";
    const rName = isGeneral ? undefined : regionNames.get(regionKey);

    clusters.push({
      label: isGeneral ? category : `${rName ?? regionKey} — ${category}`,
      category,
      region: isGeneral ? undefined : regionKey,
      regionName: rName,
      tasks: groupTasks,
      totalPoints: groupTasks.reduce((s, t) => s + t.points, 0),
      estimatedMinutes: estimateMinutes(groupTasks),
      tasksByDifficulty: countDifficulty(groupTasks),
    });
  }

  // Sort clusters: region-specific first (by region name), then general (by points desc)
  clusters.sort((a, b) => {
    // Region-specific clusters before general
    if (a.region && !b.region) return -1;
    if (!a.region && b.region) return 1;
    // Within same bucket, by total points descending
    return b.totalPoints - a.totalPoints;
  });

  return clusters;
}

// ---------------------------------------------------------------------------
// Internal: Phase naming
// ---------------------------------------------------------------------------

function getPhaseName(
  stageIndex: number,
  milestone: PathMilestone,
  totalStages: number
): string {
  if (totalStages === 1) return "Complete Path";
  if (stageIndex === 0) return "Sprint Start";
  if (stageIndex === totalStages - 1 && milestone.label === "Goal Reached") {
    return "Final Push";
  }
  if (milestone.type === "relic-unlock") return "Relic Unlock";

  // Reward tier milestones — name by position
  const position = stageIndex / (totalStages - 1);
  if (position <= 0.33) return "Early Progress";
  if (position <= 0.66) return "Mid-Game";
  return "Late Push";
}

// ---------------------------------------------------------------------------
// Public: Main algorithm
// ---------------------------------------------------------------------------

/**
 * Compute an efficient task path to reach a goal.
 *
 * Algorithm:
 *   1. Filter to accessible tasks (by region + exclusions)
 *   2. Sort by composite priority (difficulty → region → category → name)
 *   3. Compute milestones (relic unlocks + reward tiers up to goal)
 *   4. Assign tasks to milestone stages (greedy fill to threshold)
 *   5. Cluster tasks within each stage by activity context
 *   6. Compute metadata (estimated time, difficulty breakdown, phase names)
 */
export function computeOptimalPath(
  league: LeagueData,
  regionIds: string[],
  goal: PathGoal,
  excludeTaskIds?: Set<string>
): OptimalPathResult {
  const recommendations = recommendRegions(league);
  const regionNames = buildRegionNameMap(league);

  let accessibleTasks = filterAccessibleTasks(league.tasks, regionIds, league);

  if (excludeTaskIds && excludeTaskIds.size > 0) {
    accessibleTasks = accessibleTasks.filter(
      (t) => !excludeTaskIds.has(t.id)
    );
  }

  // Sort by composite priority
  const sorted = sortByPriority(accessibleTasks, league);

  const milestones = computeMilestones(league, goal.targetPoints);
  const totalAccessiblePoints = sorted.reduce((s, t) => s + t.points, 0);
  const isAchievable = totalAccessiblePoints >= goal.targetPoints;
  const pointsShortfall = isAchievable
    ? 0
    : goal.targetPoints - totalAccessiblePoints;

  // Build stages from milestones
  const stages: PathStage[] = [];
  let taskIndex = 0;
  let cumulativePoints = 0;

  for (let i = 0; i < milestones.length; i++) {
    const milestone = milestones[i];
    const stageTasks: LeagueTask[] = [];
    let stagePoints = 0;

    // Add tasks until we reach this milestone's threshold or run out
    while (
      taskIndex < sorted.length &&
      cumulativePoints + stagePoints < milestone.pointsRequired
    ) {
      stageTasks.push(sorted[taskIndex]);
      stagePoints += sorted[taskIndex].points;
      taskIndex++;
    }

    cumulativePoints += stagePoints;

    // Skip empty stages (can happen when milestones are close together)
    if (stageTasks.length === 0) continue;

    const tasksByDifficulty = countDifficulty(stageTasks);
    const tasksByCategory: Record<string, number> = {};
    for (const task of stageTasks) {
      tasksByCategory[task.category] =
        (tasksByCategory[task.category] || 0) + 1;
    }

    const clusters = clusterTasks(stageTasks, regionNames);

    stages.push({
      stageNumber: stages.length + 1,
      name: getPhaseName(i, milestone, milestones.length),
      milestone,
      clusters,
      tasks: stageTasks,
      stagePoints,
      cumulativePoints,
      estimatedMinutes: estimateMinutes(stageTasks),
      tasksByDifficulty,
      tasksByCategory,
    });
  }

  // Overall difficulty breakdown
  const difficultyBreakdown = emptyDifficultyBreakdown();
  for (const stage of stages) {
    for (const d of DIFFICULTY_ORDER) {
      difficultyBreakdown[d] += stage.tasksByDifficulty[d];
    }
  }

  return {
    goal,
    stages,
    totalTasks: stages.reduce((s, st) => s + st.tasks.length, 0),
    totalPoints: cumulativePoints,
    totalEstimatedMinutes: stages.reduce(
      (s, st) => s + st.estimatedMinutes,
      0
    ),
    isAchievable,
    pointsShortfall,
    difficultyBreakdown,
    regionIds,
    recommendedRegions: recommendations,
  };
}
