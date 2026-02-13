# @lexion-rte/extensions

Feature extension bundle for Lexion.

## Overview

`@lexion-rte/extensions` ships:

- starter-kit schema and commands
- AI extension primitives (`AIService`, `aiExtension`)
- collaboration extension primitives (`createCollaborationExtension`)

## Install

```bash
pnpm add @lexion-rte/extensions @lexion-rte/core
```

For collaboration features:

```bash
pnpm add yjs y-protocols y-prosemirror
```

## Exports

- `starterKitExtension`
- `starterKitSchema`
- `createStarterKitSchema()`
- `createStarterKitCommands()`
- `starterKitCommandNames`
- `aiExtension`, `aiCommandNames`, `AIService`, `createAIService()`
- `createCollaborationExtension()`, `collaborationCommandNames`

## Starter Kit Commands

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

## Starter Kit Example

```ts
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension, starterKitCommandNames } from "@lexion-rte/extensions";

const editor = new LexionEditor({ extensions: [starterKitExtension] });

editor.execute(starterKitCommandNames.toggleHeading, { level: 2 });
editor.execute(starterKitCommandNames.toggleBold);
editor.execute(starterKitCommandNames.setLink, {
  href: "https://example.com",
  title: "Example"
});
```

## AI Service Example

```ts
import { LexionEditor } from "@lexion-rte/core";
import { AIService, aiExtension, starterKitExtension } from "@lexion-rte/extensions";

const editor = new LexionEditor({
  extensions: [starterKitExtension, aiExtension]
});

const service = new AIService({
  async generate({ prompt, selection }) {
    return `Prompt: ${prompt}\nSelection: ${selection}`;
  }
});

await service.generateAndApply(editor, "Rewrite this paragraph clearly");
```

## Collaboration Example

```ts
import { LexionEditor } from "@lexion-rte/core";
import {
  createCollaborationExtension,
  collaborationCommandNames,
  starterKitExtension
} from "@lexion-rte/extensions";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";

const ydoc = new Y.Doc();
const awareness = new Awareness(ydoc);
const fragment = ydoc.getXmlFragment("lexion");

const editor = new LexionEditor({
  extensions: [starterKitExtension, createCollaborationExtension({ fragment, awareness })]
});

editor.execute(collaborationCommandNames.undo);
```
