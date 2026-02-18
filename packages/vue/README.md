![Lexion Logo](../../assets/images/logo.png)

This package is part of the Lexion framework-agnostic rich text editor.

Lexion is a framework-agnostic, headless rich text editor platform built on ProseMirror, designed to provide a shared core, reusable extensions, and framework-specific adapters.

# @lexion-rte/vue

Vue 3 adapter for Lexion.

## Overview

`@lexion-rte/vue` exports `LexionEditorView`, a Vue component with `v-model` support.

It supports:

- controlled mode (`modelValue`)
- uncontrolled mode (`defaultValue`)
- custom editor instances
- read-only mode

## Install

```bash
pnpm add @lexion-rte/vue vue
```

## Props

- `editor?: LexionEditor`
- `modelValue?: JSONDocument`
- `defaultValue?: JSONDocument`
- `readOnly?: boolean`
- `className?: string`
- `style?: StyleValue`

## Emits

- `update:modelValue` with `JSONDocument`
- `change` with `(value, editor)`
- `ready` with `(editor)`

## `v-model` Example

```vue
<template>
  <LexionEditorView v-model="value" :read-only="false" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { JSONDocument } from "@lexion-rte/core";
import { LexionEditorView } from "@lexion-rte/vue";

const value = ref<JSONDocument | undefined>(undefined);
</script>
```

## Uncontrolled Example

```ts
import { defineComponent, h } from "vue";
import { LexionEditorView } from "@lexion-rte/vue";

export default defineComponent({
  setup() {
    return () => h(LexionEditorView, { defaultValue: initialDoc });
  }
});
```

## Notes

- In controlled mode, update `modelValue` from `update:modelValue`.
- The component renders the shared footer message.
