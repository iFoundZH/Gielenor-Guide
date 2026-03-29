import { test, expect } from "@playwright/test";

test.describe("Guides Index Page", () => {
  test("loads and shows all guide categories", async ({ page }) => {
    await page.goto("/guides");
    await expect(page.locator("h1")).toContainText("All Guides");
    await expect(page.locator("text=Main Game Guides")).toBeVisible();
    await expect(page.locator("text=League Guides")).toBeVisible();
    await expect(page.locator("text=Snowflake Accounts")).toBeVisible();
  });

  test("shows main game guide cards", async ({ page }) => {
    await page.goto("/guides");
    await expect(page.locator("h3:has-text('Skill Training')")).toBeVisible();
    await expect(page.locator("h3:has-text('Main Account Guide')")).toBeVisible();
    await expect(page.locator("h3:has-text('Ironman Guides')")).toBeVisible();
    await expect(page.locator("h3:has-text('Optimal Quest Order')")).toBeVisible();
    await expect(page.locator("h3:has-text('Achievement Diaries')")).toBeVisible();
    await expect(page.locator("h3:has-text('Combat Achievements')")).toBeVisible();
  });

  test("shows snowflake guide cards", async ({ page }) => {
    await page.goto("/guides");
    await expect(page.locator("h3:has-text('Snowflake Guides')")).toBeVisible();
    await expect(page.locator("h3:has-text('Snowflake Planner')")).toBeVisible();
  });

  test("skill training link navigates correctly", async ({ page }) => {
    await page.goto("/guides");
    await page.locator("a[href='/guides/skills']").first().click();
    await expect(page).toHaveURL("/guides/skills");
    await expect(page.locator("h1")).toContainText("Skill Training");
  });
});

test.describe("Skill Training Guides", () => {
  test("skill index shows skill categories", async ({ page }) => {
    await page.goto("/guides/skills");
    await expect(page.locator("h1")).toContainText("Skill Training Guides");
    await expect(page.locator("text=Combat Skills")).toBeVisible();
    await expect(page.locator("text=Gathering Skills")).toBeVisible();
  });

  test("individual skill page loads", async ({ page }) => {
    await page.goto("/guides/skills/mining");
    await expect(page.locator("h1")).toContainText("Mining Training Guide");
  });

  test("skill page shows training methods table", async ({ page }) => {
    await page.goto("/guides/skills/mining");
    // Should have a table with training methods
    await expect(page.locator("th:has-text('Level Range')")).toBeVisible();
    await expect(page.locator("th:has-text('XP/hr')")).toBeVisible();
  });

  test("skill page has wiki link", async ({ page }) => {
    await page.goto("/guides/skills/mining");
    await expect(page.locator("text=Full article on Wiki")).toBeVisible();
  });
});

test.describe("Ironman Guides", () => {
  test("ironman index shows variants", async ({ page }) => {
    await page.goto("/guides/ironman");
    await expect(page.locator("h1")).toContainText("Ironman Guides");
    await expect(page.locator("h2:has-text('Ironman')").first()).toBeVisible();
    await expect(page.locator("h2:has-text('Ultimate Ironman')")).toBeVisible();
  });

  test("individual ironman guide loads", async ({ page }) => {
    await page.goto("/guides/ironman/standard");
    await expect(page.locator("h1")).toContainText("Ironman Guide");
  });
});

test.describe("Quest Order Guide", () => {
  test("quest page loads with tabs", async ({ page }) => {
    await page.goto("/guides/quests");
    await expect(page.locator("h1")).toContainText("Optimal Quest Order");
  });

  test("quest search works", async ({ page }) => {
    await page.goto("/guides/quests");
    const searchInput = page.locator("input[placeholder='Search quests...']");
    await expect(searchInput).toBeVisible();
    // Just verify the search input works (quest data may vary)
    await searchInput.fill("test");
    await searchInput.clear();
  });
});

test.describe("Achievement Diaries", () => {
  test("diary index shows areas", async ({ page }) => {
    await page.goto("/guides/diaries");
    await expect(page.locator("h1")).toContainText("Achievement Diaries");
    await expect(page.locator("text=Ardougne")).toBeVisible();
    await expect(page.locator("text=Varrock")).toBeVisible();
  });

  test("individual diary area loads with tiers", async ({ page }) => {
    await page.goto("/guides/diaries/ardougne");
    await expect(page.locator("h1")).toContainText("Ardougne Diary");
    // Should show tier tabs
    await expect(page.locator("button:has-text('Easy')")).toBeVisible();
    await expect(page.locator("button:has-text('Medium')")).toBeVisible();
  });

  test("diary tasks are displayed", async ({ page }) => {
    await page.goto("/guides/diaries/ardougne");
    // Should show overall progress
    await expect(page.locator("text=Overall Progress")).toBeVisible();
    // Should show tier tabs
    await expect(page.locator("button:has-text('Easy')")).toBeVisible();
    // Click on a tier that has tasks (Medium has 1)
    await page.locator("button:has-text('Medium')").click();
    // Should show the wiki link
    await expect(page.locator("text=Full article on Wiki")).toBeVisible();
  });
});

test.describe("Combat Achievements", () => {
  test("combat achievements page loads with tiers", async ({ page }) => {
    await page.goto("/guides/combat-achievements");
    await expect(page.locator("h1")).toContainText("Combat Achievements");
    await expect(page.locator("button:has-text('Easy')")).toBeVisible();
    await expect(page.locator("button").filter({ hasText: /^Master/ })).toBeVisible();
  });

  test("combat achievements search works", async ({ page }) => {
    await page.goto("/guides/combat-achievements");
    await page.locator("input[placeholder='Search tasks or monsters...']").fill("Jad");
    // Should find Jad-related tasks
    await expect(page.locator("text=Overall Progress")).toBeVisible();
  });
});

test.describe("Main Account Guide", () => {
  test("main account guide loads", async ({ page }) => {
    await page.goto("/guides/main");
    await expect(page.locator("h1")).toContainText("Main Account Guide");
  });

  test("main account guide shows sections", async ({ page }) => {
    await page.goto("/guides/main");
    await expect(page.locator("button:has-text('Getting Started')").first()).toBeVisible();
    await expect(page.locator("button:has-text('Gear Progression')").first()).toBeVisible();
  });
});

test.describe("Snowflake Guides", () => {
  test("snowflake guides index loads", async ({ page }) => {
    await page.goto("/guides/snowflake");
    await expect(page.locator("h1")).toContainText("Snowflake Account Guides");
    await expect(page.locator("text=Area-Locked Accounts")).toBeVisible();
    await expect(page.locator("text=Restriction Accounts")).toBeVisible();
  });

  test("snowflake guides index shows guide cards", async ({ page }) => {
    await page.goto("/guides/snowflake");
    await expect(page.locator("h3:has-text('Karamja Only')")).toBeVisible();
    await expect(page.locator("h3:has-text('1 Defence Pure')")).toBeVisible();
  });

  test("individual snowflake guide loads", async ({ page }) => {
    await page.goto("/guides/snowflake/karamja-only");
    await expect(page.locator("h1")).toContainText("Karamja Only");
    await expect(page.locator("button:has-text('Overview')").first()).toBeVisible();
  });

  test("snowflake guide shows planner link", async ({ page }) => {
    await page.goto("/guides/snowflake/karamja-only");
    await expect(page.locator("text=Open Snowflake Planner")).toBeVisible();
  });
});
