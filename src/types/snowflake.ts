import type { SkillName } from "./league";

export type SnowflakeAccountMode = "main" | "ironman" | "hardcore" | "ultimate" | "group";

export type SkillRestrictionType = "none" | "locked" | "capped";

export interface SkillRestriction {
  skill: SkillName;
  restriction: SkillRestrictionType;
  cap?: number;
}

export type GoalPriority = "low" | "medium" | "high";
export type GoalCategory = "quest" | "boss" | "skill" | "diary" | "other";

export interface SnowflakeGoal {
  id: string;
  title: string;
  category: GoalCategory;
  priority: GoalPriority;
  completed: boolean;
}

export interface SnowflakeProfile {
  id: string;
  name: string;
  accountMode: SnowflakeAccountMode;
  allowedRegions: string[];
  skillRestrictions: SkillRestriction[];
  customRules: string[];
  goals: SnowflakeGoal[];
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface OsrsQuest {
  id: string;
  name: string;
  difficulty: "novice" | "intermediate" | "experienced" | "master" | "grandmaster" | "special" | "miniquest";
  region: string;
  skillRequirements: { skill: string; level: number }[];
  questRequirements: string[];
  combatRequired: boolean;
  questPoints: number;
  members: boolean;
  length?: "very short" | "short" | "medium" | "long" | "very long";
  xpRewards?: { skill: string; xp: number }[];
  unlocks?: string[];
  wikiUrl?: string;
}

export interface OsrsBoss {
  id: string;
  name: string;
  region: string;
  combatLevel: number | null;
  skillRequirements: { skill: string; level: number }[];
  questRequirements: string[];
  hitpoints?: number | null;
  attackStyles?: string[];
  members?: boolean;
  category?: ("raid" | "wilderness" | "slayer" | "gwd" | "dt2" | "skilling" | "other")[];
  notableDrops?: string[];
  wikiUrl?: string;
}

export interface ContentBlocker {
  type: "region" | "skill" | "quest";
  description: string;
}

export interface ContentAvailabilityItem {
  id: string;
  name: string;
  available: boolean;
  blockers: ContentBlocker[];
}

export interface ContentAvailability {
  quests: ContentAvailabilityItem[];
  bosses: ContentAvailabilityItem[];
  availableQuestCount: number;
  totalQuestCount: number;
  availableBossCount: number;
  totalBossCount: number;
}

export interface RestrictionPreset {
  id: string;
  name: string;
  description: string;
  allowedRegions: string[];
  skillRestrictions: SkillRestriction[];
  customRules: string[];
}

export interface DiaryTask {
  id: string;
  description: string;
  requirements: string[];
}

export interface DiaryTier {
  tier: "easy" | "medium" | "hard" | "elite";
  tasks: DiaryTask[];
  rewards: string[];
}

export interface DiaryArea {
  id: string;
  name: string;
  region: string;
  tiers: DiaryTier[];
  wikiUrl: string;
}

export interface CATask {
  id: string;
  name: string;
  description: string;
  monster: string;
  tier: string;
  points: number;
}

export interface CATier {
  tier: string;
  tasks: CATask[];
  totalPoints: number;
}

export interface CombatAchievementData {
  tiers: CATier[];
  totalTasks: number;
  totalPoints: number;
}
