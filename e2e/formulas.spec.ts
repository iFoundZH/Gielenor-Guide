import { test, expect } from "@playwright/test";

test.describe("Formulas Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/formulas");
  });

  test("renders page title", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("DPS Formulas");
  });

  test("renders all formula sections", async ({ page }) => {
    await expect(page.getByText("1. Effective Level")).toBeVisible();
    await expect(page.getByText("2. Equipment Strength")).toBeVisible();
    await expect(page.getByText("3. Base Max Hit")).toBeVisible();
    await expect(page.getByText("4. Multiplier Chain")).toBeVisible();
    await expect(page.getByText("5. Attack Roll")).toBeVisible();
    await expect(page.getByText("6. Defence Roll")).toBeVisible();
    await expect(page.getByText("7. Accuracy")).toBeVisible();
    await expect(page.getByText("8. Attack Speed")).toBeVisible();
    await expect(page.getByText("9. DPS Calculation")).toBeVisible();
    await expect(page.getByText("10. Bonus Hit DPS")).toBeVisible();
    await expect(page.getByText("11. Echo Cascade")).toBeVisible();
    await expect(page.getByText("12. Weapon Passives")).toBeVisible();
  });

  test("shows formula code blocks", async ({ page }) => {
    await expect(page.locator("pre").first()).toBeVisible();
  });

  test("has wiki source links", async ({ page }) => {
    const wikiLink = page.getByRole("link", { name: /OSRS Wiki/ }).first();
    await expect(wikiLink).toBeVisible();
  });
});
