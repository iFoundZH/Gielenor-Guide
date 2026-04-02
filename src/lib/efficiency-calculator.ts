import type {
  LeagueData,
  LeagueTask,
  TaskDifficulty,
} from "@/types/league";
import type {
  RegionAnalysis,
  RegionTier,
  OptimalRegionPick,
  RelicTierRecommendation,
  TaskRoutingPhase,
  TierProjection,
} from "@/types/efficiency-guide";

// Average minutes per task by difficulty (empirical league estimates)
const MINUTES_PER_TASK: Record<TaskDifficulty, number> = {
  easy: 2,
  medium: 8,
  hard: 25,
  elite: 60,
  master: 120,
};


/**
 * Count tasks strictly assigned to a region (excluding general).
 */
function tasksStrictlyInRegion(
  tasks: LeagueTask[],
  regionId: string
): LeagueTask[] {
  return tasks.filter((t) => t.region === regionId);
}

/**
 * Build a difficulty breakdown for a task list.
 */
function countByDifficulty(
  tasks: LeagueTask[]
): Record<TaskDifficulty, number> {
  const counts: Record<TaskDifficulty, number> = {
    easy: 0,
    medium: 0,
    hard: 0,
    elite: 0,
    master: 0,
  };
  for (const t of tasks) {
    counts[t.difficulty] = (counts[t.difficulty] || 0) + 1;
  }
  return counts;
}

/**
 * Estimate points per hour for a set of tasks based on difficulty time estimates.
 */
function estimatePointsPerHour(tasks: LeagueTask[]): number {
  if (tasks.length === 0) return 0;

  let totalMinutes = 0;
  let totalPoints = 0;
  for (const t of tasks) {
    totalMinutes += MINUTES_PER_TASK[t.difficulty] || 10;
    totalPoints += t.points;
  }

  if (totalMinutes === 0) return 0;
  return Math.round((totalPoints / totalMinutes) * 60);
}

/**
 * Assign S/A/B/C tier based on position in a sorted list.
 * Top 20% = S, next 30% = A, next 30% = B, bottom 20% = C.
 */
function assignTiers<T extends { totalPoints: number }>(
  items: T[]
): (T & { tier: RegionTier })[] {
  if (items.length === 0) return [];

  const sorted = [...items].sort((a, b) => b.totalPoints - a.totalPoints);
  const n = sorted.length;

  return sorted.map((item, i) => {
    const position = i / n;
    let tier: RegionTier;
    if (position < 0.2) tier = "S";
    else if (position < 0.5) tier = "A";
    else if (position < 0.8) tier = "B";
    else tier = "C";
    return { ...item, tier };
  });
}

/**
 * Generate all k-combinations of an array.
 */
function combinations<T>(arr: T[], k: number): T[][] {
  if (k <= 0 || k > arr.length) return k === 0 ? [[]] : [];
  if (k === arr.length) return [arr.slice()];

  const result: T[][] = [];

  function recurse(start: number, current: T[]) {
    if (current.length === k) {
      result.push(current.slice());
      return;
    }
    const remaining = k - current.length;
    for (let i = start; i <= arr.length - remaining; i++) {
      current.push(arr[i]);
      recurse(i + 1, current);
      current.pop();
    }
  }

  recurse(0, []);
  return result;
}

// ---------------------------------------------------------------------------
// Exported functions
// ---------------------------------------------------------------------------

/**
 * Analyze the efficiency of each choosable region in a league.
 *
 * For each choosable region, counts tasks by difficulty, sums total points,
 * estimates points/hour, and assigns S/A/B/C tier rankings.
 */
