---
"@lexion-rte/core": minor
"@lexion-rte/web": minor
"@lexion-rte/starter-kit": patch
"@lexion-rte/tools": patch
---

Rename ProseMirror-branded public names to neutral ones.

- `LexionExtension.prosemirrorPlugins` → `editorPlugins`. The old field still works but is deprecated; `editorPlugins` wins when both are set.
- `PROSEMIRROR_REQUIRED_STYLE_ATTRIBUTE` → `EDITOR_REQUIRED_STYLE_ATTRIBUTE`. The old export remains as a deprecated alias.
