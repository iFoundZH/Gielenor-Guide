/**
 * Generates src/data/sync-status.json with metadata about data completeness.
 * Called at the end of prebuild and in the CI sync workflow.
 */
import { writeFileSync } from "fs";
import { resolve } from "path";

async function main() {
  // Dynamic imports to handle @/ path alias via tsx
  const { leagues } = await import("../data/leagues.js");
  const { osrsQuests } = await import("../data/osrs-quests.js");
  const { osrsBosses } = await import("../data/osrs-bosses.js");
  const { skillTrainingGuides } = await import("../data/guides/skills/index.js");
  const { achievementDiaries } = await import("../data/guides/diaries/index.js");
  const { combatAchievements } = await import("../data/guides/combat-achievements.js");

  const leagueStatus: Record<string, unknown> = {};
  for (const league of leagues) {
    const difficulties = ["easy", "medium", "hard", "elite", "master"] as const;
    const taskBreakdown: Record<string, number> = {};
    for (const d of difficulties) {
      taskBreakdown[d] = league.tasks.filter((t) => t.difficulty === d).length;
    }

    leagueStatus[league.id] = {
      taskCount: league.tasks.length,
      taskBreakdown,
      totalPoints: league.tasks.reduce((sum, t) => sum + t.points, 0),
      relicCount: league.relicTiers.flatMap((t) => t.relics).length,
      relicTierCount: league.relicTiers.length,
      regionCount: league.regions.length,
      pactCount: league.pacts.length,
      rewardTierCount: league.rewardTiers.length,
      maxRegions: league.maxRegions,
      lastSynced: league.lastSynced,
    };
  }

  const uniqueSkills = new Set(skillTrainingGuides.map((g) => g.skill));
  const p2pGuides = skillTrainingGuides.filter((g) => g.variant === "p2p").length;
  const f2pGuides = skillTrainingGuides.filter((g) => g.variant === "f2p").length;
  const caTierCount = combatAchievements.tiers.length;
  const caTotalTasks = combatAchievements.tiers.reduce((sum, t) => sum + t.tasks.length, 0);

  const status = {
    generatedAt: new Date().toISOString(),
    leagues: leagueStatus,
    guides: {
      skillGuideCount: skillTrainingGuides.length,
      uniqueSkillCount: uniqueSkills.size,
      p2pGuideCount: p2pGuides,
      f2pGuideCount: f2pGuides,
      diaryAreaCount: achievementDiaries.length,
      combatAchievementTierCount: caTierCount,
      combatAchievementTaskCount: caTotalTasks,
    },
    data: {
      questCount: osrsQuests.length,
      bossCount: osrsBosses.length,
    },
  };

  const outPath = resolve("src/data/sync-status.json");
  writeFileSync(outPath, JSON.stringify(status, null, 2) + "\n");
  console.log(`[sync-status] Wrote ${outPath}`);
}

main().catch((err) => {
  console.error("[sync-status] Failed:", err);
  process.exit(1);
});
