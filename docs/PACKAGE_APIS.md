# Package APIs

For extension-specific API details, see `docs/EXTENSIONS_REFERENCE.md`.

## `@lexion/core`

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
import { LexionEditor } from "@lexion/core";
import { starterKitCommandNames, starterKitExtension } from "@lexion/extensions";

const editor = new LexionEditor({
  extensions: [starterKitExtension]
});

editor.execute(starterKitCommandNames.toggleBold);
```

### Example: JSON Read/Write
```ts
import { LexionEditor, type JSONDocument } from "@lexion/core";
import { starterKitExtension } from "@lexion/extensions";

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
import { LexionEditor } from "@lexion/core";
import { starterKitExtension } from "@lexion/extensions";

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

## `@lexion/extensions`

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
import { LexionEditor } from "@lexion/core";
import { starterKitCommandNames, starterKitExtension } from "@lexion/extensions";

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
import { LexionEditor } from "@lexion/core";
import {
  AIService,
  aiCommandNames,
  aiExtension,
  starterKitExtension
} from "@lexion/extensions";

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
import { LexionEditor } from "@lexion/core";
import {
  collaborationCommandNames,
  createCollaborationExtension,
  starterKitExtension
} from "@lexion/extensions";
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

## `@lexion/web`

### Exports
- `createLexionWebEditor(options)`
- `LexionWebEditor`

### Example: Uncontrolled Editor
```ts
import { createLexionWebEditor } from "@lexion/web";

const webEditor = createLexionWebEditor({
  element: document.getElementById("editor")!,
  onChange: (value) => {
    console.log("changed", value);
  }
});
```

### Example: Controlled Update + Commands
```ts
import { starterKitCommandNames } from "@lexion/extensions";
import { createLexionWebEditor } from "@lexion/web";

const webEditor = createLexionWebEditor({
  element: document.getElementById("editor")!,
  value: initialDoc
});

webEditor.update({ value: externalDoc, readOnly: false });
webEditor.execute(starterKitCommandNames.toggleItalic);
```

## `@lexion/react`

### Exports
- `LexionEditorView`

### Example: Uncontrolled
```tsx
import { LexionEditorView } from "@lexion/react";

export const EditorScreen = () => <LexionEditorView defaultValue={doc} />;
```

### Example: Controlled
```tsx
import { useState } from "react";
import type { JSONDocument } from "@lexion/core";
import { LexionEditorView } from "@lexion/react";

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

## `@lexion/vue`

### Exports
- `LexionEditorView`

### Example: Uncontrolled
```ts
import { defineComponent, h } from "vue";
import { LexionEditorView } from "@lexion/vue";

export default defineComponent({
  setup() {
    return () => h(LexionEditorView, { defaultValue: doc });
  }
});
```

### Example: Controlled (`v-model`)
```ts
import { defineComponent, h, ref } from "vue";
import type { JSONDocument } from "@lexion/core";
import { LexionEditorView } from "@lexion/vue";

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

## `@lexion/tools`

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
import { LexionEditor } from "@lexion/core";
import { starterKitExtension } from "@lexion/extensions";
import { fromHTML, fromText, toHTML, toText } from "@lexion/tools";

const editor = new LexionEditor({ extensions: [starterKitExtension] });

fromText(editor, "Hello Lexion\n\nSecond paragraph");
console.log(toText(editor));

fromHTML(editor, "<p><strong>Rich</strong> text</p>");
console.log(toHTML(editor));
```
