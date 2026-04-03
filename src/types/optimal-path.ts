import type { LeagueTask, TaskDifficulty, Relic } from "./league";

export interface PathGoal {
  type: "reward-tier" | "all-relics";
  targetPoints: number;
  label: string;
  color: string;
}

export interface CategoryFocusEntry {
  category: string;
  count: number;
  points: number;
}

export interface RewardTierMilestone {
  name: string;
  pointsRequired: number;
  color: string;
}

export interface ProgressionPhase {
  phaseNumber: number;
  name: string;
  startPoints: number;
  endPoints: number;
  targetRelicTier: number | null;
  passiveEffects: string[];
  relicChoices: Relic[];
  highlightedTasks: LeagueTask[];
  allTasks: LeagueTask[];
  categoryFocus: CategoryFocusEntry[];
  tasksByDifficulty: Record<TaskDifficulty, number>;
  totalPoints: number;
  cumulativePoints: number;
  rewardTiersCrossed: RewardTierMilestone[];
}

export interface ProgressionResult {
  goal: PathGoal;
  phases: ProgressionPhase[];
  totalTasks: number;
  totalPoints: number;
  isAchievable: boolean;
  pointsShortfall: number;
  difficultyBreakdown: Record<TaskDifficulty, number>;
  regionIds: string[];
  recommendedRegions: RegionRecommendation[];
  hasRelicThresholds: boolean;
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
