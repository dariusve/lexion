import { CommonModule } from "@angular/common";
import {
  Component,
  ViewChild,
  signal,
  computed
} from "@angular/core";
import type { AfterViewInit, ElementRef, OnDestroy } from "@angular/core";

import type { JSONDocument } from "@lexion-rte/core";
import { createLexionAngularAdapter } from "@lexion-rte/angular";

const createDoc = (text: string): JSONDocument => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text }]
    }
  ]
});

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css"
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild("editorHost", { static: true })
  private readonly editorHost!: ElementRef<HTMLElement>;

  protected readonly readOnly = signal(false);
  protected readonly touchedCount = signal(0);
  protected readonly value = signal<JSONDocument>(createDoc("Hello from @lexion-rte/angular"));
  protected readonly state = computed(() =>
    JSON.stringify(
      {
        readOnly: this.readOnly(),
        touchedCount: this.touchedCount(),
        value: this.value()
      },
      null,
      2
    )
  );

  private readonly adapter = createLexionAngularAdapter({
    defaultValue: this.value(),
    onChange: (nextValue) => {
      this.value.set(nextValue);
    }
  });

  public constructor() {
    this.adapter.registerOnTouched(() => {
      this.touchedCount.update((count) => count + 1);
    });
  }

  public ngAfterViewInit(): void {
    this.adapter.attach(this.editorHost.nativeElement);
  }

  public ngOnDestroy(): void {
    this.adapter.destroy();
  }

  protected toggleReadOnly(): void {
    const nextReadOnly = !this.readOnly();
    this.readOnly.set(nextReadOnly);
    this.adapter.setDisabledState(nextReadOnly);
  }

  protected rewriteValue(): void {
    this.adapter.writeValue(createDoc("Updated via Angular adapter writeValue()"));
  }
}
