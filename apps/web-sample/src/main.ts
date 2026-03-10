import type { JSONDocument } from "@lexion-rte/core";
import { starterKitCommandNames } from "@lexion-rte/starter-kit";
import { createLexionWebEditor } from "@lexion-rte/web";

import "./styles.css";

interface ToolbarButtonConfig {
  readonly label: string;
  readonly command: string;
  readonly args?: readonly unknown[];
}

const LINK_ATTRIBUTES = {
  href: "https://lexion.dev",
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
              content: [{ type: "text", text: "List item for indent and outdent commands" }]
            }
          ]
        }
      ]
    }
  ]
});

const root = document.querySelector<HTMLElement>("#app");
if (!root) {
  throw new Error("Missing #app container");
}

root.innerHTML = `
  <main class="shell">
    <h1>Web Adapter Sample</h1>
    <p>Select text to test inline formatting and links. Place the cursor in the list to test indent and outdent.</p>
    <div class="toolbar">
      ${toolbarButtons
        .map(
          (button, index) =>
            `<button data-command-index="${index}" type="button">${button.label}</button>`
        )
        .join("")}
      <button id="readonly" type="button">Toggle Read Only</button>
    </div>
    <section class="editor" id="editor"></section>
    <pre class="state" id="state"></pre>
  </main>
`;

const editorElement = root.querySelector<HTMLElement>("#editor");
const stateElement = root.querySelector<HTMLElement>("#state");
const commandButtons = [...root.querySelectorAll<HTMLButtonElement>("[data-command-index]")];
const readOnlyButton = root.querySelector<HTMLButtonElement>("#readonly");

if (!editorElement || !stateElement || commandButtons.length !== toolbarButtons.length || !readOnlyButton) {
  throw new Error("Missing sample DOM nodes");
}

let readOnly = false;

const editor = createLexionWebEditor({
  element: editorElement,
  defaultValue: createDoc(),
  onChange: (value) => {
    stateElement.textContent = JSON.stringify(value, null, 2);
  }
});

stateElement.textContent = JSON.stringify(editor.getJSON(), null, 2);

commandButtons.forEach((button, index) => {
  const config = toolbarButtons[index];
  button.addEventListener("click", () => {
    editor.execute(config.command, ...(config.args ?? []));
  });
});

readOnlyButton.addEventListener("click", () => {
  readOnly = !readOnly;
  editor.setReadOnly(readOnly);
  readOnlyButton.textContent = readOnly ? "Set Editable" : "Toggle Read Only";
});

window.addEventListener(
  "beforeunload",
  () => {
    editor.destroy();
  },
  { once: true }
);
