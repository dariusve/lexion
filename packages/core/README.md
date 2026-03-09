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
- `plugins?: LexionPlugin[]` (alias for extensions)
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
- `use(extension)`
- `removePlugin(key)`
- `destroy()`

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
