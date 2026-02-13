# @lexion-rte/core

Headless editor runtime for Lexion.

## What It Is

`@lexion-rte/core` provides the editor state, command execution, extension lifecycle, and JSON document APIs.

## Install

```bash
pnpm add @lexion-rte/core @lexion-rte/extensions
```

## Usage

```ts
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension, starterKitCommandNames } from "@lexion-rte/extensions";

const editor = new LexionEditor({
  extensions: [starterKitExtension]
});

editor.execute(starterKitCommandNames.toggleBold);
const json = editor.getJSON();
console.log(json.type);
```

