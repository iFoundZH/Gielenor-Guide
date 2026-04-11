import { test, expect } from "@playwright/test";

test.describe("Calculator Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/calculator");
  });

  test("renders calculator title", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("DPS Calculator");
  });

  test("shows player config panel with combat style tabs", async ({ page }) => {
    await expect(page.getByText("Player Stats")).toBeVisible();
    // Combat style buttons are in a flex container — use text matching
    await expect(page.locator("button:has-text('melee')").first()).toBeVisible();
    await expect(page.locator("button:has-text('ranged')").first()).toBeVisible();
    await expect(page.locator("button:has-text('magic')").first()).toBeVisible();
  });

  test("shows boss selector with search", async ({ page }) => {
    await expect(page.locator("h3:has-text('Target')")).toBeVisible();
    await expect(page.getByPlaceholder("Search bosses...")).toBeVisible();
  });

  test("shows region selector", async ({ page }) => {
    await expect(page.locator("h3:has-text('Regions')")).toBeVisible();
    await expect(page.locator("text=Varlamore").first()).toBeVisible();
  });

  test("shows pact skill tree", async ({ page }) => {
    await expect(page.locator("h3:has-text('Pact Tree')")).toBeVisible();
    await expect(page.getByText("/40 points")).toBeVisible();
  });

  test("shows equipment grid", async ({ page }) => {
    await expect(page.locator("h3:has-text('Equipment')")).toBeVisible();
    // Use the gear grid buttons which have "Empty" text inside
    await expect(page.getByRole("button", { name: "Weapon Empty" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Head Empty" })).toBeVisible();
  });

  test("shows optimize button", async ({ page }) => {
    await expect(page.locator("button:has-text('Optimize')")).toBeVisible();
  });

  test("initial DPS is empty without weapon", async ({ page }) => {
    await expect(page.getByText("Configure your build to see DPS")).toBeVisible();
  });

  test("switching combat style updates UI", async ({ page }) => {
    // Click ranged tab
    await page.locator("button:has-text('ranged')").first().click();
    // Should now show Ranged stat input label
    await expect(page.locator("label:has-text('Ranged')")).toBeVisible();
  });

  test("item picker opens on slot click", async ({ page }) => {
    await page.locator("button:has-text('Weapon')").first().click();
    // Modal should appear
    await expect(page.locator("h3:has-text('weapon Slot')")).toBeVisible();
    await expect(page.getByPlaceholder("Search items...")).toBeVisible();
  });

  test("selecting a weapon shows DPS result", async ({ page }) => {
    // Click weapon slot
    await page.locator("button:has-text('Weapon')").first().click();
    // Select whip (always available, no region lock)
    await page.locator("button:has-text('Abyssal whip')").first().click();
    // DPS should now be calculated
    await expect(page.getByText("DPS (damage per second)")).toBeVisible();
  });

  test("optimizer runs and populates results", async ({ page }) => {
    await page.locator("button:has-text('Optimize')").click();
    // Wait for results — should show at least #1
    await expect(page.getByText(/^#1 —/)).toBeVisible({ timeout: 15000 });
  });

  test("pact selection changes DPS", async ({ page }) => {
    // Equip a weapon first
    await page.locator("button:has-text('Weapon')").first().click();
    await page.locator("button:has-text('Abyssal whip')").first().click();

    // Read initial DPS via testid
    const dpsEl = page.getByTestId("dps-value");
    await expect(dpsEl).toBeVisible();
    const initialDps = await dpsEl.textContent();

    // Click the root node (node1 — Regenerate) in the SVG
    await page.locator("[data-testid='node-node1']").click();

    // Navigate to a DPS-relevant node: node74 (melee minhit) then node72 (light weapon double hit)
    await page.locator("[data-testid='node-node74']").click();
    await page.locator("[data-testid='node-node72']").click();

    // DPS should change (accuracy boost)
    await expect(dpsEl).not.toHaveText(initialDps!);
  });

  test("boss selection changes target info", async ({ page }) => {
    // Search and select Vorkath
    await page.getByPlaceholder("Search bosses...").fill("Vorkath");
    await page.locator("button:has-text('Vorkath')").click();
    await expect(page.getByText("Def: 214")).toBeVisible();
  });
});
