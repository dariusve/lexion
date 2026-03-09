import { fileURLToPath } from "node:url";

export default defineNuxtConfig({
  css: ["~/assets/styles.css"],
  alias: {
    "@lexion-rte/core": fileURLToPath(new URL("../../packages/core/src/index.ts", import.meta.url)),
    "@lexion-rte/starter-kit": fileURLToPath(
      new URL("../../packages/starter-kit/src/index.ts", import.meta.url)
    ),
    "@lexion-rte/vue": fileURLToPath(new URL("../../packages/vue/src/index.ts", import.meta.url)),
    "@lexion-rte/nuxt": fileURLToPath(new URL("../../packages/nuxt/src/index.ts", import.meta.url))
  }
});
