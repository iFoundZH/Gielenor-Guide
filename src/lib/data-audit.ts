/**
 * Data completeness audit — validates all synced data meets expected thresholds.
 * Run with: npm run audit-data
 * In CI mode (--ci flag): outputs plain text suitable for PR descriptions.
 */

type Status = "OK" | "WARN" | "FAIL";

interface CheckResult {
  name: string;
  status: Status;
  detail: string;
}

const results: CheckResult[] = [];
const ciMode = process.argv.includes("--ci");

function check(name: string, status: Status, detail: string) {
  results.push({ name, status, detail });
}

function colorize(status: Status): string {
  if (ciMode) return status;
  const colors = { OK: "\x1b[32m", WARN: "\x1b[33m", FAIL: "\x1b[31m" };
  return `${colors[status]}${status}\x1b[0m`;
}

async function main() {
  const { leagues } = await import("../data/leagues.js");
  const { osrsQuests } = await import("../data/osrs-quests.js");
  const { osrsBosses } = await import("../data/osrs-bosses.js");
  const { skillTrainingGuides } = await import("../data/guides/skills/index.js");
  const { achievementDiaries } = await import("../data/guides/diaries/index.js");
  const { combatAchievements } = await import("../data/guides/combat-achievements.js");

  const dp = leagues.find((l) => l.id === "demonic-pacts");
  const re = leagues.find((l) => l.id === "raging-echoes");

  // --- DP task count ---
  if (dp) {
    const dpLaunched = new Date() >= new Date(dp.startDate);
    if (dpLaunched) {
      check(
        "DP task count (post-launch)",
        dp.tasks.length >= 100 ? "OK" : dp.tasks.length > 0 ? "WARN" : "FAIL",
        `${dp.tasks.length} tasks (expect 1000+ post-launch)`
      );
    } else {
      check(
        "DP task count (pre-launch)",
        dp.tasks.length > 0 ? "OK" : "FAIL",
        `${dp.tasks.length} tasks (placeholder OK pre-launch)`
      );
    }
  }

  // --- RE task count ---
  if (re) {
    check(
      "RE task count",
      re.tasks.length === 1589 ? "OK" : re.tasks.length > 1500 ? "WARN" : "FAIL",
      `${re.tasks.length} tasks (expected 1,589)`
    );

    // RE task breakdown
    const expected = { easy: 224, medium: 536, hard: 437, elite: 345, master: 47 };
    const actual: Record<string, number> = {};
    for (const d of ["easy", "medium", "hard", "elite", "master"] as const) {
      actual[d] = re.tasks.filter((t) => t.difficulty === d).length;
    }
    const breakdownMatch = Object.entries(expected).every(
      ([k, v]) => actual[k] === v
    );
    check(
      "RE task breakdown",
      breakdownMatch ? "OK" : "WARN",
      Object.entries(actual)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ")
    );
  }

  // --- Relic completeness (per league) ---
  for (const league of leagues) {
    const allRelics = league.relicTiers.flatMap((t) => t.relics);
    const tiersWithRelics = league.relicTiers.filter((t) => t.relics.length > 0).length;
    check(
      `${league.name} relics`,
      tiersWithRelics === league.relicTiers.length ? "OK" : "WARN",
      `${allRelics.length} relics across ${tiersWithRelics}/${league.relicTiers.length} tiers`
    );
  }

  // --- Region completeness ---
  for (const league of leagues) {
    const types = new Set(league.regions.map((r) => r.type));
    const hasStarting = types.has("starting");
    const hasChoosable = types.has("choosable");
    check(
      `${league.name} regions`,
      hasStarting && hasChoosable ? "OK" : "WARN",
      `${league.regions.length} regions, types: ${[...types].join(", ")}`
    );
  }

  // --- Reward tiers ---
  for (const league of leagues) {
    check(
      `${league.name} reward tiers`,
      league.rewardTiers.length === 7 ? "OK" : "WARN",
      `${league.rewardTiers.length} tiers (expected 7: Bronze-Dragon)`
    );
  }

  // --- Quest count ---
  check(
    "Quest count",
    osrsQuests.length >= 170 ? "OK" : osrsQuests.length >= 150 ? "WARN" : "FAIL",
    `${osrsQuests.length} quests (expected 170+)`
  );

  // --- Boss count ---
  check(
    "Boss count",
    osrsBosses.length >= 50 ? "OK" : osrsBosses.length >= 30 ? "WARN" : "FAIL",
    `${osrsBosses.length} bosses (expected 50+)`
  );

  // --- Skill guides ---
  const uniqueSkills = new Set(skillTrainingGuides.map((g) => g.skill));
  const p2pCount = skillTrainingGuides.filter((g) => g.variant === "p2p").length;
  check(
    "Skill guides",
    uniqueSkills.size >= 24 && p2pCount >= 24 ? "OK" : "WARN",
    `${skillTrainingGuides.length} guides, ${uniqueSkills.size} skills, ${p2pCount} P2P`
  );

  // --- Diary areas ---
  check(
    "Diary areas",
    achievementDiaries.length === 12 ? "OK" : "WARN",
    `${achievementDiaries.length} areas (expected 12)`
  );

  // --- Combat achievement tiers ---
  const caTiers = combatAchievements.tiers.map((t) => t.tier);
  const expectedTiers = ["easy", "medium", "hard", "elite", "master", "grandmaster"];
  const allTiersPresent = expectedTiers.every((t) => caTiers.includes(t as typeof caTiers[number]));
  const totalCAs = combatAchievements.tiers.reduce((sum, t) => sum + t.tasks.length, 0);
  check(
    "Combat achievement tiers",
    allTiersPresent ? "OK" : "WARN",
    `${caTiers.length} tiers (${caTiers.join(", ")}), ${totalCAs} total tasks`
  );

  // --- Region distribution (misthalin over-representation check) ---
  if (re) {
    const regionCounts: Record<string, number> = {};
    for (const task of re.tasks) {
      const region = task.region || "unknown";
      regionCounts[region] = (regionCounts[region] || 0) + 1;
    }
    const misthalinCount = regionCounts["misthalin"] || 0;
    const misthalinPct = ((misthalinCount / re.tasks.length) * 100).toFixed(1);
    check(
      "RE region distribution",
      misthalinCount / re.tasks.length < 0.3 ? "OK" : "WARN",
      `misthalin: ${misthalinCount} tasks (${misthalinPct}%) — known fallback bug if >30%`
    );
  }

  // --- Duplicate IDs ---
  for (const league of leagues) {
    const taskIds = league.tasks.map((t) => t.id);
    const dupes = taskIds.filter((id, i) => taskIds.indexOf(id) !== i);
    check(
      `${league.name} duplicate task IDs`,
      dupes.length === 0 ? "OK" : "FAIL",
      dupes.length === 0 ? "No duplicates" : `${dupes.length} duplicates: ${dupes.slice(0, 5).join(", ")}`
    );
  }

  // --- Staleness check ---
  for (const league of leagues) {
    const synced = new Date(league.lastSynced);
    const now = new Date();
    const daysSince = Math.floor((now.getTime() - synced.getTime()) / (1000 * 60 * 60 * 24));
    const isActive = now >= new Date(league.startDate) && now <= new Date(league.endDate);
    const threshold = isActive ? 2 : 7;
    check(
      `${league.name} staleness`,
      daysSince <= threshold ? "OK" : daysSince <= threshold * 2 ? "WARN" : "FAIL",
      `Last synced ${daysSince} day(s) ago (threshold: ${threshold}d ${isActive ? "active" : "inactive"})`
    );
  }

  // --- Print results ---
  const maxNameLen = Math.max(...results.map((r) => r.name.length));
  console.log("\n  Data Audit Report");
  console.log("  " + "=".repeat(60));

  for (const r of results) {
    const pad = " ".repeat(maxNameLen - r.name.length);
    console.log(`  ${r.name}${pad}  [${colorize(r.status)}]  ${r.detail}`);
  }

  const counts = { OK: 0, WARN: 0, FAIL: 0 };
  for (const r of results) counts[r.status]++;

  console.log("  " + "-".repeat(60));
  console.log(
    `  Total: ${counts.OK} OK, ${counts.WARN} WARN, ${counts.FAIL} FAIL\n`
  );

  if (counts.FAIL > 0) process.exit(1);
}

main().catch((err) => {
  console.error("[data-audit] Failed:", err);
  process.exit(1);
});
