# Architecture Guide

## Design Goals
- Framework-agnostic editor core.
- Extension-first feature delivery.
- Thin UI adapters with no business logic.
- Open-core package boundaries with premium features isolated from community packages.
- Strict TypeScript across the monorepo.

## Layer Responsibilities

## `@lexion-rte/core`
- Hosts editor lifecycle (`LexionEditor`).
- Manages editor state, command registration, and transaction dispatch.
- Emits change events through `subscribe(listener)` after every state change (transactions, `setJSON()`, extension add/remove), with `docChanged` so consumers can ignore selection-only updates.
- Fixes the schema at construction: schema-providing extensions go in the constructor, and `use()` rejects them.
- Loads extensions for schema, commands, and ProseMirror plugins.
- Aggregates status bar items for adapter-rendered editor chrome, and ships the status bar stylesheet (`lexionStatusBarStyles`) and the optional "Powered by lexion" branding item (`branding` option).
- Provides only a minimal fallback schema (`doc`, `paragraph`, `text`, `hard_break`).

## `@lexion-rte/starter-kit`
- Contains community editing features.
- Provides `starterKitExtension` with:
  - schema
  - commands (paragraph/heading/bold/italic/lists/links/undo/redo)
  - ProseMirror plugins: history, keyboard shortcuts, Markdown input rules, base keymap, list keymap, gap cursor, drop cursor, trailing node

## Commercial Feature Track
- Commercial features are implemented in private codebases against the public extension contracts.
- Premium implementation code must stay out of the public repository unless it is intentionally reclassified as community functionality.

## Adapters (`@lexion-rte/web`, `@lexion-rte/react`, `@lexion-rte/vue`, `@lexion-rte/vue2`, `@lexion-rte/angular`, `@lexion-rte/svelte`, `@lexion-rte/solid`, `@lexion-rte/astro`, `@lexion-rte/next`, `@lexion-rte/nuxt`)
- Render/editor view mounting and lifecycle only.
- Built on one shared implementation, `LexionViewController` in `@lexion-rte/web`: it creates the ProseMirror `EditorView`, subscribes to the editor, syncs controlled values, emits `onChange` only when the document changes, and applies read-only state, ARIA attributes (`role="textbox"`, `ariaLabel` / `ariaLabelledBy`) and stylesheet injection.
- `react` and `vue` render the status bar with their own templates on top of the controller; `vue2`, `angular`, `svelte`, `solid` and `astro` wrap `LexionWebEditor`; `next` re-exports the React view and `nuxt` wraps the Vue view client-side.
- Render editor chrome such as the status bar from core-provided state.
- When creating internal editors, they attach `starterKitExtension`.

## `@lexion-rte/tools`
- Converts editor content to/from HTML and text.
- Operates on `LexionEditor` instances.

## `@lexion-rte/ui`
- Framework-agnostic toolbar (`LexionToolbar`) that runs editor commands through `editor.execute()`.
- Accessible by default: `role="toolbar"`, one Tab stop with arrow-key navigation, keyboard-operable dropdown menus, `aria-pressed` for toggle items.
- Because views subscribe to the editor, a toolbar command updates every mounted view.

## Data Flow
1. App initializes an editor (internally or externally).
2. Extensions define schema + commands + PM plugins.
3. Adapter binds ProseMirror `EditorView` to editor state and subscribes to the editor.
4. Transactions (from the view, `execute()`, a toolbar, or `setJSON()`) update state via core, and core notifies subscribers.
5. Each subscribed view updates itself; adapters emit `onChange` only when the document changed.
6. App reads/writes JSON via core and uses tools for text/HTML conversion.

## Non-Negotiables
- No feature business logic in adapters.
- No framework runtime dependencies in core.
- Community feature additions go to `@lexion-rte/starter-kit` or another public package.
- Paid capabilities go to commercial packages or services outside this repository.
