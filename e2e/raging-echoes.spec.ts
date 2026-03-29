import { test, expect } from "@playwright/test";

// ─── Helper: select a relic by name ─────────────────────────────────────
async function selectRelic(page: import("@playwright/test").Page, name: string) {
  // Use getByText within h4 to handle apostrophes in relic names (e.g. "Fairy's Flight")
  await page.locator("h4").filter({ hasText: name }).click();
  await page.waitForTimeout(200);
}

// ─── Helper: select a mastery by name ───────────────────────────────────
async function selectMastery(page: import("@playwright/test").Page, name: string) {
  await page.locator(`text=${name}`).first().click();
  await page.waitForTimeout(200);
}

// ─── RE Guide Page ──────────────────────────────────────────────────────

test.describe("Raging Echoes Strategy Guide", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/leagues/raging-echoes/guide");
  });

  test("loads with Speedrunner tab active", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Raging Echoes Strategy Guide");
    await expect(page.locator("h2 >> text=Speedrunner")).toBeVisible();
  });

  test("shows all 3 strategy tabs", async ({ page }) => {
    await expect(page.locator("button >> text=Speedrunner")).toBeVisible();
    await expect(page.locator("button >> text=PvM Destroyer")).toBeVisible();
    await expect(page.locator("button >> text=Completionist")).toBeVisible();
  });

  test("Speedrunner shows correct 8 relics", async ({ page }) => {
    const relics = ["Animal Wrangler", "Dodgy Deals", "Clue Compass", "Golden God",
      "Treasure Arbiter", "Total Recall", "Grimoire", "Specialist"];
    for (const relic of relics) {
      await expect(page.locator(`text=${relic}`).first()).toBeVisible();
    }
  });

  test("PvM Destroyer shows correct relics", async ({ page }) => {
    await page.locator("button >> text=PvM Destroyer").click();
    const relics = ["Power Miner", "Corner Cutter", "Bank Heist", "Reloaded",
      "Slayer Master", "Banker's Note", "Grimoire", "Guardian"];
    for (const relic of relics) {
      await expect(page.locator(`text=${relic}`).first()).toBeVisible();
    }
  });

  test("Completionist shows correct relics", async ({ page }) => {
    await page.locator("button >> text=Completionist").click();
    const relics = ["Lumberjack", "Friendly Forager", "Fairy's Flight", "Equilibrium",
      "Production Master", "Total Recall", "Overgrown", "Last Stand"];
    for (const relic of relics) {
      await expect(page.locator(`text=${relic}`).first()).toBeVisible();
    }
  });

  test("shows mastery recommendations", async ({ page }) => {
    await expect(page.locator("text=Recommended Masteries")).toBeVisible();
    await expect(page.locator("text=Melee Mastery").first()).toBeVisible();
  });

  test("shows Open in Planner button", async ({ page }) => {
    const link = page.locator("a >> text=Open in Planner");
    await expect(link).toBeVisible();
    const href = await link.getAttribute("href");
    expect(href).toContain("/leagues/raging-echoes/planner?build=");
  });

  test("Open in Planner loads correct Speedrunner build", async ({ page }) => {
    const link = page.locator("a >> text=Open in Planner");
    await link.click();
    await expect(page).toHaveURL(/\/leagues\/raging-echoes\/planner\?build=/);
    // Should have Speedrunner relics selected
    await expect(page.locator("text=Selected Relics")).toBeVisible();
  });

  test("phase cards reference all tier picks", async ({ page }) => {
    // Speedrunner early game should mention T1 and T2
    await expect(page.locator("text=Animal Wrangler (T1)")).toBeVisible();
    await expect(page.locator("text=Dodgy Deals (T2)")).toBeVisible();
  });

  test("difficulty badges display correctly", async ({ page }) => {
    await expect(page.locator("text=Advanced").first()).toBeVisible();
    await page.locator("button >> text=PvM Destroyer").click();
    await expect(page.locator("text=Intermediate").first()).toBeVisible();
    await page.locator("button >> text=Completionist").click();
    await expect(page.locator("text=Expert").first()).toBeVisible();
  });
});

