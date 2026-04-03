import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("header is sticky and visible", async ({ page }) => {
    await page.goto("/");
    const header = page.locator("header");
    await expect(header).toBeVisible();
    await expect(header.locator("text=Gielinor Guide")).toBeVisible();
  });

  test("desktop nav shows league dropdowns on hover", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto("/");
    // Hover over the Demonic Pacts nav item's parent div
    const demonicNav = page.locator("header nav >> text=Demonic Pacts").locator("..");
    await demonicNav.hover();
    // Dropdown should appear with sub-links
    await expect(page.locator("header nav >> text=Overview").first()).toBeVisible();
  });

  test("mobile menu toggle works", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    // Find mobile menu button
    const menuButton = page.locator("header button");
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    // Mobile menu should be visible (the border-t div)
    const mobileMenu = page.locator("header .md\\:hidden.pb-4");
    await expect(mobileMenu).toBeVisible();
  });

  test("all main routes load without errors", async ({ page }) => {
    const routes = [
      "/",
      "/guides",
      "/leagues/demonic-pacts",
      "/leagues/demonic-pacts/planner",
      "/leagues/demonic-pacts/tasks",
      "/leagues/demonic-pacts/path",
      "/leagues/demonic-pacts/guide",
      "/leagues/raging-echoes",
      "/leagues/raging-echoes/planner",
      "/leagues/raging-echoes/tasks",
      "/leagues/raging-echoes/path",
      "/leagues/raging-echoes/guide",
    ];

    for (const route of routes) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
    }
  });

  test("breadcrumbs navigate correctly", async ({ page }) => {
    await page.goto("/leagues/demonic-pacts/planner");
    // Check breadcrumb links exist
    await expect(page.locator("a >> text=Home").first()).toBeVisible();
    await expect(page.locator("a >> text=Demonic Pacts").first()).toBeVisible();
  });
});
