import { defineConfig, devices } from "@playwright/test";

// Smoke tests run against a production server (`pnpm build` first), or
// against a deployment when E2E_BASE_URL is set (no local server then).
const PORT = 3200;
const remote = process.env.E2E_BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["list"]] : "list",
  use: {
    baseURL: remote ?? `http://localhost:${PORT}`,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: /mobile\.spec\.ts/,
    },
    // Real iPhones run WebKit (Chrome on iOS included): layout bugs differ.
    {
      name: "iphone",
      use: { ...devices["iPhone 14 Pro"] },
      testMatch: /mobile\.spec\.ts/,
    },
  ],
  webServer: remote
    ? undefined
    : {
        command: `pnpm start --port ${PORT}`,
        // Canned chat answers: no API key in CI (lib/ai/mock.ts).
        env: { CHAT_MOCK: "1" },
        url: `http://localhost:${PORT}/en`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
