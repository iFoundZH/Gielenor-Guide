/**
 * Selection Impact System
 *
 * Computes impact deltas for every unselected option so the planner can
 * show how each choice would change the build's Gielinor Score, synergies,
 * AFK score, relic/region fit, and risk.
 *
 * Designed to run inside useMemo — max ~22 lightweight delta computations.
 */

import type { LeagueBuild, LeagueData, Relic, Pact } from "@/types/league";
import type { GielinorScore } from "./player-score";
import {
  calculateBuildSynergy,
  calculateRiskScore,
} from "./player-score";
import {
  REGION_BOSSES,
  RELIC_TAGS,
  findActiveSynergies,
} from "./build-analysis";
import { computeRelicAfkScore, computeBuildAfkScore } from "./relic-metrics";

// ─── Public interfaces ──────────────────────────────────────────────────

export interface ImpactDelta {
  gielinorScoreDelta: number;
  newSynergies: string[];
}

export interface RegionImpact extends ImpactDelta {
  regionId: string;
  tasksDelta: number;
  pointsDelta: number;
  bossNames: string[];
  relicFitScore: number;
  relicFitReasons: string[];
  contentOverlapPercent: number;
}

export interface RelicImpact extends ImpactDelta {
  relicId: string;
  afkDelta: number;
  regionFitScore: number;
  regionFitReasons: string[];
  pactSynergies: string[];
}

export interface PactImpact extends ImpactDelta {
  pactId: string;
  riskDelta: number;
  dangerousCombos: string[];
  relicSynergies: string[];
}

export interface BuildImpactMap {
  regions: Record<string, RegionImpact>;
  relics: Record<string, RelicImpact>;
  pacts: Record<string, PactImpact>;
}

// ─── Static content tags per region ─────────────────────────────────────

const REGION_CONTENT_TAGS: Record<string, string[]> = {
  varlamore: ["combat", "bossing", "hunter", "agility", "thieving", "slayer"],
  karamja: ["combat", "bossing", "agility", "mining"],
  asgarnia: ["combat", "bossing", "mining", "gathering", "slayer"],
  fremennik: ["combat", "bossing", "slayer"],
  kandarin: ["combat", "bossing", "fishing", "gathering"],
  desert: ["combat", "bossing", "thieving", "agility"],
  morytania: ["combat", "bossing", "agility", "slayer"],
  tirannwn: ["combat", "bossing", "mining", "crafting"],
  wilderness: ["combat", "bossing", "prayer"],
  kebos: ["combat", "bossing", "gathering", "skilling", "mining", "slayer", "firemaking"],
  kourend: ["combat", "bossing", "gathering", "skilling", "mining", "slayer", "firemaking"],
  misthalin: ["combat", "skilling"],
};

// ─── Main entry point ───────────────────────────────────────────────────

export function computeAllImpacts(
  build: LeagueBuild,
  league: LeagueData,
  currentScore: GielinorScore,
): BuildImpactMap {
  const allRelics = league.relicTiers.flatMap((t) => t.relics);
  const selectedRelics = allRelics.filter((r) => build.relics.includes(r.id));
  const selectedPacts = league.pacts.filter((p) => build.pacts.includes(p.id));
  const hasMasteries = build.pacts.some((id) => id.startsWith("re-mastery-"));

  // Current scores for diffing
  const currentBuildScore = calculateBuildSynergy(selectedRelics, selectedPacts, hasMasteries);
  const currentRiskScore = calculateRiskScore(selectedPacts);
  const currentSynergies = findActiveSynergies(selectedRelics, selectedPacts, hasMasteries);
  const currentSynergyNames = new Set(currentSynergies.map((s) => s.name));

  // Current AFK baseline
  const currentAfkScores = selectedRelics.map(computeRelicAfkScore);
  const currentAfkTotal = computeBuildAfkScore(currentAfkScores, league);

  // Selected region content tags (for overlap calculation)
  const accessibleRegionIds = new Set<string>();
  for (const r of league.regions) {
    if (r.type === "starting" || r.type === "auto-unlock") accessibleRegionIds.add(r.id);
  }
  for (const id of build.regions) accessibleRegionIds.add(id);

  const selectedContentTags = new Set<string>();
  for (const regionId of accessibleRegionIds) {
    const tags = REGION_CONTENT_TAGS[regionId];
    if (tags) tags.forEach((t) => selectedContentTags.add(t));
  }

  // Relic tags for the current build
  const selectedRelicTags = new Set<string>();
  for (const relic of selectedRelics) {
    const tags = RELIC_TAGS[relic.id];
    if (tags) tags.forEach((t) => selectedRelicTags.add(t));
  }

  // Tiers that already have a selection
  const filledTiers = new Set<number>();
  for (const relic of selectedRelics) {
    filledTiers.add(relic.tier);
  }

  // ── Region impacts ──────────────────────────────────────────────────

  const regionImpacts: Record<string, RegionImpact> = {};

  const choosableRegions = league.regions.filter(
    (r) => r.type === "choosable" && !build.regions.includes(r.id),
  );
  const canAddRegion = build.regions.length < league.maxRegions;

  if (canAddRegion) {
    for (const region of choosableRegions) {
      regionImpacts[region.id] = computeRegionImpact(
        region.id,
        build,
        league,
        selectedRelics,
        selectedPacts,
        hasMasteries,
        currentBuildScore,
        currentRiskScore,
        currentSynergyNames,
        selectedRelicTags,
        selectedContentTags,
      );
    }
  }

  // ── Relic impacts ───────────────────────────────────────────────────

  const relicImpacts: Record<string, RelicImpact> = {};

  for (const tier of league.relicTiers) {
    for (const relic of tier.relics) {
      // Skip already-selected relic
      if (build.relics.includes(relic.id)) continue;

      relicImpacts[relic.id] = computeRelicImpact(
        relic,
        tier.tier,
        build,
        league,
        allRelics,
        selectedRelics,
        selectedPacts,
        hasMasteries,
        currentBuildScore,
        currentRiskScore,
        currentSynergyNames,
        currentAfkTotal,
        accessibleRegionIds,
        filledTiers,
      );
    }
  }

  // ── Pact impacts ────────────────────────────────────────────────────

  const pactImpacts: Record<string, PactImpact> = {};

  for (const pact of league.pacts) {
    if (build.pacts.includes(pact.id)) continue;

    pactImpacts[pact.id] = computePactImpact(
      pact,
      selectedRelics,
      selectedPacts,
      hasMasteries,
      currentBuildScore,
      currentRiskScore,
      currentSynergyNames,
    );
  }

  return { regions: regionImpacts, relics: relicImpacts, pacts: pactImpacts };
}

