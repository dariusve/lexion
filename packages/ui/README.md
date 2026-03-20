![Lexion Logo](../../assets/images/logo.png)

This package is part of the Lexion framework-agnostic rich text editor.

Lexion is a framework-agnostic, headless rich text editor platform built on ProseMirror, designed to provide a shared core, reusable extensions, and framework-specific adapters.

# @lexion-rte/ui

Toolbar UI primitives for Lexion integrations.

## Overview

`@lexion-rte/ui` provides a toolbar area with icon-first buttons and command wiring to `@lexion-rte/core`.

It supports:

- command execution through `editor.execute(...)`
- automatic focus restoration through `editor.focus?.()` before command execution
- item management methods (`setItems`, `addItem`, `updateItem`, `removeItem`)
- icon states: `enabled`, `disabled`, `hidden`
- Remix Icon class names (for example `ri-bold`)

## Install

```bash
pnpm add @lexion-rte/ui remixicon
```

## Example 1: Minimal Toolbar

```ts
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/starter-kit";
import {
  createLexionToolbar,
  createToolbarSeparatorItem,
  lexionToolbarIcons,
  injectLexionToolbarStyles
} from "@lexion-rte/ui";

import "remixicon/fonts/remixicon.css";

injectLexionToolbarStyles();

const editor = new LexionEditor({ extensions: [starterKitExtension] });
const toolbarHost = document.getElementById("toolbar");
if (!toolbarHost) throw new Error("Missing #toolbar");

const toolbar = createLexionToolbar({
  element: toolbarHost,
  editor,
  items: [
    { id: "bold", iconClass: lexionToolbarIcons.bold, label: "Bold", command: "toggleBold" },
    { id: "italic", iconClass: lexionToolbarIcons.italic, label: "Italic", command: "toggleItalic" },
    createToolbarSeparatorItem("sep-main"),
    { id: "undo", iconClass: lexionToolbarIcons.undo, label: "Undo", command: "undo" }
  ]
});
```

## Example 2: Full Starter-kit Preset

```ts
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/starter-kit";
import {
  createLexionToolbar,
  createStarterKitToolbarItems,
  injectLexionToolbarStyles
} from "@lexion-rte/ui";

import "remixicon/fonts/remixicon.css";

injectLexionToolbarStyles();

const editor = new LexionEditor({ extensions: [starterKitExtension] });

const toolbar = createLexionToolbar({
  element: document.getElementById("toolbar")!,
  editor,
  items: createStarterKitToolbarItems({ withLabels: true })
});

// Example state changes
toolbar.disableItem("redo");
toolbar.hideItem("unset-link");
```

## Example 3: Group Buttons in a Dropdown

```ts
const toolbar = createLexionToolbar({
  element: document.getElementById("toolbar")!,
  editor,
  items: [
    {
      id: "inline-format",
      iconClass: lexionToolbarIcons.textFormat,
      title: "Inline format",
      items: [
        { id: "bold", iconClass: lexionToolbarIcons.bold, label: "Bold", command: "toggleBold" },
        { id: "italic", iconClass: lexionToolbarIcons.italic, label: "Italic", command: "toggleItalic" },
        { id: "underline", iconClass: lexionToolbarIcons.underline, label: "Underline", command: "toggleUnderline" }
      ]
    }
  ]
});
```

Each dropdown row renders the icon + command name.

## Example 4: Dynamic Enabled/Disabled/Hidden States

```ts
import type { LexionToolbar } from "@lexion-rte/ui";

function applyToolbarPolicy(toolbar: LexionToolbar, canEdit: boolean, canLink: boolean): void {
  toolbar.setItemStates({
    bold: canEdit ? "enabled" : "disabled",
    italic: canEdit ? "enabled" : "disabled",
    "set-link": canLink ? "enabled" : "hidden",
    "unset-link": canLink ? "enabled" : "hidden"
  });
}
```

## Example 5: Add Visual Separators (No Dropdown)

```ts
toolbar.setItems([
  { id: "bold", iconClass: lexionToolbarIcons.bold, title: "Bold", command: "toggleBold" },
  { id: "italic", iconClass: lexionToolbarIcons.italic, title: "Italic", command: "toggleItalic" },
  { id: "sep-inline-actions", separator: true },
  { id: "undo", iconClass: lexionToolbarIcons.undo, title: "Undo", command: "undo" },
  { id: "redo", iconClass: lexionToolbarIcons.redo, title: "Redo", command: "redo" }
]);
```

## Example 6: Add/Update/Remove Items at Runtime

```ts
toolbar.addItem({
  id: "save",
  iconClass: lexionToolbarIcons.save,
  label: "Save",
  title: "Save document",
  onClick: () => {
    console.log("saved");
    return false; // stop command execution path
  }
});

toolbar.updateItem("save", {
  iconClass: lexionToolbarIcons.check,
  label: "Saved",
  state: "disabled"
});

toolbar.removeItem("save");
```

## Example 7: Integrate with `@lexion-rte/web`

```ts
import { createLexionWebEditor } from "@lexion-rte/web";
import {
  createLexionToolbar,
  createStarterKitToolbarItems,
  injectLexionToolbarStyles
} from "@lexion-rte/ui";

import "remixicon/fonts/remixicon.css";

injectLexionToolbarStyles();

const editorHost = document.getElementById("editor")!;
const toolbarHost = document.getElementById("toolbar")!;

const webEditor = createLexionWebEditor({
  element: editorHost
});

const toolbar = createLexionToolbar({
  element: toolbarHost,
  editor: webEditor,
  items: createStarterKitToolbarItems({ withLabels: false }),
  onItemExecute: (event) => {
    console.log(`toolbar: ${event.item.id}, executed: ${event.executed}`);
  }
});

// cleanup
window.addEventListener("beforeunload", () => {
  toolbar.destroy();
  webEditor.destroy();
});
```

## Example 8: Inject Styles into a Specific Document

Useful for iframes or custom document roots.

```ts
const iframeDocument = iframe.contentDocument;
if (!iframeDocument) throw new Error("Iframe document not ready");

injectLexionToolbarStyles({
  document: iframeDocument,
  id: "lexion-toolbar-ui-styles"
});
```

## API

### `LexionToolbarOptions`

- `element: HTMLElement` (required)
- `editor?: { execute(command, ...args): boolean; focus?(): void }`
- `items?: LexionToolbarItemInput[]`
- `className?: string`
- `onItemExecute?: (event) => void`

`LexionToolbarItemInput` supports:

- command button item (`command`, `args`, `label`, `iconClass`, ...)
- dropdown group item (`items`) where each nested item has `iconClass` + `label` + command config
- separator item (`separator: true`) for visual grouping in the same toolbar row

### `LexionToolbarItemState`

- `"enabled"`
- `"disabled"`
- `"hidden"`

### `LexionToolbar` methods

- `setEditor(editor | null)`
- `getItems()`
- `setItems(items)`
- `addItem(item, index?)`
- `updateItem(id, update)`
- `removeItem(id)`
- `clearItems()`
- `setItemState(id, state)`
- `setItemStates(record)`
- `enableItem(id)`
- `disableItem(id)`
- `hideItem(id)`
- `showItem(id, state?)`
- `destroy()`

### Styling helpers

- `lexionToolbarStyles`
- `injectLexionToolbarStyles(options?)`
- `lexionToolbarAppearance`

### Starter-kit preset

- `createStarterKitToolbarItems(options?)`
- `createToolbarSeparatorItem(id, state?)`
- `lexionToolbarIcons`
