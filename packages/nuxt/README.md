# @lexion-rte/nuxt

Nuxt adapter for Lexion.

## What It Is

`@lexion-rte/nuxt` exports `LexionNuxtEditorView` for client-side Nuxt usage with `v-model`.

## Install

```bash
pnpm add @lexion-rte/nuxt nuxt vue
```

## Usage

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

