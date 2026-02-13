# @lexion-rte/react

React adapter for Lexion.

## What It Is

`@lexion-rte/react` exposes `LexionEditorView`, a React component that supports controlled and uncontrolled usage.

## Install

```bash
pnpm add @lexion-rte/react react react-dom
```

## Usage

```tsx
import { useState } from "react";
import type { JSONDocument } from "@lexion-rte/core";
import { LexionEditorView } from "@lexion-rte/react";

export function EditorScreen() {
  const [value, setValue] = useState<JSONDocument | undefined>(undefined);

  return (
    <LexionEditorView
      value={value}
      onChange={(nextValue) => setValue(nextValue)}
    />
  );
}
```

