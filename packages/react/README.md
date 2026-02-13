# @lexion-rte/react

React adapter for Lexion.

## Overview

`@lexion-rte/react` exports `LexionEditorView`, a component that wraps ProseMirror wiring for React.

It supports:

- controlled mode (`value`)
- uncontrolled mode (`defaultValue`)
- custom external editor instances
- read-only mode

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

```tsx
import { useMemo } from "react";
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/extensions";
import { LexionEditorView } from "@lexion-rte/react";

export function SharedEditor() {
  const editor = useMemo(() => new LexionEditor({ extensions: [starterKitExtension] }), []);
  return <LexionEditorView editor={editor} />;
}
```

## Notes

- In controlled mode, pass updated `value` back on every `onChange` call.
- The component renders the same footer message as other adapters.
