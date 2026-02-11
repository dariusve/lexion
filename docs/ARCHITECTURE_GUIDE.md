# Architecture Guide

## Design Goals
- Framework-agnostic editor core.
- Extension-first feature delivery.
- Thin UI adapters with no business logic.
- Strict TypeScript across the monorepo.

## Layer Responsibilities

## `@lexion/core`
- Hosts editor lifecycle (`LexionEditor`).
- Manages editor state, command registration, and transaction dispatch.
- Loads extensions for schema, commands, and ProseMirror plugins.
- Provides only a minimal fallback schema (`doc`, `paragraph`, `text`, `hard_break`).

## `@lexion/extensions`
- Contains feature implementations.
- Provides `starterKitExtension` with:
  - schema
  - commands (paragraph/heading/bold/italic/lists/links/undo/redo)
  - ProseMirror plugins (history + base keymap)
- Provides collaboration extension primitives (`createCollaborationExtension`).
- Provides AI extension primitives (`aiExtension`, `AIService`).

## Adapters (`@lexion/web`, `@lexion/react`, `@lexion/vue`, `@lexion/vue2`, `@lexion/angular`, `@lexion/svelte`, `@lexion/solid`, `@lexion/astro`, `@lexion/next`, `@lexion/nuxt`)
- Render/editor view mounting and lifecycle only.
- Bridge UI events/transactions to `LexionEditor`.
- When creating internal editors, they attach `starterKitExtension`.

## `@lexion/tools`
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
- Feature additions go to `@lexion/extensions`.
