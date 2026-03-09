![Lexion Logo](../../assets/images/logo.png)

This package is part of the Lexion framework-agnostic rich text editor.

Lexion is an open-core, framework-agnostic, headless rich text editor platform built on ProseMirror.

# @lexion-rte/starter-kit

Community starter-kit extensions for Lexion.

## Overview

`@lexion-rte/starter-kit` ships:

- the starter-kit schema
- default editing commands
- the base ProseMirror history and keymap plugins

Commercial features such as AI and collaboration live in separate premium packages.

## Install

```bash
pnpm add @lexion-rte/starter-kit @lexion-rte/core
```

## Exports

- `starterKitExtension`
- `starterKitSchema`
- `createStarterKitSchema()`
- `createStarterKitCommands()`
- `starterKitCommandNames`

## Example

```ts
import { LexionEditor } from "@lexion-rte/core";
import { starterKitExtension, starterKitCommandNames } from "@lexion-rte/starter-kit";

const editor = new LexionEditor({ extensions: [starterKitExtension] });

editor.execute(starterKitCommandNames.toggleHeading, 2);
editor.execute(starterKitCommandNames.toggleBold);
editor.execute(starterKitCommandNames.setLink, {
  href: "https://example.com",
  title: "Example"
});
```
