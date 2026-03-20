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
- `onChange?: (value, editor) => void`
- `onReady?: (editor) => void`

## Instance API

- `editor`
- `getJSON()`
- `focus()`
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
- The adapter renders an editor status bar and includes the core branding item: `Powered by lexion`.
- Base editor styles are injected automatically. Set `injectStyles: false` if you want to provide your own ProseMirror CSS.
