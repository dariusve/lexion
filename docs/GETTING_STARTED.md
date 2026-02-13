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
- `apps/collab-server`: Yjs collaboration WebSocket service.
- `apps/docs`: runnable documentation site.

## Contribution Workflow
1. Implement or modify behavior in `packages/extensions`.
2. Keep `packages/core` generic and extension-driven.
3. Keep adapters UI-only.
4. Run `pnpm build` and `pnpm lint` before opening PR.
