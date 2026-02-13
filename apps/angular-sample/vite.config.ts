import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@lexion-rte/core": fileURLToPath(new URL("../../packages/core/src/index.ts", import.meta.url)),
      "@lexion-rte/extensions": fileURLToPath(
        new URL("../../packages/extensions/src/index.ts", import.meta.url)
      ),
      "@lexion-rte/web": fileURLToPath(new URL("../../packages/web/src/index.ts", import.meta.url)),
      "@lexion-rte/angular": fileURLToPath(new URL("../../packages/angular/src/index.ts", import.meta.url))
    }
  }
});
