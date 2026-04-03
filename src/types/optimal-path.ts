import type { LeagueTask, TaskDifficulty } from "./league";

export interface PathGoal {
  type: "reward-tier" | "all-relics";
  targetPoints: number;
  label: string;
  color: string;
}

export interface PathMilestone {
  type: "relic-unlock" | "reward-tier";
  pointsRequired: number;
  label: string;
  passiveEffects: string[];
}

/** A cluster of related tasks grouped by activity context (category + region). */
export interface TaskCluster {
  label: string;
  category: string;
  region?: string;
  regionName?: string;
  tasks: LeagueTask[];
  totalPoints: number;
  estimatedMinutes: number;
  tasksByDifficulty: Record<TaskDifficulty, number>;
}

export interface PathStage {
  stageNumber: number;
  name: string;
  milestone: PathMilestone;
  clusters: TaskCluster[];
  tasks: LeagueTask[];
  stagePoints: number;
  cumulativePoints: number;
  estimatedMinutes: number;
  tasksByDifficulty: Record<TaskDifficulty, number>;
  tasksByCategory: Record<string, number>;
}

export interface OptimalPathResult {
  goal: PathGoal;
  stages: PathStage[];
  totalTasks: number;
  totalPoints: number;
  totalEstimatedMinutes: number;
  isAchievable: boolean;
  pointsShortfall: number;
  difficultyBreakdown: Record<TaskDifficulty, number>;
  regionIds: string[];
  recommendedRegions: RegionRecommendation[];
}

export interface RegionRecommendation {
  regionId: string;
  regionName: string;
  accessiblePoints: number;
  accessibleTasks: number;
  rank: number;
  hasEchoBoss: boolean;
  efficiencyScore: number;
}
