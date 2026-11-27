![Lexion Logo](../../assets/images/logo.png)

This package is part of the Lexion framework-agnostic rich text editor.

Lexion is a framework-agnostic, headless rich text editor platform built on ProseMirror, designed to provide a shared core, reusable extensions, and framework-specific adapters.

# @lexion-rte/solid

SolidJS adapter utilities for Lexion.

## Overview

`@lexion-rte/solid` provides an imperative adapter for Solid lifecycle integration.

## Install

```bash
pnpm add @lexion-rte/solid solid-js
```

## API

- `createLexionSolidAdapter(options?)`
- `LexionSolidAdapter`

Methods:

- `mount(element)`
- `update({ value?, readOnly?, onChange? })`
- `setValue(value)`
- `setReadOnly(readOnly)`
- `execute(command, ...args)`
- `destroy()`
- `editor` getter

Options also accept `ariaLabel` / `ariaLabelledBy` (set at creation) for the accessible name of the editable area, which has `role="textbox"` and `aria-multiline="true"`. `onChange` fires only when the document changes; values set through `value` / `update()` are not echoed back.

## Solid Integration Example

```ts
import { createSignal, createEffect, onCleanup, onMount } from "solid-js";
import type { JSONDocument } from "@lexion-rte/core";
import { createLexionSolidAdapter } from "@lexion-rte/solid";

const [value, setValue] = createSignal<JSONDocument | undefined>(undefined);
const adapter = createLexionSolidAdapter({
  onChange: (nextValue) => setValue(nextValue)
});

let host!: HTMLDivElement;

onMount(() => {
  adapter.mount(host);
});

createEffect(() => {
  const nextValue = value();
  if (nextValue) {
    adapter.update({ value: nextValue });
  }
});

onCleanup(() => {
  adapter.destroy();
});
```

## Notes

- Always call `destroy()` on cleanup.
- `execute()` throws if the adapter is not mounted.
