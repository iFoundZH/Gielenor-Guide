import type { SkillName } from "./league";

export type SkillTrainingVariant = "p2p" | "f2p";

export interface TrainingMethod {
  name: string;
  levelRange: [number, number];
  xpPerHour: number | null;
  description: string;
  members: boolean;
}

export interface SkillTrainingGuide {
  skill: SkillName;
  variant: SkillTrainingVariant;
  methods: TrainingMethod[];
  wikiUrl: string;
}

export type QuestGuideVariant = "main" | "ironman";

export interface QuestXpReward {
  skill: string;
  xp: number;
}

export interface QuestEntry {
  order: number;
  name: string;
  questPoints: number;
  cumulativeQP: number;
  xpRewards: QuestXpReward[];
  notes: string;
}

export interface OptimalQuestGuide {
  variant: QuestGuideVariant;
  entries: QuestEntry[];
  wikiUrl: string;
}

export type DiaryTier = "easy" | "medium" | "hard" | "elite";

export interface DiaryRequirement {
  type: "skill" | "quest" | "other";
  description: string;
  skill?: string;
  level?: number;
}

export interface DiaryTask {
  id: string;
  description: string;
  requirements: DiaryRequirement[];
}

export interface DiaryReward {
  itemName: string;
  effects: string[];
}

export interface DiaryTierData {
  tier: DiaryTier;
  tasks: DiaryTask[];
  rewards: DiaryReward[];
}

export interface AchievementDiaryArea {
  id: string;
  name: string;
  tiers: DiaryTierData[];
  wikiUrl: string;
}

export type CombatAchievementTierName =
  | "easy" | "medium" | "hard" | "elite" | "master" | "grandmaster";

export interface CombatAchievementTask {
  id: string;
  name: string;
  description: string;
  monster: string;
  type: string;
}

export interface CombatAchievementTier {
  tier: CombatAchievementTierName;
  tasks: CombatAchievementTask[];
}

export interface CombatAchievementData {
  tiers: CombatAchievementTier[];
  wikiUrl: string;
}

export type IronmanVariant = "standard" | "hardcore" | "ultimate" | "group";

export interface GuideSection {
  title: string;
  level: number;
  content: string;
  subsections: GuideSection[];
}

export interface IronmanGuide {
  variant: IronmanVariant;
  sections: GuideSection[];
  wikiUrl: string;
}

export interface MainAccountGuide {
  sections: GuideSection[];
}

export interface SnowflakeGuide {
  id: string;
  name: string;
  category: "area-locked" | "restriction";
  description: string;
  sections: GuideSection[];
}
