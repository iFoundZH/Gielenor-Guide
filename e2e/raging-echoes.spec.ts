import { test, expect } from "@playwright/test";

// ─── Helper: select a relic by name ─────────────────────────────────────
async function selectRelic(page: import("@playwright/test").Page, name: string) {
  await page.locator(`text=${name}`).first().click();
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
    const relics = ["Trickster", "Fairy's Flight", "Infernal Gathering", "Clue Compass",
      "Last Recall", "Weapon Specialist", "Echo Augmentation", "Dodgy Dealings"];
    for (const relic of relics) {
      await expect(page.locator(`text=${relic}`).first()).toBeVisible();
    }
  });

  test("PvM Destroyer shows correct relics", async ({ page }) => {
    await page.locator("button >> text=PvM Destroyer").click();
    const relics = ["Production Prodigy", "Banker's Note", "Knife's Edge", "Soul Stealer",
      "Last Recall", "Weapon Specialist", "Echo Augmentation", "Absolute Unit"];
    for (const relic of relics) {
      await expect(page.locator(`text=${relic}`).first()).toBeVisible();
    }
  });

  test("Completionist shows correct relics", async ({ page }) => {
    await page.locator("button >> text=Completionist").click();
    const relics = ["Endless Harvest", "Banker's Note", "Equilibrium", "Clue Compass",
      "Friendly Forager", "Ruinous Powers", "Treasure Seeker", "Riftwalker"];
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
    await expect(page.locator("text=Trickster (T1)")).toBeVisible();
    await expect(page.locator("text=Fairy's Flight (T2)")).toBeVisible();
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
    await selectRelic(page, "Trickster");
    await selectRelic(page, "Fairy's Flight");
    await selectRelic(page, "Infernal Gathering");
    await selectRelic(page, "Clue Compass");
    await selectRelic(page, "Last Recall");
    await selectRelic(page, "Weapon Specialist");
    await selectRelic(page, "Echo Augmentation");
    await selectRelic(page, "Dodgy Dealings");
    await selectMastery(page, "Melee Mastery");

    // Verify 8/8 relics selected
    await expect(page.locator("text=8 / 8").first()).toBeVisible();
  });

  test("Trickster + Dodgy Dealings triggers Master Thief synergy", async ({ page }) => {
    await selectRelic(page, "Trickster");
    await selectRelic(page, "Dodgy Dealings");

    // The synergy section should appear with content
    const synergiesBtn = page.locator("#analysis button:has-text('Active Synergies')");
    await expect(synergiesBtn).toBeVisible();
    await synergiesBtn.click();
    // Synergy name appears in a green span inside the expanded section
    await expect(page.locator("#analysis span.text-osrs-green:has-text('Master Thief')")).toBeVisible();
  });

  test("Weapon Specialist + mastery triggers Combat Mastery Engine", async ({ page }) => {
    await selectRelic(page, "Weapon Specialist");
    await selectMastery(page, "Melee Mastery");

    const synergiesBtn = page.locator("#analysis button:has-text('Active Synergies')");
    await expect(synergiesBtn).toBeVisible();
    await synergiesBtn.click();
    await expect(page.locator("#analysis >> text=Combat Mastery Engine")).toBeVisible();
  });
});

// ─── RE Planner: PvM Destroyer Build ────────────────────────────────────

test.describe("RE Planner - PvM Destroyer Build", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/leagues/raging-echoes/planner");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("select full PvM build and verify Raid Boss archetype", async ({ page }) => {
    await selectRelic(page, "Production Prodigy");
    await selectRelic(page, "Banker's Note");
    await selectRelic(page, "Knife's Edge");
    await selectRelic(page, "Soul Stealer");
    await selectRelic(page, "Last Recall");
    await selectRelic(page, "Weapon Specialist");
    await selectRelic(page, "Echo Augmentation");
    await selectRelic(page, "Absolute Unit");
    await selectMastery(page, "Melee Mastery");
    await selectMastery(page, "Ranged Mastery");

    await expect(page.locator("text=8 / 8").first()).toBeVisible();
    await expect(page.locator("#analysis >> text=Raid Boss")).toBeVisible();
  });

  test("Knife's Edge triggers danger warning", async ({ page }) => {
    await selectRelic(page, "Knife's Edge");

    const warningsBtn = page.locator("#analysis button:has-text('Warnings')");
    await warningsBtn.click();
    await expect(page.locator("#analysis >> text=caps your HP at 10")).toBeVisible();
  });

  test("Knife's Edge + Berserker triggers critical warning", async ({ page }) => {
    await selectRelic(page, "Knife's Edge");
    await selectRelic(page, "Berserker");

    const warningsBtn = page.locator("#analysis button:has-text('Warnings')");
    await warningsBtn.click();
    await expect(page.locator("#analysis >> text=highest-risk combo")).toBeVisible();
  });

  test("Knife's Edge + Berserker triggers Death's Edge synergy", async ({ page }) => {
    await selectRelic(page, "Knife's Edge");
    await selectRelic(page, "Berserker");

    const synergiesBtn = page.locator("#analysis button:has-text('Active Synergies')");
    await synergiesBtn.click();
    await expect(page.locator("#analysis >> text=Death's Edge")).toBeVisible();
  });

  test("Soul Stealer + Last Recall triggers Recall Slayer synergy", async ({ page }) => {
    await selectRelic(page, "Soul Stealer");
    await selectRelic(page, "Last Recall");

    const synergiesBtn = page.locator("#analysis button:has-text('Active Synergies')");
    await synergiesBtn.click();
    await expect(page.locator("#analysis >> text=Recall Slayer")).toBeVisible();
  });

  test("Glass Berserker archetype with Knife's Edge + Berserker", async ({ page }) => {
    await selectRelic(page, "Knife's Edge");
    await selectRelic(page, "Berserker");

    await expect(page.locator("#analysis >> text=Glass Berserker")).toBeVisible();
  });
});

