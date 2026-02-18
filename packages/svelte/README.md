![Lexion Logo](../../assets/images/logo.png)

This package is part of the Lexion framework-agnostic rich text editor.

Lexion is a framework-agnostic, headless rich text editor platform built on ProseMirror, designed to provide a shared core, reusable extensions, and framework-specific adapters.

# @lexion-rte/svelte

Svelte action adapter for Lexion.

## Overview

`@lexion-rte/svelte` exports the `lexion` action for declarative editor mounting.

Action options:

- `editor?: LexionEditor`
- `value?: JSONDocument`
- `defaultValue?: JSONDocument`
- `readOnly?: boolean`
- `onChange?: (value, editor) => void`
- `onReady?: (editor) => void`

## Install

```bash
pnpm add @lexion-rte/svelte svelte
```

## Basic Usage

```svelte
<script lang="ts">
  import type { JSONDocument } from "@lexion-rte/core";
  import { lexion } from "@lexion-rte/svelte";

  let value: JSONDocument | undefined = undefined;
</script>

<div
  use:lexion={{
    value,
    onChange: (nextValue) => {
      value = nextValue;
    }
  }}
></div>
```

## Read-only Toggle Example

```svelte
<script lang="ts">
  import { lexion } from "@lexion-rte/svelte";
  let readOnly = false;
</script>

<button on:click={() => (readOnly = !readOnly)}>Toggle read-only</button>
<div use:lexion={{ readOnly }}></div>
```

## Notes

- The action returns `update()` and `destroy()` automatically handled by Svelte.
- If the `editor` instance changes, the adapter recreates the web editor.
