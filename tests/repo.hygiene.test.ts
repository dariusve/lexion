import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packagesDir = path.join(rootDir, "packages");
const compiledPattern = /\.(js|js\.map|d\.ts|d\.ts\.map)$/;

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

describe("repo hygiene", () => {
  // Compiled files next to .ts sources shadow them at import time
  // (`./editor.js` resolves to the stale file instead of `editor.ts`).
  it("has no compiled output inside packages/*/src", () => {
    const leftovers = readdirSync(packagesDir)
      .map((pkg) => path.join(packagesDir, pkg, "src"))
      .filter((src) => {
        try {
          return statSync(src).isDirectory();
        } catch {
          return false;
        }
      })
      .flatMap(walk)
      .filter((file) => compiledPattern.test(file))
      .map((file) => path.relative(rootDir, file));

    expect(leftovers).toEqual([]);
  });
});
