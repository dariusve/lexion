import type { JSONDocument } from "@lexion-rte/core";
import { starterKitCommandNames } from "@lexion-rte/starter-kit";
import {
  createLexionToolbar,
  createToolbarSeparatorItem,
  injectLexionToolbarStyles,
  lexionToolbarIcons,
  type LexionToolbar,
  type LexionToolbarItemInput
} from "@lexion-rte/ui";
import { createLexionWebEditor, type LexionWebEditor } from "@lexion-rte/web";

import type { PlaygroundExampleHandle } from "./vue-examples.js";
import { createStarterKitSampleDocument } from "./starter-kit-buttons.js";

export type ToolbarButtonConfig = LexionToolbarItemInput;

export interface SampleToolbarAdapterOptions {
  readonly element: HTMLElement;
  readonly value?: JSONDocument;
  readonly buttons?: readonly ToolbarButtonConfig[];
}

const LINK_ATTRIBUTES = {
  href: "https://lexion.app",
  title: "Lexion"
} as const;

const defaultToolbarButtons: readonly ToolbarButtonConfig[] = [
  {
    id: "paragraph",
    iconClass: lexionToolbarIcons.paragraph,
    title: "Paragraph",
    command: starterKitCommandNames.setParagraph
  },
  createToolbarSeparatorItem("sep-1"),
  {
    id: "headings",
    iconClass: lexionToolbarIcons.heading,
    title: "Headings",
    items: [
      {
        id: "heading-1",
        iconClass: lexionToolbarIcons.heading1,
        label: "Heading 1",
        command: starterKitCommandNames.toggleHeading,
        args: [1]
      },
      {
        id: "heading-2",
        iconClass: lexionToolbarIcons.heading2,
        label: "Heading 2",
        command: starterKitCommandNames.toggleHeading,
        args: [2]
      },
      {
        id: "heading-3",
        iconClass: lexionToolbarIcons.heading3,
        label: "Heading 3",
        command: starterKitCommandNames.toggleHeading,
        args: [3]
      }
    ]
  },
  createToolbarSeparatorItem("sep-2"),
  {
    id: "inline-format",
    iconClass: lexionToolbarIcons.textFormat,
    title: "Inline Format",
    items: [
      {
        id: "bold",
        iconClass: lexionToolbarIcons.bold,
        label: "Bold",
        command: starterKitCommandNames.toggleBold
      },
      {
        id: "italic",
        iconClass: lexionToolbarIcons.italic,
        label: "Italic",
        command: starterKitCommandNames.toggleItalic
      },
      {
        id: "underline",
        iconClass: lexionToolbarIcons.underline,
        label: "Underline",
        command: starterKitCommandNames.toggleUnderline
      },
      {
        id: "strike",
        iconClass: lexionToolbarIcons.strike,
        label: "Strike",
        command: starterKitCommandNames.toggleStrike
      },
      {
        id: "code",
        iconClass: lexionToolbarIcons.code,
        label: "Code",
        command: starterKitCommandNames.toggleCode
      }
    ]
  },
  createToolbarSeparatorItem("sep-3"),
  {
    id: "lists",
    iconClass: lexionToolbarIcons.bulletList,
    title: "Lists",
    items: [
      {
        id: "bullet-list",
        iconClass: lexionToolbarIcons.bulletList,
        label: "Bullet List",
        command: starterKitCommandNames.wrapBulletList
      },
      {
        id: "ordered-list",
        iconClass: lexionToolbarIcons.orderedList,
        label: "Ordered List",
        command: starterKitCommandNames.wrapOrderedList
      },
      {
        id: "indent",
        iconClass: lexionToolbarIcons.indent,
        label: "Indent",
        command: starterKitCommandNames.sinkListItem
      },
      {
        id: "outdent",
        iconClass: lexionToolbarIcons.outdent,
        label: "Outdent",
        command: starterKitCommandNames.liftListItem
      }
    ]
  },
  createToolbarSeparatorItem("sep-4"),
  {
    id: "links",
    iconClass: lexionToolbarIcons.link,
    title: "Links",
    items: [
      {
        id: "set-link",
        iconClass: lexionToolbarIcons.link,
        label: "Set Link",
        command: starterKitCommandNames.setLink,
        args: [LINK_ATTRIBUTES]
      },
      {
        id: "unset-link",
        iconClass: lexionToolbarIcons.unlink,
        label: "Unset Link",
        command: starterKitCommandNames.unsetLink
      }
    ]
  },
  createToolbarSeparatorItem("sep-5"),
  {
    id: "undo",
    iconClass: lexionToolbarIcons.undo,
    title: "Undo",
    command: starterKitCommandNames.undo
  },
  {
    id: "redo",
    iconClass: lexionToolbarIcons.redo,
    title: "Redo",
    command: starterKitCommandNames.redo
  }
];

const createWrapper = (): {
  readonly root: HTMLDivElement;
  readonly toolbarHost: HTMLDivElement;
  readonly editorHost: HTMLDivElement;
} => {
  const root = document.createElement("div");
  root.className = "lexion-toolbar-sample";

  const toolbarHost = document.createElement("div");
  toolbarHost.className = "lexion-toolbar";

  const editorHost = document.createElement("div");
  editorHost.className = "lexion-editor-host";

  root.appendChild(toolbarHost);
  root.appendChild(editorHost);

  return { root, toolbarHost, editorHost };
};

export class SampleToolbarAdapter {
  private readonly root: HTMLDivElement;
  private readonly editor: LexionWebEditor;
  private readonly toolbar: LexionToolbar;

  public constructor(options: SampleToolbarAdapterOptions) {
    injectLexionToolbarStyles();

    const { root, toolbarHost, editorHost } = createWrapper();
    this.root = root;
    options.element.appendChild(root);

    this.editor = createLexionWebEditor({
      element: editorHost,
      defaultValue: options.value ?? createStarterKitSampleDocument()
    });

    this.toolbar = createLexionToolbar({
      element: toolbarHost,
      editor: this.editor,
      items: options.buttons ?? defaultToolbarButtons
    });

    if (!options.buttons) {
      this.toolbar.disableItem("redo");
    }
  }

  public getEditorJSON(): JSONDocument {
    return this.editor.getJSON();
  }

  public destroy(): void {
    this.toolbar.destroy();
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