// ─── Region impact ──────────────────────────────────────────────────────

function computeRegionImpact(
  regionId: string,
  build: LeagueBuild,
  league: LeagueData,
  selectedRelics: Relic[],
  selectedPacts: Pact[],
  hasMasteries: boolean,
  currentBuildScore: number,
  currentRiskScore: number,
  currentSynergyNames: Set<string>,
  selectedRelicTags: Set<string>,
  selectedContentTags: Set<string>,
): RegionImpact {
  // Tasks and points this region adds
  const regionTasks = league.tasks.filter((t) => t.region === regionId);
  const tasksDelta = regionTasks.length;
  const pointsDelta = regionTasks.reduce((s, t) => s + t.points, 0);

  // Bosses
  const bosses = REGION_BOSSES[regionId] || [];
  const bossNames = bosses.map((b) => b.name);

  // Relic fit: how many of the selected relic tags match this region's content
  const regionTags = REGION_CONTENT_TAGS[regionId] || [];
  const matchingTags = regionTags.filter((t) => selectedRelicTags.has(t));
  const relicFitScore = regionTags.length > 0
    ? Math.round((matchingTags.length / regionTags.length) * 100)
    : 0;
  const relicFitReasons = matchingTags.length > 0
    ? matchingTags.map((t) => `${t} relics match`)
    : [];

  // Content overlap: how much of this region's content is already covered
  const overlapTags = regionTags.filter((t) => selectedContentTags.has(t));
  const contentOverlapPercent = regionTags.length > 0
    ? Math.round((overlapTags.length / regionTags.length) * 100)
    : 0;

  // GS delta: hypothetical build score with this region added
  // Region choice doesn't change relic synergies or risk, only task pool (which matters at completion time)
  // We approximate the GS delta from the build+risk axes
  // Since adding a region doesn't change relics/pacts, only the task potential changes
  // We'll show the task point gain as the main value and leave GS delta as 0 for regions
  // (task score depends on completion, not selection)
  const gielinorScoreDelta = 0;

  // Synergy delta: regions don't directly affect synergies
  const newSynergies: string[] = [];

  return {
    regionId,
    tasksDelta,
    pointsDelta,
    bossNames,
    relicFitScore,
    relicFitReasons,
    contentOverlapPercent,
    gielinorScoreDelta,
    newSynergies,
  };
}

// ─── Relic impact ───────────────────────────────────────────────────────

