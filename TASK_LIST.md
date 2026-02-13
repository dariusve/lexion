# Lexion Task List

Last updated: 2026-02-11

## Completed
- [x] Monorepo scaffolding with `pnpm` workspaces.
- [x] Root strict TypeScript base config (`strict`, `noImplicitAny`, etc.).
- [x] Shared root ESLint config.
- [x] Architecture and project governance docs:
  - [x] `AI_CONTRACT.md`
  - [x] `ARCHITECTURE.md`
  - [x] `PROJECT_MAP.md`
- [x] `@lexion-rte/core` initial implementation:
  - [x] Headless editor class
  - [x] JSON document input/output
  - [x] Command registry (`execute`, register/unregister)
  - [x] Plugin contract and lifecycle (`use`, `removePlugin`)
  - [x] Built-in features: paragraph, heading, bold, italic, lists, links, undo/redo
  - [x] Base key bindings fixed (Enter, cursor movement)
- [x] `@lexion-rte/react` adapter:
  - [x] `LexionEditorView` component
  - [x] Controlled mode
  - [x] Uncontrolled mode
- [x] `@lexion-rte/vue` adapter:
  - [x] `LexionEditorView` component
  - [x] Controlled mode
  - [x] Uncontrolled mode
- [x] `@lexion-rte/web` vanilla adapter:
  - [x] `LexionWebEditor` class
  - [x] Controlled/uncontrolled style usage
  - [x] Read-only toggle and lifecycle management
- [x] `@lexion-rte/tools` package:
  - [x] `toHTML`
  - [x] `toText`
  - [x] `fromHTML`
  - [x] `fromText`
- [x] `@lexion-rte/extensions` package:
  - [x] Starter-kit schema moved out of core
  - [x] Starter-kit commands moved out of core
  - [x] Starter-kit ProseMirror plugins moved out of core
  - [x] AI extension layer baseline (`aiExtension`, provider-agnostic AI service)
  - [x] Collaboration extension baseline (`createCollaborationExtension`)
- [x] Vue playground examples in `apps/playground`.
- [x] Local Vue sample app (`apps/vue-sample`) that runs against workspace packages (no registry publish required).
- [x] `apps/api` backend application baseline (Fastify).
- [x] `apps/collab-server` realtime collaboration server baseline (Yjs + WebSocket).
- [x] Yjs collaboration integration wiring.
- [x] `apps/docs` real docs site implementation.
- [x] Test suite:
  - [x] Unit tests for `@lexion-rte/core`
  - [x] Adapter tests (`@lexion-rte/react`, `@lexion-rte/vue`, `@lexion-rte/web`)
  - [x] Integration tests (editor + adapters + tools)
- [x] Workspace build verification in CI (GitHub Actions).
- [x] Release/versioning workflow baseline (Changesets + release workflow).

## Partially Completed
- [x] Documentation coverage
  - [x] Core architecture docs exist.
  - [x] API reference docs and usage guides added under `docs/`.
- [ ] Production hardening
  - [x] Baseline CI/lint/build/test/release wiring
  - [ ] Security/auth layers for API/collab are not implemented
  - [ ] Persistence/storage for API/collab is not implemented
  - [ ] End-to-end collaboration client protocol validation is not implemented

## Not Started
- [ ] Persistent storage adapters for API/collab documents.
- [ ] Authn/Authz integration for API and collaboration transport.
- [ ] Expanded AI providers and prompt/policy guardrails.
- [ ] End-to-end browser collaboration tests.

## Suggested Next Milestones
1. Add persistence (PostgreSQL) for document and collaboration state.
2. Add auth to `apps/api` and `apps/collab-server`.
3. Expand AI extension providers and deterministic transformation policies.
4. Add e2e collaboration test matrix (multiple clients, conflict scenarios, reconnect flow).
