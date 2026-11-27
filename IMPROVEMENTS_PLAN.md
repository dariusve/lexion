# Improvements Plan

Source: project review on 2026-11-23. Baseline at review time: `pnpm lint`, `pnpm build:packages` and `pnpm test` (22 tests) all passed. Two bugs were confirmed by reproduction (P0 below).

Tasks are grouped into phases in the order they should be done. Each task lists the files involved and what "done" means.

---

## Phase 0 — Critical fixes (confirmed bugs)

### 0.1 Remove compiled output from `packages/core/src`

**Problem:** `editor.js`, `schema.js`, `branding.js`, `index.js`, `types.js` and their `.d.ts` / `.map` files are committed next to the `.ts` sources. Vitest resolves `./editor.js` to the committed compiled file, not `editor.ts`. Verified: a marker appended to `src/editor.js` was loaded during a test run. Edits to `.ts` sources are not tested until stale JS is regenerated.

- [x] `git rm` all `*.js`, `*.js.map`, `*.d.ts`, `*.d.ts.map` under `packages/core/src/`
- [x] Check every other `packages/*/src` and `apps/*/src` for the same leftovers
- [x] Add to `.gitignore`: `packages/*/src/**/*.js`, `packages/*/src/**/*.d.ts`, `packages/*/src/**/*.map`
- [x] Find what emitted into `src/` (an old `tsc` run without `outDir`, an IDE setting) and prevent it — files arrived in commit `1d74f2e` with source maps relative to `src/` (i.e. `tsc` with the base options but no `outDir`); `packages/core/tsconfig.json` has always had `outDir: dist`, so the exact command is unknown. Prevented by `.gitignore` plus `tests/repo.hygiene.test.ts`, which fails if compiled files appear in any `packages/*/src` (gitignore alone does not stop Vitest from resolving untracked local files)
- [x] **Done when:** `pnpm test` passes and a deliberate change in `editor.ts` is reflected in tests without a build

### 0.2 Fix React adapter crash under `<StrictMode>`

**Problem:** `<StrictMode><LexionEditorView /></StrictMode>` throws `LexionEditor instance has been destroyed`. The internal editor is created in `useMemo`, destroyed in an effect cleanup, then reused on the StrictMode remount. Also, an internal editor is created (and leaked) even when the `editor` prop is passed.

File: `packages/react/src/LexionEditorView.tsx`

- [x] Create the internal editor inside the mount effect (or lazily in a ref) and destroy it in the same effect's cleanup
- [x] Don't create an internal editor when `editor` is provided
- [x] Add a StrictMode test in `tests/adapters/react.adapter.test.tsx`
- [x] Audit the Vue adapter (`packages/vue/src/LexionEditorView.ts`) and the `next` adapter for the same create/destroy lifecycle issue — Vue creates in `onMounted` / destroys in `onBeforeUnmount` (OK); `next` re-exports the React view, fixed with it
- [x] **Done when:** StrictMode test passes; the React sample runs in StrictMode without errors

---

## Phase 1 — Core API

### 1.1 Add change events to `LexionEditor`

**Problem:** core has no `on("update")` / `subscribe`. Calling `editor.execute()` outside the view (e.g. from `@lexion-rte/ui` or with a shared editor) does not update mounted views.

File: `packages/core/src/editor.ts`, `packages/core/src/types.ts`

- [x] Add `subscribe(listener): () => void` (or `on/off`) emitting `{ transaction, state, docChanged }` from `dispatchTransaction` and `setJSON` — event is `{ editor, source, transaction, previousState, state, docChanged }`; also emitted on `use()` / `removeExtension()` (`source: "extensions"`) since they replace the state
- [x] Update the `LexionEditor` interface in `types.ts`
- [x] Clear listeners on `destroy()`
- [x] Unit tests in `tests/core/editor.unit.test.ts`
- [x] Switch adapters to subscribe instead of manually calling `view.updateState` after each operation (see 2.1) — react, vue, web (and therefore angular/svelte/solid/vue2/astro). React/Next samples and the playground now own their editor in an effect (they had the same StrictMode bug)

### 1.2 Fire `onChange` only when the document changes

- [x] In all adapters, emit `onChange` only when `transaction.docChanged` is true (currently fires on selection changes)
- [x] In `LexionWebEditor.execute()`, emit only when the command executed and the doc changed
- [x] Tests: selection-only transaction does not call `onChange`

