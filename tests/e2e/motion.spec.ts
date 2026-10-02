import { expect, test, type Page } from "@playwright/test";

// M5 exit criteria: motion must never leave content hidden.

const hiddenReveals = (page: Page) =>
  page.evaluate(
    () =>
      [...document.querySelectorAll("[data-reveal]")].filter(
        (element) => getComputedStyle(element).opacity !== "1",
      ).length,
  );

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  for (const path of ["/en", "/vi/work/edly"]) {
    test(`${path} shows every section`, async ({ page }) => {
      await page.goto(path);
      expect(await page.locator("[data-reveal]").count()).toBeGreaterThan(0);
      expect(await hiddenReveals(page)).toBe(0);
    });
  }
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("nothing is hidden and metrics show final values", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("html")).not.toHaveAttribute("data-motion");
    expect(await hiddenReveals(page)).toBe(0);
    await expect(page.getByText("15K+").first()).toBeVisible();
  });
});

test("scrolling reveals every section", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "");

  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y <= height; y += 400) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(50);
  }
  await expect.poll(() => hiddenReveals(page), { timeout: 5_000 }).toBe(0);
});
