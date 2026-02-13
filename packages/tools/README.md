# @lexion-rte/tools

Document conversion helpers for Lexion.

## What It Is

`@lexion-rte/tools` provides conversion utilities such as `toText`, `fromText`, `toHTML`, and `fromHTML`.

## Install

```bash
pnpm add @lexion-rte/tools @lexion-rte/core @lexion-rte/extensions
```

## Usage

```ts
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/extensions";
import { fromText, toText } from "@lexion-rte/tools";

const editor = new LexionEditor({
  extensions: [starterKitExtension]
});

fromText(editor, "Line 1\n\nLine 2");
console.log(toText(editor));
```

