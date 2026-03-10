import { CommonModule } from "@angular/common";
import {
  Component,
  ViewChild,
  signal,
  computed
} from "@angular/core";
import type { AfterViewInit, ElementRef, OnDestroy } from "@angular/core";

import type { JSONDocument } from "@lexion-rte/core";
import { starterKitCommandNames } from "@lexion-rte/starter-kit";
import { createLexionAngularAdapter } from "@lexion-rte/angular";

interface ToolbarButtonConfig {
  readonly label: string;
  readonly command: string;
  readonly args?: readonly unknown[];
}

const LINK_ATTRIBUTES = {
  href: "https://lexion.app",
  title: "Lexion"
} as const;

const toolbarButtons: readonly ToolbarButtonConfig[] = [
  { label: "Paragraph", command: starterKitCommandNames.setParagraph },
  { label: "H1", command: starterKitCommandNames.toggleHeading, args: [1] },
  { label: "H2", command: starterKitCommandNames.toggleHeading, args: [2] },
  { label: "H3", command: starterKitCommandNames.toggleHeading, args: [3] },
  { label: "Bold", command: starterKitCommandNames.toggleBold },
  { label: "Italic", command: starterKitCommandNames.toggleItalic },
  { label: "Code", command: starterKitCommandNames.toggleCode },
  { label: "Strike", command: starterKitCommandNames.toggleStrike },
  { label: "Underline", command: starterKitCommandNames.toggleUnderline },
  { label: "Quote", command: starterKitCommandNames.toggleBlockquote },
  { label: "Code Block", command: starterKitCommandNames.toggleCodeBlock },
  { label: "Bullet List", command: starterKitCommandNames.wrapBulletList },
  { label: "Ordered List", command: starterKitCommandNames.wrapOrderedList },
  { label: "Outdent", command: starterKitCommandNames.liftListItem },
  { label: "Indent", command: starterKitCommandNames.sinkListItem },
  { label: "Set Link", command: starterKitCommandNames.setLink, args: [LINK_ATTRIBUTES] },
  { label: "Unset Link", command: starterKitCommandNames.unsetLink },
  { label: "Rule", command: starterKitCommandNames.insertHorizontalRule },
  { label: "Break", command: starterKitCommandNames.insertHardBreak },
  { label: "Undo", command: starterKitCommandNames.undo },
  { label: "Redo", command: starterKitCommandNames.redo }
];

const createDoc = (): JSONDocument => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text: "Select text to try inline marks, links, and block transforms." }]
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "Use the toolbar to compare the full starter-kit command set." }]
    },
    {
      type: "bullet_list",
      content: [
        {
          type: "list_item",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Parent list item" }]
            }
          ]
        },
        {
          type: "list_item",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Place the cursor here to test indent, then outdent." }]
            }
          ]
        }
      ]
    }
  ]
});

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="shell">
      <h1>Angular Adapter Sample</h1>
      <p>Select text to test inline formatting and links. Place the cursor in the second list item to test indent, then outdent.</p>
      <div class="toolbar">
        <button
          *ngFor="let button of toolbarButtons"
          type="button"
          (mousedown)="$event.preventDefault()"
          (click)="runCommand(button)"
        >
          {{ button.label }}
        </button>
        <button type="button" (mousedown)="$event.preventDefault()" (click)="toggleReadOnly()">
          {{ readOnly() ? "Set Editable" : "Toggle Read Only" }}
        </button>
      </div>
      <section class="editor" #editorHost></section>
      <pre class="state">{{ state() }}</pre>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      color-scheme: light;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    }

    .shell {
      max-width: 860px;
      margin: 0 auto;
      padding: 24px;
    }

    .toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 12px;
    }

    button {
      border: 1px solid #cbd5e1;
      background: #ffffff;
      border-radius: 8px;
      padding: 8px 12px;
      cursor: pointer;
    }

    button:hover {
      background: #e2e8f0;
    }

    .editor {
      border: 1px solid #cbd5e1;
      background: #ffffff;
    }

    .state {
      margin-top: 12px;
      background: #0b1220;
      color: #d0e2ff;
      padding: 12px;
      border-radius: 10px;
      overflow: auto;
      font-size: 12px;
    }
  `]
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild("editorHost", { static: true })
  private readonly editorHost!: ElementRef<HTMLElement>;

  protected readonly toolbarButtons = toolbarButtons;
  protected readonly readOnly = signal(false);
  protected readonly touchedCount = signal(0);
  protected readonly value = signal<JSONDocument>(createDoc());
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
    this.adapter.writeValue(createDoc());
  }

  protected runCommand(button: ToolbarButtonConfig): void {
    const editor = this.adapter.editor;
    if (!editor) {
      return;
    }

    editor.execute(button.command, ...(button.args ?? []));
    const nextValue = editor.getJSON();
    this.value.set(nextValue);
    this.adapter.writeValue(nextValue);
  }
}
