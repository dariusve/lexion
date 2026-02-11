import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@lexion/core": fileURLToPath(new URL("../../packages/core/src/index.ts", import.meta.url)),
      "@lexion/extensions": fileURLToPath(
        new URL("../../packages/extensions/src/index.ts", import.meta.url)
      ),
      "@lexion/vue": fileURLToPath(new URL("../../packages/vue/src/index.ts", import.meta.url))
    }
  }
});
