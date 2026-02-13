# @lexion-rte/web

Vanilla JavaScript adapter for Lexion.

## What It Is

`@lexion-rte/web` mounts a ProseMirror-backed editor into a DOM element and exposes a small imperative API.

## Install

```bash
pnpm add @lexion-rte/web
```

## Usage

```ts
import { createLexionWebEditor } from "@lexion-rte/web";

const host = document.getElementById("editor");
if (!host) throw new Error("Missing #editor");

const editor = createLexionWebEditor({
  element: host,
  onChange: (value) => {
    console.log(value);
  }
});

editor.execute("toggleBold");
```

