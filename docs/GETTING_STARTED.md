# Getting Started

## Prerequisites
- Node.js 22 (pinned in `.nvmrc`; `>=20` is supported). With nvm: `nvm use`.
- pnpm 9.15 (pinned in `packageManager`). With Corepack: `corepack enable`.

## Install
```bash
pnpm install
```

## Verify Workspace
```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm build
pnpm test
```

These root commands verify the full public workspace in this repository. `pnpm run ci` runs the same checks CI runs, in order, with coverage thresholds (`pnpm test:coverage`).

Tests and `pnpm typecheck` resolve `@lexion-rte/*` imports to package sources, so they do not need a prior build. Sample apps use the built packages, so run `pnpm build:packages` before starting one.

## Run Local Adapter Samples (No Registry Publish Needed)
```bash
pnpm dev:web-sample
pnpm dev:react-sample
pnpm dev:vue-sample
pnpm dev:vue2-sample
pnpm dev:angular-sample
pnpm dev:svelte-sample
pnpm dev:solid-sample
pnpm dev:astro-sample
pnpm dev:next-sample
pnpm dev:nuxt-sample
```

These start workspace sample apps for each adapter package using their respective framework runtimes/tooling.
The command names are unified at the repo root, while each sample runs its native toolchain under the hood (for example `next dev`, `nuxt dev`, `astro dev`, `vite`, etc.).

## Run Docs and Servers
```bash
pnpm dev:docs
pnpm dev:api
```

## Repository Layout
- `packages/core`: headless editor runtime and extension host.
- `packages/starter-kit`: community editing features.
- `packages/web`: vanilla JS adapter.
- `packages/react`: React adapter.
- `packages/vue`: Vue adapter.
- `packages/vue2`: Vue 2 adapter.
- `packages/angular`: Angular adapter utilities.
- `packages/svelte`: Svelte action adapter.
- `packages/solid`: Solid lifecycle adapter.
- `packages/astro`: Astro client-mount adapter.
- `packages/next`: Next.js adapter.
- `packages/nuxt`: Nuxt adapter.
- `packages/tools`: format conversion helpers (`toHTML`, `toText`, `fromHTML`, `fromText`).
- `packages/ui`: framework-agnostic, accessible toolbar (`LexionToolbar`).
- `tests/`: Vitest suites for core, starter-kit, every adapter, the API and repo hygiene.
- `apps/playground`: combined React / Vue / web toolbar examples.
- `apps/web-sample`: runnable vanilla web adapter sample.
- `apps/react-sample`: runnable React adapter sample.
- `apps/vue-sample`: runnable Vue 3 adapter sample.
- `apps/vue2-sample`: runnable Vue 2 adapter sample.
- `apps/angular-sample`: runnable Angular framework adapter sample.
- `apps/svelte-sample`: runnable Svelte action adapter sample.
- `apps/solid-sample`: runnable Solid framework adapter sample.
- `apps/astro-sample`: runnable Astro framework adapter sample.
- `apps/next-sample`: runnable Next.js framework adapter sample.
- `apps/nuxt-sample`: runnable Nuxt framework adapter sample.
- `apps/api`: Fastify API service.
- `apps/docs`: runnable documentation site.

## Contribution Workflow
1. Implement or modify community behavior in `packages/starter-kit`.
2. Keep `packages/core` generic and extension-driven.
3. Keep adapters UI-only.
4. Run `pnpm run ci` before opening a pull request.
5. Add a changeset (`pnpm changeset`) for any change to a published package. Never edit `version` fields or `CHANGELOG.md` by hand; see [CONTRIBUTING.md](../CONTRIBUTING.md#releases).
6. Keep compiled output in `dist/`. A test fails if `.js` or `.d.ts` files appear under `packages/*/src`.
7. Keep non-public commercial code out of this repository.
