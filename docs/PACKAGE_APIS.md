# Package APIs

For extension-specific API details, see `docs/EXTENSIONS_REFERENCE.md`.
For concrete payload samples, see `docs/DATA_EXAMPLES.md`.

## `@lexion-rte/core`

### Main Class
- `LexionEditor`

### `LexionEditorOptions`
- `schema?: Schema`
- `doc?: JSONDocument`
- `extensions?: LexionExtension[]`
- `commands?: CommandMap`
- `plugins?: LexionPlugin[]` (alias for extension compatibility)

### Instance API
- `schema`
- `state`
- `doc`
- `getJSON()`
- `setJSON(document)`
- `dispatchTransaction(transaction)`
- `execute(commandName, ...args)`
- `registerCommand(name, handler)`
- `unregisterCommand(name)`
- `use(extension)`
- `removePlugin(key)`
- `destroy()`

### Example: Initialize + Execute Commands
```ts
import { LexionEditor } from "@lexion-rte/core";
import { starterKitCommandNames, starterKitExtension } from "@lexion-rte/extensions";

const editor = new LexionEditor({
  extensions: [starterKitExtension]
});

editor.execute(starterKitCommandNames.toggleBold);
```

### Example: JSON Read/Write
```ts
import { LexionEditor, type JSONDocument } from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/extensions";

const editor = new LexionEditor({ extensions: [starterKitExtension] });

const nextDoc: JSONDocument = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text: "Hello from JSON" }]
    }
  ]
};

editor.setJSON(nextDoc);
const persisted = editor.getJSON();
console.log(persisted);
```

### Example: Register Custom Command
```ts
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/extensions";

const editor = new LexionEditor({ extensions: [starterKitExtension] });

editor.registerCommand("insertTimestamp", ({ state, dispatch }) => {
  const { from, to } = state.selection;
  const transaction = state.tr.insertText(new Date().toISOString(), from, to);
  dispatch(transaction);
  return true;
});

editor.execute("insertTimestamp");
editor.unregisterCommand("insertTimestamp");
```

## `@lexion-rte/extensions`

### Exports
- `starterKitExtension`
- `starterKitSchema`
- `createStarterKitSchema()`
- `createStarterKitCommands()`
- `starterKitCommandNames`
- `aiExtension`
- `aiCommandNames`
- `AIService`
- `createAIService()`
- `createCollaborationExtension()`
- `collaborationCommandNames`

### Command Names
- `setParagraph`
- `toggleHeading`
- `toggleBold`
- `toggleItalic`
- `wrapBulletList`
- `wrapOrderedList`
- `liftListItem`
- `sinkListItem`
- `setLink`
- `unsetLink`
- `undo`
- `redo`

### Example: Use Starter Kit Commands
```ts
import { LexionEditor } from "@lexion-rte/core";
import { starterKitCommandNames, starterKitExtension } from "@lexion-rte/extensions";

const editor = new LexionEditor({ extensions: [starterKitExtension] });

editor.execute(starterKitCommandNames.toggleHeading, { level: 2 });
editor.execute(starterKitCommandNames.toggleBold);
editor.execute(starterKitCommandNames.setLink, {
  href: "https://lexion.dev",
  title: "Lexion"
});
```

### Example: AI Service + Extension
```ts
import { LexionEditor } from "@lexion-rte/core";
import {
  AIService,
  aiCommandNames,
  aiExtension,
  starterKitExtension
} from "@lexion-rte/extensions";

const editor = new LexionEditor({
  extensions: [starterKitExtension, aiExtension]
});

const service = new AIService({
  async generate(request) {
    return `Rewrite: ${request.selection || "No selection"}`;
  }
});

const suggestion = await service.generateForSelection(editor, "Rewrite clearly");
editor.execute(aiCommandNames.applySuggestion, suggestion);
```

### Example: Collaboration Extension
```ts
import { LexionEditor } from "@lexion-rte/core";
import {
  collaborationCommandNames,
  createCollaborationExtension,
  starterKitExtension
} from "@lexion-rte/extensions";
import * as Y from "yjs";
import { Awareness } from "y-protocols/awareness";

const ydoc = new Y.Doc();
const awareness = new Awareness(ydoc);
const fragment = ydoc.getXmlFragment("lexion");

const editor = new LexionEditor({
  extensions: [
    starterKitExtension,
    createCollaborationExtension({ fragment, awareness })
  ]
});

editor.execute(collaborationCommandNames.undo);
```

## `@lexion-rte/web`

### Exports
- `createLexionWebEditor(options)`
- `LexionWebEditor`

### Example: Uncontrolled Editor
```ts
import { createLexionWebEditor } from "@lexion-rte/web";

const webEditor = createLexionWebEditor({
  element: document.getElementById("editor")!,
  onChange: (value) => {
    console.log("changed", value);
  }
});
```

### Example: Controlled Update + Commands
```ts
import { starterKitCommandNames } from "@lexion-rte/extensions";
import { createLexionWebEditor } from "@lexion-rte/web";

const webEditor = createLexionWebEditor({
  element: document.getElementById("editor")!,
  value: initialDoc
});

webEditor.update({ value: externalDoc, readOnly: false });
webEditor.execute(starterKitCommandNames.toggleItalic);
```

## `@lexion-rte/react`

### Exports
- `LexionEditorView`

