import type { TaskDifficulty } from "./league";

export type RegionTier = "S" | "A" | "B" | "C";

export interface RegionAnalysis {
  regionId: string;
  regionName: string;
  tier: RegionTier;
  totalTasks: number;
  totalPoints: number;
  tasksByDifficulty: Record<TaskDifficulty, number>;
  estimatedPtsPerHour: number;
  uniqueBosses: string[];
  reasoning: string;
}

export interface OptimalRegionPick {
  primary: string[];
  alternative: string[];
  mathJustification: string;
  unlockOrder: string[];
}

export interface RelicTierRecommendation {
  tier: number;
  recommended: string;
  alternatives: string[];
  reasoning: string;
  synergyNotes: string;
}

export interface TaskRoutingPhase {
  name: string;
  pointRange: string;
  strategy: string;
  tasksPerHour: number;
  pointsPerHour: number;
}

export interface DailyMilestone {
  day: number;
  targetPoints: number;
  targetTier: string;
  keyActivities: string[];
}

export interface TierProjection {
  tierName: string;
  pointsRequired: number;
  estimatedHours: number;
  estimatedDay: number;
}

export interface PactProfile {
  name: string;
  description: string;
  riskLevel: "conservative" | "balanced" | "aggressive";
  pacts: string[];
  reasoning: string;
}

export interface PactComboAnalysis {
  combo: string[];
  synergy: string;
  risk: string;
  reward: string;
}

export interface PactOptimization {
  profiles: PactProfile[];
  comboAnalysis: PactComboAnalysis[];
}

export interface MasteryAllocation {
  primaryStyle: string;
  distribution: { style: string; points: number; reasoning: string }[];
}

export interface EchoBossStrategy {
  boss: string;
  region: string;
  strategy: string;
  kph: number;
}

export interface EfficiencyGuide {
  leagueId: string;
  leagueName: string;
  summary: {
    targetPoints: number;
    optimalRegions: string[];
    keyInsight: string;
  };
  regionAnalysis: RegionAnalysis[];
  optimalRegionPick: OptimalRegionPick;
  relicPath: RelicTierRecommendation[];
  taskRouting: TaskRoutingPhase[];
  dailyMilestones: DailyMilestone[];
  tierProjections: TierProjection[];
  pactOptimization?: PactOptimization;
  masteryAllocation?: MasteryAllocation;
  echoBossStrategy?: EchoBossStrategy[];
}
