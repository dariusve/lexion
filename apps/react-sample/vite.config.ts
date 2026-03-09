import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@lexion-rte/core": fileURLToPath(new URL("../../packages/core/src/index.ts", import.meta.url)),
      "@lexion-rte/starter-kit": fileURLToPath(
        new URL("../../packages/starter-kit/src/index.ts", import.meta.url)
      ),
      "@lexion-rte/react": fileURLToPath(new URL("../../packages/react/src/index.ts", import.meta.url))
    }
  }
});
