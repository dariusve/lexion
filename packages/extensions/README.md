# @lexion-rte/extensions

Feature extension set for Lexion.

## What It Is

`@lexion-rte/extensions` ships starter-kit commands/schema plus optional AI and collaboration extension helpers.

## Install

```bash
pnpm add @lexion-rte/extensions @lexion-rte/core
```

## Usage

```ts
import { LexionEditor } from "@lexion-rte/core";
import {
  starterKitExtension,
  starterKitCommandNames
} from "@lexion-rte/extensions";

const editor = new LexionEditor({
  extensions: [starterKitExtension]
});

editor.execute(starterKitCommandNames.toggleHeading, { level: 2 });
```

