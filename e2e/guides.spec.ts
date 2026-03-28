import { test, expect } from "@playwright/test";

test.describe("Guides Page", () => {
  test("loads and shows league guides", async ({ page }) => {
    await page.goto("/guides");
    await expect(page.locator("h1")).toContainText("All Guides");
    await expect(page.locator("text=League Guides")).toBeVisible();
  });

  test("live guides are clickable links", async ({ page }) => {
    await page.goto("/guides");
    // Demonic Pacts League should be a link
    const link = page.locator("a[href='/leagues/demonic-pacts']").first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL("/leagues/demonic-pacts");
  });

  test("Raging Echoes league is listed", async ({ page }) => {
    await page.goto("/guides");
    await expect(page.locator("h3 >> text=Raging Echoes League")).toBeVisible();
  });

  test("Strategy Guide and Build Planner guides are clickable", async ({ page }) => {
    await page.goto("/guides");
    // Strategy Guide card should be a link
    const strategyLink = page.locator("h3:has-text('Strategy Guide')");
    await expect(strategyLink).toBeVisible();
    // Build Planner card should be a link
    const plannerLink = page.locator("h3:has-text('Build Planner')");
    await expect(plannerLink).toBeVisible();
  });
});
