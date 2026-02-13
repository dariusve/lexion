# @lexion-rte/next

Next.js adapter for Lexion.

## What It Is

`@lexion-rte/next` exports `LexionNextEditorView`, a client component wrapper around the React adapter.

## Install

```bash
pnpm add @lexion-rte/next next react react-dom
```

## Usage

```tsx
"use client";

import { LexionNextEditorView } from "@lexion-rte/next";

export default function EditorPage() {
  return <LexionNextEditorView />;
}
```

