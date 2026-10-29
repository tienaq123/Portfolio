import { defineConfig, devices } from "@playwright/test";

// M7-T10 visual regression, run by hand around a change of content source:
//   1. build with the current source, `pnpm test:visual --update-snapshots`
//   2. switch the source (e.g. Supabase env), rebuild, `pnpm test:visual`
// Snapshots stay local (gitignored): they are a before/after check.
const PORT = 3300;

export default defineConfig({
  testDir: "./tests/visual",
  snapshotPathTemplate: ".visual-baseline/{arg}{ext}",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    reducedMotion: "reduce",
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.001, animations: "disabled" },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: `pnpm start --port ${PORT}`,
    url: `http://localhost:${PORT}/en`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
