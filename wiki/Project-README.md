# Lexion

![Lexion Logo](assets/images/logo.png)

Lexion is a framework-agnostic, headless rich text editor platform built on ProseMirror.

## Developer Docs
- [Getting Started](Getting-Started)
- [Lexion Overview](Lexion-Overview)
- [Architecture Guide](Architecture-Guide)
- [Licensing Model](Licensing-Model)
- [Package APIs](Package-APIs)
- [Data Examples](Data-Examples)
- [Extension Development](Extension-Development)
- [Extensions Reference](Extensions-Reference)
- [Adapter Examples](Adapter-Examples)
- [Backend Services](Backend-Services)
- 
## Quick Start
1. Install dependencies:
   - `pnpm install`
2. Build all packages/apps:
   - `pnpm build`
3. Run lints:
   - `pnpm lint`
4. Run tests:
   - `pnpm test`
5. Run adapter sample apps:
   - `pnpm dev:web-sample`
   - `pnpm dev:react-sample`
   - `pnpm dev:vue-sample`
   - `pnpm dev:vue2-sample`
   - `pnpm dev:angular-sample`
   - `pnpm dev:svelte-sample`
   - `pnpm dev:solid-sample`
   - `pnpm dev:astro-sample`
   - `pnpm dev:next-sample`
   - `pnpm dev:nuxt-sample`

## Monorepo Commands
- `pnpm build`: build all workspaces.
- `pnpm build:packages`: build `packages/*`.
- `pnpm build:apps`: build `apps/*`.
- `pnpm lint`: run lint across all workspaces.
- `pnpm test`: run unit, adapter, and integration tests.
- `pnpm dev:docs`: run docs site locally.
- `pnpm dev:api`: build and run API server.
- `pnpm dev:web-sample`: run vanilla web adapter sample.
- `pnpm dev:react-sample`: run React adapter sample.
- `pnpm dev:vue-sample`: run Vue 3 adapter sample.
- `pnpm dev:vue2-sample`: run Vue 2 adapter sample.
- `pnpm dev:angular-sample`: run Angular framework adapter sample.
- `pnpm dev:svelte-sample`: run Svelte action adapter sample.
- `pnpm dev:solid-sample`: run Solid framework adapter sample.
- `pnpm dev:astro-sample`: run Astro framework adapter sample.
- `pnpm dev:next-sample`: run Next.js framework adapter sample.
- `pnpm dev:nuxt-sample`: run Nuxt framework adapter sample.

Sample apps use native framework runtimes/tooling where applicable (for example Next.js, Nuxt, Astro, Angular, Svelte, Solid, Vue, and React).

## Core Rule
Feature behavior must be implemented as extensions (`@lexion-rte/starter-kit` or premium extension packages), not directly in adapters.

## License
Lexion uses an open-core, dual-license model:

- community packages in this repository are available under GPL-3.0-or-later
- commercial licenses are available separately for proprietary use and premium packages

See [LICENSE](LICENSE.md), [LICENSE-COMMERCIAL.md](LICENSE-COMMERCIAL.md), and [docs/LICENSING_MODEL.md](Licensing-Model).

## Package Tracks

Community packages:
- `@lexion-rte/core`
- `@lexion-rte/starter-kit`
- `@lexion-rte/tools`
- public adapter packages

Commercial features:
- private commercial packages kept outside this public repository
- hosted commercial services
- future premium offerings distributed separately
