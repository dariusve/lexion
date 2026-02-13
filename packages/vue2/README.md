# @lexion-rte/vue2

Vue 2 adapter utilities for Lexion.

## What It Is

`@lexion-rte/vue2` provides `createLexionVue2Adapter` for mounting and syncing a Lexion editor in Vue 2 lifecycle hooks.

## Install

```bash
pnpm add @lexion-rte/vue2 vue@^2.7.0
```

## Usage

```ts
import Vue from "vue";
import type { JSONDocument } from "@lexion-rte/core";
import { createLexionVue2Adapter } from "@lexion-rte/vue2";

export default Vue.extend({
  props: {
    value: Object as () => JSONDocument | undefined
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
  }
});
```

