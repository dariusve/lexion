# Extension Development

## Goal
Implement editor features as reusable extensions in `packages/extensions`.

## Extension Contract
A `LexionExtension` can provide:
- `key`: unique id.
- `schema`: schema instance or factory.
- `commands(context)`: command map.
- `prosemirrorPlugins(context)`: ProseMirror plugins.
- `onCreate` / `onDestroy`: lifecycle hooks.

## Minimal Template
```ts
import type { LexionExtension } from "@lexion-rte/core";

export const myExtension: LexionExtension = {
  key: "my-extension",
  commands: () => ({
    myCommand: ({ state, dispatch }) => {
      dispatch(state.tr);
      return true;
    }
  }),
  prosemirrorPlugins: () => []
};
```

## Registering an Extension
```ts
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/extensions";
import { myExtension } from "./my-extension";

const editor = new LexionEditor({
  extensions: [starterKitExtension, myExtension]
});
```

## Framework-Style Extension Usage

### React (`.tsx`)
```tsx
import { useMemo } from "react";
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/extensions";
import { LexionEditorView } from "@lexion-rte/react";
import { myExtension } from "./my-extension";

export const EditorScreen = () => {
  const editor = useMemo(
    () => new LexionEditor({ extensions: [starterKitExtension, myExtension] }),
    []
  );

  return <LexionEditorView editor={editor} />;
};
```

### Vue (`.vue`)
```vue
<template>
  <LexionEditorView :editor="editor" />
</template>

<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/extensions";
import { LexionEditorView } from "@lexion-rte/vue";
import { myExtension } from "./my-extension";

const editor = new LexionEditor({
  extensions: [starterKitExtension, myExtension]
});

onBeforeUnmount(() => {
  editor.destroy();
});
</script>
```

### Angular (`.component.ts`)
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

## Rules for Contributors
1. Put feature logic in `packages/extensions`, not adapters.
2. Keep extension command names stable and explicit.
3. Avoid side effects in extension module scope.
4. Keep schema ownership clear: use one schema-providing extension per editor instance.

## Validation Checklist
1. `pnpm build`
2. `pnpm lint`
3. Verify behavior in relevant adapter sample apps under `apps/*-sample` and in `apps/playground`.
