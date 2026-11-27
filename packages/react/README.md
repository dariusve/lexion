![Lexion Logo](../../assets/images/logo.png)

This package is part of the Lexion framework-agnostic rich text editor.

Lexion is a framework-agnostic, headless rich text editor platform built on ProseMirror, designed to provide a shared core, reusable extensions, and framework-specific adapters.

# @lexion-rte/react

React adapter for Lexion.

## Overview

`@lexion-rte/react` exports `LexionEditorView`, a component that wraps ProseMirror wiring for React.

It supports:

- controlled mode (`value`)
- uncontrolled mode (`defaultValue`)
- custom external editor instances
- read-only mode
- automatic ProseMirror base white-space safeguards to avoid console CSS warnings

## Install

```bash
pnpm add @lexion-rte/react react react-dom
```

## Component Props

`LexionEditorViewProps`:

- `editor?: LexionEditor`
- `value?: JSONDocument`
- `defaultValue?: JSONDocument`
- `onChange?: (value, editor) => void`
- `onReady?: (editor) => void`
- `readOnly?: boolean`
- `ariaLabel?: string` / `ariaLabelledBy?: string` (accessible name of the editable area, which has `role="textbox"` and `aria-multiline="true"`)
- `injectStyles?: boolean` (default `true`; injects the editor and status bar stylesheet)
- `className?: string`
- `style?: CSSProperties`

## Uncontrolled Example

```tsx
import { LexionEditorView } from "@lexion-rte/react";

export function EditorScreen() {
  return <LexionEditorView defaultValue={initialDoc} />;
}
```

## Controlled Example

```tsx
import { useState } from "react";
import type { JSONDocument } from "@lexion-rte/core";
import { LexionEditorView } from "@lexion-rte/react";

export function ControlledEditor({ initial }: { initial: JSONDocument }) {
  const [value, setValue] = useState(initial);

  return (
    <LexionEditorView
      value={value}
      onChange={(nextValue) => setValue(nextValue)}
      readOnly={false}
    />
  );
}
```

## External Editor Instance Example

Pass your own `LexionEditor` to share it with a toolbar or other views. Create and destroy it in the same effect so it works under `<StrictMode>`; the view never destroys an editor it did not create.

```tsx
import { useEffect, useState } from "react";
import { LexionEditor } from "@lexion-rte/core";
import { starterKitCommandNames, starterKitExtension } from "@lexion-rte/starter-kit";
import { LexionEditorView } from "@lexion-rte/react";

export function SharedEditor() {
  const [editor, setEditor] = useState<LexionEditor | null>(null);

  useEffect(() => {
    const created = new LexionEditor({ extensions: [starterKitExtension] });
    setEditor(created);
    return () => created.destroy();
  }, []);

  if (!editor) {
    return null;
  }

  return (
    <>
      <button onClick={() => editor.execute(starterKitCommandNames.toggleBold)}>Bold</button>
      <LexionEditorView editor={editor} ariaLabel="Document body" />
    </>
  );
}
```

## Notes

- In controlled mode, pass updated `value` back on every `onChange` call.
- `onChange` fires only when the document changes (not on selection-only changes), including changes made through a shared `editor` (e.g. `editor.execute()` from a toolbar). Values applied through `value` are not echoed back.
- Works under `<StrictMode>`. When no `editor` is passed, the view creates its own (with `starterKitExtension`) and destroys it on unmount.
- The component renders the same status bar as other adapters. Hide or change the "Powered by lexion" item with the `branding` option of `LexionEditor`, and theme it with the `--lexion-status-bar-*` custom properties (see `@lexion-rte/web`).
- The editor root enforces required ProseMirror `white-space` styles, so users should not see the `prosemirror.css` warning.
