import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders hero section with title", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("DPS Calculator");
  });

  test("renders Demonic Pacts badge", async ({ page }) => {
    await expect(page.locator("span:has-text('Demonic Pacts League')")).toBeVisible();
  });

  test("has Open Calculator CTA", async ({ page }) => {
    const cta = page.getByRole("link", { name: "Open Calculator" });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/calculator");
  });

  test("has View Formulas CTA", async ({ page }) => {
    const cta = page.getByRole("link", { name: "View Formulas" });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/formulas");
  });

  test("renders 3 combat style cards", async ({ page }) => {
    await expect(page.locator("h3:has-text('melee')")).toBeVisible();
    await expect(page.locator("h3:has-text('ranged')")).toBeVisible();
    await expect(page.locator("h3:has-text('magic')")).toBeVisible();
  });

  test("renders popular bosses section", async ({ page }) => {
    await expect(page.getByText("Popular Bosses")).toBeVisible();
    await expect(page.getByText("General Graardor")).toBeVisible();
  });

  test("renders feature cards", async ({ page }) => {
    // Features are below fold, scroll to them
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await expect(page.getByRole("heading", { name: "Gear Optimizer" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Pact Modifiers" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Build Sharing" })).toBeVisible();
  });
});
