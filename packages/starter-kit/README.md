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
- links
- bullet lists
- ordered lists
- list indent and outdent commands
- undo and redo

It also provides the default ProseMirror history plugin and base keymap so a new editor instance is usable immediately.

## Exports

- `starterKitExtension`
- `starterKitSchema`
- `createStarterKitSchema()`
- `createStarterKitCommands()`
- `starterKitCommandNames`

## Command Names

`starterKitCommandNames` includes:

- `setParagraph`
- `toggleHeading`
- `toggleBold`
- `toggleItalic`
- `wrapBulletList`
- `wrapOrderedList`
- `liftListItem`
- `sinkListItem`
- `setLink`
- `unsetLink`
- `undo`
- `redo`

## Basic Example

```ts
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension, starterKitCommandNames } from "@lexion-rte/starter-kit";

const editor = new LexionEditor({ extensions: [starterKitExtension] });

editor.execute(starterKitCommandNames.toggleHeading, 2);
editor.execute(starterKitCommandNames.toggleBold);
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

List commands operate on the current selection:

```ts
editor.execute(starterKitCommandNames.wrapBulletList);
editor.execute(starterKitCommandNames.sinkListItem);
editor.execute(starterKitCommandNames.liftListItem);
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
