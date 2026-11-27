---
"@lexion-rte/core": minor
"@lexion-rte/web": patch
"@lexion-rte/react": patch
"@lexion-rte/vue": patch
---

Add editor change events and make adapters react to them.

**`@lexion-rte/core`**

- New `editor.subscribe(listener)` returns an unsubscribe function. Listeners receive `{ editor, source, transaction, previousState, state, docChanged }` after dispatched transactions (including `execute()`), `setJSON()`, and extension add/remove. Listeners are cleared on `destroy()`.
- New `editor.removeExtension(key)` and `editor.isDestroyed`.
- **Deprecated:** `removePlugin(key)` (use `removeExtension`), the `plugins` option (use `extensions`) and the `LexionPlugin` type (use `LexionExtension`). They keep working.
- **Behavior change:** `use(extension)` now throws when the extension provides a `schema`. Before, the schema was silently ignored. Pass schema-providing extensions to the constructor.
- **Behavior change:** `state`, `doc` and `getJSON()` now throw on a destroyed editor, like the other members.

**Adapters (`web`, `react`, `vue`, and everything built on `web`)**

- Views now update when the shared editor changes from outside the view, e.g. `editor.execute()` from a toolbar or another view.
- `onChange` / `update:modelValue` fire only when the document changes, not on selection-only changes or commands that did nothing. Values applied through the controlled `value` / `modelValue` are not echoed back.
- Controlled values are compared by reference and `Node.eq()` instead of `JSON.stringify` on every transaction.
- React: the internal editor is created and destroyed in the same effect, so `<LexionEditorView>` works under `<StrictMode>`. No internal editor is created when `editor` is passed.
