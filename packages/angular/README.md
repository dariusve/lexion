# @lexion-rte/angular

Angular integration helpers for Lexion.

## Overview

`@lexion-rte/angular` provides an adapter that:

- attaches/detaches editor lifecycle to Angular components
- supports value updates and read-only toggling
- exposes hooks compatible with form-style change/touched flow

## Install

```bash
pnpm add @lexion-rte/angular @angular/core @angular/forms
```

## Adapter API

Create adapter:

- `createLexionAngularAdapter(options?)`

Main methods:

- `attach(element)`
- `detach()`
- `update({ value?, readOnly?, onChange? })`
- `writeValue(value)`
- `setDisabledState(disabled)`
- `registerOnChange(handler)`
- `registerOnTouched(handler)`
- `markAsTouched()`
- `destroy()`

## Component Lifecycle Example

```ts
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { createLexionAngularAdapter } from "@lexion-rte/angular";

@Component({
  selector: "app-editor",
  template: `<div #editorHost></div>`
})
export class EditorComponent implements AfterViewInit, OnDestroy {
  @ViewChild("editorHost", { static: true })
  private editorHost!: ElementRef<HTMLElement>;

  private readonly adapter = createLexionAngularAdapter({
    onChange: (value) => {
      console.log("changed", value);
    }
  });

  ngAfterViewInit(): void {
    this.adapter.attach(this.editorHost.nativeElement);
  }

  ngOnDestroy(): void {
    this.adapter.destroy();
  }
}
```

## Notes

- `attach()` is idempotent for the same element.
- Use `setDisabledState(true)` for read-only behavior in form-driven components.