function computeRelicImpact(
  relic: Relic,
  relicTier: number,
  build: LeagueBuild,
  league: LeagueData,
  allRelics: Relic[],
  selectedRelics: Relic[],
  selectedPacts: Pact[],
  hasMasteries: boolean,
  currentBuildScore: number,
  currentRiskScore: number,
  currentSynergyNames: Set<string>,
  currentAfkTotal: number,
  accessibleRegionIds: Set<string>,
  filledTiers: Set<number>,
): RelicImpact {
  // Hypothetical relics: swap in this relic (replacing same-tier if any)
  const hypotheticalRelics = [
    ...selectedRelics.filter((r) => r.tier !== relicTier),
    relic,
  ];

  // Build synergy delta
  const hypotheticalBuildScore = calculateBuildSynergy(hypotheticalRelics, selectedPacts, hasMasteries);
  const buildDelta = hypotheticalBuildScore - currentBuildScore;
  // Risk doesn't change with relics
  const gielinorScoreDelta = buildDelta;

  // AFK delta
  const hypotheticalAfkScores = hypotheticalRelics.map(computeRelicAfkScore);
  const hypotheticalAfkTotal = computeBuildAfkScore(hypotheticalAfkScores, league);
  const afkDelta = hypotheticalAfkTotal - currentAfkTotal;

  // Region fit: how well this relic's tags match selected region content
  const relicTags = RELIC_TAGS[relic.id] || [];
  const regionContentUnion = new Set<string>();
  for (const regionId of accessibleRegionIds) {
    const tags = REGION_CONTENT_TAGS[regionId];
    if (tags) tags.forEach((t) => regionContentUnion.add(t));
  }
  const matchingTags = relicTags.filter((t) => regionContentUnion.has(t));
  const regionFitScore = relicTags.length > 0
    ? Math.round((matchingTags.length / relicTags.length) * 100)
    : 0;
  const regionFitReasons = matchingTags.length > 0
    ? matchingTags.map((t) => `${t} in your regions`)
    : [];

  // Synergy delta
  const hypotheticalSynergies = findActiveSynergies(hypotheticalRelics, selectedPacts, hasMasteries);
  const newSynergies = hypotheticalSynergies
    .filter((s) => !currentSynergyNames.has(s.name))
    .map((s) => s.name);

  // Pact synergies: which selected pacts appear in the new synergies
  const pactSynergies: string[] = [];
  for (const syn of hypotheticalSynergies) {
    if (!currentSynergyNames.has(syn.name)) {
      for (const pact of selectedPacts) {
        if (syn.components.includes(pact.name)) {
          pactSynergies.push(pact.name);
        }
      }
    }
  }

  return {
    relicId: relic.id,
    gielinorScoreDelta,
    newSynergies,
    afkDelta,
    regionFitScore,
    regionFitReasons,
    pactSynergies: [...new Set(pactSynergies)],
  };
}

// ─── Pact impact ────────────────────────────────────────────────────────

function computePactImpact(
  pact: Pact,
  selectedRelics: Relic[],
  selectedPacts: Pact[],
  hasMasteries: boolean,
  currentBuildScore: number,
  currentRiskScore: number,
  currentSynergyNames: Set<string>,
): PactImpact {
  const hypotheticalPacts = [...selectedPacts, pact];

  // Build synergy delta
  const hypotheticalBuildScore = calculateBuildSynergy(selectedRelics, hypotheticalPacts, hasMasteries);
  const buildDelta = hypotheticalBuildScore - currentBuildScore;

  // Risk delta
  const hypotheticalRiskScore = calculateRiskScore(hypotheticalPacts);
  const riskDelta = hypotheticalRiskScore - currentRiskScore;

  const gielinorScoreDelta = buildDelta + riskDelta;

  // Dangerous combos
  const dangerousCombos: string[] = [];
  const existingPactIds = new Set(selectedPacts.map((p) => p.id));

  if (pact.id === "pact-glass-cannon" && existingPactIds.has("pact-berserker")) {
    dangerousCombos.push("Glass Cannon + Berserker");
  }
  if (pact.id === "pact-berserker" && existingPactIds.has("pact-glass-cannon")) {
    dangerousCombos.push("Glass Cannon + Berserker");
  }
  if (pact.id === "pact-glass-cannon" && !existingPactIds.has("pact-vampiric-touch")) {
    dangerousCombos.push("No Vampiric Touch for sustain");
  }

  // Synergy delta
  const hypotheticalSynergies = findActiveSynergies(selectedRelics, hypotheticalPacts, hasMasteries);
  const newSynergies = hypotheticalSynergies
    .filter((s) => !currentSynergyNames.has(s.name))
    .map((s) => s.name);

  // Relic synergies: which selected relics appear in new synergies
  const relicSynergies: string[] = [];
  for (const syn of hypotheticalSynergies) {
    if (!currentSynergyNames.has(syn.name)) {
      for (const relic of selectedRelics) {
        if (syn.components.includes(relic.name)) {
          relicSynergies.push(relic.name);
        }
      }
    }
  }

  return {
    pactId: pact.id,
    gielinorScoreDelta,
    newSynergies,
    riskDelta,
    dangerousCombos,
    relicSynergies: [...new Set(relicSynergies)],
  };
}
