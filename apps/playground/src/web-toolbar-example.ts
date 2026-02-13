import type { JSONDocument } from "@lexion-rte/core";
import { starterKitCommandNames } from "@lexion-rte/extensions";
import { createLexionWebEditor, type LexionWebEditor } from "@lexion-rte/web";

import type { PlaygroundExampleHandle } from "./vue-examples.js";

export interface ToolbarButtonConfig {
  readonly label: string;
  readonly command: string;
  readonly args?: readonly unknown[];
}

export interface SampleToolbarAdapterOptions {
  readonly element: HTMLElement;
  readonly value?: JSONDocument;
  readonly buttons?: readonly ToolbarButtonConfig[];
}

const createInitialDocument = (): JSONDocument => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text: "Toolbar sample ready" }]
    }
  ]
});

const defaultToolbarButtons: readonly ToolbarButtonConfig[] = [
  {
    label: "Bold",
    command: starterKitCommandNames.toggleBold
  },
  {
    label: "Italic",
    command: starterKitCommandNames.toggleItalic
  },
  {
    label: "H2",
    command: starterKitCommandNames.toggleHeading,
    args: [2]
  },
  {
    label: "Bullet List",
    command: starterKitCommandNames.wrapBulletList
  },
  {
    label: "Undo",
    command: starterKitCommandNames.undo
  },
  {
    label: "Redo",
    command: starterKitCommandNames.redo
  }
];

const createWrapper = (): {
  readonly root: HTMLDivElement;
  readonly toolbar: HTMLDivElement;
  readonly editorHost: HTMLDivElement;
} => {
  const root = document.createElement("div");
  root.className = "lexion-toolbar-sample";

  const toolbar = document.createElement("div");
  toolbar.className = "lexion-toolbar";

  const editorHost = document.createElement("div");
  editorHost.className = "lexion-editor-host";

  root.appendChild(toolbar);
  root.appendChild(editorHost);

  return { root, toolbar, editorHost };
};

const createToolbarButton = (config: ToolbarButtonConfig): HTMLButtonElement => {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = config.label;
  button.className = "lexion-toolbar-button";
  return button;
};

export class SampleToolbarAdapter {
  private readonly root: HTMLDivElement;
  private readonly destroyHandlers: Array<() => void> = [];
  private readonly editor: LexionWebEditor;

  public constructor(options: SampleToolbarAdapterOptions) {
    const { root, toolbar, editorHost } = createWrapper();
    this.root = root;
    options.element.appendChild(root);

    this.editor = createLexionWebEditor({
      element: editorHost,
      defaultValue: options.value ?? createInitialDocument()
    });

    for (const buttonConfig of options.buttons ?? defaultToolbarButtons) {
      const button = createToolbarButton(buttonConfig);
      const onClick = (): void => {
        try {
          this.editor.execute(buttonConfig.command, ...(buttonConfig.args ?? []));
        } catch {
          // Sample adapter keeps UX resilient; command may be unavailable for custom schemas.
        }
      };

      button.addEventListener("click", onClick);
      toolbar.appendChild(button);
      this.destroyHandlers.push(() => {
        button.removeEventListener("click", onClick);
      });
    }
  }

  public getEditorJSON(): JSONDocument {
    return this.editor.getJSON();
  }

  public destroy(): void {
    for (const cleanup of this.destroyHandlers) {
      cleanup();
    }
    this.destroyHandlers.length = 0;
    this.editor.destroy();
    this.root.remove();
  }
}

export const mountWebToolbarExample = (element: HTMLElement): PlaygroundExampleHandle => {
  const adapter = new SampleToolbarAdapter({ element });
  return {
    unmount: () => {
      adapter.destroy();
    }
  };
};
