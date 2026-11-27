# Project Map

## What The System Does
Lexion is a framework-agnostic, headless rich text editor platform.  
The public workspace provides a typed core, a community starter kit, framework adapters, docs, sample apps, and a backend API surface.

## Main Packages
- `packages/core`: editor engine and domain logic.
- `packages/starter-kit`: reusable community editing features, schema pieces, commands, and plugins.
- `packages/tools`: HTML/text conversion (`toHTML`, `fromHTML`, `toText`, `fromText`).
- `packages/ui`: framework-agnostic, accessible toolbar (`LexionToolbar`).
- `packages/web`: `LexionViewController` (the shared view wiring every adapter uses) and the vanilla `LexionWebEditor`.
- `packages/react`: React adapter layer (built on `LexionViewController`).
- `packages/vue`: Vue adapter layer (built on `LexionViewController`).
- `packages/vue2`: Vue 2 lifecycle adapter layer.
- `packages/angular`: Angular lifecycle/form bridge adapter.
- `packages/svelte`: Svelte action adapter.
- `packages/solid`: Solid lifecycle adapter.
- `packages/astro`: Astro client-mount adapter.
- `packages/next`: Next.js client component adapter.
- `packages/nuxt`: Nuxt SSR-safe Vue adapter.
- `apps/api`: backend API surface (Fastify/Node.js).
- `apps/docs`, `apps/playground`: documentation and interactive validation environments.
- `apps/*-sample`: framework-specific sample apps for validating adapter behavior in real runtimes.
- `tests/`: Vitest suites (core, starter-kit, every adapter, API, repo hygiene); `tests/tsconfig.json` backs `pnpm typecheck`.

## Data Flow
1. Client app initializes an editor instance through a framework adapter or web binding.
2. The adapter wires UI events to core commands and transactions.
3. `packages/core` applies transactions, exposes the editor state model, and notifies `subscribe()` listeners.
4. `packages/starter-kit` adds the default schema, commands, and plugins for common editing behavior.
5. Every subscribed view re-renders the new state; adapters emit `onChange` only when the document changed.
6. Optional backend workflows can be handled by `apps/api` or private commercial services outside this repository.

## Where To Implement Features
- New editor behavior: `packages/starter-kit` (default path for community features).
- Shared editor rules/invariants: `packages/core`.
- Shared utilities and integration helpers: `packages/tools`.
- Rendering or framework lifecycle integration: `packages/web`, `packages/react`, `packages/vue`, `packages/vue2`, `packages/angular`, `packages/svelte`, `packages/solid`, `packages/astro`, `packages/next`, `packages/nuxt`.
- API endpoints and backend workflows: `apps/api`.

Rule of thumb: implement logic once in `packages/core` or `packages/starter-kit`, then expose it through adapters.
