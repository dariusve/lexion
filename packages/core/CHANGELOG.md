# @lexion-rte/core

## 0.2.0

### Minor Changes

- 785eb57: Add editor change events and make adapters react to them.

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

- 785eb57: Rename ProseMirror-branded public names to neutral ones.

  - `LexionExtension.prosemirrorPlugins` → `editorPlugins`. The old field still works but is deprecated; `editorPlugins` wins when both are set.
  - `PROSEMIRROR_REQUIRED_STYLE_ATTRIBUTE` → `EDITOR_REQUIRED_STYLE_ATTRIBUTE`. The old export remains as a deprecated alias.

- 785eb57: Shared view controller, accessibility, and themeable status bar.

  - **New `LexionViewController`** in `@lexion-rte/web`: the single implementation of view wiring that every adapter now uses (editor subscription, controlled-value sync, change emission, read-only state, ARIA attributes, stylesheet injection). `@lexion-rte/react` and `@lexion-rte/vue` now depend on `@lexion-rte/web`.
  - **Accessibility:** the editable area has `role="textbox"`, `aria-multiline` and `aria-readonly`. Every adapter accepts `ariaLabel` / `ariaLabelledBy`.
  - **Status bar:** it is now styled with CSS classes from an injected stylesheet (`lexionStatusBarStyles`, zero-specificity `:where()` selectors, `--lexion-status-bar-*` custom properties) instead of inline styles, so it can be themed. The font size went from 7.5px to 11px, and `text-wrap-mode` was replaced with `white-space: nowrap`. React and Vue now inject the stylesheet too; opt out with `injectStyles: false`.
  - **Branding:** the new `LexionEditorOptions.branding` option hides (`false`) or customizes (`{ text, align, className, style }`) the "Powered by lexion" status bar item.
  - New core helpers: `splitStatusBarItems`, `getStatusBarGroupClassName`, `getStatusBarItemClassName`, `resolveBrandingStatusItem`. `lexionStatusBarAppearance.style` / `groupStyles` are deprecated.

## 0.1.5

### Patch Changes

- 1d74f2e: Introduce the open-core package split for Lexion.

  Community editing features now ship in `@lexion-rte/starter-kit`, while commercial-only capabilities move behind private package boundaries. Public documentation and package metadata now describe the dual-license/open-core model consistently.

  Migration note:

  - replace imports from `@lexion-rte/extensions` with `@lexion-rte/starter-kit` for starter-kit commands and extensions
  - use the new package/docs structure for community versus commercial features going forward

## 0.1.4

### Patch Changes

- Add a shared Lexion framework overview and logo at the top of each package README.

## 0.1.3

### Patch Changes

- Release `0.1.3` with framework-native adapter samples and documentation alignment.

  - Add runnable sample apps for each adapter package in `apps/*-sample`.
  - Ensure adapter and extension docs use real framework code style (React JSX, Vue SFC, Vue 2 Options API, Angular component lifecycle, Svelte action/component usage, Solid JSX).
  - Update guides and task tracking to reflect the full adapter sample matrix and framework-accurate examples.

## 0.1.2

### Patch Changes

- Refresh package metadata links and expand package-level README documentation.

## 0.1.1

### Patch Changes

- Update package metadata and documentation for the `@lexion-rte` package set.

  - Align repository/homepage/bugs metadata with the current GitHub repository owner.
  - Add package-level README files with package purpose and usage examples.
