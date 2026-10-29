import { expect, test } from "@playwright/test";

const pages = [
  "/en",
  "/vi",
  "/en/work",
  "/vi/work",
  "/en/work/prep4u",
  "/vi/work/prep4u",
  "/en/work/edly",
  "/vi/work/edly",
  "/en/work/ai-slack-check",
  "/vi/work/ai-slack-check",
];

for (const path of pages) {
  test(`${path} looks the same`, async ({ page }, testInfo) => {
    await page.goto(path, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    // Lazy images below the fold: scroll through so every one has loaded.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState("networkidle");
    const name = `${testInfo.project.name}${path.replaceAll("/", "_")}.png`;
    await expect(page).toHaveScreenshot(name, { fullPage: true });
  });
}
