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
- Loads extensions for schema, commands, and ProseMirror plugins.
- Aggregates status bar items for adapter-rendered editor chrome.
- Provides only a minimal fallback schema (`doc`, `paragraph`, `text`, `hard_break`).

## `@lexion-rte/starter-kit`
- Contains community editing features.
- Provides `starterKitExtension` with:
  - schema
  - commands (paragraph/heading/bold/italic/lists/links/undo/redo)
  - ProseMirror plugins (history + base keymap)

## Commercial Feature Track
- Commercial features are implemented in private codebases against the public extension contracts.
- Premium implementation code must stay out of the public repository unless it is intentionally reclassified as community functionality.

## Adapters (`@lexion-rte/web`, `@lexion-rte/react`, `@lexion-rte/vue`, `@lexion-rte/vue2`, `@lexion-rte/angular`, `@lexion-rte/svelte`, `@lexion-rte/solid`, `@lexion-rte/astro`, `@lexion-rte/next`, `@lexion-rte/nuxt`)
- Render/editor view mounting and lifecycle only.
- Bridge UI events/transactions to `LexionEditor`.
- Render editor chrome such as the status bar from core-provided state.
- When creating internal editors, they attach `starterKitExtension`.

## `@lexion-rte/tools`
- Converts editor content to/from HTML and text.
- Operates on `LexionEditor` instances.

## Data Flow
1. App initializes an editor (internally or externally).
2. Extensions define schema + commands + PM plugins.
3. Adapter binds ProseMirror `EditorView` to editor state.
4. Transactions update state via core.
5. App reads/writes JSON via core and uses tools for text/HTML conversion.

## Non-Negotiables
- No feature business logic in adapters.
- No framework runtime dependencies in core.
- Community feature additions go to `@lexion-rte/starter-kit` or another public package.
- Paid capabilities go to commercial packages or services outside this repository.
