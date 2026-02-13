# @lexion-rte/vue

Vue 3 adapter for Lexion.

## What It Is

`@lexion-rte/vue` exposes `LexionEditorView` with `v-model` support (`modelValue` / `update:modelValue`).

## Install

```bash
pnpm add @lexion-rte/vue vue
```

## Usage

```vue
<template>
  <LexionEditorView v-model="value" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { JSONDocument } from "@lexion-rte/core";
import { LexionEditorView } from "@lexion-rte/vue";

const value = ref<JSONDocument | undefined>(undefined);
</script>
```

