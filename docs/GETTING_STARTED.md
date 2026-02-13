# Getting Started

## Prerequisites
- Node.js 22+
- pnpm 9+

## Install
```bash
pnpm install
```

## Verify Workspace
```bash
pnpm build
pnpm lint
pnpm test
```

## Run Local Sample (No Registry Publish Needed)
```bash
pnpm dev:vue-sample
```

This starts `apps/vue-sample`, which uses workspace packages (`@lexion-rte/core`, `@lexion-rte/extensions`, `@lexion-rte/vue`) directly.

## Run Docs and Servers
```bash
pnpm dev:docs
pnpm dev:api
pnpm dev:collab
```

## Repository Layout
- `packages/core`: headless editor runtime and extension host.
- `packages/extensions`: feature modules (starter kit and future extensions).
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
- `apps/playground`: lightweight integration playground helpers.
- `apps/vue-sample`: runnable local sample app.
- `apps/api`: Fastify API service.
- `apps/collab-server`: Yjs collaboration WebSocket service.
- `apps/docs`: runnable documentation site.

## Contribution Workflow
1. Implement or modify behavior in `packages/extensions`.
2. Keep `packages/core` generic and extension-driven.
3. Keep adapters UI-only.
4. Run `pnpm build` and `pnpm lint` before opening PR.
