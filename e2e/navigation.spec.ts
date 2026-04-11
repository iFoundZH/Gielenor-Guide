import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("header nav links navigate correctly", async ({ page }) => {
    await page.goto("/");

    // Use header nav specifically
    const header = page.locator("header");

    // Calculator link
    await header.getByRole("link", { name: "Calculator" }).click();
    await expect(page).toHaveURL("/calculator");
    await expect(page.locator("h1")).toContainText("DPS Calculator");

    // Items link
    await header.getByRole("link", { name: "Items" }).click();
    await expect(page).toHaveURL("/items");
    await expect(page.locator("h1")).toContainText("Item Database");

    // Formulas link
    await header.getByRole("link", { name: "Formulas" }).click();
    await expect(page).toHaveURL("/formulas");
    await expect(page.locator("h1")).toContainText("DPS Formulas");

    // Home link
    await header.getByRole("link", { name: "Home" }).click();
    await expect(page).toHaveURL("/");
  });

  test("logo links to home", async ({ page }) => {
    await page.goto("/calculator");
    // Click the logo text in the header
    await page.locator("header").locator("text=Gielinor Guide").click();
    await expect(page).toHaveURL("/");
  });

  test("footer links have correct hrefs", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer.getByRole("link", { name: "DPS Calculator" })).toHaveAttribute("href", "/calculator");
    await expect(footer.getByRole("link", { name: "Item Database" })).toHaveAttribute("href", "/items");
    await expect(footer.getByRole("link", { name: "DPS Formulas" })).toHaveAttribute("href", "/formulas");
  });

  test("mobile menu toggles navigation", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Desktop nav should be hidden (md:flex is hidden at mobile width)
    const desktopNav = page.locator("nav.hidden.md\\:flex");
    await expect(desktopNav).toBeHidden();

    // Click hamburger
    await page.locator("header button").click();

    // Mobile menu links should appear
    const mobileLink = page.locator("header").locator("a:has-text('Calculator')").last();
    await expect(mobileLink).toBeVisible();

    // Click and verify navigation
    await mobileLink.click();
    await expect(page).toHaveURL("/calculator");
  });
});