// ─── RE Planner: Completionist Build ────────────────────────────────────

test.describe("RE Planner - Completionist Build", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/leagues/raging-echoes/planner");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("select full Completionist build and verify Treasure Hunter archetype", async ({ page }) => {
    await selectRelic(page, "Endless Harvest");
    await selectRelic(page, "Banker's Note");
    await selectRelic(page, "Equilibrium");
    await selectRelic(page, "Clue Compass");
    await selectRelic(page, "Friendly Forager");
    await selectRelic(page, "Ruinous Powers");
    await selectRelic(page, "Treasure Seeker");
    await selectRelic(page, "Riftwalker");
    await selectMastery(page, "Melee Mastery");
    await selectMastery(page, "Ranged Mastery");
    await selectMastery(page, "Magic Mastery");

    await expect(page.locator("text=8 / 8").first()).toBeVisible();
    await expect(page.locator("#analysis >> text=Treasure Hunter")).toBeVisible();
  });

  test("Endless Harvest + Infernal Gathering triggers Gathering Pipeline", async ({ page }) => {
    await selectRelic(page, "Endless Harvest");
    await selectRelic(page, "Infernal Gathering");

    const synergiesBtn = page.locator("#analysis button:has-text('Active Synergies')");
    await synergiesBtn.click();
    await expect(page.locator("#analysis >> text=Gathering Pipeline")).toBeVisible();
  });

  test("Clue Compass + Treasure Seeker triggers Loot Magnet", async ({ page }) => {
    await selectRelic(page, "Clue Compass");
    await selectRelic(page, "Treasure Seeker");

    const synergiesBtn = page.locator("#analysis button:has-text('Active Synergies')");
    await synergiesBtn.click();
    await expect(page.locator("#analysis >> text=Loot Magnet")).toBeVisible();
  });

  test("Weapon Specialist + Absolute Unit triggers Unstoppable Force", async ({ page }) => {
    await selectRelic(page, "Weapon Specialist");
    await selectRelic(page, "Absolute Unit");

    const synergiesBtn = page.locator("#analysis button:has-text('Active Synergies')");
    await synergiesBtn.click();
    await expect(page.locator("#analysis >> text=Unstoppable Force")).toBeVisible();
  });

  test("Production Prodigy + Pocket Crafter triggers Portable Workshop", async ({ page }) => {
    await selectRelic(page, "Production Prodigy");
    await selectRelic(page, "Pocket Crafter");

    const synergiesBtn = page.locator("#analysis button:has-text('Active Synergies')");
    await synergiesBtn.click();
    await expect(page.locator("#analysis >> text=Portable Workshop")).toBeVisible();
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

  test("Endless Harvest without Infernal Gathering shows missed synergy", async ({ page }) => {
    await selectRelic(page, "Endless Harvest");
    await selectRelic(page, "Equilibrium");

    const missedBtn = page.locator("#analysis button:has-text('Missed Synergies')");
    await expect(missedBtn).toBeVisible();
    await missedBtn.click();
    await expect(page.locator("#analysis >> text=Gathering Pipeline")).toBeVisible();
  });

  test("Knife's Edge without Berserker shows missed Death's Edge", async ({ page }) => {
    await selectRelic(page, "Knife's Edge");
    await selectRelic(page, "Weapon Specialist");

    const missedBtn = page.locator("#analysis button:has-text('Missed Synergies')");
    await expect(missedBtn).toBeVisible();
    await missedBtn.click();
    await expect(page.locator("#analysis >> text=Death's Edge")).toBeVisible();
  });

  test("Trickster without Dodgy Dealings shows missed Master Thief", async ({ page }) => {
    await selectRelic(page, "Trickster");
    await selectRelic(page, "Absolute Unit");

    const missedBtn = page.locator("#analysis button:has-text('Missed Synergies')");
    await expect(missedBtn).toBeVisible();
    await missedBtn.click();
    // Scoped to analysis section to avoid matching archetype
    await expect(page.locator("#analysis >> text=Master Thief")).toBeVisible();
  });

  test("Clue Compass without Treasure Seeker shows missed Loot Magnet", async ({ page }) => {
    await selectRelic(page, "Clue Compass");
    await selectRelic(page, "Echo Augmentation");

    const missedBtn = page.locator("#analysis button:has-text('Missed Synergies')");
    await expect(missedBtn).toBeVisible();
    await missedBtn.click();
    await expect(page.locator("#analysis >> text=Loot Magnet")).toBeVisible();
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
    await selectRelic(page, "Trickster");
    await expect(page.locator("#analysis >> text=Explorer")).toBeVisible();
  });

  test("two relics no masteries shows Skiller archetype", async ({ page }) => {
    await selectRelic(page, "Endless Harvest");
    await selectRelic(page, "Banker's Note");
    await expect(page.locator("#analysis >> text=Skiller")).toBeVisible();
  });

  test("switching relics in same tier replaces selection", async ({ page }) => {
    await selectRelic(page, "Trickster");
    await expect(page.locator("text=1 / 8").first()).toBeVisible();

    await selectRelic(page, "Endless Harvest");
    await expect(page.locator("text=1 / 8").first()).toBeVisible();
  });

  test("deselecting a relic works", async ({ page }) => {
    await selectRelic(page, "Trickster");
    await expect(page.locator("text=1 / 8").first()).toBeVisible();

    await selectRelic(page, "Trickster");
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
    await selectRelic(page, "Trickster");
    await selectRelic(page, "Fairy's Flight");
    await selectMastery(page, "Melee Mastery");

    await page.reload();
    await expect(page.locator("text=2 / 8").first()).toBeVisible();
  });

  test("share button copies URL", async ({ page }) => {
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    await selectRelic(page, "Trickster");
    await page.locator("text=Share Build").click();
    await expect(page.locator("text=Copied!")).toBeVisible();
  });

  test("reset clears all selections after confirm", async ({ page }) => {
    await selectRelic(page, "Trickster");
    await selectRelic(page, "Fairy's Flight");
    // Verify relics were selected
    await expect(page.locator("text=2 / 8").first()).toBeVisible({ timeout: 3000 });

    page.once("dialog", (d) => d.accept());
    await page.locator("button >> text=Reset").click();

    // After reset, should show 0/8
    await expect(page.locator("text=0 / 8").first()).toBeVisible({ timeout: 5000 });
  });
});

