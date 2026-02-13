import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      "@lexion-rte/core": fileURLToPath(new URL("../../packages/core/src/index.ts", import.meta.url)),
      "@lexion-rte/extensions": fileURLToPath(
        new URL("../../packages/extensions/src/index.ts", import.meta.url)
      ),
      "@lexion-rte/web": fileURLToPath(new URL("../../packages/web/src/index.ts", import.meta.url)),
      "@lexion-rte/svelte": fileURLToPath(new URL("../../packages/svelte/src/index.ts", import.meta.url))
    }
  }
});
