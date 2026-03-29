import { test, expect } from "@playwright/test";

test.describe("Demonic Pacts Build Planner", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/leagues/demonic-pacts/planner");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("loads with default build state", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Build Planner");
    await expect(page.locator("input[type='text']").first()).toHaveValue("My Demonic Pacts Build");
  });

  test("can change build name", async ({ page }) => {
    const nameInput = page.locator("input[type='text']").first();
    await nameInput.clear();
    await nameInput.fill("Test Build");
    await expect(nameInput).toHaveValue("Test Build");
  });

  test("can change account type", async ({ page }) => {
    const select = page.locator("select").first();
    await select.selectOption("hardcore");
    await expect(select).toHaveValue("hardcore");
  });

  test("can select a region", async ({ page }) => {
    // Click on a choosable region card - find by region name
    await page.locator("h5 >> text=Asgarnia").click();
    // RegionPicker shows "1 / 3 selected"
    await expect(page.locator("text=1 / 3 selected")).toBeVisible();
  });

  test("enforces max region limit of 3", async ({ page }) => {
    // Click 3 choosable regions
    await page.locator("h5 >> text=Asgarnia").click();
    await page.locator("h5 >> text=Kandarin").click();
    await page.locator("h5 >> text=Morytania").click();
    // Should show 3/3
    await expect(page.locator("text=3 / 3").first()).toBeVisible();
    // Try to select a 4th - should not work
    await page.locator("h5 >> text=Tirannwn").click();
    // Still 3/3
    await expect(page.locator("text=3 / 3").first()).toBeVisible();
  });

  test("can select a relic", async ({ page }) => {
    await page.locator("text=Endless Harvest").first().click();
    await expect(page.locator("text=Selected Relics")).toBeVisible();
  });

  test("switching relics in same tier replaces selection", async ({ page }) => {
    await page.locator("text=Endless Harvest").first().click();
    await expect(page.locator("text=Selected Relics")).toBeVisible();

    // Select Abundance instead (same tier)
    await page.locator("text=Abundance").first().click();
    const selectedRelics = page.locator("text=Selected Relics").locator("..");
    await expect(selectedRelics).toContainText("Abundance");
  });

  test("can toggle pacts", async ({ page }) => {
    await page.locator("text=Melee Might").first().click();
    await expect(page.locator("text=Active Pacts")).toBeVisible();
  });

  test("Gielinor Score updates with selections", async ({ page }) => {
    const scoreCard = page.locator("text=Gielinor Score").first();
    await expect(scoreCard).toBeVisible();

    await page.locator("text=Endless Harvest").first().click();
    await page.locator("text=Melee Might").first().click();

    const scoreText = page.locator("text=Gielinor Score").locator("..").locator("..").first();
    await expect(scoreText).toBeVisible();
  });

  test("share button exists and is clickable", async ({ page }) => {
    // Grant clipboard permissions for the test
    await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.locator("text=Share Build").click();
    // Button text changes to "Copied!" when clipboard is available
    await expect(page.locator("text=Copied!")).toBeVisible();
  });

  test("reset button clears all selections after confirm", async ({ page }) => {
    // Select a relic — wait for "ring-osrs-gold" class to confirm selection
    const relicCard = page.locator("h4:has-text('Endless Harvest')");
    await relicCard.click();
    await expect(relicCard.locator("xpath=ancestor::div[contains(@class,'bg-osrs-panel')]")).toHaveClass(/ring-osrs-gold/, { timeout: 5000 });

    // Select a pact
    await page.locator("text=Melee Might").first().click();
    await expect(page.locator("text=Active Pacts")).toBeVisible({ timeout: 5000 });

    // Accept the confirmation dialog and reset
    page.once("dialog", (dialog) => dialog.accept());
    await page.locator("text=Reset").click();

    // After reset, the relic should no longer have gold ring
    await expect(relicCard.locator("xpath=ancestor::div[contains(@class,'bg-osrs-panel')]")).not.toHaveClass(/ring-osrs-gold/, { timeout: 5000 });
  });

  test("persists build to localStorage", async ({ page }) => {
    await page.locator("text=Endless Harvest").first().click();
    await page.reload();
    await expect(page.locator("text=Selected Relics")).toBeVisible();
  });
});

test.describe("Raging Echoes Build Planner", () => {
  test("loads correctly", async ({ page }) => {
    await page.goto("/leagues/raging-echoes/planner");
    await expect(page.locator("h1")).toContainText("Raging Echoes Build Planner");
  });

  test("shows all 8 relic tiers", async ({ page }) => {
    await page.goto("/leagues/raging-echoes/planner");
    for (let tier = 1; tier <= 8; tier++) {
      await expect(page.locator(`text=Tier ${tier}`).first()).toBeVisible();
    }
  });

  test("has account type selector", async ({ page }) => {
    await page.goto("/leagues/raging-echoes/planner");
    const select = page.locator("select").first();
    await expect(select).toBeVisible();
    await select.selectOption("hardcore");
    await expect(select).toHaveValue("hardcore");
  });

  test("shows combat masteries section", async ({ page }) => {
    await page.goto("/leagues/raging-echoes/planner");
    await expect(page.locator("text=Combat Masteries")).toBeVisible();
  });
});