### Example: Uncontrolled
```tsx
import { LexionEditorView } from "@lexion-rte/react";

export const EditorScreen = () => <LexionEditorView defaultValue={doc} />;
```

### Example: Controlled
```tsx
import { useState } from "react";
import type { JSONDocument } from "@lexion-rte/core";
import { LexionEditorView } from "@lexion-rte/react";

export const ControlledEditor = ({ initial }: { initial: JSONDocument }) => {
  const [value, setValue] = useState<JSONDocument>(initial);

  return (
    <LexionEditorView
      value={value}
      onChange={(nextValue) => setValue(nextValue)}
    />
  );
};
```

## `@lexion-rte/vue`

### Exports
- `LexionEditorView`

### Example: Uncontrolled
```ts
import { defineComponent, h } from "vue";
import { LexionEditorView } from "@lexion-rte/vue";

export default defineComponent({
  setup() {
    return () => h(LexionEditorView, { defaultValue: doc });
  }
});
```

### Example: Controlled (`v-model`)
```ts
import { defineComponent, h, ref } from "vue";
import type { JSONDocument } from "@lexion-rte/core";
import { LexionEditorView } from "@lexion-rte/vue";

export default defineComponent({
  setup() {
    const value = ref<JSONDocument>(doc);

    return () =>
      h(LexionEditorView, {
        modelValue: value.value,
        "onUpdate:modelValue": (nextValue: JSONDocument) => {
          value.value = nextValue;
        }
      });
  }
})
```

## `@lexion-rte/vue2`

### Exports
- `LexionVue2Adapter`
- `createLexionVue2Adapter(options?)`

### Example: Vue 2 Options API
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
        onChange: (nextValue) => {
          this.$emit("input", nextValue);
        }
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

## `@lexion-rte/angular`

### Exports
- `LexionAngularAdapter`
- `createLexionAngularAdapter(options?)`

### Example: Component Lifecycle Binding
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

  private readonly adapter = createLexionAngularAdapter({
    onChange: (value) => {
      console.log("changed", value);
    }
  });

  ngAfterViewInit(): void {
    this.adapter.attach(this.editorHost.nativeElement);
  }

  ngOnDestroy(): void {
    this.adapter.destroy();
  }
}
```

## `@lexion-rte/svelte`

### Exports
- `lexion` (Svelte action)

### Example: Action Usage
```svelte
<script lang="ts">
  import type { JSONDocument } from "@lexion-rte/core";
  import { lexion } from "@lexion-rte/svelte";

  let value: JSONDocument | undefined = undefined;
</script>

<div
  use:lexion={{
    value,
    onChange: (nextValue: JSONDocument) => {
      value = nextValue;
    }
  }}
></div>
```

## `@lexion-rte/solid`

### Exports
- `LexionSolidAdapter`
- `createLexionSolidAdapter(options?)`

### Example: Solid Lifecycle Integration
```ts
import { createEffect, onCleanup, onMount } from "solid-js";
import { createSignal } from "solid-js";
import type { JSONDocument } from "@lexion-rte/core";
import { createLexionSolidAdapter } from "@lexion-rte/solid";

const [value, setValue] = createSignal<JSONDocument | undefined>(undefined);
const adapter = createLexionSolidAdapter({
  onChange: (nextValue) => setValue(nextValue)
});

let host!: HTMLDivElement;

onMount(() => {
  adapter.mount(host);
});

createEffect(() => {
  const nextValue = value();
  if (nextValue) {
    adapter.update({ value: nextValue });
  }
});

onCleanup(() => {
  adapter.destroy();
});
```

## `@lexion-rte/astro`

### Exports
- `LexionAstroAdapter`
- `mountLexionAstroEditor(options)`

### Example: Client Mount Script
```astro
---
const editorId = "lexion-editor";
---

<div id={editorId}></div>
<script>
  import { mountLexionAstroEditor } from "@lexion-rte/astro";

  const element = document.getElementById("lexion-editor");
  if (element) {
    const adapter = mountLexionAstroEditor({ element });
    window.addEventListener("beforeunload", () => adapter.destroy(), { once: true });
  }
</script>
```

## `@lexion-rte/next`

### Exports
- `LexionNextEditorView`

### Example: App Router Client Component
```tsx
"use client";

import { LexionNextEditorView } from "@lexion-rte/next";

export default function EditorPage() {
  return <LexionNextEditorView defaultValue={doc} />;
}
```

## `@lexion-rte/nuxt`

### Exports
- `LexionNuxtEditorView`

### Example: Nuxt `ClientOnly` + `v-model`
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

## `@lexion-rte/tools`

### Exports
- `toHTML(editor, context?)`
- `toText(editor)`
- `fromHTML(editor, html, context?)`
- `fromText(editor, text)`

### Notes
- `toHTML` and `fromHTML` require a DOM `Document`.
- In non-browser environments, pass `{ document }`.

### Example: Convert Current Document
```ts
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/extensions";
import { fromHTML, fromText, toHTML, toText } from "@lexion-rte/tools";

const editor = new LexionEditor({ extensions: [starterKitExtension] });

fromText(editor, "Hello Lexion\n\nSecond paragraph");
console.log(toText(editor));

fromHTML(editor, "<p><strong>Rich</strong> text</p>");
console.log(toHTML(editor));
```
