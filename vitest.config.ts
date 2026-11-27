import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@lexion-rte/core": path.resolve(rootDir, "packages/core/src/index.ts"),
      "@lexion-rte/starter-kit": path.resolve(rootDir, "packages/starter-kit/src/index.ts"),
      "@lexion-rte/react": path.resolve(rootDir, "packages/react/src/index.ts"),
      "@lexion-rte/vue": path.resolve(rootDir, "packages/vue/src/index.ts"),
      "@lexion-rte/web": path.resolve(rootDir, "packages/web/src/index.ts"),
      "@lexion-rte/ui": path.resolve(rootDir, "packages/ui/src/index.ts"),
      "@lexion-rte/tools": path.resolve(rootDir, "packages/tools/src/index.ts"),
      "@lexion-rte/angular": path.resolve(rootDir, "packages/angular/src/index.ts"),
      "@lexion-rte/svelte": path.resolve(rootDir, "packages/svelte/src/index.ts"),
      "@lexion-rte/solid": path.resolve(rootDir, "packages/solid/src/index.ts"),
      "@lexion-rte/vue2": path.resolve(rootDir, "packages/vue2/src/index.ts"),
      "@lexion-rte/astro": path.resolve(rootDir, "packages/astro/src/index.ts"),
      "@lexion-rte/next": path.resolve(rootDir, "packages/next/src/index.ts"),
      "@lexion-rte/nuxt": path.resolve(rootDir, "packages/nuxt/src/index.ts")
    }
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    setupFiles: ["tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text-summary", "text", "lcov", "json-summary"],
      include: ["packages/*/src/**/*.{ts,tsx}"],
      exclude: ["packages/*/src/**/*.d.ts"],
      // Floors set a few points below the measured values; raise them as coverage improves.
      thresholds: {
        lines: 80,
        "packages/core/src/**": { lines: 85, statements: 85, functions: 85, branches: 70 },
        "packages/starter-kit/src/**": { lines: 85, statements: 85, functions: 85, branches: 80 }
      }
    }
  }
});
