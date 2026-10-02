import { expect, test } from "@playwright/test";

// Runs in the iPhone (WebKit) project only: WebKit grew implicit `auto` grid
// columns past the viewport while scrolling, which Chromium never showed.
for (const path of ["/en", "/vi/work", "/en/work/prep4u"]) {
  test(`${path} never scrolls sideways`, async ({ page }) => {
    await page.goto(path);
    const height = await page.evaluate(() => document.body.scrollHeight);
    let widest = 0;
    for (let y = 0; y <= height; y += 500) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(150);
      widest = Math.max(
        widest,
        await page.evaluate(() => document.documentElement.scrollWidth),
      );
    }
    const viewport = await page.evaluate(
      () => document.documentElement.clientWidth,
    );
    expect(widest).toBeLessThanOrEqual(viewport);
  });
}
