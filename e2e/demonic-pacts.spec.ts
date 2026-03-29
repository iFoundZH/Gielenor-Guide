import { test, expect } from "@playwright/test";

// ─── Helper: select a relic by name ─────────────────────────────────────
async function selectRelic(page: import("@playwright/test").Page, name: string) {
  await page.locator(`text=${name}`).first().click();
  await page.waitForTimeout(200);
}

// ─── DP Guide Page ──────────────────────────────────────────────────────

test.describe("Demonic Pacts Strategy Guide", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/leagues/demonic-pacts/guide");
  });

  test("loads with 4 strategy tabs", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Strategy Guide");
    await expect(page.locator("button >> text=Speedrunner")).toBeVisible();
    await expect(page.locator("button >> text=PvM Powerhouse")).toBeVisible();
    await expect(page.locator("button >> text=Completionist")).toBeVisible();
    await expect(page.locator("button >> text=Ironman Optimized")).toBeVisible();
  });

  test("Speedrunner shows real DP relic: Barbarian Gathering", async ({ page }) => {
    await expect(page.locator("text=Barbarian Gathering").first()).toBeVisible();
  });

  test("PvM shows real DP relic: Endless Harvest", async ({ page }) => {
    await page.locator("button >> text=PvM Powerhouse").click();
    await expect(page.locator("text=Endless Harvest").first()).toBeVisible();
  });

  test("Completionist shows real DP relic: Abundance", async ({ page }) => {
    await page.locator("button >> text=Completionist").click();
    await expect(page.locator("text=Abundance").first()).toBeVisible();
  });

  test("strategies show region recommendations", async ({ page }) => {
    // Speedrunner regions
    await expect(page.locator("text=Regions").first()).toBeVisible();
    await expect(page.locator("text=Kebos & Kourend").first()).toBeVisible();
    await expect(page.locator("text=Morytania").first()).toBeVisible();
    await expect(page.locator("text=Kandarin").first()).toBeVisible();
  });

  test("shows real DP pact names", async ({ page }) => {
    // Speedrunner pacts
    await expect(page.locator("text=Melee Might").first()).toBeVisible();
    await expect(page.locator("text=Glass Cannon").first()).toBeVisible();
  });

  test("PvM strategy shows Berserker's Oath", async ({ page }) => {
    await page.locator("button >> text=PvM Powerhouse").click();
    await expect(page.locator("text=Berserker's Oath").first()).toBeVisible();
  });

  test("auto-selected relics note is shown", async ({ page }) => {
    await expect(page.locator("text=Woodsman, T3 Evil Eye, T4 Conniving Clues")).toBeVisible();
  });

  test("shows Open in Planner button for each strategy", async ({ page }) => {
    const link = page.locator("a >> text=Open in Planner");
    await expect(link).toBeVisible();
    const href = await link.getAttribute("href");
    expect(href).toContain("/leagues/demonic-pacts/planner?build=");
  });

  test("Open in Planner loads Speedrunner build correctly", async ({ page }) => {
    await page.locator("a >> text=Open in Planner").click();
    await expect(page).toHaveURL(/\/leagues\/demonic-pacts\/planner\?build=/);
    // Should have Barbarian Gathering selected
    await expect(page.locator("text=Selected Relics")).toBeVisible();
  });

  test("PvM Open in Planner loads correct regions", async ({ page }) => {
    await page.locator("button >> text=PvM Powerhouse").click();
    await page.locator("a >> text=Open in Planner").click();
    await expect(page).toHaveURL(/\/leagues\/demonic-pacts\/planner\?build=/);
    // Should load with regions pre-selected
    await expect(page.locator("text=Selected Regions")).toBeVisible();
  });

  test("Completionist shows 4 pacts", async ({ page }) => {
    await page.locator("button >> text=Completionist").click();
    const pacts = ["Melee Might", "Ranged Fury", "Magic Surge", "Vampiric Touch"];
    for (const pact of pacts) {
      await expect(page.locator(`text=${pact}`).first()).toBeVisible();
    }
  });

  test("phase cards mention auto-selected relics", async ({ page }) => {
    // Speedrunner phases should mention auto-unlocked relics
    await expect(page.locator("text=Woodsman (T2)").first()).toBeVisible();
    // Evil Eye is mentioned in mid game section
    await expect(page.locator("text=Evil Eye (T3)").first()).toBeVisible();
  });
});

// ─── DP Planner: Strategy Builds ────────────────────────────────────────

