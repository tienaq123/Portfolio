import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const NAME = "Bùi Hữu Tiến";

test.describe("homepage", () => {
  for (const locale of ["en", "vi"] as const) {
    test(`/${locale} renders the main heading in its language`, async ({
      page,
    }) => {
      await page.goto(`/${locale}`);
      await expect(page.locator("html")).toHaveAttribute("lang", locale);
      await expect(
        page.getByRole("heading", { level: 1, name: NAME }),
      ).toBeVisible();
    });
  }

  test("a project card opens its case study", async ({ page }) => {
    await page.goto("/en");
    await page.getByRole("link", { name: "Prep4u", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/work\/prep4u$/);
    await expect(
      page.getByRole("heading", { level: 1, name: "Prep4u" }),
    ).toBeVisible();
  });
});

test("an unknown case study returns a real 404", async ({ request }) => {
  const response = await request.get("/en/work/does-not-exist");
  expect(response.status()).toBe(404);
});

test("/cv/en serves the PDF", async ({ request }) => {
  const response = await request.get("/cv/en");
  expect(response.ok()).toBe(true);
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
});

test("security headers are set", async ({ request }) => {
  const headers = (await request.get("/en")).headers();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
});

test.describe("locale routing", () => {
  for (const [acceptLanguage, locale] of [
    ["vi-VN,vi;q=0.9,en;q=0.8", "vi"],
    ["en-US,en;q=0.9", "en"],
    ["ja-JP", "en"],
  ] as const) {
    test(`/ redirects "${acceptLanguage}" to /${locale}`, async ({
      request,
    }) => {
      const response = await request.get("/", {
        headers: { "Accept-Language": acceptLanguage },
        maxRedirects: 0,
      });
      expect(response.status()).toBe(307);
      expect(
        new URL(response.headers()["location"] ?? "", "http://x").pathname,
      ).toBe(`/${locale}`);
    });
  }

  test("the language switcher keeps the current page", async ({ page }) => {
    await page.goto("/en/work/edly");
    await page.getByRole("link", { name: /Tiếng Việt/ }).click();
    await expect(page).toHaveURL(/\/vi\/work\/edly$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "vi");
  });
});

test("mobile navigation opens and navigates", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/en");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("dialog");
  await expect(menu).toBeVisible();
  await menu.getByRole("link", { name: "Contact" }).click();
  await expect(menu).toBeHidden();
  await expect(page).toHaveURL(/\/en#contact$/);
});

test.describe("accessibility (axe)", () => {
  // Audit the settled page: a reveal mid-fade has partial opacity and would
  // fail colour contrast at random. Motion itself is covered in motion.spec.ts.
  test.use({ reducedMotion: "reduce" });

  for (const path of ["/en", "/vi", "/en/work", "/vi/work/prep4u"]) {
    test(`${path} has no serious or critical violations`, async ({ page }) => {
      await page.goto(path);
      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const blocking = violations.filter(
        (violation) =>
          violation.impact === "serious" || violation.impact === "critical",
      );
      expect(
        blocking.map((violation) => ({
          id: violation.id,
          nodes: violation.nodes.map((node) => node.target.join(" ")),
        })),
      ).toEqual([]);
    });
  }
});
