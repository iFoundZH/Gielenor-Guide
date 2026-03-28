import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and shows hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("h1")).toContainText("Ultimate");
    await expect(page.locator("h1")).toContainText("OSRS Companion");
  });

  test("displays league stats in featured card", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Relics").first()).toBeVisible();
    await expect(page.locator("text=Pacts").first()).toBeVisible();
    await expect(page.locator("text=Tasks").first()).toBeVisible();
  });

  test("shows Get Started section with feature cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h2 >> text=Get Started")).toBeVisible();
    await expect(page.locator("h3 >> text=Build Planner")).toBeVisible();
    await expect(page.locator("h3 >> text=Task Tracker")).toBeVisible();
    await expect(page.locator("h3 >> text=Strategy Guide")).toBeVisible();
  });

  test("navigates to build planner", async ({ page }) => {
    await page.goto("/");
    await page.locator("a[href='/leagues/demonic-pacts/planner']").first().click();
    await expect(page).toHaveURL("/leagues/demonic-pacts/planner");
  });

  test("navigates to league overview", async ({ page }) => {
    await page.goto("/");
    await page.locator("a[href='/leagues/demonic-pacts']").first().click();
    await expect(page).toHaveURL("/leagues/demonic-pacts");
  });

  test("shows dynamic league status badge", async ({ page }) => {
    await page.goto("/");
    const badge = page.locator("text=/Coming Soon|Live Now|Ended/").first();
    await expect(badge).toBeVisible();
  });
});
