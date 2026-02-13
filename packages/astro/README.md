# @lexion-rte/astro

Astro client-mount adapter for Lexion.

## What It Is

`@lexion-rte/astro` provides `LexionAstroAdapter` and `mountLexionAstroEditor` for mounting an editor in browser scripts.

## Install

```bash
pnpm add @lexion-rte/astro astro
```

## Usage

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

