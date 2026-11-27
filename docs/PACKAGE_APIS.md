# Package APIs

For extension-specific API details, see `docs/EXTENSIONS_REFERENCE.md`.
For concrete payload samples, see `docs/DATA_EXAMPLES.md`.

## `@lexion-rte/core`

### Main Class
- `LexionEditor`

### Status Bar Helpers
- `lexionStatusBarStyles`: status bar stylesheet (zero-specificity `:where()` selectors, themeable with `--lexion-status-bar-*` custom properties). Injected by the web, React and Vue adapters.
- `splitStatusBarItems(items)`: groups items into `start` / `end` for rendering (by `align`, default `start`).
- `getStatusBarGroupClassName(align)` / `getStatusBarItemClassName(item)`: class names used by the adapters.
- `resolveBrandingStatusItem(branding)`: the branding item for a `branding` option value, or `null` when hidden.
- `lexionBrandingStatusItem`, `LEXION_BRANDING_CLASS_NAME`
- `lexionStatusBarAppearance` (`style` / `groupStyles` are deprecated; use the stylesheet)

### `LexionEditorOptions`
- `schema?: Schema`
- `doc?: JSONDocument`
- `extensions?: LexionExtension[]`
- `commands?: CommandMap`
- `plugins?: LexionPlugin[]` (deprecated alias of `extensions`)
- `branding?: boolean | { text?, align?, className?, style? }` (`false` hides the "Powered by lexion" status bar item)

### Instance API
- `schema`
- `state`
- `doc`
- `getJSON()`
- `getStatusBarItems()`
- `setJSON(document)`
- `dispatchTransaction(transaction)`
- `execute(commandName, ...args)`
- `registerCommand(name, handler)`
- `unregisterCommand(name)`
- `use(extension)` (throws if the extension provides a `schema`; pass those to the constructor)
- `removeExtension(key)`
- `removePlugin(key)` (deprecated alias of `removeExtension`)
- `subscribe(listener)` → unsubscribe function
- `isDestroyed`
- `destroy()`

After `destroy()`, every member except `schema`, `isDestroyed` and `destroy()` throws.

### Example: Initialize + Execute Commands
```ts
import { LexionEditor } from "@lexion-rte/core";
import { starterKitCommandNames, starterKitExtension } from "@lexion-rte/starter-kit";

const editor = new LexionEditor({
  extensions: [starterKitExtension]
});

editor.execute(starterKitCommandNames.toggleBold);
```

### Example: JSON Read/Write
```ts
import { LexionEditor, type JSONDocument } from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/starter-kit";

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

### Example: Subscribe to Changes
`subscribe` is called after every state change: dispatched transactions (including `execute()`), `setJSON()`, and extension add/remove. Adapters use it to keep their views in sync, so commands run on a shared editor (e.g. from a toolbar) update every mounted view.

```ts
const unsubscribe = editor.subscribe(({ source, docChanged, transaction, state, previousState }) => {
  // source: "transaction" | "setJSON" | "extensions"
  if (docChanged) {
    save(editor.getJSON());
  }
});

unsubscribe(); // listeners are also cleared on destroy()
```

### Example: Register Custom Command
```ts
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/starter-kit";

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

## `@lexion-rte/starter-kit`

### Exports
- `starterKitExtension`
- `starterKitSchema`
- `createStarterKitSchema()`
- `createStarterKitCommands()`
- `starterKitCommandNames`

### Command Names
- `setParagraph`
- `toggleHeading`
- `toggleBold`
- `toggleItalic`
- `toggleCode`
- `toggleStrike`
- `toggleUnderline`
- `toggleBlockquote`
- `toggleCodeBlock`
- `wrapBulletList`
- `wrapOrderedList`
- `liftListItem`
- `sinkListItem`
- `setLink`
- `unsetLink`
- `insertHorizontalRule`
- `insertHardBreak`
- `undo`
- `redo`

