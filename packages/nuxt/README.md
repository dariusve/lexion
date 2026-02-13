# @lexion-rte/nuxt

Nuxt adapter for Lexion.

## Overview

`@lexion-rte/nuxt` exports `LexionNuxtEditorView`, a Nuxt-friendly wrapper around the Vue adapter.

It is intended for client-side rendering in Nuxt.

## Install

```bash
pnpm add @lexion-rte/nuxt nuxt vue
```

## Usage with `ClientOnly`

```vue
<template>
  <ClientOnly>
    <LexionNuxtEditorView v-model="value" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { JSONDocument } from "@lexion-rte/core";
import { LexionNuxtEditorView } from "@lexion-rte/nuxt";

const value = ref<JSONDocument | undefined>(undefined);
</script>
```

## Props

- `editor?: LexionEditor`
- `modelValue?: JSONDocument`
- `defaultValue?: JSONDocument`
- `readOnly?: boolean`
- `className?: string`
- `style?: StyleValue`

## Emits

- `update:modelValue`
- `change`
- `ready`

## Notes

- Wrap with `<ClientOnly>` to avoid SSR DOM constraints.
- Prop and event behavior mirrors `@lexion-rte/vue`.
