![Lexion Logo](../../assets/images/logo.png)

This package is part of the Lexion framework-agnostic rich text editor.

Lexion is a framework-agnostic, headless rich text editor platform built on ProseMirror, designed to provide a shared core, reusable extensions, and framework-specific adapters.

# @lexion-rte/core

Headless editor runtime for the Lexion platform.

## Overview

`@lexion-rte/core` provides:

- editor state and schema management
- command registration/execution
- status bar item aggregation for adapter UIs
- extension lifecycle hooks (`onCreate`, `onDestroy`)
- JSON document input/output

This package does not render UI by itself. Pair it with `@lexion-rte/starter-kit` and optionally an adapter package.

## Install

```bash
pnpm add @lexion-rte/core
```

Typical pairing:

```bash
pnpm add @lexion-rte/core @lexion-rte/starter-kit
```

## Quick Start

```ts
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension, starterKitCommandNames } from "@lexion-rte/starter-kit";

const editor = new LexionEditor({
  extensions: [starterKitExtension]
});

editor.execute(starterKitCommandNames.toggleBold);
console.log(editor.getJSON());
```

## Editor Options

`LexionEditor` accepts:

- `schema?: Schema`
- `doc?: JSONDocument`
- `extensions?: LexionExtension[]`
- `plugins?: LexionPlugin[]` (deprecated alias of `extensions`)
- `branding?: boolean | { text?, align?, className?, style? }` (`false` hides the "Powered by lexion" status bar item)
- `commands?: CommandMap`

## Core API

Main instance members:

- `schema`
- `state`
- `doc`
- `getJSON()`
- `getStatusBarItems()`
- `setJSON(document)`
- `dispatchTransaction(transaction)`
- `execute(command, ...args)`
- `registerCommand(name, handler)`
- `unregisterCommand(name)`
- `use(extension)` (throws if the extension provides a `schema`; pass those to the constructor)
- `removeExtension(key)`
- `removePlugin(key)` (deprecated alias of `removeExtension`)
- `subscribe(listener)` → unsubscribe function
- `isDestroyed`
- `destroy()`

After `destroy()`, every member except `schema`, `isDestroyed` and `destroy()` throws.

## Subscribing to Changes
`subscribe` is called after every state change: dispatched transactions (including `execute()`), `setJSON()`, and extension add/remove. Adapters use it to keep their views in sync, so commands run on a shared editor (e.g. from a toolbar) update every mounted view.

```ts
const unsubscribe = editor.subscribe(({ source, docChanged, transaction, state, previousState }) => {
  // source: "transaction" | "setJSON" | "extensions"
  if (docChanged) {
    save(editor.getJSON());
  }
});

unsubscribe(); // listeners are also cleared on destroy()
```

## Status Bar and Branding

Core collects status bar items from extensions and ships the stylesheet adapters inject (`lexionStatusBarStyles`). It uses zero-specificity `:where()` selectors, so your CSS always wins, and `--lexion-status-bar-*` custom properties for quick theming.

```ts
// Hide the "Powered by lexion" item
new LexionEditor({ extensions: [starterKitExtension], branding: false });

// Or customize it
new LexionEditor({
  extensions: [starterKitExtension],
  branding: { text: "Edited with Acme", align: "end", className: "acme-badge" }
});
```

Helpers for custom renderers: `splitStatusBarItems(items)` (→ `{ start, end }`), `getStatusBarGroupClassName(align)`, `getStatusBarItemClassName(item)`, `resolveBrandingStatusItem(branding)`. `lexionStatusBarAppearance.style` / `groupStyles` are deprecated in favor of the stylesheet.

## Custom Command Example

```ts
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/starter-kit";

const editor = new LexionEditor({ extensions: [starterKitExtension] });

editor.registerCommand("insertTimestamp", ({ state, dispatch }) => {
  const { from, to } = state.selection;
  dispatch(state.tr.insertText(new Date().toISOString(), from, to));
  return true;
});

editor.execute("insertTimestamp");
```

## Extension Lifecycle Example

```ts
import type { LexionExtension } from "@lexion-rte/core";

const auditExtension: LexionExtension = {
  key: "audit",
  onCreate: ({ editor }) => {
    console.log("created", editor.getJSON());
  },
  onDestroy: () => {
    console.log("destroyed");
  }
};
```

## Status Bar Example

```ts
import type { LexionExtension } from "@lexion-rte/core";

const metricsExtension: LexionExtension = {
  key: "metrics",
  statusBarItems: ({ doc }) => [
    {
      key: "characters",
      text: `${doc.textContent.length} chars`
    }
  ]
};
```

## Error Behavior

- Executing an unknown command throws `Unknown command: <name>`.
- Using an editor after `destroy()` throws an error.
- Registering duplicate command names throws.

## Related Packages

- `@lexion-rte/starter-kit` for community editing features
- private commercial packages for non-public features
- `@lexion-rte/tools` for HTML/text conversions
- adapter packages (`web`, `react`, `vue`, etc.) for UI integration
