# Contributing

By submitting a contribution to Lexion, you agree that the contribution may be used under Lexion's dual-license model:

- the community GPL license in [LICENSE](./LICENSE.md)
- commercial terms described in [LICENSE-COMMERCIAL.md](./LICENSE-COMMERCIAL.md)

If you do not want your contribution used under both licensing tracks, do not submit it.

## Development Setup

- Node.js 22 (see `.nvmrc`; `>=20` is supported). With nvm: `nvm use`.
- pnpm 9.15 (pinned in `packageManager`). With Corepack: `corepack enable`.

```sh
pnpm install
pnpm build:packages   # needed before running sample apps, not before tests
pnpm test             # Vitest resolves @lexion-rte/* to package sources, no build needed
```

Run a sample app with `pnpm dev:<name>-sample` (for example `pnpm dev:react-sample`).

## Checks

Before opening a pull request, run what CI runs:

| Command | What it does |
| --- | --- |
| `pnpm format:check` | Prettier (`pnpm format` to fix) |
| `pnpm lint` | ESLint in every package and app |
| `pnpm typecheck` | Type-checks tests and package sources together, without a build |
| `pnpm build` | Builds all packages and sample apps |
| `pnpm test:coverage` | Tests with coverage thresholds (core and starter-kit have their own) |

`pnpm run ci` runs all of them in order.

Compiled output belongs in `dist/` only. A test fails if `.js` or `.d.ts` files appear under `packages/*/src`, because they would shadow the TypeScript sources.

## Releases

Versions and changelogs are managed with [Changesets](https://github.com/changesets/changesets). **Never edit `version` fields or `CHANGELOG.md` by hand.**

1. In your pull request, run `pnpm changeset`, pick the affected packages and the bump type, and describe the change for users. Commit the generated `.changeset/*.md` file.
2. When the pull request merges into `main`, the Release workflow runs the same checks as CI, then opens or updates a "Version Packages" pull request. That pull request runs `pnpm version-packages`, which bumps versions and writes changelogs.
3. Merging the "Version Packages" pull request publishes the bumped packages to npm (`pnpm release`).
