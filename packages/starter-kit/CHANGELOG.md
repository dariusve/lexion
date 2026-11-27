# @lexion-rte/starter-kit

## 0.3.0

### Minor Changes

- 785eb57: Add keyboard shortcuts and Markdown input rules.

  - Shortcuts: `Mod-z` / `Shift-Mod-z` / `Mod-y` undo and redo (they were not bound before), `Mod-b` / `Mod-i` / `Mod-u` / `Mod-e` / `Shift-Mod-s` marks, `Mod-Alt-0..6` paragraph and headings, `Mod-Alt-c` code block, `Shift-Mod-b` blockquote, `Shift-Mod-8` / `Shift-Mod-7` lists, `Shift-Enter` / `Mod-Enter` hard break.
  - Input rules: `# ` … `###### ` headings, `> ` blockquote, `- ` / `* ` / `+ ` bullet list, `1. ` ordered list, ` ``` ` code block, `---` horizontal rule.

### Patch Changes

- 785eb57: Rename ProseMirror-branded public names to neutral ones.

  - `LexionExtension.prosemirrorPlugins` → `editorPlugins`. The old field still works but is deprecated; `editorPlugins` wins when both are set.
  - `PROSEMIRROR_REQUIRED_STYLE_ATTRIBUTE` → `EDITOR_REQUIRED_STYLE_ATTRIBUTE`. The old export remains as a deprecated alias.

- Updated dependencies [785eb57]
- Updated dependencies [785eb57]
- Updated dependencies [785eb57]
  - @lexion-rte/core@0.2.0

## 0.2.2

### Patch Changes

- Expand `@lexion-rte/starter-kit` with more built-in editing commands and default editor behavior. This release adds inline code, strike, underline, blockquote, code block, horizontal rule, and hard break commands, plus list keybindings, gap/drop cursor support, and automatic trailing paragraph handling.

## 0.2.1

### Patch Changes

- 7679d1f: Improve the `@lexion-rte/starter-kit` package documentation with clearer command coverage, usage examples, migration notes, and related reference links.

## 0.2.0

### Minor Changes

- 1d74f2e: Introduce the open-core package split for Lexion.

  Community editing features now ship in `@lexion-rte/starter-kit`, while commercial-only capabilities move behind private package boundaries. Public documentation and package metadata now describe the dual-license/open-core model consistently.

  Migration note:

  - replace imports from `@lexion-rte/extensions` with `@lexion-rte/starter-kit` for starter-kit commands and extensions
  - use the new package/docs structure for community versus commercial features going forward

### Patch Changes

- Updated dependencies [1d74f2e]
  - @lexion-rte/core@0.1.5

## 0.1.0

- Split the community starter-kit out of the former `@lexion-rte/extensions` package.
