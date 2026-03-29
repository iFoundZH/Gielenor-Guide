import { test, expect } from "@playwright/test";

test.describe("Snowflake Landing Page", () => {
  test("loads and shows presets", async ({ page }) => {
    await page.goto("/snowflake");
    await expect(page.locator("h1")).toContainText("Snowflake Account Tracker");
    await expect(page.locator("text=Quick Start Presets")).toBeVisible();
    await expect(page.locator("text=Karamja Only")).toBeVisible();
    await expect(page.locator("text=1 Defence Pure")).toBeVisible();
    await expect(page.locator("text=Skiller")).toBeVisible();
  });

  test("create custom profile", async ({ page }) => {
    await page.goto("/snowflake");
    await page.locator("input[placeholder='Profile name...']").fill("Test Build");
    await page.locator("button:has-text('Create')").click();
    // Should navigate to planner
    await expect(page).toHaveURL(/\/snowflake\/planner\?profile=/);
  });

  test("create profile from preset", async ({ page }) => {
    await page.goto("/snowflake");
    await page.locator("button:has-text('Use This Preset')").first().click();
    // Should navigate to planner
    await expect(page).toHaveURL(/\/snowflake\/planner\?profile=/);
  });
});

test.describe("Snowflake Planner", () => {
  test.beforeEach(async ({ page }) => {
    // Create a profile first
    await page.goto("/snowflake");
    await page.locator("input[placeholder='Profile name...']").fill("E2E Test");
    await page.locator("button:has-text('Create')").click();
    await expect(page).toHaveURL(/\/snowflake\/planner\?profile=/);
  });

  test("shows restriction planner UI", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Restriction Planner");
    await expect(page.locator("text=Allowed Regions")).toBeVisible();
    await expect(page.locator("text=Skill Restrictions")).toBeVisible();
    await expect(page.locator("text=Content Availability")).toBeVisible();
  });

  test("region selection works", async ({ page }) => {
    // Click on Karamja region
    const karamja = page.locator("h5:has-text('Karamja')");
    await karamja.click();
    // Should show 1 region allowed
    await expect(page.locator("text=1 region allowed")).toBeVisible();
  });

  test("skill restriction dropdown works", async ({ page }) => {
    // Find the Defence skill section and set it to locked
    const defenceSelect = page.locator("div:has(> div > span:text('Defence')) select").first();
    await defenceSelect.selectOption("locked");
    // Should show 1 locked
    await expect(page.locator("text=1 locked")).toBeVisible();
  });

  test("share button exists and is clickable", async ({ page }) => {
    const shareBtn = page.locator("button:has-text('Share')");
    await expect(shareBtn).toBeVisible();
    // Click share — clipboard may not be available in test environment
    await shareBtn.click();
    // Either shows "Copied!" or the button text changes
    await expect(shareBtn).toBeVisible();
  });

  test("quick presets apply restrictions", async ({ page }) => {
    // Apply "1 Defence Pure" preset
    await page.locator("button:has-text('1 Defence Pure')").click();
    // Should show skill restrictions
    await expect(page.locator("text=1 capped")).toBeVisible();
  });

  test("custom rules can be added", async ({ page }) => {
    await page.locator("text=+ Add rule").click();
    const ruleInput = page.locator("div#rules input[type='text']").first();
    await ruleInput.fill("No GE");
    // Rule should be visible
    await expect(ruleInput).toHaveValue("No GE");
  });
});

test.describe("Snowflake Goals", () => {
  test.beforeEach(async ({ page }) => {
    // Create a profile first
    await page.goto("/snowflake");
    await page.locator("input[placeholder='Profile name...']").fill("Goal Test");
    await page.locator("button:has-text('Create')").click();
    await expect(page).toHaveURL(/\/snowflake\/planner\?profile=/);
    // Get the profile ID from URL
    const url = page.url();
    const profileId = new URL(url).searchParams.get("profile");
    await page.goto(`/snowflake/goals?profile=${profileId}`);
  });

  test("shows goal tracker", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Goal Tracker");
    await expect(page.locator("text=Goal Progress")).toBeVisible();
  });

  test("add and complete a goal", async ({ page }) => {
    // Add a goal
    await page.locator("input[placeholder='New goal...']").fill("Complete Fire Cape");
    await page.locator("button:has-text('Add')").click();
    // Goal should be visible
    await expect(page.locator("text=Complete Fire Cape")).toBeVisible();
    // Complete the goal
    const checkbox = page.locator("button.w-5.h-5").first();
    await checkbox.click();
    // Should show completion
    await expect(page.locator("text=1 / 1")).toBeVisible();
  });
});