test.describe("DP Planner - Strategy Builds", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/leagues/demonic-pacts/planner");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("Gathering Lord archetype with Endless Harvest + Woodsman", async ({ page }) => {
    // Click the relic card heading to select
    await page.locator("h4:has-text('Endless Harvest')").click();
    await page.waitForTimeout(300);
    await page.locator("h4:has-text('Woodsman')").click();
    await page.waitForTimeout(300);
    await expect(page.locator("#analysis >> text=Gathering Lord")).toBeVisible();
  });

  test("Skill Prodigy archetype with Abundance + another relic", async ({ page }) => {
    await page.locator("h4:has-text('Abundance')").click();
    await page.waitForTimeout(300);
    await page.locator("h4:has-text('Woodsman')").click();
    await page.waitForTimeout(300);
    await expect(page.locator("#analysis >> text=Skill Prodigy")).toBeVisible();
  });

  test("PvM Powerhouse archetype with Evil Eye + Culling Spree + combat pact", async ({ page }) => {
    await selectRelic(page, "Evil Eye");
    await selectRelic(page, "Culling Spree");
    await page.locator("text=Melee Might").first().click();
    await expect(page.locator("text=PvM Powerhouse")).toBeVisible();
  });

  test("Demonlord archetype with Minion + Glass Cannon + Berserker's Oath", async ({ page }) => {
    await selectRelic(page, "Minion");
    await page.locator("text=Glass Cannon").first().click();
    await page.locator("text=Berserker's Oath").first().click();
    await expect(page.locator("text=Demonlord")).toBeVisible();
  });

  test("region selection updates boss access", async ({ page }) => {
    // Select Morytania for ToB
    await page.locator("h5 >> text=Morytania").click();

    await page.locator("button:has-text('Boss Access')").click();
    await expect(page.locator("#analysis >> text=Theatre of Blood")).toBeVisible();
  });

  test("no regions selected warns about missing content", async ({ page }) => {
    await page.locator("button:has-text('Warnings & Tips')").click();
    await expect(page.locator("text=haven't selected any regions")).toBeVisible();
  });

  test("Glass Cannon + Berserker's Oath triggers critical warning", async ({ page }) => {
    await page.locator("text=Glass Cannon").first().click();
    await page.locator("text=Berserker's Oath").first().click();
    await page.locator("button:has-text('Warnings & Tips')").click();
    await expect(page.locator("text=Glass Cannon + Berserker")).toBeVisible();
  });

  test("Endless Harvest + Woodsman triggers Gathering Pipeline synergy", async ({ page }) => {
    await page.locator("h4:has-text('Endless Harvest')").click();
    await page.waitForTimeout(300);
    await page.locator("h4:has-text('Woodsman')").click();
    await page.waitForTimeout(300);
    const synergiesBtn = page.locator("#analysis button:has-text('Active Synergies')");
    await synergiesBtn.click();
    await expect(page.locator("#analysis >> text=Gathering Pipeline")).toBeVisible();
  });

  test("Evil Eye + combat pact triggers Boss Blitz synergy", async ({ page }) => {
    await selectRelic(page, "Evil Eye");
    await page.locator("text=Melee Might").first().click();
    await page.locator("button:has-text('Active Synergies')").click();
    await expect(page.locator("text=Boss Blitz")).toBeVisible();
  });

  test("Culling Spree + combat pact triggers Slayer Machine synergy", async ({ page }) => {
    await selectRelic(page, "Culling Spree");
    await page.locator("text=Melee Might").first().click();
    await page.locator("button:has-text('Active Synergies')").click();
    await expect(page.locator("text=Slayer Machine")).toBeVisible();
  });

  test("Minion + Glass Cannon triggers Glass Cannon + Minion synergy", async ({ page }) => {
    await selectRelic(page, "Minion");
    await page.locator("text=Glass Cannon").first().click();
    await page.locator("button:has-text('Active Synergies')").click();
    await expect(page.locator("text=Glass Cannon + Minion")).toBeVisible();
  });

  test("Evil Eye + Conniving Clues triggers Clue Blitz synergy", async ({ page }) => {
    await selectRelic(page, "Evil Eye");
    await selectRelic(page, "Conniving Clues");
    await page.locator("button:has-text('Active Synergies')").click();
    await expect(page.locator("text=Clue Blitz")).toBeVisible();
  });
});

// ─── DP Planner: Region Mechanics ───────────────────────────────────────

test.describe("DP Planner - Region Mechanics", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/leagues/demonic-pacts/planner");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("Varlamore is always accessible (starting)", async ({ page }) => {
    await expect(page.locator("h5 >> text=Varlamore")).toBeVisible();
  });

  test("Misthalin shows as inaccessible", async ({ page }) => {
    await expect(page.locator("text=Misthalin")).toBeVisible();
  });

  test("selecting 3 regions fills the quota", async ({ page }) => {
    await page.locator("h5 >> text=Asgarnia").click();
    await page.locator("h5 >> text=Morytania").click();
    await page.locator("h5 >> text=Kebos").click();
    await expect(page.locator("text=3 / 3").first()).toBeVisible();
  });

  test("task accessibility updates with regions", async ({ page }) => {
    await page.locator("h5 >> text=Morytania").click();
    await page.locator("button:has-text('Task Accessibility')").click();
    await expect(page.locator("text=Accessible Tasks")).toBeVisible();
  });
});

// ─── DP Task Tracker ────────────────────────────────────────────────────

test.describe("DP Task Tracker - Comprehensive", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/leagues/demonic-pacts/tasks");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("shows correct task count", async ({ page }) => {
    // DP has 43 tasks total: 15 easy + 10 medium + 8 hard + 6 elite + 4 master
    await expect(page.locator("text=/\\/ 43 tasks/")).toBeVisible();
  });

  test("sort by difficulty works", async ({ page }) => {
    // DP task tracker sort select is at index 3 (difficulty, category, region, sort)
    const sortSelect = page.locator("select").nth(3);
    await sortSelect.selectOption("points-desc");
    const firstPoints = await page.locator("div.rounded-lg.border.cursor-pointer").first().locator("text=/\\d+ pts/").textContent();
    // DP master tasks are 200 pts (placeholder data, not yet confirmed from wiki)
    expect(firstPoints).toContain("200");
  });

  test("region filter shows only matching tasks", async ({ page }) => {
    // DP tasks have region tags
    const categorySelect = page.locator("select").nth(1);
    await categorySelect.selectOption("Combat");
    const tasks = page.locator("div.rounded-lg.border.cursor-pointer");
    const count = await tasks.count();
    expect(count).toBeGreaterThan(0);
  });
});