### 1.3 Remove per-keystroke `JSON.stringify` comparisons

**Problem:** adapters serialize the whole document on each transaction and on each controlled-value check.

- [x] Track the last emitted/applied `ProseMirrorNode` and compare with `doc.eq()` — last emitted/applied JSON compared by identity (Vue: `toRaw`), otherwise `schema.nodeFromJSON(value).eq(editor.doc)`
- [x] Only serialize when a JSON value is actually emitted or received
- [x] Applies to react, vue, web adapters

### 1.4 Reject schema-providing extensions in `use()`

- [x] `use(extension)` throws if `extension.schema` is set (schema is fixed at construction); currently ignored silently
- [x] Document this in `docs/EXTENSION_DEVELOPMENT.md`
- [x] Unit test

### 1.5 Consistent naming

- [x] Add `removeExtension(key)`; keep `removePlugin` as a deprecated alias
- [x] Mark the `plugins` option and `LexionPlugin` type as `@deprecated` in favor of `extensions` / `LexionExtension`
- [x] Add a changeset describing the deprecations

### 1.6 Minor core consistency

- [x] Decide whether `getJSON`, `state`, `doc` should assert not destroyed (currently only some methods do) and make it consistent — they now throw; only `schema`, `isDestroyed` (new) and `destroy()` stay usable

---

## Phase 2 — Adapters

### 2.1 Share view logic between adapters

**Problem:** status-bar rendering, controlled-value sync and the required ProseMirror styles are duplicated in react, vue and web.

- [x] Extract shared view controller logic (from `packages/web/src/adapter.ts`) that React and Vue can build on, as angular / svelte / solid / vue2 already do — `LexionViewController` in `packages/web/src/view-controller.ts`; react and vue now depend on `@lexion-rte/web`
- [x] Move the `PROSEMIRROR_REQUIRED_STYLE_ATTRIBUTE` and status-bar helpers to a single place — style attribute and stylesheet injection in `packages/web/src/styles.ts`; status bar helpers (`splitStatusBarItems`, class name helpers, `lexionStatusBarStyles`) in `packages/core/src/branding.ts`
- [x] Keep adapters thin, per the Core Rule in README

### 2.2 Adapter test coverage

Currently only react, vue, web, ui, core, tools, api have tests.

- [x] Add Vitest aliases in `vitest.config.ts` for angular, svelte, solid, vue2, astro, next, nuxt
- [x] Add at least a mount / value sync / destroy test for each — `tests/adapters/{angular,svelte,next,nuxt}.adapter.test.*` and `web-based.adapters.test.ts` (solid, vue2, astro); plus `tests/apps/react-sample.smoke.test.tsx`
- [x] Optionally build all `apps/*-sample` in CI as smoke tests (already part of `pnpm build`) — no change needed

---

## Phase 3 — Tooling and CI

### 3.1 Type-check tests and sources without a prior build

