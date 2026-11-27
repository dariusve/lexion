![Lexion Logo](../../assets/images/logo.png)

This package is part of the Lexion framework-agnostic rich text editor.

Lexion is a framework-agnostic, headless rich text editor platform built on ProseMirror, designed to provide a shared core, reusable extensions, and framework-specific adapters.

# @lexion-rte/web

Vanilla DOM adapter for Lexion.

## Overview

`@lexion-rte/web` mounts a ProseMirror editor into a DOM element and exposes an imperative API.

It supports:

- controlled and uncontrolled usage
- read-only toggling
- command execution
- automatic ProseMirror base style injection (`white-space: pre-wrap`, etc.)
- lifecycle cleanup

## Install

```bash
pnpm add @lexion-rte/web
```

## Quick Start

```ts
import { createLexionWebEditor } from "@lexion-rte/web";

const host = document.getElementById("editor");
if (!host) throw new Error("Missing #editor host");

const editor = createLexionWebEditor({
  element: host,
  onChange: (value) => {
    console.log("changed", value);
  }
});
```

## Options

`createLexionWebEditor(options)` options:

- `element: HTMLElement` (required)
- `editor?: LexionEditor`
- `value?: JSONDocument` (controlled)
- `defaultValue?: JSONDocument` (uncontrolled init)
- `readOnly?: boolean`
- `injectStyles?: boolean` (default `true`)
- `styleInjectionOptions?: { document?: Document; id?: string; target?: HTMLElement }`
- `onChange?: (value, editor) => void` (only when the document changes; values passed through `value` / `setValue()` are not echoed back)
- `onReady?: (editor) => void`
- `ariaLabel?: string` / `ariaLabelledBy?: string` (accessible name of the editable area, which has `role="textbox"` and `aria-multiline="true"`)

## Instance API

- `editor`
- `getJSON()`
- `focus()`
- `execute(command, ...args)`
- `setValue(value)`
- `setReadOnly(readOnly)`
- `update({ value?, readOnly?, onChange?, ariaLabel?, ariaLabelledBy? })` (only the fields passed change)
- `destroy()`

## Building Your Own Adapter: `LexionViewController`

`LexionViewController` is the framework-agnostic core every Lexion adapter is built on. It mounts a ProseMirror view for a `LexionEditor` and handles the editor subscription, controlled-value sync, change emission, read-only state, ARIA attributes and stylesheet injection. Render the status bar yourself from `onStatusBarChange`:

```ts
import { LexionViewController } from "@lexion-rte/web";
import { splitStatusBarItems } from "@lexion-rte/core";

const controller = new LexionViewController({
  element,
  defaultValue,
  ariaLabel: "Message body",
  onChange: (value) => save(value),
  onStatusBarChange: (items) => render(splitStatusBarItems(items))
});

controller.setValue(nextValue); // controlled updates
controller.setReadOnly(true);
controller.destroy(); // also destroys the editor if the controller created it
```

## Styling and Theming

The injected stylesheet (`lexionWebEditorStyles`) includes the status bar styles from `@lexion-rte/core`. They use zero-specificity `:where()` selectors, so your own rules for `.lexion-editor-status-bar`, `.lexion-editor-status-bar-group`, `.lexion-editor-status-item` and `.lexion-editor-status-item--branding` always win. For small changes, set these custom properties:

- `--lexion-status-bar-font-size` (default `11px`)
- `--lexion-status-bar-color`
- `--lexion-status-bar-background`
- `--lexion-status-bar-border-color`
- `--lexion-status-bar-padding`

To hide or change the "Powered by lexion" item, pass `branding: false` or `branding: { text, align, className, style }` to the `LexionEditor` constructor.

## Controlled Example

```ts
import { createLexionWebEditor } from "@lexion-rte/web";

const webEditor = createLexionWebEditor({
  element: document.getElementById("editor")!,
  value: initialDoc
});

webEditor.update({ value: nextDoc, readOnly: false });
```

## Notes

- If you pass a custom `editor`, the adapter will not destroy that editor on `destroy()`.
- The adapter renders an editor status bar and includes the core branding item: `Powered by lexion`. Pass `branding: false` (or `{ text, align, className, style }`) to the `LexionEditor` constructor to hide or change it.
- The view updates when the editor changes from outside it, e.g. `editor.execute()` from a toolbar or another view sharing the same editor.
- Base editor styles are injected automatically. Set `injectStyles: false` if you want to provide your own ProseMirror CSS.
