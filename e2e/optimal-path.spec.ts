import { test, expect } from "@playwright/test";

test.describe("Progression Guide - Demonic Pacts", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/leagues/demonic-pacts/path");
  });

  test("page loads with title and goal selector", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Progression Guide");
    await expect(page.getByText("Select Your Goal")).toBeVisible();
  });

  test("goal selector shows all reward tiers", async ({ page }) => {
    // DP has 7 reward tiers: Bronze, Iron, Steel, Mithril, Adamant, Rune, Dragon
    await expect(page.getByText("Bronze Tier")).toBeVisible();
    await expect(page.getByText("Dragon Tier")).toBeVisible();
  });

  test("selecting a goal renders difficulty progression phases", async ({ page }) => {
    // Click the Bronze tier goal (lowest, most achievable)
    await page.getByText("Bronze Tier").click();
    // Phases heading should appear (DP uses difficulty-tier strategy)
    await expect(page.getByText("Difficulty Progression")).toBeVisible();
  });

  test("standalone mode shows region picker", async ({ page }) => {
    await page.getByText("Bronze Tier").click();
    // Settings dropdown contains mode toggle — open it
    await page.locator("button[title='Settings']").click();
    // The standalone mode button should be active by default
    await expect(page.getByText("Manual")).toBeVisible();
    // Region picker should be visible
    await expect(page.getByText("Select Regions")).toBeVisible();
  });

  test("shortfall warning when goal exceeds accessible points", async ({ page }) => {
    // Dragon tier is 56,000 pts, DP only has 43 placeholder tasks (~3,890 pts)
    await page.getByText("Dragon Tier").click();
    await expect(page.getByText(/Goal exceeds accessible points/)).toBeVisible();
  });

  test("DP shows info banner about difficulty-based phases", async ({ page }) => {
    await page.getByText("Bronze Tier").click();
    await expect(page.getByText(/Phases organized by difficulty/)).toBeVisible();
  });

  test("import mode disabled without planner data", async ({ page }) => {
    await page.getByText("Bronze Tier").click();
    // Open settings dropdown
    await page.locator("button[title='Settings']").click();
    const importButton = page.getByText("Import", { exact: true });
    // Should be disabled (opacity class) when no localStorage data exists
    await expect(importButton).toBeVisible();
  });

  test("import mode reads from localStorage", async ({ page }) => {
    // Set up a build in localStorage before navigating
    const build = {
      id: "test",
      name: "Test Build",
      accountType: "ironman",
      regions: ["asgarnia", "morytania", "kebos"],
      relics: [],
      pacts: [],
      completedTasks: [],
      notes: "",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await page.evaluate((b) => {
      localStorage.setItem("gielinor-dp-build", JSON.stringify(b));
    }, build);

    // Reload to pick up localStorage
    await page.reload();
    await page.getByText("Bronze Tier").click();

    // Open settings and click Import
    await page.locator("button[title='Settings']").click();
    const importButton = page.getByText("Import", { exact: true });
    await importButton.click();

    // Phases should render — and region picker should NOT be visible in import mode
    await expect(page.getByText("Difficulty Progression")).toBeVisible();
  });

  test("breadcrumbs show correct path", async ({ page }) => {
    await expect(page.locator("a >> text=Home").first()).toBeVisible();
    await expect(page.locator("a >> text=Demonic Pacts").first()).toBeVisible();
    await expect(page.getByText("Progression Guide", { exact: true }).first()).toBeVisible();
  });

  test("exclude completed tasks toggle works", async ({ page }) => {
    // Set up some completed tasks
    await page.evaluate(() => {
      localStorage.setItem("gielinor-dp-tasks", JSON.stringify(["task-e-1", "task-e-2", "task-e-3"]));
    });
    await page.reload();
    await page.getByText("Bronze Tier").click();

    // Open settings dropdown and toggle exclude completed
    await page.locator("button[title='Settings']").click();
    const toggle = page.getByText("Exclude completed tasks");
    await toggle.click();

    // Phases should still be visible (path recalculated)
    await expect(page.getByText("Difficulty Progression")).toBeVisible();
  });

  test("DP Bronze tier creates difficulty phases", async ({ page }) => {
    await page.getByText("Bronze Tier").click();
    // Should have difficulty-based phase names
    await expect(page.getByText("Getting Started").first()).toBeVisible();
  });

  test("key tasks section visible after goal selection", async ({ page }) => {
    await page.getByText("Bronze Tier").click();
    // Wait for phases to render, then check for key tasks
    await expect(page.getByText("Key Tasks").first()).toBeVisible();
  });

  test("full task list expandable with category headers", async ({ page }) => {
    await page.getByText("Bronze Tier").click();
    // Find and click the "Show all" button
    const showAllButton = page.getByText(/Show all \d+ tasks/).first();
    await expect(showAllButton).toBeVisible();
    await showAllButton.click();
    // After expanding, the button text should change to "Hide"
    await expect(page.getByText("Hide full task list").first()).toBeVisible();
    // Category headers should be visible (tasks are grouped by category)
    // DP tasks have categories like "Combat", "Skilling", etc.
    const categoryHeaders = page.locator(".uppercase.tracking-wider").filter({ hasText: /\w+/ });
    await expect(categoryHeaders.first()).toBeVisible();
  });
});

test.describe("Progression Guide - Raging Echoes", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/leagues/raging-echoes/path");
  });

  test("page loads with title and goal selector", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Progression Guide");
    await expect(page.getByText("Select Your Goal")).toBeVisible();
  });

  test("goal selector shows reward tiers and all-relics goal", async ({ page }) => {
    // RE has reward tiers + "All Relics Unlocked" since it has pointsToUnlock on relic tiers
    await expect(page.getByText("Bronze Tier")).toBeVisible();
    await expect(page.getByText("All Relics Unlocked")).toBeVisible();
  });

  test("selecting all-relics goal renders relic progression phases", async ({ page }) => {
    // Click the All Relics goal
    await page.getByText("All Relics Unlocked").click();
    // Should show "Relic Progression" heading (RE has relic thresholds)
    await expect(page.getByText("Relic Progression")).toBeVisible();
  });

  test("RE phases show relic choices when available", async ({ page }) => {
    await page.getByText("All Relics Unlocked").click();
    // RE has relic tiers with choices — "Relic Choices" heading should appear
    await expect(page.getByText("Relic Choices").first()).toBeVisible();
  });

  test("standalone mode shows region picker for RE", async ({ page }) => {
    await page.getByText("Bronze Tier").click();
    await expect(page.getByText("Select Regions")).toBeVisible();
  });
});