// ─── RE Planner: Boss Access (All Accessible) ──────────────────────────

test.describe("RE Planner - Boss Access", () => {
  test("all bosses are accessible in RE (all areas open)", async ({ page }) => {
    await page.goto("/leagues/raging-echoes/planner");
    await page.evaluate(() => localStorage.clear());
    await page.reload();

    await selectRelic(page, "Trickster");

    const bossBtn = page.locator("#analysis button:has-text('Boss Access')");
    await bossBtn.click();

    // Endgame bosses should be listed
    await expect(page.locator("#analysis >> text=Endgame").first()).toBeVisible();
    // No inaccessible indicators (red backgrounds)
    const inaccessibleDots = page.locator("#analysis .bg-red-500");
    const count = await inaccessibleDots.count();
    expect(count).toBe(0);
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
    await selectRelic(page, "Knife's Edge");
    await selectRelic(page, "Weapon Specialist");
    await selectRelic(page, "Absolute Unit");
    await selectMastery(page, "Melee Mastery");

    const balanceBtn = page.locator("#analysis button:has-text('Build Balance')");
    await balanceBtn.click();
    await expect(page.getByText("Combat", { exact: true }).first()).toBeVisible();
  });

  test("gathering-focused build shows gathering emphasis", async ({ page }) => {
    await selectRelic(page, "Endless Harvest");
    await selectRelic(page, "Infernal Gathering");
    await selectRelic(page, "Friendly Forager");

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

  test("shows correct task count", async ({ page }) => {
    // Overall Progress shows "0 / 43" (15 easy + 10 medium + 8 hard + 6 elite + 4 master)
    await expect(page.locator("text=0 / 43")).toBeVisible();
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

  test("filter by master difficulty shows 4 tasks", async ({ page }) => {
    const select = page.locator("select").first();
    await select.selectOption("master");
    const tasks = page.locator("div.rounded-lg.border.cursor-pointer");
    await expect(tasks).toHaveCount(4);
  });

  test("filter by category works", async ({ page }) => {
    const categorySelect = page.locator("select").nth(1);
    // Use a category that definitely exists
    await categorySelect.selectOption("Combat");
    const tasks = page.locator("div.rounded-lg.border.cursor-pointer");
    const count = await tasks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("sort by points high to low works", async ({ page }) => {
    const sortSelect = page.locator("select").nth(2);
    await sortSelect.selectOption("points-desc");
    const firstPoints = await page.locator("div.rounded-lg.border.cursor-pointer").first().locator("text=/\\d+ pts/").textContent();
    expect(firstPoints).toContain("200");
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
    await page.locator("input[placeholder='Search tasks...']").fill("Infernal");
    const tasks = page.locator("div.rounded-lg.border.cursor-pointer");
    const count = await tasks.count();
    expect(count).toBe(1);
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
