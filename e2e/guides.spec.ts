import { test, expect } from "@playwright/test";

test.describe("Guides Page", () => {
  test("loads and shows all guide categories", async ({ page }) => {
    await page.goto("/guides");
    await expect(page.locator("h1")).toContainText("All Guides");
    await expect(page.locator("text=League Guides")).toBeVisible();
    await expect(page.locator("text=Account Type Guides")).toBeVisible();
    await expect(page.locator("text=PvM Guides")).toBeVisible();
    await expect(page.locator("text=Skilling Guides")).toBeVisible();
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

  test("Coming Soon items are not wrapped in links", async ({ page }) => {
    await page.goto("/guides");
    // Ironman Guide should be inside a div with cursor-not-allowed, not an anchor
    const ironmanContainer = page.locator("div.cursor-not-allowed").filter({ hasText: "Ironman Guide" });
    await expect(ironmanContainer).toBeVisible();
  });

  test("Coming Soon items have reduced opacity", async ({ page }) => {
    await page.goto("/guides");
    const ironmanCard = page.locator("div.cursor-not-allowed").filter({ hasText: "Ironman Guide" }).locator("div.opacity-60");
    await expect(ironmanCard).toBeVisible();
  });
});
