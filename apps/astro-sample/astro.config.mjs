import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";

export default defineConfig({
  vite: {
    resolve: {
      alias: {
        "@lexion-rte/core": fileURLToPath(new URL("../../packages/core/src/index.ts", import.meta.url)),
        "@lexion-rte/starter-kit": fileURLToPath(
          new URL("../../packages/starter-kit/src/index.ts", import.meta.url)
        ),
        "@lexion-rte/web": fileURLToPath(new URL("../../packages/web/src/index.ts", import.meta.url)),
        "@lexion-rte/astro": fileURLToPath(new URL("../../packages/astro/src/index.ts", import.meta.url))
      }
    }
  }
});
