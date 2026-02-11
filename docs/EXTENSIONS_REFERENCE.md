# Extensions Reference

This document is the canonical API reference for `@lexion/extensions`.

## Package Exports

| Export | Kind | Description |
| --- | --- | --- |
| `starterKitCommandNames` | `const` | Command name map for starter-kit feature commands. |
| `createStarterKitCommands` | `function` | Builds the starter-kit command map. |
| `createStarterKitSchema` | `function` | Builds the starter-kit ProseMirror schema. |
| `starterKitSchema` | `const` | Ready-to-use starter-kit schema instance. |
| `starterKitExtension` | `const` | Starter-kit `LexionExtension` (schema + commands + PM plugins). |
| `aiCommandNames` | `const` | Command name map for AI extension commands. |
| `aiExtension` | `const` | AI `LexionExtension` with suggestion-apply command. |
| `AIService` | `class` | Provider-agnostic AI orchestration service. |
| `createAIService` | `function` | Factory for `AIService`. |
| `collaborationCommandNames` | `const` | Command name map for collaboration undo/redo. |
| `createCollaborationExtension` | `function` | Factory for Yjs collaboration `LexionExtension`. |
| `HeadingAttributes` | `type` | Heading command attribute type (`level: 1..6`). |
| `LinkAttributes` | `type` | Link command attribute type (`href`, `title?`). |
| `AIProvider` | `type` | AI provider contract (`generate`). |
| `AIProviderRequest` | `type` | Payload passed to provider generation calls. |
| `CollaborationExtensionOptions` | `type` | Input options for collaboration extension factory. |

## Starter Kit

### `starterKitExtension`

| Property | Type | Value/Behavior |
| --- | --- | --- |
| `key` | `string` | `"starter-kit"` |
| `schema` | `Schema` | `starterKitSchema` |
| `commands` | `() => CommandMap` | Returns `createStarterKitCommands()` |
| `prosemirrorPlugins` | `() => Plugin[]` | Returns `[history(), keymap(baseKeymap)]` |

### Starter-Kit Commands

| Name (`starterKitCommandNames.*`) | Command ID | Args | Behavior |
| --- | --- | --- | --- |
| `setParagraph` | `"setParagraph"` | none | Sets block type to paragraph. |
| `toggleHeading` | `"toggleHeading"` | `level: number` (`1..6`) | Sets block type to heading with provided level. |
| `toggleBold` | `"toggleBold"` | none | Toggles `strong` mark in selection. |
| `toggleItalic` | `"toggleItalic"` | none | Toggles `em` mark in selection. |
| `wrapBulletList` | `"wrapBulletList"` | none | Wraps selection in bullet list. |
| `wrapOrderedList` | `"wrapOrderedList"` | none | Wraps selection in ordered list. |
| `liftListItem` | `"liftListItem"` | none | Lifts current list item one level. |
| `sinkListItem` | `"sinkListItem"` | none | Sinks current list item one level. |
| `setLink` | `"setLink"` | `LinkAttributes` | Applies link mark to non-empty selection. |
| `unsetLink` | `"unsetLink"` | none | Removes link mark in selection range. |
| `undo` | `"undo"` | none | Executes history undo. |
| `redo` | `"redo"` | none | Executes history redo. |

### Starter-Kit Types

| Type | Shape |
| --- | --- |
| `HeadingAttributes` | `{ level: 1 \| 2 \| 3 \| 4 \| 5 \| 6 }` |
| `LinkAttributes` | `{ href: string; title?: string \| null }` |

## AI Extension

### `aiExtension`

| Property | Type | Value/Behavior |
| --- | --- | --- |
| `key` | `string` | `"ai"` |
| `commands` | `() => CommandMap` | Registers `ai.applySuggestion`. |

### AI Commands

| Name (`aiCommandNames.*`) | Command ID | Args | Behavior |
| --- | --- | --- | --- |
| `applySuggestion` | `"ai.applySuggestion"` | `suggestion: string` | Replaces current selection with suggestion text. |

### `AIProviderRequest`

| Field | Type | Description |
| --- | --- | --- |
| `prompt` | `string` | User/system instruction for generation. |
| `selection` | `string` | Current selected text from editor state. |
| `document` | `JSONDocument` | Full editor document JSON snapshot. |

### `AIProvider`

| Member | Signature | Description |
| --- | --- | --- |
| `generate` | `(request: AIProviderRequest) => Promise<string>` | Returns suggested text output for insertion. |

### `AIService`

| Method | Signature | Description |
| --- | --- | --- |
| `constructor` | `(provider: AIProvider)` | Creates service with provider implementation. |
| `generateForSelection` | `(editor: LexionEditor, prompt: string) => Promise<string>` | Produces suggestion string for current selection. |
| `generateAndApply` | `(editor: LexionEditor, prompt: string) => Promise<boolean>` | Generates suggestion and applies via `ai.applySuggestion`. |

### `createAIService`

| Function | Signature | Returns |
| --- | --- | --- |
| `createAIService` | `(provider: AIProvider) => AIService` | New `AIService` instance. |

## Collaboration Extension

### `CollaborationExtensionOptions`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `fragment` | `XmlFragment` | yes | Shared Yjs XML fragment for document sync. |
| `awareness` | `Awareness` | yes | Shared awareness instance for presence/cursors. |
| `withCursor` | `boolean` | no | Enables/disables cursor plugin. Default: `true`. |
| `withUndo` | `boolean` | no | Enables/disables Yjs undo plugin. Default: `true`. |

### `createCollaborationExtension`

| Function | Signature | Returns |
| --- | --- | --- |
| `createCollaborationExtension` | `(options: CollaborationExtensionOptions) => LexionExtension` | Collaboration extension with sync plugins and commands. |

### Collaboration Extension Behavior

| Property | Type | Value/Behavior |
| --- | --- | --- |
| `key` | `string` | `"collaboration"` |
| `prosemirrorPlugins` | `() => Plugin[]` | Always includes `ySyncPlugin(fragment)`, optionally `yCursorPlugin(awareness)` and `yUndoPlugin()`. |
| `commands` | `() => CommandMap` | Registers `collaboration.undo` and `collaboration.redo`. |

### Collaboration Commands

| Name (`collaborationCommandNames.*`) | Command ID | Args | Behavior |
| --- | --- | --- | --- |
| `undo` | `"collaboration.undo"` | none | Executes Yjs-aware undo command. |
| `redo` | `"collaboration.redo"` | none | Executes Yjs-aware redo command. |

## Minimal Usage

```ts
import { LexionEditor } from "@lexion/core";
import {
  starterKitExtension,
  aiExtension,
  createCollaborationExtension
} from "@lexion/extensions";

const editor = new LexionEditor({
  extensions: [starterKitExtension, aiExtension]
});

// Later, when Yjs is available:
// editor.use(createCollaborationExtension({ fragment, awareness }));
```
