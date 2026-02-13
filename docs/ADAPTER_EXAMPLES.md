# Adapter Examples

This guide shows practical patterns for adding a toolbar and creating a custom adapter without moving editor business logic outside core/extensions.

## Web Toolbar Example

Use `@lexion-rte/web` plus starter-kit command names:

```ts
import { starterKitCommandNames } from "@lexion-rte/extensions";
import { createLexionWebEditor } from "@lexion-rte/web";

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
import type { JSONDocument } from "@lexion-rte/core";
import { starterKitCommandNames } from "@lexion-rte/extensions";
import { createLexionWebEditor } from "@lexion-rte/web";

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
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension, starterKitCommandNames } from "@lexion-rte/extensions";
import { LexionEditorView } from "@lexion-rte/react";

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

```vue
<template>
  <main>
    <button type="button" @click="toggleBold">Bold</button>
    <LexionEditorView :editor="editor" />
  </main>
</template>

<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension, starterKitCommandNames } from "@lexion-rte/extensions";
import { LexionEditorView } from "@lexion-rte/vue";

const editor = new LexionEditor({ extensions: [starterKitExtension] });

const toggleBold = (): void => {
  editor.execute(starterKitCommandNames.toggleBold);
};

onBeforeUnmount(() => {
  editor.destroy();
});
</script>
```

## Vue 2 Adapter Pattern

Use `@lexion-rte/vue2` with Vue 2 lifecycle hooks:

```ts
import Vue from "vue";
import { createLexionVue2Adapter, type LexionVue2Adapter } from "@lexion-rte/vue2";

export default Vue.extend({
  template: `<main><div ref="editorHost"></div></main>`,
  data() {
    return {
      adapter: null as LexionVue2Adapter | null
    };
  },
  mounted() {
    const host = this.$refs.editorHost as HTMLElement | undefined;
    if (!host) {
      throw new Error("Missing editor host ref");
    }

    this.adapter = createLexionVue2Adapter({
      onChange: (value) => this.$emit("input", value)
    });
    this.adapter.mount(host);
  },
  beforeDestroy() {
    this.adapter?.destroy();
  }
});
```

## Angular Adapter Pattern

Use `@lexion-rte/angular` in component lifecycle hooks:

```ts
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { createLexionAngularAdapter } from "@lexion-rte/angular";

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
  import { lexion } from "@lexion-rte/svelte";
</script>

<div use:lexion={{ onChange: (value) => console.log(value) }}></div>
```

## Solid Adapter Pattern

Use `@lexion-rte/solid` with a Solid component and JSX:

```tsx
import { createSignal, onCleanup, onMount } from "solid-js";
import { render } from "solid-js/web";
import type { JSONDocument } from "@lexion-rte/core";
import { createLexionSolidAdapter } from "@lexion-rte/solid";

const App = () => {
  let host!: HTMLDivElement;
  const [value, setValue] = createSignal<JSONDocument | undefined>(undefined);
  const adapter = createLexionSolidAdapter({
    onChange: (nextValue) => setValue(nextValue)
  });

  onMount(() => {
    adapter.mount(host);
  });

  onCleanup(() => {
    adapter.destroy();
  });

  return (
    <main>
      <div ref={(element) => {
        host = element;
      }} />
      <pre>{JSON.stringify(value(), null, 2)}</pre>
    </main>
  );
};

render(() => <App />, document.getElementById("app")!);
```

## Astro Adapter Pattern

Use `@lexion-rte/astro` from a client script:

```astro
<div id="editor"></div>
<script>
  import { mountLexionAstroEditor } from "@lexion-rte/astro";

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

import { LexionNextEditorView } from "@lexion-rte/next";

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
import type { JSONDocument } from "@lexion-rte/core";
import { LexionNuxtEditorView } from "@lexion-rte/nuxt";

const value = ref<JSONDocument>(doc);
</script>
```

## Playground Implementation

A runnable sample adapter is included in:
- `apps/playground/src/web-toolbar-example.ts`

Exports:
- `SampleToolbarAdapter`
- `mountWebToolbarExample(element)`

## Runnable Adapter Sample Apps

The repository now includes runnable sample apps for every adapter package:
- `apps/web-sample`
- `apps/react-sample`
- `apps/vue-sample`
- `apps/vue2-sample`
- `apps/angular-sample`
- `apps/svelte-sample`
- `apps/solid-sample`
- `apps/astro-sample`
- `apps/next-sample`
- `apps/nuxt-sample`

Framework-native app entrypoints:
- `apps/web-sample/src/main.ts` (vanilla web)
- `apps/react-sample/src/main.tsx` (React + Vite)
- `apps/vue-sample/src/main.ts` (Vue 3 + Vite)
- `apps/vue2-sample/src/main.ts` (Vue 2 + Vite)
- `apps/angular-sample/src/main.ts` (Angular standalone bootstrap)
- `apps/svelte-sample/src/App.svelte` (Svelte component app)
- `apps/solid-sample/src/main.ts` (Solid runtime app)
- `apps/astro-sample/src/pages/index.astro` (Astro page app)
- `apps/next-sample/app/page.tsx` (Next.js App Router)
- `apps/nuxt-sample/app.vue` (Nuxt app)

Run any sample from the repository root:

```bash
pnpm dev:web-sample
pnpm dev:react-sample
pnpm dev:vue-sample
pnpm dev:vue2-sample
pnpm dev:angular-sample
pnpm dev:svelte-sample
pnpm dev:solid-sample
pnpm dev:astro-sample
pnpm dev:next-sample
pnpm dev:nuxt-sample
```
