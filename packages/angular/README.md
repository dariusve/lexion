# @lexion-rte/angular

Angular adapter utilities for Lexion.

## What It Is

`@lexion-rte/angular` provides `createLexionAngularAdapter` to attach/detach the editor and bridge value/touched callbacks.

## Install

```bash
pnpm add @lexion-rte/angular @angular/core @angular/forms
```

## Usage

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

  private readonly adapter = createLexionAngularAdapter();

  ngAfterViewInit(): void {
    this.adapter.attach(this.editorHost.nativeElement);
  }

  ngOnDestroy(): void {
    this.adapter.destroy();
  }
}
```

