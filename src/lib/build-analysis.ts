/**
 * Build Analysis Engine
 *
 * Performs deep analysis of a player's build to surface:
 * - What content they're missing out on (bosses, raids, skills)
 * - Whether the build is skewed toward specific skill types
 * - Synergies they've activated and ones they're missing
 * - XP/drop rate multiplier timeline
 * - Task accessibility (how many tasks require missing regions)
 * - Pact trade-off analysis
 * - Warnings about dangerous combos or gaps
 */

import { LeagueBuild, LeagueData, Region, Relic, Pact, LeagueTask } from "@/types/league";

export interface BuildAnalysis {
  /** Content you're locking yourself out of */
  missedContent: MissedContent;
  /** How balanced the build is across combat/skilling/utility */
  buildBalance: BuildBalance;
  /** Active synergies between relics and pacts */
  synergies: Synergy[];
  /** Synergies you're close to but haven't activated */
  missedSynergies: Synergy[];
  /** XP and drop multiplier progression through tiers */
  multiplierTimeline: MultiplierTier[];
  /** Task accessibility breakdown */
  taskAccess: TaskAccessibility;
  /** Warnings and tips */
  warnings: Warning[];
  /** Pact tradeoff summary */
  pactTradeoffs: PactTradeoff[];
  /** Overall build archetype classification */
  archetype: BuildArchetype;
  /** Key bosses accessible/inaccessible */
  bossAccess: BossAccess[];
}

export interface MissedContent {
  regions: { region: Region; notableLosses: string[] }[];
  totalKeyContentMissed: number;
  totalKeyContentAvailable: number;
}

export interface BuildBalance {
  combat: number;   // 0-100
  gathering: number; // 0-100
  production: number; // 0-100
  utility: number;   // 0-100
  slayer: number;    // 0-100
  /** "combat-heavy" | "gathering-heavy" | "well-rounded" | "specialist" etc */
  label: string;
  /** Percentage of build power going to the dominant category */
  dominance: number;
}

export interface Synergy {
  name: string;
  description: string;
  strength: "strong" | "moderate" | "minor";
  components: string[]; // Names of relics/pacts involved
}

export interface MultiplierTier {
  tier: number;
  xpMultiplier: number;
  dropMultiplier: number;
  label: string;
}

export interface TaskAccessibility {
  accessible: number;
  inaccessible: number;
  total: number;
  byRegion: { regionName: string; tasks: number; accessible: boolean }[];
  accessiblePoints: number;
  totalPoints: number;
}

export interface Warning {
  severity: "critical" | "caution" | "tip";
  message: string;
}

export interface PactTradeoff {
  pactName: string;
  gain: string;
  cost: string;
  riskLevel: "low" | "medium" | "high" | "extreme";
}

export interface BuildArchetype {
  name: string;
  description: string;
  icon: string;
}

export interface BossAccess {
  name: string;
  region: string;
  accessible: boolean;
  difficulty: "mid" | "high" | "endgame";
}

// ─── Region → Content mapping ───────────────────────────────────────────

