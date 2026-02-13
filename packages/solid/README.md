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
