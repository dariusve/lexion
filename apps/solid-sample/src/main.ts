import { createSignal, onCleanup, onMount } from "solid-js";
import h from "solid-js/html";
import { render } from "solid-js/web";

import type { JSONDocument } from "@lexion-rte/core";
import { starterKitCommandNames } from "@lexion-rte/starter-kit";
import { createLexionSolidAdapter, type LexionSolidAdapter } from "@lexion-rte/solid";

import "./styles.css";

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

const App = () => {
  let editorHost: HTMLElement | undefined;
  let adapter: LexionSolidAdapter | null = null;

  const [readOnly, setReadOnly] = createSignal(false);
  const [state, setState] = createSignal(JSON.stringify(createDoc(), null, 2));

  onMount(() => {
    if (!editorHost) {
      throw new Error("Missing editor host");
    }

    adapter = createLexionSolidAdapter({
      defaultValue: createDoc(),
      onChange: (value) => {
        setState(JSON.stringify(value, null, 2));
      }
    });

    adapter.mount(editorHost);

    if (adapter.editor) {
      setState(JSON.stringify(adapter.editor.getJSON(), null, 2));
    }
  });

  onCleanup(() => {
    adapter?.destroy();
  });

  const runCommand = (button: ToolbarButtonConfig): void => {
    if (!adapter) {
      return;
    }
    adapter.execute(button.command, ...(button.args ?? []));
  };

  const toggleReadOnly = (): void => {
    if (!adapter) {
      return;
    }
    const next = !readOnly();
    setReadOnly(next);
    adapter.setReadOnly(next);
  };

  return h`<main class="shell">
    <h1>Solid Adapter Sample</h1>
    <p>Select text to test inline formatting and links. Place the cursor in the second list item to test indent, then outdent.</p>
    <div class="toolbar">
      ${toolbarButtons.map(
        (button) =>
          h`<button type="button" onMouseDown=${(event: MouseEvent) => event.preventDefault()} onClick=${() => runCommand(button)}>${button.label}</button>`
      )}
      <button type="button" onMouseDown=${(event: MouseEvent) => event.preventDefault()} onClick=${toggleReadOnly}>${() =>
        readOnly() ? "Set Editable" : "Toggle Read Only"}</button>
    </div>
    <section class="editor" ref=${(element: HTMLElement) => {
      editorHost = element;
    }}></section>
    <pre class="state">${state}</pre>
  </main>`;
};

const root = document.querySelector<HTMLElement>("#app");
if (!root) {
  throw new Error("Missing #app container");
}

render(() => App(), root);