const REGION_BOSSES: Record<string, { name: string; difficulty: "mid" | "high" | "endgame" }[]> = {
  varlamore: [
    { name: "Vardorvis", difficulty: "endgame" },
    { name: "Amoxliatl", difficulty: "mid" },
    { name: "Hueycoatl", difficulty: "high" },
    { name: "Fortis Colosseum", difficulty: "endgame" },
    { name: "Moons of Peril", difficulty: "endgame" },
  ],
  karamja: [
    { name: "TzTok-Jad (Fight Caves)", difficulty: "high" },
    { name: "TzKal-Zuk (Inferno)", difficulty: "endgame" },
  ],
  asgarnia: [
    { name: "General Graardor (Bandos)", difficulty: "high" },
    { name: "Commander Zilyana (Sara)", difficulty: "high" },
    { name: "K'ril Tsutsaroth (Zammy)", difficulty: "high" },
    { name: "Kree'arra (Arma)", difficulty: "high" },
  ],
  fremennik: [
    { name: "Vorkath", difficulty: "high" },
    { name: "Nex", difficulty: "endgame" },
    { name: "Dagannoth Kings", difficulty: "mid" },
  ],
  kandarin: [
    { name: "Zulrah", difficulty: "high" },
  ],
  desert: [
    { name: "Tombs of Amascut", difficulty: "endgame" },
    { name: "Kalphite Queen", difficulty: "mid" },
  ],
  morytania: [
    { name: "Theatre of Blood", difficulty: "endgame" },
    { name: "The Nightmare", difficulty: "endgame" },
    { name: "Barrows", difficulty: "mid" },
  ],
  tirannwn: [
    { name: "Corrupted Gauntlet", difficulty: "endgame" },
    { name: "Zalcano", difficulty: "mid" },
  ],
  wilderness: [
    { name: "Callisto / Artio", difficulty: "high" },
    { name: "Venenatis / Spindel", difficulty: "high" },
    { name: "Vet'ion / Calvar'ion", difficulty: "high" },
    { name: "Corporeal Beast", difficulty: "endgame" },
  ],
  kebos: [
    { name: "Chambers of Xeric", difficulty: "endgame" },
    { name: "Alchemical Hydra", difficulty: "high" },
  ],
};

// Tags for what each relic focuses on
const RELIC_TAGS: Record<string, string[]> = {
  // DP relics
  "relic-t1-1": ["gathering", "fishing", "woodcutting", "mining", "banking"],
  "relic-t1-2": ["gathering", "agility", "strength", "early-game"],
  "relic-t1-3": ["skilling", "money", "all-skills", "production"],
  "relic-t2-1": ["production", "fletching", "firemaking", "hunter", "gathering"],
  "relic-t3-1": ["combat", "bossing", "teleport", "utility"],
  "relic-t6-1": ["combat", "slayer", "clues", "utility"],
  "relic-t8-1": ["combat", "bossing", "utility", "auto-loot"],
  // RE relics
  "re-t1-1": ["utility", "thieving", "agility"],
  "re-t1-2": ["gathering", "mining", "woodcutting", "fishing", "banking"],
  "re-t1-3": ["production", "skilling"],
  "re-t2-1": ["utility", "banking"],
  "re-t2-2": ["utility", "money"],
  "re-t2-3": ["utility", "teleport"],
  "re-t3-1": ["combat", "skilling"],
  "re-t3-2": ["gathering", "production"],
  "re-t3-3": ["combat", "bossing"],
  "re-t4-1": ["clues", "utility"],
  "re-t4-2": ["combat", "slayer", "utility"],
  "re-t4-3": ["utility", "teleport"],
  "re-t5-1": ["gathering", "utility"],
  "re-t5-2": ["utility", "teleport"],
  "re-t5-3": ["utility", "teleport"],
  "re-t6-1": ["combat", "bossing"],
  "re-t6-2": ["combat", "bossing"],
  "re-t6-3": ["combat", "utility"],
  "re-t7-1": ["combat", "bossing"],
  "re-t7-2": ["combat", "bossing"],
  "re-t7-3": ["production", "skilling"],
  "re-t8-1": ["utility", "teleport"],
  "re-t8-2": ["combat", "bossing"],
  "re-t8-3": ["utility", "thieving", "combat"],
};

// ─── Main Analysis Function ─────────────────────────────────────────────

