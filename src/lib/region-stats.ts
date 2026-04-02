import type { LeagueTask, TaskDifficulty } from "@/types/league";
import type { RegionAnalysis } from "@/types/efficiency-guide";
import { osrsBosses } from "@/data/osrs-bosses";
import { osrsQuests } from "@/data/osrs-quests";
import { REGION_BOSSES } from "@/lib/build-analysis";

export interface RegionBossInfo {
  name: string;
  combatLevel: number | null;
  difficulty: "mid" | "high" | "endgame";
  category: string[];
  notableDrops: string[];
  slayerReq?: number;
}

export interface RegionQuestInfo {
  name: string;
  difficulty: string;
  questPoints: number;
  keyUnlocks: string[];
}

export interface RegionStats {
  bosses: RegionBossInfo[];
  bossCount: number;
  quests: RegionQuestInfo[];
  questCount: number;
  totalQuestPoints: number;
  taskCount: number;
  tasksByDifficulty: Record<TaskDifficulty, number>;
  totalTaskPoints: number;
  tier?: "S" | "A" | "B" | "C";
  estimatedPtsPerHour?: number;
  reasoning?: string;
}

const DIFFICULTY_MAP = new Map<string, "mid" | "high" | "endgame">();
for (const [, bossList] of Object.entries(REGION_BOSSES)) {
  for (const b of bossList) {
    DIFFICULTY_MAP.set(b.name, b.difficulty);
  }
}

function matchesRegion(bossRegion: string, targetRegion: string): boolean {
  if (bossRegion === targetRegion) return true;
  // kebos and kourend share content
  if ((targetRegion === "kebos" || targetRegion === "kourend") &&
      (bossRegion === "kebos" || bossRegion === "kourend")) return true;
  return false;
}

export function computeRegionStats(
  regionId: string,
  tasks: LeagueTask[],
  regionAnalysis?: RegionAnalysis[],
): RegionStats {
  // Bosses
  const regionBosses = osrsBosses.filter((b) => matchesRegion(b.region, regionId));
  const bosses: RegionBossInfo[] = regionBosses.map((b) => {
    const slayerReq = b.skillRequirements?.find((s) => s.skill === "Slayer");
    return {
      name: b.name,
      combatLevel: b.combatLevel,
      difficulty: DIFFICULTY_MAP.get(b.name) ?? "mid",
      category: b.category ?? [],
      notableDrops: (b.notableDrops ?? []).slice(0, 3),
      slayerReq: slayerReq?.level,
    };
  });

  // Quests
  const regionQuests = osrsQuests.filter((q) => matchesRegion(q.region, regionId));
  const quests: RegionQuestInfo[] = regionQuests.map((q) => ({
    name: q.name,
    difficulty: q.difficulty,
    questPoints: q.questPoints,
    keyUnlocks: (q.unlocks ?? []).slice(0, 2),
  }));
  const totalQuestPoints = regionQuests.reduce((s, q) => s + q.questPoints, 0);

  // Tasks
  const regionTasks = tasks.filter((t) => t.region === regionId);
  const tasksByDifficulty: Record<TaskDifficulty, number> = {
    easy: 0, medium: 0, hard: 0, elite: 0, master: 0,
  };
  for (const t of regionTasks) {
    tasksByDifficulty[t.difficulty]++;
  }
  const totalTaskPoints = regionTasks.reduce((s, t) => s + t.points, 0);

  // Efficiency guide data
  const analysis = regionAnalysis?.find((a) => a.regionId === regionId);

  return {
    bosses: bosses.sort((a, b) => {
      const order = { endgame: 0, high: 1, mid: 2 };
      return order[a.difficulty] - order[b.difficulty];
    }),
    bossCount: bosses.length,
    quests,
    questCount: quests.length,
    totalQuestPoints,
    taskCount: regionTasks.length,
    tasksByDifficulty,
    totalTaskPoints,
    tier: analysis?.tier,
    estimatedPtsPerHour: analysis?.estimatedPtsPerHour,
    reasoning: analysis?.reasoning,
  };
}
