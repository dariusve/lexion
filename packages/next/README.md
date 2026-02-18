![Lexion Logo](../../assets/images/logo.png)

This package is part of the Lexion framework-agnostic rich text editor.

Lexion is a framework-agnostic, headless rich text editor platform built on ProseMirror, designed to provide a shared core, reusable extensions, and framework-specific adapters.

# @lexion-rte/next

Next.js adapter for Lexion.

## Overview

`@lexion-rte/next` exports `LexionNextEditorView`, which wraps the React adapter as a client component.

This package is ideal for Next App Router and can also be used in Pages Router client components.

## Install

```bash
pnpm add @lexion-rte/next next react react-dom
```

## Basic Example

```tsx
"use client";

import { LexionNextEditorView } from "@lexion-rte/next";

export default function EditorPage() {
  return <LexionNextEditorView />;
}
```

## Controlled Example

```tsx
"use client";

import { useState } from "react";
import type { JSONDocument } from "@lexion-rte/core";
import { LexionNextEditorView } from "@lexion-rte/next";

export default function EditorPage() {
  const [value, setValue] = useState<JSONDocument | undefined>(undefined);

  return (
    <LexionNextEditorView
      value={value}
      onChange={(nextValue) => setValue(nextValue)}
    />
  );
}
```

## Notes

- Keep `"use client"` at the top of files that render the component.
- Component props are the same as `@lexion-rte/react` `LexionEditorViewProps`.
