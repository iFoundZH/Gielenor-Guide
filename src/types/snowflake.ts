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
}

export interface OsrsBoss {
  id: string;
  name: string;
  region: string;
  combatLevel: number | null;
  skillRequirements: { skill: string; level: number }[];
  questRequirements: string[];
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
