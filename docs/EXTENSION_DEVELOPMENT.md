# Extension Development

## Goal
Implement editor features as reusable extensions in `packages/starter-kit` or the relevant premium package.

## Choosing the Package Boundary

Put a feature in `packages/starter-kit` when it is part of the baseline community editing experience.

Put a feature in a premium package when it is commercially licensed, depends on entitlement checks, or is part of a paid workflow such as AI, collaboration, comments, revision history, or admin tooling.

Keep neutral contracts in `@lexion-rte/core` only when they are reusable across both tracks without embedding pricing or licensing behavior.

## Extension Contract
A `LexionExtension` can provide:
- `key`: unique id.
- `schema`: schema instance or factory. Only allowed for extensions passed to the `LexionEditor` constructor; the schema is fixed at construction, so `editor.use()` throws for an extension that sets `schema`.
- `commands(context)`: command map.
- `editorPlugins(context)`: editor plugins (ProseMirror `Plugin` instances).
- `statusBarItems(context)`: status bar entries.
- `onCreate` / `onDestroy`: lifecycle hooks.

Extensions added later with `editor.use(extension)` can be removed with `editor.removeExtension(key)` (`removePlugin` is a deprecated alias).

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
  editorPlugins: () => []
};
```

## Registering an Extension
```ts
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/starter-kit";
import { myExtension } from "./my-extension";

const editor = new LexionEditor({
  extensions: [starterKitExtension, myExtension]
});
```

## Framework-Style Extension Usage

### React (`.tsx`)
```tsx
import { useEffect, useState } from "react";
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/starter-kit";
import { LexionEditorView } from "@lexion-rte/react";
import { myExtension } from "./my-extension";

export const EditorScreen = () => {
  // Create and destroy in the same effect so the editor survives <StrictMode> remounts.
  const [editor, setEditor] = useState<LexionEditor | null>(null);

  useEffect(() => {
    const created = new LexionEditor({ extensions: [starterKitExtension, myExtension] });
    setEditor(created);
    return () => created.destroy();
  }, []);

  return editor ? <LexionEditorView editor={editor} /> : null;
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
import { starterKitExtension } from "@lexion-rte/starter-kit";
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
1. Put feature logic in `packages/starter-kit` or the relevant premium package, not adapters.
2. Keep extension command names stable and explicit.
3. Avoid side effects in extension module scope.
4. Keep schema ownership clear: use one schema-providing extension per editor instance, passed to the constructor (not `editor.use()`).
5. Do not add entitlement or plan logic to adapters or `@lexion-rte/core`.

## Validation Checklist
1. `pnpm build`
2. `pnpm lint`
3. Verify behavior in relevant adapter sample apps under `apps/*-sample` and in `apps/playground`.
