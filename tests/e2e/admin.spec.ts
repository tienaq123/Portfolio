import { expect, test } from "@playwright/test";

// ADMIN_PASSWORD is set for the test server (playwright.config.ts).
const credentials = { username: "admin", password: "e2e-admin-password" };

test("the dashboard asks for credentials", async ({ request }) => {
  const anonymous = await request.get("/admin");
  expect(anonymous.status()).toBe(401);
  expect(anonymous.headers()["www-authenticate"]).toContain("Basic");

  const wrong = await request.get("/admin", {
    headers: {
      Authorization: `Basic ${Buffer.from("admin:nope-nope-nope").toString("base64")}`,
    },
  });
  expect(wrong.status()).toBe(401);
});

test.describe("signed in", () => {
  test.use({ httpCredentials: credentials });

  test("opens, unindexed", async ({ page }) => {
    const response = await page.goto("/admin");
    expect(response?.status()).toBe(200);
    expect(response?.headers()["x-robots-tag"]).toContain("noindex");
    await expect(
      page.getByRole("heading", { level: 1, name: "Câu hỏi gửi trợ lý" }),
    ).toBeVisible();
  });
});
