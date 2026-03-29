/**
 * Global setup: warm the dev server's compilation cache by visiting all test pages.
 * This prevents on-demand compilation from causing timeouts during parallel test runs.
 */
async function globalSetup() {
  const baseUrl = "http://localhost:3000";
  const pages = [
    "/",
    "/guides",
    "/guides/skills",
    "/guides/skills/mining",
    "/guides/ironman",
    "/guides/ironman/standard",
    "/guides/quests",
    "/guides/diaries",
    "/guides/diaries/ardougne",
    "/guides/combat-achievements",
    "/snowflake",
    "/snowflake/planner",
    "/snowflake/goals",
    "/leagues/demonic-pacts",
    "/leagues/demonic-pacts/planner",
    "/leagues/demonic-pacts/guide",
    "/leagues/demonic-pacts/tasks",
    "/leagues/raging-echoes",
    "/leagues/raging-echoes/planner",
    "/leagues/raging-echoes/guide",
    "/leagues/raging-echoes/tasks",
  ];

  console.log("Warming dev server compilation cache...");
  for (const page of pages) {
    try {
      await fetch(`${baseUrl}${page}`);
    } catch {
      // Server might not be ready yet for all pages
    }
  }
  console.log(`Warmed ${pages.length} pages.`);
}

export default globalSetup;
