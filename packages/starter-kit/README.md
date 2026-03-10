![Lexion Logo](../../assets/images/logo.png)

This package is part of the Lexion framework-agnostic rich text editor.

Lexion is an open-core, framework-agnostic, headless rich text editor platform built on ProseMirror.

# @lexion-rte/starter-kit

Community starter-kit extensions for Lexion.

## Overview

`@lexion-rte/starter-kit` ships:

- the starter-kit schema
- default editing commands
- the base ProseMirror history and keymap plugins

Commercial features such as AI and collaboration live in separate premium packages.

Use this package when you want the baseline Lexion editing experience without adding commercial extensions.

## Install

```bash
pnpm add @lexion-rte/starter-kit @lexion-rte/core
```

## What It Includes

The starter kit provides:

- paragraphs
- headings
- bold
- italic
- inline code
- strikethrough
- underline
- blockquotes
- code blocks
- links
- bullet lists
- ordered lists
- horizontal rules
- hard breaks
- list indent and outdent commands
- undo and redo
- list keyboard shortcuts for split, indent, and outdent
- gap cursor navigation between block nodes
- drop cursor feedback during drag and drop
- automatic trailing paragraph after block content

It also provides the default ProseMirror history plugin, base keymap, list keymap plugin, gap cursor plugin, drop cursor plugin, and trailing node plugin so a new editor instance is usable immediately.

## Exports

- `starterKitExtension`
- `starterKitSchema`
- `createStarterKitSchema()`
- `createStarterKitCommands()`
- `starterKitCommandNames`

## Default Plugins

`starterKitExtension` enables these ProseMirror plugins by default:

- `history()`
- `keymap(baseKeymap)`
- `createListKeymapPlugin(schema)`
- `gapCursor()`
- `dropCursor()`
- `createTrailingNodePlugin()`

## Command Names

`starterKitCommandNames` includes:

- `setParagraph`
- `toggleHeading`
- `toggleBold`
- `toggleItalic`
- `toggleCode`
- `toggleStrike`
- `toggleUnderline`
- `toggleBlockquote`
- `toggleCodeBlock`
- `wrapBulletList`
- `wrapOrderedList`
- `liftListItem`
- `sinkListItem`
- `setLink`
- `unsetLink`
- `insertHorizontalRule`
- `insertHardBreak`
- `undo`
- `redo`

## Command Reference

| Command | Args | Description | Notes |
| --- | --- | --- | --- |
| `setParagraph` | none | Sets the current block to a paragraph. | Useful after headings, blockquotes, or code blocks. |
| `toggleHeading` | `level: 1..6` | Sets the current block to the requested heading level. | Use toolbar buttons such as `H1`, `H2`, or `H3` to pass the level. |
| `toggleBold` | none | Toggles bold formatting on the current selection. | Requires a text selection for visible effect. |
| `toggleItalic` | none | Toggles italic formatting on the current selection. | Requires a text selection for visible effect. |
| `toggleCode` | none | Toggles inline code formatting on the current selection. | Best used on short inline text spans. |
| `toggleStrike` | none | Toggles strikethrough formatting on the current selection. | Requires a text selection for visible effect. |
| `toggleUnderline` | none | Toggles underline formatting on the current selection. | Requires a text selection for visible effect. |
| `toggleBlockquote` | none | Wraps the current block in a blockquote, or lifts it back out. | Use when the cursor is inside a text block. |
| `toggleCodeBlock` | none | Converts the current block to a code block, or back to paragraph. | Good for fenced-code style editing flows. |
| `wrapBulletList` | none | Wraps the current selection in a bullet list. | Creates list structure from the active block. |
| `wrapOrderedList` | none | Wraps the current selection in an ordered list. | Creates numbered list structure from the active block. |
| `liftListItem` | none | Moves the current list item one level out. | Most useful when the cursor is already inside a list item. |
| `sinkListItem` | none | Moves the current list item one level deeper. | Most useful when the cursor is already inside a list item. |
| `setLink` | `{ href: string; title?: string \| null }` | Applies a link mark to the current selection. | Returns `false` if the selection is empty or the payload is invalid. |
| `unsetLink` | none | Removes the link mark from the current selection range. | Works on the selected text range. |
| `insertHorizontalRule` | none | Inserts a horizontal rule at the current selection. | Useful for section breaks. |
| `insertHardBreak` | none | Inserts a hard line break. | Useful inside paragraphs or list items. |
| `undo` | none | Reverts the last history step. | Powered by the history plugin. |
| `redo` | none | Reapplies the last undone history step. | Powered by the history plugin. |

## Basic Example

```ts
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension, starterKitCommandNames } from "@lexion-rte/starter-kit";

const editor = new LexionEditor({ extensions: [starterKitExtension] });

editor.execute(starterKitCommandNames.toggleHeading, 2);
editor.execute(starterKitCommandNames.toggleBold);
editor.execute(starterKitCommandNames.toggleStrike);
editor.execute(starterKitCommandNames.toggleCodeBlock);
editor.execute(starterKitCommandNames.setLink, {
  href: "https://example.com",
  title: "Example"
});
```

## Creating an Editor With Initial Content

```ts
import { LexionEditor, type JSONDocument } from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/starter-kit";

const initialDocument: JSONDocument = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text: "Hello from Lexion" }]
    }
  ]
};

const editor = new LexionEditor({
  doc: initialDocument,
  extensions: [starterKitExtension]
});
```

## Using the Command API

`toggleHeading` expects a heading level number from `1` to `6`:

```ts
editor.execute(starterKitCommandNames.toggleHeading, 2);
```

`setLink` expects a non-empty selection and a link payload:

```ts
editor.execute(starterKitCommandNames.setLink, {
  href: "https://lexion.dev",
  title: "Lexion"
});
```

Inline formatting commands can be combined on the current selection:

```ts
editor.execute(starterKitCommandNames.toggleUnderline);
editor.execute(starterKitCommandNames.toggleStrike);
```

List commands operate on the current selection:

```ts
editor.execute(starterKitCommandNames.wrapBulletList);
editor.execute(starterKitCommandNames.sinkListItem);
editor.execute(starterKitCommandNames.liftListItem);
```

`sinkListItem` nests the current list item under its previous sibling, so it only succeeds when the cursor is in a non-first list item.

Inside lists, the starter-kit also wires keyboard behavior by default:

- `Enter` splits the current list item
- `Tab` indents into a nested list item
- `Shift-Tab` outdents the current list item

You can also insert structural content:

```ts
editor.execute(starterKitCommandNames.insertHorizontalRule);
editor.execute(starterKitCommandNames.insertHardBreak);
```

## Schema and Command Factories

Use the factories if you want direct access to the schema or command map without importing the ready-made extension object:

```ts
import { createStarterKitCommands, createStarterKitSchema } from "@lexion-rte/starter-kit";

const schema = createStarterKitSchema();
const commands = createStarterKitCommands();
```

In most app code, `starterKitExtension` is the simplest option.

## Migration

If you previously used `@lexion-rte/extensions`, migrate community starter-kit imports like this:

```ts
import { starterKitExtension, starterKitCommandNames } from "@lexion-rte/starter-kit";
```

AI and collaboration are no longer shipped in this package.

## Related Docs

- root package and architecture overview: [README](../../README.md)
- extension API reference: [docs/EXTENSIONS_REFERENCE.md](../../docs/EXTENSIONS_REFERENCE.md)
- package surface reference: [docs/PACKAGE_APIS.md](../../docs/PACKAGE_APIS.md)
