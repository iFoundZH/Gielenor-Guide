import { test, expect } from "@playwright/test";

test.describe("Items Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/items");
  });

  test("renders page title", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Item Database");
  });

  test("shows item count", async ({ page }) => {
    await expect(page.getByText(/\d+ items/)).toBeVisible();
  });

  test("renders filter controls", async ({ page }) => {
    await expect(page.locator("select").first()).toBeVisible();
    await expect(page.getByPlaceholder("Search items...")).toBeVisible();
  });

  test("filtering by slot reduces items", async ({ page }) => {
    // Get initial count
    const initialText = await page.getByText(/\d+ items/).textContent();
    const initialCount = parseInt(initialText?.match(/\d+/)?.[0] ?? "0");

    // Filter to ring slot (fewer items)
    await page.locator("select").first().selectOption("ring");
    const filteredText = await page.getByText(/\d+ items/).textContent();
    const filteredCount = parseInt(filteredText?.match(/\d+/)?.[0] ?? "0");

    expect(filteredCount).toBeLessThan(initialCount);
    expect(filteredCount).toBeGreaterThan(0);
  });

  test("search finds specific items", async ({ page }) => {
    await page.getByPlaceholder("Search items...").fill("Scythe of vitur");
    await expect(page.getByText("Scythe of vitur", { exact: true })).toBeVisible();
  });

  test("echo items show Echo badge", async ({ page }) => {
    await page.getByPlaceholder("Search items...").fill("V's helm");
    const card = page.locator("text=V's helm").first();
    await expect(card).toBeVisible();
    await expect(page.locator("span:has-text('Echo')").first()).toBeVisible();
  });

  test("clicking item expands full stats", async ({ page }) => {
    await page.getByPlaceholder("Search items...").fill("Scythe of vitur");
    // Click the card (Card component has onClick)
    await page.locator("text=Scythe of vitur").first().click();
    // Expanded view shows detailed stat rows
    await expect(page.getByText("Stab Atk")).toBeVisible();
    await expect(page.getByText("Slash Def")).toBeVisible();
  });
});
