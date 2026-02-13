import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@lexion-rte/core": path.resolve(rootDir, "packages/core/src/index.ts"),
      "@lexion-rte/extensions": path.resolve(rootDir, "packages/extensions/src/index.ts"),
      "@lexion-rte/react": path.resolve(rootDir, "packages/react/src/index.ts"),
      "@lexion-rte/vue": path.resolve(rootDir, "packages/vue/src/index.ts"),
      "@lexion-rte/web": path.resolve(rootDir, "packages/web/src/index.ts"),
      "@lexion-rte/tools": path.resolve(rootDir, "packages/tools/src/index.ts")
    }
  },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
    setupFiles: ["tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"]
    }
  }
});
