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
- [x] `@lexion/core` initial implementation:
  - [x] Headless editor class
  - [x] JSON document input/output
  - [x] Command registry (`execute`, register/unregister)
  - [x] Plugin contract and lifecycle (`use`, `removePlugin`)
  - [x] Built-in features: paragraph, heading, bold, italic, lists, links, undo/redo
  - [x] Base key bindings fixed (Enter, cursor movement)
- [x] `@lexion/react` adapter:
  - [x] `LexionEditorView` component
  - [x] Controlled mode
  - [x] Uncontrolled mode
- [x] `@lexion/vue` adapter:
  - [x] `LexionEditorView` component
  - [x] Controlled mode
  - [x] Uncontrolled mode
- [x] `@lexion/web` vanilla adapter:
  - [x] `LexionWebEditor` class
  - [x] Controlled/uncontrolled style usage
  - [x] Read-only toggle and lifecycle management
- [x] `@lexion/tools` package:
  - [x] `toHTML`
  - [x] `toText`
  - [x] `fromHTML`
  - [x] `fromText`
- [x] `@lexion/extensions` package:
  - [x] Starter-kit schema moved out of core
  - [x] Starter-kit commands moved out of core
  - [x] Starter-kit ProseMirror plugins moved out of core
- [x] Vue playground examples in `apps/playground`.
- [x] Local Vue sample app (`apps/vue-sample`) that runs against workspace packages (no registry publish required).

## Partially Completed
- [ ] Workspace build verification in CI
  - [x] Build scripts exist per package/app.
  - [ ] Automated CI pipeline not set up yet.
- [ ] Documentation coverage
  - [x] Core architecture docs exist.
  - [ ] API reference docs and usage guides are still missing.

## Not Started
- [ ] `apps/api` backend application.
- [ ] `apps/collab-server` realtime collaboration server.
- [ ] Yjs collaboration integration wiring.
- [ ] AI-native extension layer.
- [ ] `apps/docs` real docs site implementation.
- [ ] Test suite:
  - [ ] Unit tests for `@lexion/core`
  - [ ] Adapter tests (`@lexion/react`, `@lexion/vue`, `@lexion/web`)
  - [ ] Integration tests (editor + adapters)
- [ ] Release/versioning workflow for open-source publishing.

## Suggested Next Milestones
1. Build `packages/extensions` and move built-in behaviors into extension modules.
2. Add test coverage for core commands, schema behavior, and adapter lifecycle.
3. Implement collaboration stack (`apps/collab-server` + Yjs integration).
4. Implement API server (`apps/api`) and docs app (`apps/docs`).
