# @lexion-rte/solid

SolidJS adapter utilities for Lexion.

## What It Is

`@lexion-rte/solid` provides `createLexionSolidAdapter` for mounting and controlling the editor from Solid lifecycle hooks.

## Install

```bash
pnpm add @lexion-rte/solid solid-js
```

## Usage

```ts
import { createSignal, createEffect, onCleanup, onMount } from "solid-js";
import type { JSONDocument } from "@lexion-rte/core";
import { createLexionSolidAdapter } from "@lexion-rte/solid";

const [value, setValue] = createSignal<JSONDocument | undefined>(undefined);
const adapter = createLexionSolidAdapter({
  onChange: (nextValue) => setValue(nextValue)
});

let host!: HTMLDivElement;

onMount(() => adapter.mount(host));
onCleanup(() => adapter.destroy());

createEffect(() => {
  const nextValue = value();
  if (nextValue) {
    adapter.update({ value: nextValue });
  }
});
```

