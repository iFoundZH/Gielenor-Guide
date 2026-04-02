#!/usr/bin/env tsx
/**
 * Compute Guide Stats
 *
 * Computes real region-level task statistics from league data for use in
 * efficiency guides. Replaces fabricated numbers with computed values.
 *
 * Usage:
 *   npx tsx src/lib/compute-guide-stats.ts           # Print stats to stdout
 *   npx tsx src/lib/compute-guide-stats.ts --write    # Patch efficiency guide files
 */

import * as fs from "node:fs";
import * as path from "node:path";

const PROJECT_ROOT = path.resolve(import.meta.dirname ?? __dirname, "../..");

interface TaskDifficultyBreakdown {
  easy: number;
  medium: number;
  hard: number;
  elite: number;
  master: number;
}

interface RegionStats {
  regionId: string;
  regionName: string;
  totalTasks: number;
  totalPoints: number;
  tasksByDifficulty: TaskDifficultyBreakdown;
}

interface LeagueStats {
  leagueId: string;
  leagueName: string;
  totalTasks: number;
  totalPoints: number;
  globalDifficulty: TaskDifficultyBreakdown;
  regionStats: RegionStats[];
  generalTasks: number;
  generalPoints: number;
}

function computeLeagueStats(leagueModule: Record<string, unknown>): LeagueStats {
  // Find the league data export (first object with .tasks array)
  let league: Record<string, unknown> | null = null;
  for (const value of Object.values(leagueModule)) {
    if (value && typeof value === "object" && "tasks" in value && Array.isArray((value as Record<string, unknown>).tasks)) {
      league = value as Record<string, unknown>;
      break;
    }
  }
  if (!league) throw new Error("No league data found in module");

  const tasks = league.tasks as { difficulty: string; points: number; region?: string; category?: string }[];
  const regions = league.regions as { id: string; name: string }[];
  const leagueId = league.id as string;
  const leagueName = league.name as string;

  // Global stats
  const globalDifficulty: TaskDifficultyBreakdown = { easy: 0, medium: 0, hard: 0, elite: 0, master: 0 };
  let totalPoints = 0;

  for (const task of tasks) {
    const diff = task.difficulty as keyof TaskDifficultyBreakdown;
    if (diff in globalDifficulty) globalDifficulty[diff]++;
    totalPoints += task.points;
  }

  // Per-region stats
  const regionMap = new Map<string, RegionStats>();
  for (const region of regions) {
    regionMap.set(region.id, {
      regionId: region.id,
      regionName: region.name,
      totalTasks: 0,
      totalPoints: 0,
      tasksByDifficulty: { easy: 0, medium: 0, hard: 0, elite: 0, master: 0 },
    });
  }

  let generalTasks = 0;
  let generalPoints = 0;

  for (const task of tasks) {
    const regionId = task.region;
    if (regionId && regionMap.has(regionId)) {
      const stats = regionMap.get(regionId)!;
      stats.totalTasks++;
      stats.totalPoints += task.points;
      const diff = task.difficulty as keyof TaskDifficultyBreakdown;
      if (diff in stats.tasksByDifficulty) stats.tasksByDifficulty[diff]++;
    } else {
      generalTasks++;
      generalPoints += task.points;
    }
  }

  const regionStats = [...regionMap.values()].sort((a, b) => b.totalPoints - a.totalPoints);

  return {
    leagueId,
    leagueName,
    totalTasks: tasks.length,
    totalPoints,
    globalDifficulty,
    regionStats,
    generalTasks,
    generalPoints,
  };
}

function printStats(stats: LeagueStats): void {
  console.log(`\n=== ${stats.leagueName} ===`);
  console.log(`Total tasks: ${stats.totalTasks}`);
  console.log(`Total points: ${stats.totalPoints.toLocaleString()}`);
  console.log(`Difficulty breakdown: Easy=${stats.globalDifficulty.easy} Medium=${stats.globalDifficulty.medium} Hard=${stats.globalDifficulty.hard} Elite=${stats.globalDifficulty.elite} Master=${stats.globalDifficulty.master}`);
  console.log(`\nGeneral (no region): ${stats.generalTasks} tasks, ${stats.generalPoints.toLocaleString()} pts`);
  console.log(`\nRegion breakdown:`);

  for (const rs of stats.regionStats) {
    const d = rs.tasksByDifficulty;
    console.log(`  ${rs.regionName.padEnd(16)} ${String(rs.totalTasks).padStart(4)} tasks  ${String(rs.totalPoints).padStart(7)} pts  E=${d.easy} M=${d.medium} H=${d.hard} El=${d.elite} Ma=${d.master}`);
  }
}

function patchEfficiencyGuide(stats: LeagueStats, guideFilePath: string): boolean {
  if (!fs.existsSync(guideFilePath)) {
    console.log(`  Guide file not found: ${guideFilePath}`);
    return false;
  }

  let content = fs.readFileSync(guideFilePath, "utf-8");
  let patched = false;

  for (const rs of stats.regionStats) {
    // Match regionId in the guide and patch totalTasks, totalPoints, tasksByDifficulty
    // Pattern: regionId: "xxx", ... totalTasks: N, totalPoints: N, tasksByDifficulty: { ... }
    const regionPattern = new RegExp(
      `(regionId:\\s*"${rs.regionId}"[\\s\\S]*?)(totalTasks:\\s*)\\d+(,\\s*totalPoints:\\s*)\\d+(,\\s*tasksByDifficulty:\\s*\\{\\s*easy:\\s*)\\d+(,\\s*medium:\\s*)\\d+(,\\s*hard:\\s*)\\d+(,\\s*elite:\\s*)\\d+(,\\s*master:\\s*)\\d+`,
    );

    const match = content.match(regionPattern);
    if (match) {
      const d = rs.tasksByDifficulty;
      const replacement = `${match[1]}${match[2]}${rs.totalTasks}${match[3]}${rs.totalPoints}${match[4]}${d.easy}${match[5]}${d.medium}${match[6]}${d.hard}${match[7]}${d.elite}${match[8]}${d.master}`;
      content = content.replace(regionPattern, replacement);
      patched = true;
      console.log(`  Patched ${rs.regionName}: ${rs.totalTasks} tasks, ${rs.totalPoints} pts`);
    }
  }

  if (patched) {
    fs.writeFileSync(guideFilePath, content);
    console.log(`  Written: ${guideFilePath}`);
  } else {
    console.log(`  No matching region entries found to patch`);
  }

  return patched;
}

async function main() {
  const args = process.argv.slice(2);
  const doWrite = args.includes("--write");

  console.log("Computing guide stats from league task data...\n");

  // Import league data dynamically
  const reModule = await import("../data/raging-echoes");
  const dpModule = await import("../data/demonic-pacts");

  const reStats = computeLeagueStats(reModule);
  const dpStats = computeLeagueStats(dpModule);

  printStats(reStats);
  printStats(dpStats);

  if (doWrite) {
    console.log("\n--- Patching efficiency guide files ---\n");

    const reGuidePath = path.join(PROJECT_ROOT, "src/data/guides/efficiency/raging-echoes-rank1.ts");
    const dpGuidePath = path.join(PROJECT_ROOT, "src/data/guides/efficiency/demonic-pacts-rank1.ts");

    console.log("RE Guide:");
    patchEfficiencyGuide(reStats, reGuidePath);

    console.log("DP Guide:");
    patchEfficiencyGuide(dpStats, dpGuidePath);
  } else {
    console.log("\nRun with --write to patch efficiency guide files.");
  }
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