export function analyzeBuild(build: LeagueBuild, league: LeagueData): BuildAnalysis {
  const accessibleRegionIds = getAccessibleRegions(build, league);
  const allRelics = league.relicTiers.flatMap((t) => t.relics);
  const selectedRelics = allRelics.filter((r) => build.relics.includes(r.id));
  const selectedPacts = league.pacts.filter((p) => build.pacts.includes(p.id));

  return {
    missedContent: analyzeMissedContent(build, league, accessibleRegionIds),
    buildBalance: analyzeBuildBalance(selectedRelics, selectedPacts),
    synergies: findActiveSynergies(selectedRelics, selectedPacts),
    missedSynergies: findMissedSynergies(selectedRelics, selectedPacts, allRelics, league.pacts),
    multiplierTimeline: getMultiplierTimeline(league),
    taskAccess: analyzeTaskAccessibility(build, league, accessibleRegionIds),
    warnings: generateWarnings(build, league, selectedRelics, selectedPacts, accessibleRegionIds),
    pactTradeoffs: analyzePactTradeoffs(selectedPacts),
    archetype: classifyArchetype(selectedRelics, selectedPacts, build),
    bossAccess: analyzeBossAccess(accessibleRegionIds),
  };
}

function getAccessibleRegions(build: LeagueBuild, league: LeagueData): Set<string> {
  const ids = new Set<string>();
  for (const r of league.regions) {
    if (r.type === "starting" || r.type === "auto-unlock") ids.add(r.id);
  }
  for (const id of build.regions) ids.add(id);
  return ids;
}

// ─── Missed Content ─────────────────────────────────────────────────────

function analyzeMissedContent(
  build: LeagueBuild,
  league: LeagueData,
  accessible: Set<string>,
): MissedContent {
  const missed: MissedContent["regions"] = [];
  let totalMissed = 0;
  let totalAvailable = 0;

  for (const region of league.regions) {
    if (region.type === "inaccessible") continue;
    const content = region.keyContent.filter((c) => c !== "Not available — all content locked");
    totalAvailable += content.length;
    if (!accessible.has(region.id)) {
      totalMissed += content.length;
      missed.push({ region, notableLosses: content });
    }
  }

  return { regions: missed, totalKeyContentMissed: totalMissed, totalKeyContentAvailable: totalAvailable };
}

// ─── Build Balance ──────────────────────────────────────────────────────

function analyzeBuildBalance(relics: Relic[], pacts: Pact[]): BuildBalance {
  const scores = { combat: 0, gathering: 0, production: 0, utility: 0, slayer: 0 };

  for (const relic of relics) {
    const tags = RELIC_TAGS[relic.id] || [];
    if (tags.includes("combat") || tags.includes("bossing")) scores.combat += 25;
    if (tags.includes("gathering") || tags.includes("fishing") || tags.includes("mining") || tags.includes("woodcutting")) scores.gathering += 25;
    if (tags.includes("production") || tags.includes("fletching") || tags.includes("firemaking")) scores.production += 25;
    if (tags.includes("utility") || tags.includes("teleport") || tags.includes("banking")) scores.utility += 20;
    if (tags.includes("slayer") || tags.includes("clues")) scores.slayer += 25;
    if (tags.includes("skilling") || tags.includes("all-skills")) {
      scores.gathering += 10;
      scores.production += 10;
    }
  }

  for (const pact of pacts) {
    if (pact.category === "combat") scores.combat += 20;
  }

  // Normalize to 0-100
  const maxVal = Math.max(scores.combat, scores.gathering, scores.production, scores.utility, scores.slayer, 1);
  const norm = (v: number) => Math.min(100, Math.round((v / maxVal) * 100));

  const combat = norm(scores.combat);
  const gathering = norm(scores.gathering);
  const production = norm(scores.production);
  const utility = norm(scores.utility);
  const slayer = norm(scores.slayer);

  const values = [combat, gathering, production, utility, slayer];
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const maxScore = Math.max(...values);
  const dominance = maxScore;
  const spread = maxScore - Math.min(...values.filter((v) => v > 0));

  let label: string;
  if (maxScore === 0) {
    label = "No selections yet";
  } else if (spread <= 30 && values.filter((v) => v > 0).length >= 3) {
    label = "Well-rounded";
  } else if (combat >= 70 && combat === maxScore) {
    label = "Combat-focused";
  } else if (gathering >= 70 && gathering === maxScore) {
    label = "Gathering-focused";
  } else if (slayer >= 70 && slayer === maxScore) {
    label = "Slayer-focused";
  } else if (production >= 70 && production === maxScore) {
    label = "Production-focused";
  } else {
    label = "Specialized";
  }

  return { combat, gathering, production, utility, slayer, label, dominance };
}

