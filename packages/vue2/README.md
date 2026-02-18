![Lexion Logo](../../assets/images/logo.png)

This package is part of the Lexion framework-agnostic rich text editor.

Lexion is a framework-agnostic, headless rich text editor platform built on ProseMirror, designed to provide a shared core, reusable extensions, and framework-specific adapters.

# @lexion-rte/vue2

Vue 2 adapter utilities for Lexion.

## Overview

`@lexion-rte/vue2` provides an imperative adapter class for Vue 2 lifecycle usage.

Primary API:

- `createLexionVue2Adapter(options?)`
- `LexionVue2Adapter`

## Install

```bash
pnpm add @lexion-rte/vue2 vue@^2.7.0
```

## Adapter Methods

- `mount(element)`
- `update({ value?, readOnly?, onChange? })`
- `setValue(value)`
- `setReadOnly(readOnly)`
- `execute(command, ...args)`
- `destroy()`
- `editor` getter

## Vue 2 Options API Example

```ts
import Vue from "vue";
import type { JSONDocument } from "@lexion-rte/core";
import { createLexionVue2Adapter } from "@lexion-rte/vue2";

export default Vue.extend({
  props: {
    value: {
      type: Object as () => JSONDocument | undefined,
      default: undefined
    }
  },
  data() {
    return {
      adapter: createLexionVue2Adapter({
        onChange: (nextValue) => this.$emit("input", nextValue)
      })
    };
  },
  mounted() {
    this.adapter.mount(this.$el as HTMLElement);
  },
  beforeDestroy() {
    this.adapter.destroy();
  },
  watch: {
    value(nextValue: JSONDocument | undefined) {
      if (nextValue) {
        this.adapter.update({ value: nextValue });
      }
    }
  },
  render(h) {
    return h("div");
  }
});
```

## Notes

- Call `destroy()` in `beforeDestroy` to avoid leaked view instances.
- `execute()` throws if called before `mount()`.
