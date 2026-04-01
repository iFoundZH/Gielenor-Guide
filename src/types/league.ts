export type AccountType = "main" | "ironman" | "hardcore" | "ultimate" | "group";

export type TaskDifficulty = "easy" | "medium" | "hard" | "elite" | "master";

export type SkillName =
  | "Attack" | "Strength" | "Defence" | "Ranged" | "Prayer"
  | "Magic" | "Runecraft" | "Hitpoints" | "Crafting" | "Mining"
  | "Smithing" | "Fishing" | "Cooking" | "Firemaking" | "Woodcutting"
  | "Agility" | "Herblore" | "Thieving" | "Fletching" | "Slayer"
  | "Farming" | "Construction" | "Hunter" | "Sailing";

export interface Relic {
  id: string;
  name: string;
  tier: number;
  slot: number;
  description: string;
  effects: string[];
  passiveEffects?: string[];
  icon?: string;
  synergies?: string[];
}

export interface RelicTier {
  tier: number;
  pointsToUnlock?: number;
  passiveEffects: string[];
  relics: Relic[];
}

export interface Region {
  id: string;
  name: string;
  description: string;
  type: "starting" | "auto-unlock" | "choosable" | "inaccessible";
  tasksToUnlock?: number;
  keyContent: string[];
  echoBoss?: string;
}

export interface Pact {
  id: string;
  name: string;
  tier: number;
  category: PactCategory;
  description: string;
  bonus: string;
  penalty: string;
  icon?: string;
}

export type PactCategory =
  | "combat" | "skilling" | "gathering" | "production"
  | "utility" | "exploration" | "prayer" | "magic";

export interface LeagueTask {
  id: string;
  name: string;
  description: string;
  difficulty: TaskDifficulty;
  points: number;
  category: string;
  region?: string;
  skills?: SkillName[];
  completed?: boolean;
}

export interface RewardTier {
  name: string;
  pointsRequired: number;
  color: string;
  rewards: Reward[];
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  type: "cosmetic" | "trophy" | "title" | "home_teleport" | "ornament_kit" | "outfit" | "other";
  icon?: string;
}

export interface LeagueBuild {
  id: string;
  name: string;
  accountType: AccountType;
  regions: string[];
  relics: string[];
  pacts: string[];
  completedTasks: string[];
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export interface MasteryTier {
  tier: number;
  effect: string;
}

export interface CombatMastery {
  id: string;
  name: string;
  style: "melee" | "ranged" | "magic";
  tiers: MasteryTier[];
}

export interface MasterySystem {
  maxPoints: number;
  pointSources: string[];
  universalPassives: string[];
  styles: CombatMastery[];
}

export interface LeagueData {
  id: string;
  name: string;
  leagueNumber: number;
  description: string;
  startDate: string;
  endDate: string;
  wikiUrl: string;
  lastSynced: string;
  baseXpMultiplier: number;
  baseDropMultiplier: number;
  maxRegions: number;
  regions: Region[];
  relicTiers: RelicTier[];
  pacts: Pact[];
  masteries?: MasterySystem;
  tasks: LeagueTask[];
  rewardTiers: RewardTier[];
  autoCompletedQuests: string[];
  mechanicChanges: string[];
}

export interface CharacterProfile {
  id: string;
  name: string;
  accountType: AccountType;
  builds: LeagueBuild[];
  createdAt: number;
}