// ─── Synergies ──────────────────────────────────────────────────────────

function findActiveSynergies(relics: Relic[], pacts: Pact[]): Synergy[] {
  const synergies: Synergy[] = [];
  const relicIds = new Set(relics.map((r) => r.id));
  const pactIds = new Set(pacts.map((p) => p.id));

  // DP synergies
  if (relicIds.has("relic-t1-1") && relicIds.has("relic-t2-1")) {
    synergies.push({
      name: "Gathering Pipeline",
      description: "Resources auto-bank from Endless Harvest, then Woodsman doubles Hunter loot and provides instant Fletching. Seeds from traps fuel farming loop.",
      strength: "strong",
      components: ["Endless Harvest", "Woodsman"],
    });
  }
  if (relicIds.has("relic-t3-1") && pacts.some((p) => p.category === "combat")) {
    synergies.push({
      name: "Boss Blitz",
      description: "Evil Eye teleports directly to boss lairs. Combat pacts boost your damage there. Minimizes travel time between kills.",
      strength: "strong",
      components: ["Evil Eye", ...pacts.filter((p) => p.category === "combat").map((p) => p.name)],
    });
  }
  if (relicIds.has("relic-t6-1") && (pactIds.has("pact-melee-might") || pactIds.has("pact-ranged-fury") || pactIds.has("pact-magic-surge"))) {
    synergies.push({
      name: "Slayer Machine",
      description: "Culling Spree's configurable tasks + combat pact damage boost = rapid task completions. Passive slayer helm frees a gear slot.",
      strength: "strong",
      components: ["Culling Spree", ...pacts.filter((p) => ["pact-melee-might", "pact-ranged-fury", "pact-magic-surge"].includes(p.id)).map((p) => p.name)],
    });
  }
  if (relicIds.has("relic-t8-1") && pactIds.has("pact-glass-cannon")) {
    synergies.push({
      name: "Glass Cannon + Minion",
      description: "You deal massive damage but take more. Your Minion companion adds extra DPS and auto-loots, reducing time exposed to danger.",
      strength: "strong",
      components: ["Minion", "Glass Cannon"],
    });
  }
  if (relicIds.has("relic-t8-1") && pactIds.has("pact-vampiric-touch")) {
    synergies.push({
      name: "Vampiric Army",
      description: "Lifesteal from your attacks while Minion adds extra damage. Sustain through content without food.",
      strength: "moderate",
      components: ["Minion", "Vampiric Touch"],
    });
  }
  if (relicIds.has("relic-t1-3") && pacts.length >= 2) {
    synergies.push({
      name: "Boosted Economy",
      description: "Abundance's +10 skill boost lets you access high-level content early. Coin generation from XP funds supplies for pact-boosted combat.",
      strength: "moderate",
      components: ["Abundance", "Multiple Pacts"],
    });
  }
  if (pactIds.has("pact-glass-cannon") && pactIds.has("pact-vampiric-touch")) {
    synergies.push({
      name: "Lifesteal Tank",
      description: "Glass Cannon makes you fragile but Vampiric Touch heals you back. Net survivability depends on DPS output.",
      strength: "moderate",
      components: ["Glass Cannon", "Vampiric Touch"],
    });
  }
  if (relicIds.has("relic-t6-1") && relicIds.has("relic-t8-1")) {
    synergies.push({
      name: "Slayer Companion",
      description: "Culling Spree picks optimal tasks while Minion helps kill and auto-loots. Superiors chain-spawning generates massive clue scrolls.",
      strength: "strong",
      components: ["Culling Spree", "Minion"],
    });
  }

  return synergies;
}