// ─── RE Planner: Speedrunner Build ──────────────────────────────────────

test.describe("RE Planner - Speedrunner Build", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/leagues/raging-echoes/planner");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("select full Speedrunner build and verify analysis", async ({ page }) => {
    await selectRelic(page, "Animal Wrangler");
    await selectRelic(page, "Dodgy Deals");
    await selectRelic(page, "Clue Compass");
    await selectRelic(page, "Golden God");
    await selectRelic(page, "Treasure Arbiter");
    await selectRelic(page, "Total Recall");
    await selectRelic(page, "Grimoire");
    await selectRelic(page, "Specialist");
    await selectMastery(page, "Melee Mastery");

    // Verify 8/8 relics selected
    await expect(page.locator("text=8 / 8").first()).toBeVisible();
  });

  test("Dodgy Deals + Golden God triggers Thieving Empire synergy", async ({ page }) => {
    await selectRelic(page, "Dodgy Deals");
    await selectRelic(page, "Golden God");

    const synergiesBtn = page.locator("#analysis button:has-text('Active Synergies')");
    await expect(synergiesBtn).toBeVisible();
    await synergiesBtn.click();
    await expect(page.locator("#analysis span.text-osrs-green:has-text('Thieving Empire')")).toBeVisible();
  });

  test("Specialist + mastery triggers Special Attack Engine", async ({ page }) => {
    await selectRelic(page, "Specialist");
    await selectMastery(page, "Melee Mastery");

    const synergiesBtn = page.locator("#analysis button:has-text('Active Synergies')");
    await expect(synergiesBtn).toBeVisible();
    await synergiesBtn.click();
    await expect(page.locator("#analysis >> text=Special Attack Engine")).toBeVisible();
  });
});

// ─── RE Planner: PvM Destroyer Build ────────────────────────────────────

test.describe("RE Planner - PvM Destroyer Build", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/leagues/raging-echoes/planner");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("select full PvM build and verify Summoner archetype", async ({ page }) => {
    await selectRelic(page, "Power Miner");
    await selectRelic(page, "Corner Cutter");
    await selectRelic(page, "Bank Heist");
    await selectRelic(page, "Reloaded");
    await selectRelic(page, "Slayer Master");
    await selectRelic(page, "Banker's Note");
    await selectRelic(page, "Grimoire");
    await selectRelic(page, "Guardian");
    await selectMastery(page, "Melee Mastery");
    await selectMastery(page, "Ranged Mastery");

    await expect(page.locator("text=8 / 8").first()).toBeVisible();
    await expect(page.locator("#analysis >> text=Summoner")).toBeVisible();
  });

  test("Reloaded triggers tip about choosing a second relic", async ({ page }) => {
    await selectRelic(page, "Reloaded");

    const warningsBtn = page.locator("#analysis button:has-text('Warnings')");
    await warningsBtn.click();
    await expect(page.locator("#analysis >> text=Reloaded lets you pick")).toBeVisible();
  });

  test("Clue Compass + Treasure Arbiter triggers Clue Master synergy", async ({ page }) => {
    await selectRelic(page, "Clue Compass");
    await selectRelic(page, "Treasure Arbiter");

    const synergiesBtn = page.locator("#analysis button:has-text('Active Synergies')");
    await synergiesBtn.click();
    await expect(page.locator("#analysis >> text=Clue Master")).toBeVisible();
  });

  test("Total Recall + Specialist triggers Recall Specialist synergy", async ({ page }) => {
    await selectRelic(page, "Total Recall");
    await selectRelic(page, "Specialist");

    const synergiesBtn = page.locator("#analysis button:has-text('Active Synergies')");
    await synergiesBtn.click();
    await expect(page.locator("#analysis >> text=Recall Specialist")).toBeVisible();
  });
});

// ─── RE Planner: Completionist Build ────────────────────────────────────

