# @lexion-rte/ui

## 0.2.0

### Minor Changes

- 785eb57: Toolbar accessibility and module split.

  - `role="toolbar"` with an `aria-label` (new `ariaLabel` option), one Tab stop, and `ArrowLeft` / `ArrowRight` / `Home` / `End` navigation.
  - Dropdown menus are keyboard operable: `ArrowDown` opens and focuses the first item, items have `role="menuitem"`, and `Escape` returns focus to the trigger.
  - New `active` item field, plus `setItemActive()` / `setItemsActive()`. Toggle buttons expose `aria-pressed` and a `--active` class.
  - Visible `:focus-visible` outline.
  - Internal: `src/index.ts` was split into modules. The public exports are unchanged.

### Patch Changes

- Updated dependencies [785eb57]
- Updated dependencies [785eb57]
- Updated dependencies [785eb57]
- Updated dependencies [785eb57]
  - @lexion-rte/core@0.2.0
  - @lexion-rte/starter-kit@0.3.0

## 0.1.1

### Patch Changes

- Preserve editor selection while using toolbar buttons by preventing pointer/mouse focus-steal behavior on toolbar interactions.
- Improve command execution reliability for adapter integrations by calling optional `editor.focus()` before executing toolbar commands when available.

## 0.1.0

### Minor Changes

- Introduce a new toolbar UI package for Lexion with:
  - icon-based toolbar rendering for DOM integrations
  - command execution wiring through `editor.execute(...)`
  - item management APIs (`setItems`, `addItem`, `updateItem`, `removeItem`)
  - toolbar icon states: `enabled`, `disabled`, and `hidden`
  - optional Remix Icon compatibility via icon class names
