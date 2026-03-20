# @lexion-rte/ui

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