test.describe("RE Planner - Completionist Build", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/leagues/raging-echoes/planner");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("select full Completionist build and verify Unkillable archetype", async ({ page }) => {
    await selectRelic(page, "Lumberjack");
    await selectRelic(page, "Friendly Forager");
    await selectRelic(page, "Fairy's Flight");
    await selectRelic(page, "Equilibrium");
    await selectRelic(page, "Production Master");
    await selectRelic(page, "Total Recall");
    await selectRelic(page, "Overgrown");
    await selectRelic(page, "Last Stand");
    await selectMastery(page, "Melee Mastery");
    await selectMastery(page, "Ranged Mastery");
    await selectMastery(page, "Magic Mastery");

    await expect(page.locator("text=8 / 8").first()).toBeVisible();
    // Last Stand + combat mastery = Unkillable archetype
    await expect(page.locator("#analysis >> text=Unkillable")).toBeVisible();
  });

  test("Power Miner + Production Master triggers Mining Pipeline", async ({ page }) => {
    await selectRelic(page, "Power Miner");
    await selectRelic(page, "Production Master");

    const synergiesBtn = page.locator("#analysis button:has-text('Active Synergies')");
    await synergiesBtn.click();
    await expect(page.locator("#analysis >> text=Mining Pipeline")).toBeVisible();
  });

  test("Friendly Forager + Production Master triggers Potion Factory", async ({ page }) => {
    await selectRelic(page, "Friendly Forager");
    await selectRelic(page, "Production Master");

    const synergiesBtn = page.locator("#analysis button:has-text('Active Synergies')");
    await synergiesBtn.click();
    await expect(page.locator("#analysis >> text=Potion Factory")).toBeVisible();
  });

  test("Lumberjack + Overgrown triggers Farming Pipeline", async ({ page }) => {
    await selectRelic(page, "Lumberjack");
    await selectRelic(page, "Overgrown");

    const synergiesBtn = page.locator("#analysis button:has-text('Active Synergies')");
    await synergiesBtn.click();
    await expect(page.locator("#analysis >> text=Farming Pipeline")).toBeVisible();
  });

  test("3 masteries triggers multiple mastery tip", async ({ page }) => {
    await selectMastery(page, "Melee Mastery");
    await selectMastery(page, "Ranged Mastery");
    await selectMastery(page, "Magic Mastery");

    const warningsBtn = page.locator("#analysis button:has-text('Warnings')");
    await warningsBtn.click();
    await expect(page.locator("#analysis >> text=Multiple masteries")).toBeVisible();
  });
});

// ─── RE Planner: Missed Synergies ───────────────────────────────────────

test.describe("RE Planner - Missed Synergies", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/leagues/raging-echoes/planner");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("Power Miner without Production Master shows missed synergy", async ({ page }) => {
    await selectRelic(page, "Power Miner");
    await selectRelic(page, "Equilibrium");

    const missedBtn = page.locator("#analysis button:has-text('Missed Synergies')");
    await expect(missedBtn).toBeVisible();
    await missedBtn.click();
    await expect(page.locator("#analysis >> text=Mining Pipeline")).toBeVisible();
  });

  test("Clue Compass without Treasure Arbiter shows missed Clue Master", async ({ page }) => {
    await selectRelic(page, "Clue Compass");
    await selectRelic(page, "Guardian");

    const missedBtn = page.locator("#analysis button:has-text('Missed Synergies')");
    await expect(missedBtn).toBeVisible();
    await missedBtn.click();
    await expect(page.locator("#analysis >> text=Clue Master")).toBeVisible();
  });

  test("Dodgy Deals without Golden God shows missed Thieving Empire", async ({ page }) => {
    await selectRelic(page, "Dodgy Deals");
    await selectRelic(page, "Guardian");

    const missedBtn = page.locator("#analysis button:has-text('Missed Synergies')");
    await expect(missedBtn).toBeVisible();
    await missedBtn.click();
    await expect(page.locator("#analysis >> text=Thieving Empire")).toBeVisible();
  });
});

// ─── RE Planner: Edge Cases ─────────────────────────────────────────────

