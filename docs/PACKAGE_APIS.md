# Package APIs

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

### Example
```ts
import { LexionEditor } from "@lexion/core";
import { starterKitExtension } from "@lexion/extensions";

const editor = new LexionEditor({
  extensions: [starterKitExtension]
});

editor.execute("toggleBold");
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

## `@lexion/web`

### Exports
- `createLexionWebEditor(options)`
- `LexionWebEditor`

### Usage
```ts
import { createLexionWebEditor } from "@lexion/web";

const webEditor = createLexionWebEditor({
  element: document.getElementById("editor")!
});
```

## `@lexion/react`

### Exports
- `LexionEditorView`

### Usage
```tsx
<LexionEditorView defaultValue={doc} />
```

## `@lexion/vue`

### Exports
- `LexionEditorView`

### Usage
```ts
h(LexionEditorView, {
  modelValue: doc,
  "onUpdate:modelValue": (nextDoc) => {
    doc = nextDoc;
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
