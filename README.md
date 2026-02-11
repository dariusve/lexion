# Lexion

Lexion is a framework-agnostic, headless rich text editor platform built on ProseMirror.

## Developer Docs
- Getting started: [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)
- Architecture guide: [docs/ARCHITECTURE_GUIDE.md](docs/ARCHITECTURE_GUIDE.md)
- Package APIs: [docs/PACKAGE_APIS.md](docs/PACKAGE_APIS.md)
- Extension development: [docs/EXTENSION_DEVELOPMENT.md](docs/EXTENSION_DEVELOPMENT.md)
- Adapter examples: [docs/ADAPTER_EXAMPLES.md](docs/ADAPTER_EXAMPLES.md)
- Backend services: [docs/BACKEND_SERVICES.md](docs/BACKEND_SERVICES.md)
- Release process: [docs/RELEASE_PROCESS.md](docs/RELEASE_PROCESS.md)

## Quick Start
1. Install dependencies:
   - `pnpm install`
2. Build all packages/apps:
   - `pnpm build`
3. Run lints:
   - `pnpm lint`
4. Run tests:
   - `pnpm test`
5. Run the local Vue sample app:
   - `pnpm dev:vue-sample`

## Monorepo Commands
- `pnpm build`: build all workspaces.
- `pnpm build:packages`: build `packages/*`.
- `pnpm build:apps`: build `apps/*`.
- `pnpm lint`: run lint across all workspaces.
- `pnpm test`: run unit, adapter, and integration tests.
- `pnpm dev:docs`: run docs site locally.
- `pnpm dev:api`: build and run API server.
- `pnpm dev:collab`: build and run collaboration server.

## Core Rule
Feature behavior must be implemented as extensions (`@lexion/extensions`), not directly in adapters.
