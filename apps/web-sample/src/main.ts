import type { JSONDocument } from "@lexion-rte/core";
import { starterKitCommandNames } from "@lexion-rte/extensions";
import { createLexionWebEditor } from "@lexion-rte/web";

import "./styles.css";

const createDoc = (text: string): JSONDocument => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text }]
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
    <div class="toolbar">
      <button id="bold" type="button">Toggle Bold</button>
      <button id="readonly" type="button">Toggle Read Only</button>
    </div>
    <section class="editor" id="editor"></section>
    <pre class="state" id="state"></pre>
  </main>
`;

const editorElement = root.querySelector<HTMLElement>("#editor");
const stateElement = root.querySelector<HTMLElement>("#state");
const boldButton = root.querySelector<HTMLButtonElement>("#bold");
const readOnlyButton = root.querySelector<HTMLButtonElement>("#readonly");

if (!editorElement || !stateElement || !boldButton || !readOnlyButton) {
  throw new Error("Missing sample DOM nodes");
}

let readOnly = false;

const editor = createLexionWebEditor({
  element: editorElement,
  defaultValue: createDoc("Hello from @lexion-rte/web"),
  onChange: (value) => {
    stateElement.textContent = JSON.stringify(value, null, 2);
  }
});

stateElement.textContent = JSON.stringify(editor.getJSON(), null, 2);

boldButton.addEventListener("click", () => {
  editor.execute(starterKitCommandNames.toggleBold);
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
