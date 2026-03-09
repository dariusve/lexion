# Extensions Reference

This document is the canonical API reference for the Lexion extension packages.

## Community Package: `@lexion-rte/starter-kit`

| Export | Kind | Description |
| --- | --- | --- |
| `starterKitCommandNames` | `const` | Command name map for starter-kit feature commands. |
| `createStarterKitCommands` | `function` | Builds the starter-kit command map. |
| `createStarterKitSchema` | `function` | Builds the starter-kit ProseMirror schema. |
| `starterKitSchema` | `const` | Ready-to-use starter-kit schema instance. |
| `starterKitExtension` | `const` | Starter-kit `LexionExtension` (schema + commands + PM plugins). |
| `HeadingAttributes` | `type` | Heading command attribute type (`level: 1..6`). |
| `LinkAttributes` | `type` | Link command attribute type (`href`, `title?`). |

## Starter Kit

### `starterKitExtension`

| Property | Type | Value/Behavior |
| --- | --- | --- |
| `key` | `string` | `"starter-kit"` |
| `schema` | `Schema` | `starterKitSchema` |
| `commands` | `() => CommandMap` | Returns `createStarterKitCommands()` |
| `prosemirrorPlugins` | `() => Plugin[]` | Returns `[history(), keymap(baseKeymap)]` |

### Starter-Kit Commands

| Name (`starterKitCommandNames.*`) | Command ID | Args | Behavior |
| --- | --- | --- | --- |
| `setParagraph` | `"setParagraph"` | none | Sets block type to paragraph. |
| `toggleHeading` | `"toggleHeading"` | `level: number` (`1..6`) | Sets block type to heading with provided level. |
| `toggleBold` | `"toggleBold"` | none | Toggles `strong` mark in selection. |
| `toggleItalic` | `"toggleItalic"` | none | Toggles `em` mark in selection. |
| `wrapBulletList` | `"wrapBulletList"` | none | Wraps selection in bullet list. |
| `wrapOrderedList` | `"wrapOrderedList"` | none | Wraps selection in ordered list. |
| `liftListItem` | `"liftListItem"` | none | Lifts current list item one level. |
| `sinkListItem` | `"sinkListItem"` | none | Sinks current list item one level. |
| `setLink` | `"setLink"` | `LinkAttributes` | Applies link mark to non-empty selection. |
| `unsetLink` | `"unsetLink"` | none | Removes link mark in selection range. |
| `undo` | `"undo"` | none | Executes history undo. |
| `redo` | `"redo"` | none | Executes history redo. |

### Starter-Kit Types

| Type | Shape |
| --- | --- |
| `HeadingAttributes` | `{ level: 1 \| 2 \| 3 \| 4 \| 5 \| 6 }` |
| `LinkAttributes` | `{ href: string; title?: string \| null }` |

### Starter-Kit Example

```ts
import { LexionEditor } from "@lexion-rte/core";
import {
  starterKitCommandNames,
  starterKitExtension
} from "@lexion-rte/starter-kit";

const editor = new LexionEditor({
  extensions: [starterKitExtension]
});

editor.execute(starterKitCommandNames.setParagraph);
editor.execute(starterKitCommandNames.toggleHeading, 3);
editor.execute(starterKitCommandNames.toggleBold);
editor.execute(starterKitCommandNames.wrapBulletList);
editor.execute(starterKitCommandNames.undo);
```

## Commercial Extensions

Commercial extension implementations are intentionally not documented in this public repository.

The public extension API surface ends with the community starter kit. Commercial features are built privately against the same extension contracts.

### Svelte (`.svelte`)
```svelte
<script lang="ts">
  import type { JSONDocument } from "@lexion-rte/core";
  import { lexion } from "@lexion-rte/svelte";

  let value: JSONDocument | undefined = undefined;
</script>

<div use:lexion={{ value, onChange: (nextValue) => (value = nextValue) }}></div>
```