- [x] Point `tsconfig.base.json` `paths` at `packages/*/src/index.ts` (or move to TS project references) so type-checking doesn't depend on build order — done in `tests/tsconfig.json` instead. Changing the base `paths` would break each package's `tsc` build (`rootDir: src` cannot include other packages' sources). The typecheck config maps every package to its sources and checks tests and all package sources together
- [x] Add a `tests/tsconfig.json` and a `typecheck` script (`tsc --noEmit -p tests`), or enable `vitest --typecheck` — it found and fixed type errors in 5 existing test files
- [x] Add `typecheck` to the `ci` script and CI workflow

### 3.2 Gate releases on CI

File: `.github/workflows/release.yml`

- [x] Run lint + typecheck + test before `changesets/action`, or trigger release via `workflow_run` on a successful CI run — same steps as CI (format, lint, typecheck, build, test) run before `changesets/action`
- [x] Add `concurrency` to avoid overlapping release runs

### 3.3 Formatting and coverage

- [x] Add Prettier (or Biome) config and a `format:check` script; run in CI
- [x] Run `vitest run --coverage` in CI and publish the report; set a minimum threshold for core and starter-kit — uploaded as the `coverage` artifact. Floors: 80% lines overall, 85% lines/functions for core and starter-kit. Starter-kit went from 55% to 93% with `tests/starter-kit/commands.unit.test.ts`
- [x] Replace `--ext` flags in package `lint` scripts (legacy with ESLint 9 flat config) with file globs in `eslint.config.mjs`

### 3.4 Version management

- [x] Revert or formalize the uncommitted manual bumps in `packages/{react,vue,web}/package.json` (0.1.8 → 0.1.9) through `pnpm changeset` + `pnpm version-packages` so CHANGELOGs stay correct — kept: the committed CHANGELOGs already have 0.1.9 entries, so the bumps restore consistency. New changes go through the changesets in `.changeset/`
- [x] Document the release flow in `CONTRIBUTING.md` (never edit versions by hand)

---

## Phase 4 — Repo hygiene and docs

- [x] Remove empty `packages/ai` and `packages/collab` (only `node_modules` / `dist`), or add a README marking them as planned — deleted (they were untracked and empty); listed as planned in `ARCHITECTURE.md`
- [x] Update `ARCHITECTURE.md`: it references `packages/extensions` and `apps/collab-server`, which don't exist; describe `starter-kit`, `tools`, `ui`, `apps/api`
- [x] Decide whether `ARCHITECTURE.md`, `PROJECT_MAP.md`, `AI_CONTRACT.md` should be tracked (currently gitignored but useful) — `ARCHITECTURE.md` tracked; the other two stay local
- [x] Untrack build output still in git from commit `1d74f2e`: `packages/core/dist/` (16 files) and `apps/astro-sample/.astro/` (6 files) — both are ignored but tracked, so every build dirties the tree
- [x] Stop committing `wiki/` (it is generated from `docs/` by `wiki-sync.yml`); add it to `.gitignore`
- [x] Remove or move root strays: `playground-test.html`, `playground-test.extensions-shim.js` → `apps/playground` or delete — deleted; they imported the nonexistent `packages/extensions` and were broken
- [x] Delete the local `.pnpm-store/` in the repo root (use the global store)
- [x] Finish `TASK_LIST.md` verification items: manual sample-app test, final comparison against the reference StarterKit feature list — the comparison found no keyboard shortcuts (not even `Mod-z`) and no Markdown input rules; both were added (`packages/starter-kit/src/shortcuts.ts`). Remaining gaps are listed in `TASK_LIST.md`
- [x] Add a short "Contributing / dev setup" section: Node version (add `.nvmrc` / `engines`), pnpm version

---

## Phase 5 — UX, accessibility, maintainability

### 5.1 Status bar and branding

File: `packages/core/src/branding.ts`

- [x] Raise status-bar and badge font size from `7.5px` to a readable size (≥ 11px)
- [x] Replace `textWrapMode: "nowrap"` with `whiteSpace: "nowrap"` (better browser support)
- [x] Add an option to hide or customize the branding item (e.g. `LexionEditorOptions.branding: false`), at least under the commercial license — available to everyone, as decided
- [x] Prefer CSS classes over inline styles so users can theme the status bar

### 5.2 Accessibility

- [x] Give the editable area a `role="textbox"`, `aria-multiline="true"` and support an `aria-label` / `aria-labelledby` prop in all adapters
- [x] Check toolbar keyboard navigation and `aria-pressed` states in `@lexion-rte/ui` — added `role="toolbar"`, roving tabindex with arrow keys, keyboard-operable menus, and an `active` item state (`aria-pressed`)

### 5.3 Split `@lexion-rte/ui`

File: `packages/ui/src/index.ts` (1,317 lines)

- [x] Split into modules: types, default items/config, icons, menu/dropdown handling, toolbar class — `types`, `icons`, `appearance`, `items`, `dom`, `styles`, `toolbar`, `presets`
- [x] Keep the public exports unchanged; existing `tests/adapters/ui.toolbar.test.ts` must still pass

---

## Status

All phases are complete as of 2026-11-23. Follow-ups found along the way are in `TASK_LIST.md` (starter-kit gaps).

## Suggested execution order

| Step | Tasks | Size |
|------|-------|------|
| 1 | 0.1 Remove compiled output | S |
| 2 | 0.2 React StrictMode fix + test | S |
| 3 | 3.2 Gate releases on CI, 3.4 version bumps | S |
| 4 | 1.1 Change events, 1.2 `docChanged`, 1.3 no stringify | M |
| 5 | 2.1 Shared adapter logic | M |
| 6 | 3.1 Typecheck, 2.2 adapter tests | M |
| 7 | 1.4–1.6 Core API cleanup (with changesets) | S |
| 8 | Phase 4 hygiene/docs | S |
| 9 | Phase 5 UX/a11y, UI split | M |
