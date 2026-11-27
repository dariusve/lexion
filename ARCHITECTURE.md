# Architecture

Lexion is a pnpm monorepo: a headless editor core, feature extensions, and thin framework adapters on top of ProseMirror.

```
                 @lexion-rte/core          state, schema, commands, extensions, change events
                        ▲
        ┌───────────────┼──────────────────┐
 @lexion-rte/starter-kit  @lexion-rte/tools   @lexion-rte/ui
   (features)            (HTML/text I/O)     (toolbar)
                        ▲
                 @lexion-rte/web           LexionViewController + vanilla LexionWebEditor
                        ▲
   react ─ next   vue ─ nuxt   vue2   angular   svelte   solid   astro
```

## Core Editor (`packages/core`)

- `LexionEditor` owns the ProseMirror `EditorState`, schema, command registry and extensions.
- Framework-independent API: `getJSON` / `setJSON`, `dispatchTransaction`, `execute`, `use` / `removeExtension`, `getStatusBarItems`, `destroy`.
- `subscribe(listener)` emits after every state change (`transaction`, `setJSON`, `extensions`) with `docChanged`. Views and other consumers stay in sync through it instead of patching state by hand.
- The schema is fixed at construction. Schema-providing extensions go in the constructor; `use()` rejects them.
- Ships only a minimal fallback schema (`doc`, `paragraph`, `text`, `hard_break`), plus the status bar appearance and stylesheet (`lexionStatusBarStyles`) and the optional branding item.

## Extensions (`packages/starter-kit`)

- Features are `LexionExtension`s: `schema`, `commands`, `editorPlugins`, `statusBarItems`, `onCreate` / `onDestroy`.
- `@lexion-rte/starter-kit` is the baseline community feature set: rich-text schema, commands, history, keyboard shortcuts, Markdown input rules, list keymap, gap/drop cursor and trailing node.
- **Core rule:** feature behavior lives in extensions, never in adapters.

## Tools and UI (`packages/tools`, `packages/ui`)

- `@lexion-rte/tools`: document conversion (`toHTML`, `fromHTML`, `toText`, `fromText`).
- `@lexion-rte/ui`: framework-agnostic toolbar (`LexionToolbar`) that executes editor commands. Because views subscribe to the editor, toolbar commands update every mounted view.

## Framework Adapters

- `@lexion-rte/web` contains `LexionViewController`, the single implementation of view wiring that every adapter shares: `EditorView` creation, editor subscription, controlled-value sync (reference check, then `Node.eq()`), `onChange` only on document changes, read-only state, ARIA attributes, status bar updates and stylesheet injection. `LexionWebEditor` adds a DOM status bar on top.
- `react` and `vue` render the status bar with their own templates on top of the controller. `next` re-exports the React view; `nuxt` wraps the Vue view client-side only.
- `vue2`, `angular`, `svelte`, `solid` and `astro` wrap `LexionWebEditor` in each framework's lifecycle idiom.
- Adapters stay thin: lifecycle wiring and event bridging only, no editor rules or feature logic.

## Apps (`apps/*`)

- `apps/api`: Fastify service around the core and tools (`/health`, `/documents/from-text`, `/documents/to-text`, `/commands/execute`).
- `apps/docs`: Vite documentation site.
- `apps/playground`: combined React / Vue / web toolbar examples.
- `apps/*-sample`: one minimal sample per adapter. They are built in CI as smoke tests.

## Planned (not in this repository yet)

- Collaboration (Yjs-based sync, awareness, persistence) and AI features are planned as premium extension packages that integrate through `LexionExtension` and core APIs, not adapter-specific code.
