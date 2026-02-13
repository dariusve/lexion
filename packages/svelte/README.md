# @lexion-rte/svelte

Svelte action adapter for Lexion.

## What It Is

`@lexion-rte/svelte` exports a `lexion` action for mounting and updating an editor on an element.

## Install

```bash
pnpm add @lexion-rte/svelte svelte
```

## Usage

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