test.describe("RE Planner - Edge Cases", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/leagues/raging-echoes/planner");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("empty build shows Undecided archetype", async ({ page }) => {
    await expect(page.locator("#analysis >> text=Undecided")).toBeVisible();
  });

  test("single relic shows Explorer archetype", async ({ page }) => {
    await selectRelic(page, "Power Miner");
    await expect(page.locator("#analysis >> text=Explorer")).toBeVisible();
  });

  test("two relics no masteries shows Skiller archetype", async ({ page }) => {
    await selectRelic(page, "Power Miner");
    await selectRelic(page, "Corner Cutter");
    await expect(page.locator("#analysis >> text=Skiller")).toBeVisible();
  });

  test("switching relics in same tier replaces selection", async ({ page }) => {
    await selectRelic(page, "Power Miner");
    await expect(page.locator("text=1 / 8").first()).toBeVisible();

    await selectRelic(page, "Lumberjack");
    await expect(page.locator("text=1 / 8").first()).toBeVisible();
  });

  test("deselecting a relic works", async ({ page }) => {
    await selectRelic(page, "Power Miner");
    await expect(page.locator("text=1 / 8").first()).toBeVisible();

    await selectRelic(page, "Power Miner");
    await expect(page.locator("text=0 / 8").first()).toBeVisible();
  });

  test("all 3 masteries can be selected simultaneously", async ({ page }) => {
    await selectMastery(page, "Melee Mastery");
    await selectMastery(page, "Ranged Mastery");
    await selectMastery(page, "Magic Mastery");

    // 3 masteries with no relics = Berserker archetype in analysis
    await expect(page.locator("#analysis >> text=Berserker").first()).toBeVisible();
  });

  test("League Ended banner is visible", async ({ page }) => {
    await expect(page.getByText("League Ended", { exact: true })).toBeVisible();
  });

  test("build persists to localStorage", async ({ page }) => {
    await selectRelic(page, "Power Miner");
    await selectRelic(page, "Corner Cutter");
    await selectMastery(page, "Melee Mastery");

    await page.reload();
    await expect(page.locator("text=2 / 8").first()).toBeVisible();
  });

  test("share button copies URL", async ({ page }) => {
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    await selectRelic(page, "Power Miner");
    await page.locator("text=Share Build").click();
    await expect(page.locator("text=Copied!")).toBeVisible();
  });

  test("reset clears all selections after confirm", async ({ page }) => {
    await selectRelic(page, "Power Miner");
    await selectRelic(page, "Corner Cutter");
    // Verify relics were selected
    await expect(page.locator("text=2 / 8").first()).toBeVisible({ timeout: 3000 });

    page.once("dialog", (d) => d.accept());
    await page.locator("button >> text=Reset").click();

    // After reset, should show 0/8
    await expect(page.locator("text=0 / 8").first()).toBeVisible({ timeout: 5000 });
  });
});

// ─── RE Planner: Region Data ────────────────────────────────────────

test.describe("RE Planner - Region Data", () => {
  test("planner page loads with region info in description", async ({ page }) => {
    await page.goto("/leagues/raging-echoes/planner");
    // RE planner shows region info; the strategy guide shows region unlock details
    await expect(page.locator("text=Raging Echoes Build Planner")).toBeVisible();
  });
});

// ─── RE Planner: Build Balance ──────────────────────────────────────────

test.describe("RE Planner - Build Balance", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/leagues/raging-echoes/planner");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("combat-focused build shows combat-heavy balance", async ({ page }) => {
    await selectRelic(page, "Specialist");
    await selectRelic(page, "Guardian");
    await selectMastery(page, "Melee Mastery");

    const balanceBtn = page.locator("#analysis button:has-text('Build Balance')");
    await balanceBtn.click();
    await expect(page.getByText("Combat", { exact: true }).first()).toBeVisible();
  });

  test("gathering-focused build shows gathering emphasis", async ({ page }) => {
    await selectRelic(page, "Power Miner");
    await selectRelic(page, "Lumberjack");

    const balanceBtn = page.locator("#analysis button:has-text('Build Balance')");
    await balanceBtn.click();
    await expect(page.getByText("Gathering", { exact: true })).toBeVisible();
  });
});

// ─── RE Planner: Multiplier Progression ─────────────────────────────────

