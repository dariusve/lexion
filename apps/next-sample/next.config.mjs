import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@lexion-rte/next", "@lexion-rte/react", "@lexion-rte/core", "@lexion-rte/starter-kit"],
  webpack(config) {
    config.resolve.extensionAlias = {
      ...(config.resolve.extensionAlias ?? {}),
      ".js": [".ts", ".tsx", ".js"]
    };

    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@lexion-rte/next": path.resolve(here, "../../packages/next/src/index.ts"),
      "@lexion-rte/react": path.resolve(here, "../../packages/react/src/index.ts"),
      "@lexion-rte/core": path.resolve(here, "../../packages/core/src/index.ts"),
      "@lexion-rte/starter-kit": path.resolve(here, "../../packages/starter-kit/src/index.ts")
    };
    return config;
  }
};

export default nextConfig;