function findMissedSynergies(
  selectedRelics: Relic[],
  selectedPacts: Pact[],
  allRelics: Relic[],
  allPacts: Pact[],
): Synergy[] {
  const missed: Synergy[] = [];
  const relicIds = new Set(selectedRelics.map((r) => r.id));
  const pactIds = new Set(selectedPacts.map((p) => p.id));

  // Has Endless Harvest but not Woodsman
  if (relicIds.has("relic-t1-1") && !relicIds.has("relic-t2-1")) {
    missed.push({
      name: "Gathering Pipeline",
      description: "Add Woodsman (T2) to double Hunter loot and auto-process gathered resources. Your Endless Harvest would feed perfectly into it.",
      strength: "strong",
      components: ["Endless Harvest", "Woodsman (not selected)"],
    });
  }
  // Has combat pacts but no Evil Eye
  if (selectedPacts.some((p) => p.category === "combat") && !relicIds.has("relic-t3-1")) {
    missed.push({
      name: "Boss Blitz",
      description: "You have combat pacts but no Evil Eye (T3). Adding it would let you teleport directly to every boss, maximizing your combat power.",
      strength: "strong",
      components: [...selectedPacts.filter((p) => p.category === "combat").map((p) => p.name), "Evil Eye (not selected)"],
    });
  }
  // Has Glass Cannon but no Vampiric Touch
  if (pactIds.has("pact-glass-cannon") && !pactIds.has("pact-vampiric-touch")) {
    missed.push({
      name: "Lifesteal Safety Net",
      description: "Glass Cannon makes you take more damage. Adding Vampiric Touch would give you sustain to offset the fragility.",
      strength: "moderate",
      components: ["Glass Cannon", "Vampiric Touch (not selected)"],
    });
  }
  // Has Culling Spree but no combat pacts
  if (relicIds.has("relic-t6-1") && !selectedPacts.some((p) => p.category === "combat")) {
    missed.push({
      name: "Slayer Machine",
      description: "You have Culling Spree for optimized Slayer but no combat pacts to boost kill speed. A combat pact would complete this combo.",
      strength: "moderate",
      components: ["Culling Spree", "Any combat pact (not selected)"],
    });
  }

  return missed;
}

// ─── Multiplier Timeline ────────────────────────────────────────────────

function getMultiplierTimeline(league: LeagueData): MultiplierTier[] {
  let xp = league.baseXpMultiplier;
  let drop = league.baseDropMultiplier;

  return league.relicTiers.map((rt) => {
    for (const eff of rt.passiveEffects) {
      const xpMatch = eff.match(/XP multiplier increased to (\d+)x/);
      if (xpMatch) xp = parseInt(xpMatch[1]);
      const dropMatch = eff.match(/Drop rate multiplier increased to (\d+)x/);
      if (dropMatch) drop = parseInt(dropMatch[1]);
    }
    return {
      tier: rt.tier,
      xpMultiplier: xp,
      dropMultiplier: drop,
      label: `Tier ${rt.tier}`,
    };
  });
}

// ─── Task Accessibility ─────────────────────────────────────────────────

function analyzeTaskAccessibility(
  build: LeagueBuild,
  league: LeagueData,
  accessible: Set<string>,
): TaskAccessibility {
  const byRegion: TaskAccessibility["byRegion"] = [];
  const regionTaskCounts: Record<string, number> = {};

  for (const task of league.tasks) {
    if (task.region) {
      regionTaskCounts[task.region] = (regionTaskCounts[task.region] || 0) + 1;
    }
  }

  for (const [regionId, count] of Object.entries(regionTaskCounts)) {
    const region = league.regions.find((r) => r.id === regionId);
    byRegion.push({
      regionName: region?.name || regionId,
      tasks: count,
      accessible: accessible.has(regionId),
    });
  }

  const accessibleTasks = league.tasks.filter(
    (t) => !t.region || accessible.has(t.region),
  );
  const inaccessibleTasks = league.tasks.filter(
    (t) => t.region && !accessible.has(t.region),
  );

  return {
    accessible: accessibleTasks.length,
    inaccessible: inaccessibleTasks.length,
    total: league.tasks.length,
    byRegion: byRegion.sort((a, b) => b.tasks - a.tasks),
    accessiblePoints: accessibleTasks.reduce((s, t) => s + t.points, 0),
    totalPoints: league.tasks.reduce((s, t) => s + t.points, 0),
  };
}

