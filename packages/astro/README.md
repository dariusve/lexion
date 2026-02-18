![Lexion Logo](../../assets/images/logo.png)

This package is part of the Lexion framework-agnostic rich text editor.

Lexion is a framework-agnostic, headless rich text editor platform built on ProseMirror, designed to provide a shared core, reusable extensions, and framework-specific adapters.

# @lexion-rte/astro

Astro client-side mounting adapter for Lexion.

## Overview

`@lexion-rte/astro` provides:

- `LexionAstroAdapter` class
- `mountLexionAstroEditor({ element, ...options })` helper

Use it in client scripts where DOM APIs are available.

## Install

```bash
pnpm add @lexion-rte/astro astro
```

## Quick Usage

```astro
---
const editorId = "lexion-editor";
---

<div id={editorId}></div>
<script>
  import { mountLexionAstroEditor } from "@lexion-rte/astro";

  const element = document.getElementById("lexion-editor");
  if (element) {
    const adapter = mountLexionAstroEditor({ element });
    window.addEventListener("beforeunload", () => adapter.destroy(), { once: true });
  }
</script>
```

## Adapter Methods

- `mount(element)`
- `update({ value?, readOnly?, onChange? })`
- `execute(command, ...args)`
- `destroy()`
- `editor` getter

## Notes

- Mount only on the client.
- Re-mounting recreates the underlying web editor instance.
