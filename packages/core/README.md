# @lexion-rte/core

Headless editor runtime for the Lexion platform.

## Overview

`@lexion-rte/core` provides:

- editor state and schema management
- command registration/execution
- extension lifecycle hooks (`onCreate`, `onDestroy`)
- JSON document input/output

This package does not render UI by itself. Pair it with `@lexion-rte/extensions` and optionally an adapter package.

## Install

```bash
pnpm add @lexion-rte/core
```

Typical pairing:

```bash
pnpm add @lexion-rte/core @lexion-rte/extensions
```

## Quick Start

```ts
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension, starterKitCommandNames } from "@lexion-rte/extensions";

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
import { starterKitExtension } from "@lexion-rte/extensions";

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

## Error Behavior

- Executing an unknown command throws `Unknown command: <name>`.
- Using an editor after `destroy()` throws an error.
- Registering duplicate command names throws.

## Related Packages

- `@lexion-rte/extensions` for starter-kit, AI, and collaboration features
- `@lexion-rte/tools` for HTML/text conversions
- adapter packages (`web`, `react`, `vue`, etc.) for UI integration