// ─── Warnings ───────────────────────────────────────────────────────────

function generateWarnings(
  build: LeagueBuild,
  league: LeagueData,
  relics: Relic[],
  pacts: Pact[],
  accessible: Set<string>,
): Warning[] {
  const warnings: Warning[] = [];
  const pactIds = new Set(pacts.map((p) => p.id));
  const relicIds = new Set(relics.map((r) => r.id));

  // No regions selected
  if (build.regions.length === 0 && league.maxRegions > 0) {
    warnings.push({
      severity: "critical",
      message: `You haven't selected any regions yet. Choose ${league.maxRegions} regions to unlock content.`,
    });
  } else if (build.regions.length < league.maxRegions && league.maxRegions > 0) {
    warnings.push({
      severity: "caution",
      message: `You've only selected ${build.regions.length}/${league.maxRegions} regions. You're leaving ${league.maxRegions - build.regions.length} region slot(s) empty.`,
    });
  }

  // No relics selected
  const relicTiersWithChoices = league.relicTiers.filter((t) => t.relics.length > 0);
  if (relics.length === 0 && relicTiersWithChoices.length > 0) {
    warnings.push({
      severity: "caution",
      message: "No relics selected. Relics provide massive power boosts — pick one for each tier with choices.",
    });
  }

  // Glass Cannon + Berserker = extreme risk
  if (pactIds.has("pact-glass-cannon") && pactIds.has("pact-berserker")) {
    warnings.push({
      severity: "critical",
      message: "Glass Cannon + Berserker's Oath: you take extra damage AND can't use protection prayers. This is extremely dangerous for bossing. Consider Vampiric Touch for sustain.",
    });
  }

  // Glass Cannon without sustain
  if (pactIds.has("pact-glass-cannon") && !pactIds.has("pact-vampiric-touch")) {
    warnings.push({
      severity: "caution",
      message: "Glass Cannon active without Vampiric Touch. You'll take increased damage with no lifesteal. Bring extra food.",
    });
  }

  // Multiple T1 combat pacts (redundant)
  const t1CombatPacts = pacts.filter((p) => p.tier === 1 && p.category === "combat");
  if (t1CombatPacts.length >= 2) {
    warnings.push({
      severity: "caution",
      message: `You have ${t1CombatPacts.length} combat style pacts active. Each one reduces other styles — spreading across styles diminishes returns. Consider focusing on one.`,
    });
  }

  // No raid access
  const hasRaidAccess = accessible.has("kebos") || accessible.has("morytania") || accessible.has("desert");
  if (!hasRaidAccess && league.maxRegions > 0) {
    warnings.push({
      severity: "caution",
      message: "No raid access! You're missing Chambers of Xeric (Kebos), Theatre of Blood (Morytania), and Tombs of Amascut (Desert).",
    });
  }

  // Has gathering relic but no gathering regions
  if ((relicIds.has("relic-t1-1") || relicIds.has("relic-t1-2")) && build.regions.length > 0) {
    // Check if any regions have good gathering
    const gatheringRegions = ["kebos", "kandarin", "fremennik"];
    const hasGathering = gatheringRegions.some((r) => accessible.has(r));
    if (!hasGathering) {
      warnings.push({
        severity: "tip",
        message: "You have a gathering relic but limited gathering regions. Kebos (Wintertodt, GOTR) and Kandarin (Catherby fishing) are great for gathering.",
      });
    }
  }

  // Endgame boss tips
  if (accessible.has("karamja") && pacts.some((p) => p.category === "combat")) {
    warnings.push({
      severity: "tip",
      message: "Karamja + combat pacts = Inferno access. This is the highest-prestige task in the league (500 pts).",
    });
  }

  // Relic T1-3 Abundance money tip
  if (relicIds.has("relic-t1-3")) {
    warnings.push({
      severity: "tip",
      message: "Abundance generates coins from all XP. With 16x multiplier at T7, this generates massive GP — great for buying supplies as an ironman.",
    });
  }

  return warnings;
}