### Keyboard Shortcuts and Input Rules
`starterKitExtension` binds shortcuts (`Mod-z` undo, `Mod-b` bold, `Mod-Alt-1` heading 1, `Shift-Mod-8` bullet list, ...) and Markdown input rules (`# `, `> `, `- `, `1. `, ```` ``` ````, `---`). The full tables are in the [starter-kit README](../packages/starter-kit/README.md#keyboard-shortcuts).

### Example: Use Starter Kit Commands
```ts
import { LexionEditor } from "@lexion-rte/core";
import { starterKitCommandNames, starterKitExtension } from "@lexion-rte/starter-kit";

const editor = new LexionEditor({ extensions: [starterKitExtension] });

editor.execute(starterKitCommandNames.toggleHeading, 2);
editor.execute(starterKitCommandNames.toggleBold);
editor.execute(starterKitCommandNames.toggleUnderline);
editor.execute(starterKitCommandNames.toggleCodeBlock);
editor.execute(starterKitCommandNames.setLink, {
  href: "https://lexion.dev",
  title: "Lexion"
});
editor.execute(starterKitCommandNames.insertHorizontalRule);
```

## Commercial Features

Commercial feature package APIs are intentionally not documented in this public repository.

The public repo documents only the community package surface. Commercial capabilities are implemented and distributed from private codebases.

## `@lexion-rte/web`

### Exports
- `createLexionWebEditor(options)`
- `LexionWebEditor`
- `injectLexionWebEditorStyles(options?)`
- `lexionWebEditorStyles`
- `EDITOR_REQUIRED_STYLE_ATTRIBUTE` (`PROSEMIRROR_REQUIRED_STYLE_ATTRIBUTE` is a deprecated alias)
- `LexionViewController` (shared view wiring that every adapter uses; use it to build your own adapter)

### `LexionWebEditor` Options
- `element: HTMLElement`
- `editor?: LexionEditor` (not destroyed by the adapter)
- `value?` / `defaultValue?: JSONDocument`
- `readOnly?: boolean`
- `ariaLabel?` / `ariaLabelledBy?: string` (the editable area has `role="textbox"` and `aria-multiline="true"`)
- `injectStyles?: boolean` (default `true`), `styleInjectionOptions?`
- `onChange?(value, editor)`: called only when the document changes; values applied through `value` / `setValue()` / `update()` are not echoed back
- `onReady?(editor)`

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
The view subscribes to the editor, so commands run through `execute()` (or directly on a shared `LexionEditor`) update it and fire `onChange`.

```ts
import { starterKitCommandNames } from "@lexion-rte/starter-kit";
import { createLexionWebEditor } from "@lexion-rte/web";

const webEditor = createLexionWebEditor({
  element: document.getElementById("editor")!,
  value: initialDoc
});

webEditor.update({ value: externalDoc, readOnly: false });
webEditor.execute(starterKitCommandNames.toggleItalic);
```

### Styling Notes
- The web adapter auto-injects base ProseMirror styles (including `white-space: pre-wrap`) by default.
- Disable this with `injectStyles: false` if your app already includes custom ProseMirror CSS.
- The status bar is styled through CSS classes (`.lexion-editor-status-bar`, `.lexion-editor-status-item`, ...) and `--lexion-status-bar-font-size`, `--lexion-status-bar-color`, `--lexion-status-bar-background`, `--lexion-status-bar-border-color`, `--lexion-status-bar-padding`.

### Example: Custom Adapter with `LexionViewController`
```ts
import { splitStatusBarItems } from "@lexion-rte/core";
import { LexionViewController } from "@lexion-rte/web";

const controller = new LexionViewController({
  element,
  defaultValue,
  ariaLabel: "Message body",
  onChange: (value) => save(value),
  onStatusBarChange: (items) => render(splitStatusBarItems(items))
});

controller.setValue(nextValue);
controller.setReadOnly(true);
controller.destroy(); // destroys the editor only if the controller created it
```

## `@lexion-rte/ui`

### Exports
- `createLexionToolbar(options)`
- `LexionToolbar`
- `createStarterKitToolbarItems(options?)`
- `createToolbarSeparatorItem(id, state?)`
- `lexionToolbarIcons`
- `injectLexionToolbarStyles(options?)`
- `lexionToolbarStyles`
- `lexionToolbarAppearance`

### Toolbar Options
- `element: HTMLElement`
- `editor?: LexionToolbarEditor`
- `items?: LexionToolbarItemInput[]`
- `className?: string`
- `ariaLabel?: string` (default `"Editor toolbar"`)
- `onItemExecute?(event)`

### Toolbar Item States
- `enabled`
- `disabled`
- `hidden`

Toggle items can also carry `active?: boolean`, which renders `aria-pressed` and the `lexion-toolbar-ui__button--active` class. Update it with `toolbar.setItemActive(id, active)` or `toolbar.setItemsActive({ bold: true, italic: false })`, for example from `editor.subscribe()`.

### Accessibility
- `role="toolbar"` with an `aria-label`; a single Tab stop with `ArrowLeft` / `ArrowRight` / `Home` / `End` navigation.
- Dropdowns open with `ArrowDown` / `Enter` / `Space`; items have `role="menuitem"`; `Escape` closes the menu and returns focus to the trigger.

### Toolbar Editor Contract
- Required: `execute(command, ...args): boolean`
- Optional: `focus(): void` (used automatically before command execution to keep editor selection behavior consistent)

### Toolbar Item Shapes
- command button item: `id`, `iconClass`, optional `label/title`, `command`, `args`
- dropdown group item: `id`, `iconClass`, optional `label/title`, `items[]`
- dropdown option item: `id`, `iconClass`, `label`, optional `command`, `args`, and `state`
- separator item: `id`, `separator: true`, optional `state`

### Example: Toolbar + Core Command Integration
```ts
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/starter-kit";
import {
  createStarterKitToolbarItems,
  createToolbarSeparatorItem,
  createLexionToolbar,
  lexionToolbarIcons,
  injectLexionToolbarStyles
} from "@lexion-rte/ui";

injectLexionToolbarStyles();

const editor = new LexionEditor({ extensions: [starterKitExtension] });
const toolbar = createLexionToolbar({
  element: document.getElementById("toolbar")!,
  editor,
  items: [
    ...createStarterKitToolbarItems({ withLabels: false }).slice(0, 5),
    createToolbarSeparatorItem("sep-main"),
    { id: "undo", iconClass: lexionToolbarIcons.undo, title: "Undo", command: "undo" },
    ...createStarterKitToolbarItems({ withLabels: false }).slice(5, 9)
  ]
});

toolbar.disableItem("undo");
toolbar.hideItem("unset-link");
```

### Example: Grouped Dropdown Toolbar
```ts
import { createLexionToolbar, lexionToolbarIcons } from "@lexion-rte/ui";

const toolbar = createLexionToolbar({
  element: document.getElementById("toolbar")!,
  editor,
  items: [
    {
      id: "inline-format",
      iconClass: lexionToolbarIcons.textFormat,
      title: "Inline format",
      items: [
        { id: "bold", iconClass: lexionToolbarIcons.bold, label: "Bold", command: "toggleBold" },
        { id: "italic", iconClass: lexionToolbarIcons.italic, label: "Italic", command: "toggleItalic" },
        { id: "underline", iconClass: lexionToolbarIcons.underline, label: "Underline", command: "toggleUnderline" }
      ]
    }
  ],
  onItemExecute: (event) => {
    // event.groupId is set when the executed item came from a dropdown group
    console.log(event.groupId, event.item.id, event.executed);
  }
});
```

## `@lexion-rte/react`

### Exports
- `LexionEditorView`

### Props
`editor?`, `value?`, `defaultValue?`, `onChange?`, `onReady?`, `readOnly?`, `ariaLabel?`, `ariaLabelledBy?`, `injectStyles?` (default `true`), `className?`, `style?`.

- `onChange` fires only when the document changes, including changes from a shared `editor` (e.g. a toolbar). Controlled `value` updates are not echoed back.
- Works under `<StrictMode>`. No internal editor is created when `editor` is passed, and a passed editor is never destroyed by the view.

### Styling Notes
- The React view enforces required ProseMirror `white-space` styling on the editor root to prevent CSS console warnings.
- It injects the editor and status bar stylesheet once per document; opt out with `injectStyles={false}`.

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

### Props
`editor?`, `modelValue?` (`v-model`), `defaultValue?`, `readOnly?`, `ariaLabel?`, `ariaLabelledBy?`, `injectStyles?` (default `true`), `className?`, `style?`. Events: `update:modelValue` and `change` (only when the document changes), `ready`.

### Styling Notes
- The Vue view enforces required ProseMirror `white-space` styling on the editor root to prevent CSS console warnings.
- It injects the editor and status bar stylesheet once per document; opt out with `:inject-styles="false"`.

### Example: Uncontrolled
```vue
<template>
  <LexionEditorView :default-value="doc" />
</template>

<script setup lang="ts">
import { LexionEditorView } from "@lexion-rte/vue";
</script>
```

### Example: Controlled (`v-model`)
```vue
<template>
  <LexionEditorView v-model="value" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { JSONDocument } from "@lexion-rte/core";
import { LexionEditorView } from "@lexion-rte/vue";

const value = ref<JSONDocument>(doc);
</script>
```

## `@lexion-rte/vue2`

### Exports
- `LexionVue2Adapter`
- `createLexionVue2Adapter(options?)`

### Example: Vue 2 Options API
```ts
import Vue from "vue";
import type { JSONDocument } from "@lexion-rte/core";
import { createLexionVue2Adapter, type LexionVue2Adapter } from "@lexion-rte/vue2";

export default Vue.extend({
  template: `<div ref="editorHost"></div>`,
  props: {
    value: {
      type: Object as () => JSONDocument | undefined,
      default: undefined
    }
  },
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
      onChange: (nextValue) => {
        this.$emit("input", nextValue);
      }
    });
    this.adapter.mount(host);
  },
  beforeDestroy() {
    this.adapter?.destroy();
  },
  watch: {
    value(nextValue: JSONDocument | undefined) {
      if (nextValue && this.adapter) {
        this.adapter.update({ value: nextValue });
      }
    }
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
```tsx
import { createSignal, onCleanup, onMount } from "solid-js";
import { render } from "solid-js/web";
import type { JSONDocument } from "@lexion-rte/core";
import { createLexionSolidAdapter } from "@lexion-rte/solid";

const EditorScreen = () => {
  const [value, setValue] = createSignal<JSONDocument | undefined>(undefined);
  const adapter = createLexionSolidAdapter({
    onChange: (nextValue) => setValue(nextValue)
  });

  let host!: HTMLDivElement;

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

render(() => <EditorScreen />, document.getElementById("app")!);
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
import { starterKitExtension } from "@lexion-rte/starter-kit";
import { fromHTML, fromText, toHTML, toText } from "@lexion-rte/tools";

const editor = new LexionEditor({ extensions: [starterKitExtension] });

fromText(editor, "Hello Lexion\n\nSecond paragraph");
console.log(toText(editor));

fromHTML(editor, "<p><strong>Rich</strong> text</p>");
console.log(toHTML(editor));
```