export function analyzeRegionEfficiency(
  league: LeagueData
): RegionAnalysis[] {
  const choosable = league.regions.filter((r) => r.type === "choosable");

  if (choosable.length === 0) return [];

  // General tasks count (no region) — informational for reasoning
  const generalTasks = league.tasks.filter(
    (t) => !t.region || t.region === ""
  );
  const generalPoints = generalTasks.reduce((s, t) => s + t.points, 0);

  // Build raw analysis per region (region-specific tasks only for scoring)
  const raw = choosable.map((region) => {
    const regionTasks = tasksStrictlyInRegion(league.tasks, region.id);
    const byDifficulty = countByDifficulty(regionTasks);
    const totalPoints = regionTasks.reduce((s, t) => s + t.points, 0);
    const bosses = region.echoBoss ? [region.echoBoss] : [];

    return {
      regionId: region.id,
      regionName: region.name,
      totalTasks: regionTasks.length,
      totalPoints,
      tasksByDifficulty: byDifficulty,
      ptsPerHourEstimate: estimatePointsPerHour(regionTasks),
      uniqueBosses: bosses,
      reasoning: "", // filled after tiering
      _region: region,
    };
  });

  // Assign tiers
  const tiered = assignTiers(raw);

  // Generate reasoning strings
  return tiered.map(({ _region, ptsPerHourEstimate, ...item }) => {
    const bossNote =
      item.uniqueBosses.length > 0
        ? ` Echo boss: ${item.uniqueBosses.join(", ")}.`
        : " No echo boss.";
    const generalNote =
      generalTasks.length > 0
        ? ` Plus ${generalTasks.length} general tasks (${generalPoints.toLocaleString()} pts) accessible everywhere.`
        : "";

    const reasoning =
      `${item.regionName} has ${item.totalTasks} region-specific tasks worth ${item.totalPoints?.toLocaleString()} points. ` +
      `Estimated ${ptsPerHourEstimate.toLocaleString()} pts/hr.${bossNote}${generalNote}`;

    return {
      regionId: item.regionId,
      regionName: item.regionName,
      tier: item.tier,
      totalTasks: item.totalTasks,
      totalPoints: item.totalPoints,
      tasksByDifficulty: item.tasksByDifficulty,
      uniqueBosses: item.uniqueBosses,
      reasoning,
    };
  });
}

/**
 * Find the optimal combination of choosable regions to maximize points.
 *
 * Enumerates all C(n, count) combinations, scores each by total task points
 * (with a 10% bonus for regions with an echo boss), and returns the best
 * and second-best combos with an unlock order recommendation.
 */
export function findOptimalRegions(
  league: LeagueData,
  count?: number
): OptimalRegionPick {
  const pickCount = count ?? league.maxRegions;
  const choosable = league.regions.filter((r) => r.type === "choosable");

  if (choosable.length === 0 || pickCount <= 0) {
    return {
      primary: [],
      alternative: [],
      mathJustification: "No choosable regions available.",
      unlockOrder: [],
    };
  }

  const effectiveCount = Math.min(pickCount, choosable.length);

  // Pre-compute per-region scores
  const regionScores = new Map<string, number>();
  const regionEasyMedium = new Map<string, number>();

  for (const region of choosable) {
    const regionTasks = tasksStrictlyInRegion(league.tasks, region.id);
    let points = regionTasks.reduce((s, t) => s + t.points, 0);

    // Echo boss bonus: +10%
    if (region.echoBoss) {
      points = Math.round(points * 1.1);
    }

    regionScores.set(region.id, points);

    // Count easy + medium tasks for unlock order
    const easyMedium = regionTasks.filter(
      (t) => t.difficulty === "easy" || t.difficulty === "medium"
    ).length;
    regionEasyMedium.set(region.id, easyMedium);
  }

  // Score all combinations
  const combos = combinations(choosable, effectiveCount);
  const scored = combos
    .map((combo) => {
      const ids = combo.map((r) => r.id);
      const score = ids.reduce((s, id) => s + (regionScores.get(id) || 0), 0);
      return { ids, score };
    })
    .sort((a, b) => b.score - a.score);

  const best = scored[0] || { ids: [], score: 0 };
  const second = scored[1] || { ids: [], score: 0 };

  // Unlock order: region with most easy/medium tasks first (fastest early points)
  const unlockOrder = [...best.ids].sort(
    (a, b) => (regionEasyMedium.get(b) || 0) - (regionEasyMedium.get(a) || 0)
  );

  const regionNames = (ids: string[]) =>
    ids
      .map(
        (id) =>
          choosable.find((r) => r.id === id)?.name || id
      )
      .join(", ");

  const mathJustification =
    `Best combo: ${regionNames(best.ids)} = ${best.score.toLocaleString()} pts (with echo boss bonuses). ` +
    `Runner-up: ${regionNames(second.ids)} = ${second.score.toLocaleString()} pts. ` +
    `Evaluated ${combos.length} combinations of ${choosable.length} regions choosing ${effectiveCount}.`;

  return {
    primary: best.ids,
    alternative: second.ids,
    mathJustification,
    unlockOrder,
  };
}

