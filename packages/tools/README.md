![Lexion Logo](../../assets/images/logo.png)

This package is part of the Lexion framework-agnostic rich text editor.

Lexion is a framework-agnostic, headless rich text editor platform built on ProseMirror, designed to provide a shared core, reusable extensions, and framework-specific adapters.

# @lexion-rte/tools

Conversion utilities for Lexion editor documents.

## Overview

`@lexion-rte/tools` provides:

- `toText(editor)`
- `fromText(editor, text)`
- `toHTML(editor, context?)`
- `fromHTML(editor, html, context?)`

## Install

```bash
pnpm add @lexion-rte/tools @lexion-rte/core
```

Typical pairing:

```bash
pnpm add @lexion-rte/tools @lexion-rte/core @lexion-rte/extensions
```

## Browser Example

```ts
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/extensions";
import { fromText, toHTML, toText } from "@lexion-rte/tools";

const editor = new LexionEditor({ extensions: [starterKitExtension] });

fromText(editor, "Line one\n\nLine two");
console.log(toText(editor));
console.log(toHTML(editor));
```

## Server / Node Example

`toHTML` and `fromHTML` require a DOM `Document` when not running in the browser.

```ts
import { JSDOM } from "jsdom";
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/extensions";
import { fromHTML, toHTML } from "@lexion-rte/tools";

const dom = new JSDOM("<!doctype html><html><body></body></html>");
const editor = new LexionEditor({ extensions: [starterKitExtension] });

fromHTML(editor, "<p><strong>Hello</strong> world</p>", { document: dom.window.document });
const html = toHTML(editor, { document: dom.window.document });
console.log(html);
```

## Notes

- `fromText` creates paragraph blocks separated by blank lines.
- Single newlines inside a paragraph map to `hard_break` when supported by schema.
- Conversions depend on the active editor schema.
