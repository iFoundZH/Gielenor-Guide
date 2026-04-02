import { test, expect } from "@playwright/test";

test.describe("Data Status Page", () => {
  test("loads and shows sync timeline", async ({ page }) => {
    await page.goto("/data-status");
    await expect(page.getByRole("heading", { name: "Data Status" })).toBeVisible();
    await expect(page.getByText("Sync Timeline")).toBeVisible();
    await expect(page.getByText("Last generated:")).toBeVisible();
  });

  test("shows league data sections", async ({ page }) => {
    await page.goto("/data-status");
    await expect(page.getByRole("heading", { name: "Demonic Pacts" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Raging Echoes" })).toBeVisible();
  });

  test("shows guide data section", async ({ page }) => {
    await page.goto("/data-status");
    await expect(page.getByText("Guide Data")).toBeVisible();
    await expect(page.getByText("Skill Guides")).toBeVisible();
    await expect(page.getByText("Diary Areas")).toBeVisible();
    await expect(page.getByText("Combat Achievements")).toBeVisible();
  });

  test("shows known data quirks", async ({ page }) => {
    await page.goto("/data-status");
    await expect(page.getByText("Known Data Quirks")).toBeVisible();
    await expect(page.getByText("Quest start locations")).toBeVisible();
    await expect(page.getByText("DT2 boss classifications")).toBeVisible();
  });

  test("has working breadcrumb navigation", async ({ page }) => {
    await page.goto("/data-status");
    const homeLink = page.locator("a", { hasText: "Home" }).first();
    await expect(homeLink).toHaveAttribute("href", "/");
  });
});