/**
 * Generate a recommended relic selection path through all tiers.
 *
 * Recommends the relic with the broadest impact (longest effects list) per tier.
 * Includes synergy notes referencing adjacent tiers.
 */
export function generateRelicPath(
  league: LeagueData
): RelicTierRecommendation[] {
  if (league.relicTiers.length === 0) return [];

  const sortedTiers = [...league.relicTiers].sort(
    (a, b) => a.tier - b.tier
  );

  return sortedTiers.map((relicTier, idx) => {
    const relics = relicTier.relics;

    if (relics.length === 0) {
      return {
        tier: relicTier.tier,
        recommended: "None",
        alternatives: [],
        reasoning: "No relics available in this tier.",
        synergyNotes: "",
      };
    }

    if (relics.length === 1) {
      const relic = relics[0];
      const prevTier = idx > 0 ? sortedTiers[idx - 1] : null;
      const nextTier =
        idx < sortedTiers.length - 1 ? sortedTiers[idx + 1] : null;

      const synergyParts: string[] = [];
      if (prevTier && prevTier.relics.length > 0) {
        synergyParts.push(
          `Follows T${prevTier.tier} (${prevTier.relics.map((r) => r.name).join("/")})`
        );
      }
      if (nextTier && nextTier.relics.length > 0) {
        synergyParts.push(
          `Precedes T${nextTier.tier} (${nextTier.relics.map((r) => r.name).join("/")})`
        );
      }

      return {
        tier: relicTier.tier,
        recommended: relic.name,
        alternatives: [],
        reasoning: `Only option. Effects: ${relic.effects.join("; ")}.`,
        synergyNotes:
          synergyParts.length > 0
            ? synergyParts.join(". ") + "."
            : "No adjacent tiers.",
      };
    }

    // Multiple relics: pick the one with most effects (broadest impact)
    const ranked = [...relics].sort(
      (a, b) => b.effects.length - a.effects.length
    );
    const recommended = ranked[0];
    const alternatives = ranked.slice(1).map((r) => r.name);

    const prevTier = idx > 0 ? sortedTiers[idx - 1] : null;
    const nextTier =
      idx < sortedTiers.length - 1 ? sortedTiers[idx + 1] : null;

    const synergyParts: string[] = [];
    if (prevTier && prevTier.relics.length > 0) {
      const prevRec =
        prevTier.relics.length === 1
          ? prevTier.relics[0].name
          : [...prevTier.relics].sort(
              (a, b) => b.effects.length - a.effects.length
            )[0].name;
      synergyParts.push(
        `Pairs with T${prevTier.tier} ${prevRec}`
      );
    }
    if (nextTier && nextTier.relics.length > 0) {
      const nextRec =
        nextTier.relics.length === 1
          ? nextTier.relics[0].name
          : [...nextTier.relics].sort(
              (a, b) => b.effects.length - a.effects.length
            )[0].name;
      synergyParts.push(
        `leads into T${nextTier.tier} ${nextRec}`
      );
    }

    return {
      tier: relicTier.tier,
      recommended: recommended.name,
      alternatives,
      reasoning:
        `${recommended.name} has the broadest impact with ${recommended.effects.length} effects: ` +
        `${recommended.effects.join("; ")}.`,
      synergyNotes:
        synergyParts.length > 0
          ? synergyParts.join(", ") + "."
          : "No adjacent tiers.",
    };
  });
}

/**
 * Generate a 3-phase task routing plan for selected regions.
 *
 * Phases:
 *  - Early Rush: easy/medium tasks for fast points
 *  - Mid Grind: hard tasks and boss kills
 *  - Late Push: elite/master tasks for top tiers
 */
