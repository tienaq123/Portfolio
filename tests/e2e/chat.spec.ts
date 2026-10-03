import { expect, test } from "@playwright/test";

// Runs against CHAT_MOCK=1 (playwright.config.ts): canned, streamed answers.

test("the chat panel is not part of the initial JavaScript", async ({
  page,
  request,
}) => {
  const html = await (await request.get("/en")).text();
  const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map(
    (match) => match[1] ?? "",
  );
  expect(scripts.length).toBeGreaterThan(0);
  for (const src of scripts) {
    const code = await (await request.get(src)).text();
    expect(code, src).not.toContain("data-chat-panel");
  }
  await page.goto("/en");
  await expect(page.locator("[data-chat-panel]")).toHaveCount(0);
});

test("asks a suggested question and shows the streamed answer", async ({
  page,
}) => {
  await page.goto("/en");
  const launcher = page.getByRole("button", { name: "Ask about Tiến" });
  await launcher.click();

  const dialog = page.getByRole("dialog", { name: "Ask about Tiến" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/stored for 30 days/)).toBeVisible();

  await dialog
    .getByRole("button", { name: "What did he build on Prep4u?" })
    .click();
  // .first(): the answer is also repeated in the screen-reader live region.
  await expect(dialog.getByText(/Readiness Engine/).first()).toBeVisible();
  await expect(dialog.getByText("Based on")).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Prep4u" })).toHaveAttribute(
    "href",
    "/en/work/prep4u",
  );

  await dialog.getByRole("button", { name: "Helpful", exact: true }).click();
  await expect(dialog.getByText("Thanks for the feedback.")).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(launcher).toBeFocused();
});

test("answers in Vietnamese on /vi", async ({ page }) => {
  await page.goto("/vi");
  await page.getByRole("button", { name: "Hỏi về Tiến" }).click();
  const dialog = page.getByRole("dialog", { name: "Hỏi về Tiến" });
  await dialog.getByRole("textbox").fill("Tiến làm gì ở Prep4u?");
  await dialog.getByRole("button", { name: "Gửi" }).click();
  await expect(dialog.getByText(/dự đoán điểm/).first()).toBeVisible();
});

test("shows a clear message when rate limited", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("button", { name: "Ask about Tiến" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("textbox").fill("__ratelimit__");
  await dialog.getByRole("textbox").press("Enter");
  await expect(dialog.getByRole("alert")).toContainText("a lot of questions");
});

test("recovers from a failed answer with a retry", async ({ page }) => {
  await page.goto("/en");
  await page.getByRole("button", { name: "Ask about Tiến" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("textbox").fill("__error__");
  await dialog.getByRole("textbox").press("Enter");
  await expect(dialog.getByRole("alert")).toContainText("Something went wrong");
  await expect(dialog.getByRole("button", { name: "Try again" })).toBeVisible();
});