// ─── Pact Tradeoffs ─────────────────────────────────────────────────────

function analyzePactTradeoffs(pacts: Pact[]): PactTradeoff[] {
  return pacts.map((p) => ({
    pactName: p.name,
    gain: p.bonus,
    cost: p.penalty,
    riskLevel:
      p.id === "pact-berserker" ? "extreme" :
      p.id === "pact-glass-cannon" ? "high" :
      p.id === "pact-vampiric-touch" ? "medium" :
      "low",
  }));
}

// ─── Archetype Classification ───────────────────────────────────────────

function classifyArchetype(relics: Relic[], pacts: Pact[], build: LeagueBuild): BuildArchetype {
  const relicIds = new Set(relics.map((r) => r.id));
  const pactIds = new Set(pacts.map((p) => p.id));
  const combatPacts = pacts.filter((p) => p.category === "combat").length;

  if (relics.length === 0 && pacts.length === 0) {
    return { name: "Undecided", description: "Make some selections to see your build archetype.", icon: "🤔" };
  }

  if (relicIds.has("relic-t8-1") && pactIds.has("pact-glass-cannon") && pactIds.has("pact-berserker")) {
    return { name: "Demonlord", description: "Maximum risk, maximum power. You've gone all-in on damage with no safety net. True demon energy.", icon: "👹" };
  }

  if (relicIds.has("relic-t6-1") && combatPacts >= 1 && relicIds.has("relic-t3-1")) {
    return { name: "PvM Powerhouse", description: "Built to kill. Boss teleports, optimized Slayer, and combat pacts make you a boss-farming machine.", icon: "⚔️" };
  }

  if (relicIds.has("relic-t1-1") && relicIds.has("relic-t2-1")) {
    return { name: "Gathering Lord", description: "Resources flow endlessly. Auto-banking, doubled outputs, and instant processing create a resource empire.", icon: "⛏️" };
  }

  if (relicIds.has("relic-t1-3") && relics.length >= 2) {
    return { name: "Skill Prodigy", description: "+10 to all skills plus bonus XP. You rush high-level content that others need hours to unlock.", icon: "📚" };
  }

  if (combatPacts >= 3) {
    return { name: "Berserker", description: "Triple combat pacts make you devastating but also take heavy penalties. A high-risk glass cannon.", icon: "🔥" };
  }

  if (relicIds.has("relic-t8-1")) {
    return { name: "Summoner", description: "Your Minion companion fights, loots, and powers up. You bring a friend to every fight.", icon: "🐾" };
  }

  if (combatPacts >= 1 && relics.length >= 2) {
    return { name: "Adventurer", description: "A balanced mix of combat power and utility. Ready for whatever the league throws at you.", icon: "🗡️" };
  }

  if (relics.length >= 2 && combatPacts === 0) {
    return { name: "Skiller", description: "Focused on non-combat progression. Efficient skilling and resource generation without the combat risk.", icon: "🌿" };
  }

  return { name: "Explorer", description: "A flexible build that's still taking shape. Keep selecting to define your playstyle.", icon: "🧭" };
}

// ─── Boss Access ────────────────────────────────────────────────────────

function analyzeBossAccess(accessible: Set<string>): BossAccess[] {
  const bosses: BossAccess[] = [];

  for (const [regionId, regionBosses] of Object.entries(REGION_BOSSES)) {
    for (const boss of regionBosses) {
      bosses.push({
        name: boss.name,
        region: regionId,
        accessible: accessible.has(regionId),
        difficulty: boss.difficulty,
      });
    }
  }

  return bosses.sort((a, b) => {
    const diffOrder = { mid: 0, high: 1, endgame: 2 };
    return diffOrder[a.difficulty] - diffOrder[b.difficulty];
  });
}
