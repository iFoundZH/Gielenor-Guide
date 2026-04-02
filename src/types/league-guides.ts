export interface GettingStartedStep {
  title: string;
  timeframe: string;
  objectives: string[];
  tips: string[];
}

export interface GettingStartedGuide {
  intro: string;
  steps: GettingStartedStep[];
}

export interface RelicOption {
  name: string;
  ranking: "S" | "A" | "B" | "C";
  description: string;
  bestFor: string[];
  synergyWith: string[];
}

export interface RelicGuideEntry {
  tier: number;
  unlockPoints?: number;
  passiveEffects: string[];
  relics: RelicOption[];
  mandatory?: boolean;
}

export interface RelicGuide {
  intro: string;
  tiers: RelicGuideEntry[];
}

export interface RegionGuideEntry {
  name: string;
  tier: "S" | "A" | "B" | "C";
  type: "starting" | "auto-unlock" | "choosable" | "inaccessible";
  taskCount?: number;
  totalPoints?: number;
  echoBoss?: string;
  highlights: string[];
  pickFirstIf: string;
  avoidIf: string;
}

export interface RegionGuide {
  intro: string;
  unlockMechanic: string;
  regions: RegionGuideEntry[];
}

export interface CombatBuild {
  id: string;
  name: string;
  style: "Melee" | "Ranged" | "Magic" | "Hybrid";
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  description: string;
  regions: string[];
  relics: { tier: number; name: string }[];
  mastery?: string[];
  pacts?: string[];
  gearProgression: { phase: string; items: string[] }[];
  strengths: string[];
  weaknesses: string[];
}

export interface CombatBuildGuide {
  intro: string;
  builds: CombatBuild[];
}

export interface MasteryTierEffect {
  tier: number;
  effect: string;
}

export interface MasteryStyleGuide {
  name: string;
  style: "melee" | "ranged" | "magic";
  strengths: string[];
  bestFor: string[];
  tiers: MasteryTierEffect[];
}

export interface MasteryDistribution {
  name: string;
  description: string;
  allocation: { style: string; points: number }[];
  bestFor: string;
}

export interface CombatMasteryGuide {
  intro: string;
  pointSources: string[];
  universalPassives: string[];
  styles: MasteryStyleGuide[];
  distributions: MasteryDistribution[];
}

export interface PactStrategyEntry {
  name: string;
  tier: number;
  bonus: string;
  penalty: string;
  ranking: "S" | "A" | "B" | "C";
  bestFor: string[];
  avoidIf: string;
}

export interface PactCombo {
  name: string;
  pacts: string[];
  synergy: string;
  risk: string;
  bestFor: string;
}

export interface PactGuide {
  intro: string;
  pacts: PactStrategyEntry[];
  combos: PactCombo[];
}