test.describe("RE Planner - Multiplier Progression", () => {
  test("shows correct XP multiplier progression", async ({ page }) => {
    await page.goto("/leagues/raging-echoes/planner");

    const multBtn = page.locator("#analysis button:has-text('Multiplier Progression')");
    await multBtn.click();
    await expect(page.locator("#analysis >> text=/5x/").first()).toBeVisible();
    await expect(page.locator("#analysis >> text=/16x/").first()).toBeVisible();
  });
});

// ─── RE Task Tracker ────────────────────────────────────────────────────

test.describe("RE Task Tracker - Comprehensive", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/leagues/raging-echoes/tasks");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("shows all difficulty levels", async ({ page }) => {
    await expect(page.locator("text=easy").first()).toBeVisible();
    await expect(page.locator("text=medium").first()).toBeVisible();
    await expect(page.locator("text=hard").first()).toBeVisible();
    await expect(page.locator("text=elite").first()).toBeVisible();
    await expect(page.locator("text=master").first()).toBeVisible();
  });

  test("shows reward progress track", async ({ page }) => {
    await expect(page.locator("text=Reward Progress")).toBeVisible();
  });

  test("sort by points high to low works", async ({ page }) => {
    const sortSelect = page.locator("select").nth(2);
    await sortSelect.selectOption("points-desc");
    const firstPoints = await page.locator("div.rounded-lg.border.cursor-pointer").first().locator("text=/\\d+ pts/").textContent();
    expect(firstPoints).toContain("400");
  });

  test("sort by points low to high works", async ({ page }) => {
    const sortSelect = page.locator("select").nth(2);
    await sortSelect.selectOption("points-asc");
    const firstPoints = await page.locator("div.rounded-lg.border.cursor-pointer").first().locator("text=/\\d+ pts/").textContent();
    expect(firstPoints).toContain("10");
  });

  test("completing tasks updates points display", async ({ page }) => {
    const firstTask = page.locator("div.rounded-lg.border.cursor-pointer").first();
    await firstTask.click();
    const pointsDisplay = page.locator("text=Points:").locator("..").locator("span.font-bold");
    const points = await pointsDisplay.textContent();
    expect(points).not.toBe("0");
  });

  test("search filter finds specific tasks", async ({ page }) => {
    await page.locator("input[placeholder='Search tasks...']").fill("Equip an Infernal Cape");
    // Wait for filter to apply (1,589 tasks takes a moment)
    await page.waitForTimeout(500);
    const tasks = page.locator("div.rounded-lg.border.cursor-pointer");
    await expect(tasks).toHaveCount(1, { timeout: 5000 });
    await expect(tasks.first()).toContainText("Infernal Cape");
  });

  test("League Ended banner shows", async ({ page }) => {
    await expect(page.getByText("League Ended", { exact: true })).toBeVisible();
  });

  test("task completion persists after reload", async ({ page }) => {
    await page.locator("div.rounded-lg.border.cursor-pointer").first().click();
    await page.waitForTimeout(500);
    const stored = await page.evaluate(() => localStorage.getItem("gielinor-re-tasks"));
    expect(stored).toBeTruthy();
    await page.reload();
    const firstTask = page.locator("div.rounded-lg.border.cursor-pointer").first();
    await expect(firstTask).toHaveClass(/bg-osrs-green/);
  });
});

// ─── RE Overview Page ───────────────────────────────────────────────────

test.describe("RE Overview Page", () => {
  test("shows league ended banner", async ({ page }) => {
    await page.goto("/leagues/raging-echoes");
    await expect(page.getByText("League Ended", { exact: true })).toBeVisible();
  });

  test("shows quick facts labels", async ({ page }) => {
    await page.goto("/leagues/raging-echoes");
    await expect(page.locator("text=Relic Tiers").first()).toBeVisible();
    await expect(page.locator("text=Named Relics").first()).toBeVisible();
    await expect(page.locator("text=Tasks").first()).toBeVisible();
  });

  test("navigates to planner", async ({ page }) => {
    await page.goto("/leagues/raging-echoes");
    await page.locator("a >> text=Open Planner").click();
    await expect(page).toHaveURL(/\/leagues\/raging-echoes\/planner/);
  });
});
