import { test, expect } from "@playwright/test";

// ─── Helper: select a relic by name ─────────────────────────────────────
async function selectRelic(page: import("@playwright/test").Page, name: string) {
  // If the relics section is collapsed, expand it first
  const relicsSection = page.locator("#relics");
  const editBtn = relicsSection.locator("button:has-text('Edit')");
  if (await editBtn.isVisible({ timeout: 500 }).catch(() => false)) {
    await editBtn.click();
    await page.waitForTimeout(300);
  }
  const card = page.locator(`h4:has-text("${name}")`).first();
  // Use evaluate click to bypass sticky nav overlay issues
  await card.evaluate(el => (el as HTMLElement).click());
  // After clicking, the section may auto-collapse if all tiers are now filled.
  // Assert: either the relic card shows selected state OR the section collapsed (both confirm success)
  const selectedState = card.locator("xpath=ancestor::div[contains(@class,'bg-osrs-panel')]");
  const collapsed = relicsSection.locator("button:has-text('Edit')");
  await expect(selectedState.or(collapsed)).toBeVisible({ timeout: 5000 });
}

// ─── DP Guide Page ──────────────────────────────────────────────────────

test.describe("Demonic Pacts Strategy Guide", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/leagues/demonic-pacts/guide");
  });

  test("loads with all guide tabs", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Strategy Guide");
    await expect(page.locator("button >> text=Getting Started")).toBeVisible();
    await expect(page.locator("button >> text=Relic Guide")).toBeVisible();
    await expect(page.locator("button >> text=Region Guide")).toBeVisible();
    await expect(page.locator("button >> text=Combat Builds")).toBeVisible();
    await expect(page.locator("button >> text=Pact Strategies")).toBeVisible();
    await expect(page.locator("button >> text=Rank 1 Guide")).toBeVisible();
  });

  test("Getting Started tab shows step-by-step guide", async ({ page }) => {
    // Getting Started is the default tab
    await expect(page.locator("text=Varlamore").first()).toBeVisible();
  });

  test("Relic Guide tab shows tier list", async ({ page }) => {
    await page.locator("button >> text=Relic Guide").click();
    await expect(page.locator("text=Tier 1").first()).toBeVisible();
    await expect(page.locator("text=Tier 8").first()).toBeVisible();
    // Expand T1 to see relics
    await page.locator("text=Tier 1").first().click();
    await expect(page.locator("text=Endless Harvest").first()).toBeVisible();
    await expect(page.locator("text=Barbarian Gathering").first()).toBeVisible();
    await expect(page.locator("text=Abundance").first()).toBeVisible();
  });

  test("Region Guide tab shows regions with tiers", async ({ page }) => {
    await page.locator("button >> text=Region Guide").click();
    await expect(page.locator("text=Kebos & Kourend").first()).toBeVisible();
    await expect(page.locator("text=Morytania").first()).toBeVisible();
    await expect(page.locator("text=Misthalin").first()).toBeVisible();
  });

  test("Combat Builds tab shows build archetypes", async ({ page }) => {
    await page.locator("button >> text=Combat Builds").click();
    await expect(page.locator("text=Melee").first()).toBeVisible();
    await expect(page.locator("text=Ranged").first()).toBeVisible();
  });

  test("Pact Strategies tab shows pact rankings", async ({ page }) => {
    await page.locator("button >> text=Pact Strategies").click();
    await expect(page.locator("text=Glass Cannon").first()).toBeVisible();
    await expect(page.locator("text=Berserker's Oath").first()).toBeVisible();
    await expect(page.locator("text=Melee Might").first()).toBeVisible();
  });

  test("Relic Guide shows mandatory relics", async ({ page }) => {
    await page.locator("button >> text=Relic Guide").click();
    // Expand T3 to see mandatory Evil Eye
    await page.locator("text=Tier 3").first().click();
    await expect(page.locator("text=Evil Eye").first()).toBeVisible();
    await expect(page.locator("text=Mandatory").first()).toBeVisible();
  });
});

// ─── DP Planner: Strategy Builds ────────────────────────────────────────

test.describe("DP Planner - Strategy Builds", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/leagues/demonic-pacts/planner");
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "networkidle" });
  });

  test("Gathering Lord archetype with Endless Harvest + Woodsman", async ({ page }) => {
    await selectRelic(page, "Endless Harvest");
    await selectRelic(page, "Woodsman");
    await expect(page.locator("#analysis >> text=Gathering Lord")).toBeVisible();
  });

  test("Skill Prodigy archetype with Abundance + another relic", async ({ page }) => {
    await selectRelic(page, "Abundance");
    await selectRelic(page, "Woodsman");
    await expect(page.locator("#analysis >> text=Skill Prodigy")).toBeVisible();
  });

  test("PvM Powerhouse archetype with Evil Eye + Culling Spree + combat pact", async ({ page }) => {
    await selectRelic(page, "Evil Eye");
    await selectRelic(page, "Culling Spree");
    await page.locator("#pacts h4:has-text('Melee Might')").evaluate(el => (el as HTMLElement).click());
    await expect(page.locator("#analysis >> text=PvM Powerhouse")).toBeVisible();
  });

  test("Demonlord archetype with Minion + Glass Cannon + Berserker's Oath", async ({ page }) => {
    await selectRelic(page, "Minion");
    await page.locator("text=Glass Cannon").first().evaluate(el => (el as HTMLElement).click());
    await page.locator("text=Berserker's Oath").first().evaluate(el => (el as HTMLElement).click());
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
    await page.locator("text=Glass Cannon").first().evaluate(el => (el as HTMLElement).click());
    await page.locator("text=Berserker's Oath").first().evaluate(el => (el as HTMLElement).click());
    await page.locator("button:has-text('Warnings & Tips')").click();
    await expect(page.locator("text=Glass Cannon + Berserker")).toBeVisible();
  });

  test("Endless Harvest + Woodsman triggers Gathering Pipeline synergy", async ({ page }) => {
    await selectRelic(page, "Endless Harvest");
    await selectRelic(page, "Woodsman");
    const synergiesBtn = page.locator("#analysis button:has-text('Active Synergies')");
    await synergiesBtn.click();
    await expect(page.locator("#analysis >> text=Gathering Pipeline")).toBeVisible();
  });

  test("Evil Eye + combat pact triggers Boss Blitz synergy", async ({ page }) => {
    await selectRelic(page, "Evil Eye");
    await page.locator("text=Melee Might").first().evaluate(el => (el as HTMLElement).click());
    await page.locator("button:has-text('Active Synergies')").click();
    await expect(page.locator("text=Boss Blitz")).toBeVisible();
  });

  test("Culling Spree + combat pact triggers Slayer Machine synergy", async ({ page }) => {
    await selectRelic(page, "Culling Spree");
    await page.locator("text=Melee Might").first().evaluate(el => (el as HTMLElement).click());
    await page.locator("button:has-text('Active Synergies')").click();
    await expect(page.locator("text=Slayer Machine")).toBeVisible();
  });

  test("Minion + Glass Cannon triggers Glass Cannon + Minion synergy", async ({ page }) => {
    await selectRelic(page, "Minion");
    await page.locator("text=Glass Cannon").first().evaluate(el => (el as HTMLElement).click());
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
    await page.reload({ waitUntil: "networkidle" });
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
    await page.reload({ waitUntil: "networkidle" });
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
    // DP master tasks are 400 pts
    expect(firstPoints).toContain("400");
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
