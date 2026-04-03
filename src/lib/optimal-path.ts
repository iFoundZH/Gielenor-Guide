import type { LeagueData, LeagueTask, TaskDifficulty } from "@/types/league";
import type {
  PathGoal,
  PathMilestone,
  PathStage,
  OptimalPathResult,
  RegionRecommendation,
} from "@/types/optimal-path";

const DIFFICULTY_ORDER: TaskDifficulty[] = ["easy", "medium", "hard", "elite", "master"];

function emptyDifficultyBreakdown(): Record<TaskDifficulty, number> {
  return { easy: 0, medium: 0, hard: 0, elite: 0, master: 0 };
}

/** Generate preset goal options from a league's reward tiers + an "all relics" goal. */
export function buildGoals(league: LeagueData): PathGoal[] {
  const goals: PathGoal[] = league.rewardTiers.map((tier) => ({
    type: "reward-tier" as const,
    targetPoints: tier.pointsRequired,
    label: `${tier.name} Tier`,
    color: tier.color,
  }));

  // Add "All Relics" goal if any relic tier has pointsToUnlock
  const maxRelicPoints = Math.max(
    ...league.relicTiers.map((t) => t.pointsToUnlock ?? 0)
  );
  if (maxRelicPoints > 0) {
    goals.push({
      type: "all-relics",
      targetPoints: maxRelicPoints,
      label: "All Relics Unlocked",
      color: "#a855f7", // purple
    });
  }

  return goals;
}

/** Collect relic and reward tier milestones up to a target, sorted ascending. */
export function computeMilestones(
  league: LeagueData,
  targetPoints: number
): PathMilestone[] {
  const milestones: PathMilestone[] = [];

  // Relic tier milestones (only if pointsToUnlock is defined)
  for (const tier of league.relicTiers) {
    if (tier.pointsToUnlock != null && tier.pointsToUnlock > 0 && tier.pointsToUnlock <= targetPoints) {
      milestones.push({
        type: "relic-unlock",
        pointsRequired: tier.pointsToUnlock,
        label: `Tier ${tier.tier} Relic Unlock`,
        passiveEffects: tier.passiveEffects,
      });
    }
  }

  // Reward tier milestones
  for (const tier of league.rewardTiers) {
    if (tier.pointsRequired <= targetPoints) {
      milestones.push({
        type: "reward-tier",
        pointsRequired: tier.pointsRequired,
        label: `${tier.name} Reward Tier`,
        passiveEffects: [],
      });
    }
  }

  // Final milestone at the target itself (if not already present)
  if (!milestones.some((m) => m.pointsRequired === targetPoints)) {
    milestones.push({
      type: "reward-tier",
      pointsRequired: targetPoints,
      label: "Goal Reached",
      passiveEffects: [],
    });
  }

  // Sort ascending, deduplicate by points
  milestones.sort((a, b) => a.pointsRequired - b.pointsRequired);
  const seen = new Set<number>();
  return milestones.filter((m) => {
    if (seen.has(m.pointsRequired)) return false;
    seen.add(m.pointsRequired);
    return true;
  });
}

/** Greedy region recommendation: pick the choosable region that maximizes accessible task points. */
export function recommendRegions(league: LeagueData): RegionRecommendation[] {
  const choosable = league.regions.filter((r) => r.type === "choosable");
  const recommendations: RegionRecommendation[] = choosable.map((region) => {
    const regionTasks = league.tasks.filter((t) => t.region === region.id);
    return {
      regionId: region.id,
      regionName: region.name,
      accessiblePoints: regionTasks.reduce((sum, t) => sum + t.points, 0),
      accessibleTasks: regionTasks.length,
      rank: 0,
    };
  });

  // Sort by accessible points descending
  recommendations.sort((a, b) => b.accessiblePoints - a.accessiblePoints);
  recommendations.forEach((r, i) => {
    r.rank = i + 1;
  });

  return recommendations;
}

/** Filter tasks to those accessible with given region IDs. Tasks with no region are always accessible. */
function filterAccessibleTasks(
  tasks: LeagueTask[],
  regionIds: string[],
  league: LeagueData
): LeagueTask[] {
  // Auto-include starting + auto-unlock regions
  const accessibleRegions = new Set(regionIds);
  for (const r of league.regions) {
    if (r.type === "starting" || r.type === "auto-unlock") {
      accessibleRegions.add(r.id);
    }
  }

  return tasks.filter((t) => !t.region || accessibleRegions.has(t.region));
}

/** Main algorithm: compute the optimal task ordering to reach a goal. */
export function computeOptimalPath(
  league: LeagueData,
  regionIds: string[],
  goal: PathGoal,
  excludeTaskIds?: Set<string>
): OptimalPathResult {
  const recommendations = recommendRegions(league);
  let accessibleTasks = filterAccessibleTasks(league.tasks, regionIds, league);

  // Exclude completed tasks if provided
  if (excludeTaskIds && excludeTaskIds.size > 0) {
    accessibleTasks = accessibleTasks.filter((t) => !excludeTaskIds.has(t.id));
  }

  // Sort by difficulty ascending (most efficient first)
  accessibleTasks.sort(
    (a, b) => DIFFICULTY_ORDER.indexOf(a.difficulty) - DIFFICULTY_ORDER.indexOf(b.difficulty)
  );

  const milestones = computeMilestones(league, goal.targetPoints);
  const totalAccessiblePoints = accessibleTasks.reduce((s, t) => s + t.points, 0);
  const isAchievable = totalAccessiblePoints >= goal.targetPoints;
  const pointsShortfall = isAchievable ? 0 : goal.targetPoints - totalAccessiblePoints;

  // Build stages from milestones
  const stages: PathStage[] = [];
  let taskIndex = 0;
  let cumulativePoints = 0;

  for (let i = 0; i < milestones.length; i++) {
    const milestone = milestones[i];
    const stageTasks: LeagueTask[] = [];
    let stagePoints = 0;

    // Add tasks until we reach this milestone's threshold or run out
    while (taskIndex < accessibleTasks.length && cumulativePoints + stagePoints < milestone.pointsRequired) {
      const task = accessibleTasks[taskIndex];
      stageTasks.push(task);
      stagePoints += task.points;
      taskIndex++;
    }

    cumulativePoints += stagePoints;

    const tasksByDifficulty = emptyDifficultyBreakdown();
    const tasksByCategory: Record<string, number> = {};
    for (const task of stageTasks) {
      tasksByDifficulty[task.difficulty]++;
      tasksByCategory[task.category] = (tasksByCategory[task.category] || 0) + 1;
    }

    stages.push({
      stageNumber: i + 1,
      milestone,
      tasks: stageTasks,
      stagePoints,
      cumulativePoints,
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
    isAchievable,
    pointsShortfall,
    difficultyBreakdown,
    regionIds,
    recommendedRegions: recommendations,
  };
}
