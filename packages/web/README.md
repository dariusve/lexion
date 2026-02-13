# @lexion-rte/web

Vanilla DOM adapter for Lexion.

## Overview

`@lexion-rte/web` mounts a ProseMirror editor into a DOM element and exposes an imperative API.

It supports:

- controlled and uncontrolled usage
- read-only toggling
- command execution
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
- `onChange?: (value, editor) => void`
- `onReady?: (editor) => void`

## Instance API

- `editor`
- `getJSON()`
- `execute(command, ...args)`
- `setValue(value)`
- `setReadOnly(readOnly)`
- `update({ value?, readOnly?, onChange? })`
- `destroy()`

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
- The adapter renders a footer bar with text: `Open Source Limited Version`.
