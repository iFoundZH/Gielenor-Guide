import { test, expect } from "@playwright/test";

test.describe("Demonic Pacts Task Tracker", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/leagues/demonic-pacts/tasks");
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "networkidle" });
  });

  test("loads and shows all tasks", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Task Tracker");
    await expect(page.locator("text=/\\d+ \\/ \\d+ tasks/")).toBeVisible();
  });

  test("shows progress bars by difficulty", async ({ page }) => {
    await expect(page.locator("text=easy").first()).toBeVisible();
    await expect(page.locator("text=medium").first()).toBeVisible();
    await expect(page.locator("text=hard").first()).toBeVisible();
    await expect(page.locator("text=elite").first()).toBeVisible();
    await expect(page.locator("text=master").first()).toBeVisible();
  });

  test("can complete a task by clicking", async ({ page }) => {
    // Task rows have border and cursor-pointer classes
    const taskRow = page.locator("div.rounded-lg.border.cursor-pointer").first();
    await taskRow.click();
    // After clicking, the checkbox should turn green
    const checkbox = page.locator("div.rounded-lg.border.cursor-pointer").first().locator("div.bg-osrs-green").first();
    await expect(checkbox).toBeVisible();
  });

  test("completing a task increases points", async ({ page }) => {
    // Click a task
    const taskRow = page.locator("div.rounded-lg.border.cursor-pointer").first();
    await taskRow.click();
    // Points display should be non-zero
    const pointsText = await page.locator("text=Points:").locator("..").locator("span.font-bold").textContent();
    expect(pointsText).not.toBe("0");
  });

  test("search filter works", async ({ page }) => {
    const searchInput = page.locator("input[placeholder='Search tasks...']");
    await searchInput.fill("Infernal");
    const tasks = page.locator("div.rounded-lg.border.cursor-pointer");
    const count = await tasks.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(51);
  });

  test("difficulty filter works", async ({ page }) => {
    // Difficulty filter is the first select inside the filter Card
    const select = page.locator("select:has(option[value='master'])").first();
    await select.selectOption("master");
    // Wait for the filter to take effect
    await page.waitForTimeout(300);
    const tasks = page.locator("div.rounded-lg.border.cursor-pointer");
    const count = await tasks.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThanOrEqual(10);
  });

  test("category filter works", async ({ page }) => {
    const categorySelect = page.locator("select").nth(1);
    await categorySelect.selectOption("Combat");
    const tasks = page.locator("div.rounded-lg.border.cursor-pointer");
    const count = await tasks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("hide completed toggle works", async ({ page }) => {
    // Count initial tasks
    const initialCount = await page.locator("div.rounded-lg.border.cursor-pointer").count();
    // Complete a task
    await page.locator("div.rounded-lg.border.cursor-pointer").first().click();
    // Uncheck "Show completed"
    await page.locator("text=Show completed").click();
    // Should have one fewer task visible
    const afterCount = await page.locator("div.rounded-lg.border.cursor-pointer").count();
    expect(afterCount).toBe(initialCount - 1);
  });

  test("task completion persists after reload", async ({ page }) => {
    // Complete a task and wait for the green checkbox to appear
    const firstTask = page.locator("div.rounded-lg.border.cursor-pointer").first();
    await firstTask.click();
    await expect(firstTask.locator("div.bg-osrs-green").first()).toBeVisible({ timeout: 5000 });
    // Poll until localStorage has the data
    await expect(async () => {
      const stored = await page.evaluate(() => localStorage.getItem("gielinor-dp-tasks"));
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!).length).toBeGreaterThan(0);
    }).toPass({ timeout: 5000 });
    // Reload and check task is still completed
    await page.reload({ waitUntil: "networkidle" });
    const firstTaskAfter = page.locator("div.rounded-lg.border.cursor-pointer").first();
    await expect(firstTaskAfter).toHaveClass(/bg-osrs-green/);
  });

  test("uses correct localStorage key (gielinor-dp-tasks)", async ({ page }) => {
    // Complete a task
    await page.locator("div.rounded-lg.border.cursor-pointer:has-text('pts')").first().click();
    // Poll until localStorage is written
    await expect(async () => {
      const stored = await page.evaluate(() => localStorage.getItem("gielinor-dp-tasks"));
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored!).length).toBeGreaterThan(0);
    }).toPass({ timeout: 5000 });
  });
});

test.describe("Raging Echoes Task Tracker", () => {
  test("loads and shows tasks", async ({ page }) => {
    await page.goto("/leagues/raging-echoes/tasks");
    await expect(page.locator("h1")).toContainText("Raging Echoes Task Tracker");
  });

  test("uses separate localStorage key from DP", async ({ page }) => {
    await page.goto("/leagues/raging-echoes/tasks");
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: "networkidle" });
    await page.locator("div.rounded-lg.border.cursor-pointer").first().click();
    await page.waitForTimeout(500);
    const reStored = await page.evaluate(() => localStorage.getItem("gielinor-re-tasks"));
    const dpStored = await page.evaluate(() => localStorage.getItem("gielinor-dp-tasks"));
    expect(reStored).toBeTruthy();
    expect(dpStored).toBeNull();
  });
});
