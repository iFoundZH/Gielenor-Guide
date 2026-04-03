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

export interface PathStage {
  stageNumber: number;
  milestone: PathMilestone;
  tasks: LeagueTask[];
  stagePoints: number;
  cumulativePoints: number;
  tasksByDifficulty: Record<TaskDifficulty, number>;
  tasksByCategory: Record<string, number>;
}

export interface OptimalPathResult {
  goal: PathGoal;
  stages: PathStage[];
  totalTasks: number;
  totalPoints: number;
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
}
