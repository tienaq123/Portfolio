import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const root = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": root("./"),
      "server-only": root("./tests/unit/server-only.ts"),
      "next/cache": root("./tests/unit/next-cache.ts"),
    },
  },
  test: {
    environment: "node",
    projects: [
      // pnpm test
      { extends: true, test: { name: "unit", include: ["lib/**/*.test.ts"] } },
      // pnpm test:db — needs the local stack: pnpm db:start && pnpm db:reset
      {
        extends: true,
        test: {
          name: "db",
          include: ["tests/db/**/*.test.ts"],
          testTimeout: 20_000,
          hookTimeout: 60_000,
          fileParallelism: false,
        },
      },
    ],
  },
});