export function generateTaskRouting(
  league: LeagueData,
  regionIds: string[]
): TaskRoutingPhase[] {
  // Accessible tasks: in selected regions or general (no region)
  const accessible = league.tasks.filter(
    (t) =>
      !t.region ||
      t.region === "" ||
      regionIds.includes(t.region)
  );

  if (accessible.length === 0) {
    return [
      {
        name: "No Tasks",
        pointRange: "0 → 0",
        strategy: "No accessible tasks for the selected regions.",
      },
    ];
  }

  // Also include starting/auto-unlock region tasks
  const startingRegionIds = league.regions
    .filter((r) => r.type === "starting" || r.type === "auto-unlock")
    .map((r) => r.id);

  const allAccessible = league.tasks.filter(
    (t) =>
      !t.region ||
      t.region === "" ||
      regionIds.includes(t.region) ||
      startingRegionIds.includes(t.region)
  );

  const totalPoints = allAccessible.reduce((s, t) => s + t.points, 0);

  // Determine tier boundaries from reward tiers
  const tiers = [...league.rewardTiers].sort(
    (a, b) => a.pointsRequired - b.pointsRequired
  );
  const firstTier = tiers[0]?.pointsRequired || 2500;
  const midIndex = Math.floor(tiers.length / 2);
  const midTier = tiers[midIndex]?.pointsRequired || 20000;

  // Count tasks by difficulty for strategy descriptions
  const easyMedium = allAccessible.filter(
    (t) => t.difficulty === "easy" || t.difficulty === "medium"
  );
  const hardTasks = allAccessible.filter((t) => t.difficulty === "hard");
  const eliteMaster = allAccessible.filter(
    (t) => t.difficulty === "elite" || t.difficulty === "master"
  );

  return [
    {
      name: "Early Rush",
      pointRange: `0 → ${firstTier.toLocaleString()}`,
      strategy:
        `Focus on ${easyMedium.length} easy/medium tasks across starting regions and unlocked areas. ` +
        `Prioritize quick completions to unlock relic tiers and region picks.`,
    },
    {
      name: "Mid Grind",
      pointRange: `${firstTier.toLocaleString()} → ${midTier.toLocaleString()}`,
      strategy:
        `Tackle ${hardTasks.length} hard tasks. Start boss kills for echo boss tasks. ` +
        `Mix in remaining medium tasks between boss attempts.`,
    },
    {
      name: "Late Push",
      pointRange: `${midTier.toLocaleString()} → ${totalPoints.toLocaleString()}+`,
      strategy:
        `Grind ${eliteMaster.length} elite/master tasks. These require significant time investment — ` +
        `high KC bosses, collection logs, and skill milestones.`,
    },
  ];
}

/**
 * Project tier timelines from reward tier data.
 *
 * Maps league reward tiers to tier projections, flagging tiers that may
 * exceed the total accessible points for the selected regions.
 */
export function projectTierTimelines(
  league: LeagueData,
  regionIds: string[]
): TierProjection[] {
  if (league.rewardTiers.length === 0) return [];

  // Calculate total accessible points for sanity cap
  const startingRegionIds = league.regions
    .filter((r) => r.type === "starting" || r.type === "auto-unlock")
    .map((r) => r.id);

  const allAccessibleIds = new Set([...regionIds, ...startingRegionIds]);
  const accessibleTasks = league.tasks.filter(
    (t) =>
      !t.region ||
      t.region === "" ||
      allAccessibleIds.has(t.region)
  );
  const maxAccessiblePoints = accessibleTasks.reduce(
    (s, t) => s + t.points,
    0
  );

  const sortedTiers = [...league.rewardTiers].sort(
    (a, b) => a.pointsRequired - b.pointsRequired
  );

  return sortedTiers.map((tier) => {
    const target = tier.pointsRequired;

    return {
      tierName: target > maxAccessiblePoints && maxAccessiblePoints > 0
        ? `${tier.name} (may exceed accessible points)`
        : tier.name,
      pointsRequired: target,
    };
  });
}
