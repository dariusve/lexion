# Adapter Examples

This guide shows practical patterns for adding a toolbar and creating a custom adapter without moving editor business logic outside core/extensions.

## Web Toolbar Example

Use `@lexion/web` plus starter-kit command names:

```ts
import { starterKitCommandNames } from "@lexion/extensions";
import { createLexionWebEditor } from "@lexion/web";

const editor = createLexionWebEditor({
  element: document.getElementById("editor")!
});

const boldButton = document.getElementById("toolbar-bold") as HTMLButtonElement;
boldButton.addEventListener("click", () => {
  editor.execute(starterKitCommandNames.toggleBold);
});
```

## Sample Adapter Class

A minimal adapter composes:
1. toolbar DOM
2. editor mount DOM
3. command bindings

```ts
import type { JSONDocument } from "@lexion/core";
import { starterKitCommandNames } from "@lexion/extensions";
import { createLexionWebEditor } from "@lexion/web";

export class MyToolbarAdapter {
  private readonly editor;

  constructor(element: HTMLElement, value?: JSONDocument) {
    const editorHost = document.createElement("div");
    const toolbar = document.createElement("div");

    element.append(toolbar, editorHost);

    this.editor = createLexionWebEditor({
      element: editorHost,
      defaultValue: value
    });

    const bold = document.createElement("button");
    bold.textContent = "Bold";
    bold.onclick = () => {
      this.editor.execute(starterKitCommandNames.toggleBold);
    };

    toolbar.appendChild(bold);
  }

  destroy(): void {
    this.editor.destroy();
  }
}
```

## React Toolbar Pattern

Use an external `LexionEditor` so toolbar and editor view share one instance:

```tsx
import { useMemo } from "react";
import { LexionEditor } from "@lexion/core";
import { starterKitExtension, starterKitCommandNames } from "@lexion/extensions";
import { LexionEditorView } from "@lexion/react";

export const ReactToolbarExample = () => {
  const editor = useMemo(
    () => new LexionEditor({ extensions: [starterKitExtension] }),
    []
  );

  return (
    <>
      <button onClick={() => editor.execute(starterKitCommandNames.toggleBold)}>Bold</button>
      <LexionEditorView editor={editor} />
    </>
  );
};
```

## Vue Toolbar Pattern

Use the same external `LexionEditor` instance from setup state:

```ts
import { defineComponent, h } from "vue";
import { LexionEditor } from "@lexion/core";
import { starterKitExtension, starterKitCommandNames } from "@lexion/extensions";
import { LexionEditorView } from "@lexion/vue";

export default defineComponent({
  setup() {
    const editor = new LexionEditor({ extensions: [starterKitExtension] });

    return () =>
      h("div", [
        h(
          "button",
          {
            onClick: () => {
              editor.execute(starterKitCommandNames.toggleBold);
            }
          },
          "Bold"
        ),
        h(LexionEditorView, { editor })
      ]);
  }
});
```

## Vue 2 Adapter Pattern

Use `@lexion/vue2` with Vue 2 lifecycle hooks:

```ts
import Vue from "vue";
import { createLexionVue2Adapter } from "@lexion/vue2";

export default Vue.extend({
  data() {
    return {
      adapter: createLexionVue2Adapter({
        onChange: (value) => this.$emit("input", value)
      })
    };
  },
  mounted() {
    this.adapter.mount(this.$el as HTMLElement);
  },
  beforeDestroy() {
    this.adapter.destroy();
  },
  render(h) {
    return h("div");
  }
});
```

## Angular Adapter Pattern

Use `@lexion/angular` in component lifecycle hooks:

```ts
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { createLexionAngularAdapter } from "@lexion/angular";

@Component({
  selector: "app-editor",
  template: `<div #editorHost></div>`
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild("editorHost", { static: true })
  private editorHost!: ElementRef<HTMLElement>;

  private readonly adapter = createLexionAngularAdapter();

  ngAfterViewInit(): void {
    this.adapter.attach(this.editorHost.nativeElement);
  }

  ngOnDestroy(): void {
    this.adapter.destroy();
  }
}
```

## Svelte Adapter Pattern

Use the `lexion` action:

```svelte
<script lang="ts">
  import { lexion } from "@lexion/svelte";
</script>

<div use:lexion={{ onChange: (value) => console.log(value) }}></div>
```

## Solid Adapter Pattern

Use `@lexion/solid` with `onMount`/`onCleanup`:

```ts
import { onCleanup, onMount } from "solid-js";
import { createLexionSolidAdapter } from "@lexion/solid";

const adapter = createLexionSolidAdapter();
let host!: HTMLDivElement;

onMount(() => {
  adapter.mount(host);
});

onCleanup(() => {
  adapter.destroy();
});
```

## Astro Adapter Pattern

Use `@lexion/astro` from a client script:

```astro
<div id="editor"></div>
<script>
  import { mountLexionAstroEditor } from "@lexion/astro";

  const element = document.getElementById("editor");
  if (element) {
    mountLexionAstroEditor({ element });
  }
</script>
```

## Next.js Adapter Pattern

Use the Next client wrapper:

```tsx
"use client";

import { LexionNextEditorView } from "@lexion/next";

export default function EditorPage() {
  return <LexionNextEditorView />;
}
```

## Nuxt Adapter Pattern

Use the Nuxt SSR-safe adapter with `ClientOnly`:

```vue
<template>
  <ClientOnly>
    <LexionNuxtEditorView v-model="value" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { JSONDocument } from "@lexion/core";
import { LexionNuxtEditorView } from "@lexion/nuxt";

const value = ref<JSONDocument>(doc);
</script>
```

## Playground Implementation

A runnable sample adapter is included in:
- `apps/playground/src/web-toolbar-example.ts`

Exports:
- `SampleToolbarAdapter`
- `mountWebToolbarExample(element)`
