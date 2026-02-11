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

## Playground Implementation

A runnable sample adapter is included in:
- `apps/playground/src/web-toolbar-example.ts`

Exports:
- `SampleToolbarAdapter`
- `mountWebToolbarExample(element)`
