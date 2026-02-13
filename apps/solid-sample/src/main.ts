import { createSignal, onCleanup, onMount } from "solid-js";
import h from "solid-js/html";
import { render } from "solid-js/web";

import type { JSONDocument } from "@lexion-rte/core";
import { starterKitCommandNames } from "@lexion-rte/extensions";
import { createLexionSolidAdapter, type LexionSolidAdapter } from "@lexion-rte/solid";

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

const App = () => {
  let editorHost: HTMLElement | undefined;
  let adapter: LexionSolidAdapter | null = null;

  const [readOnly, setReadOnly] = createSignal(false);
  const [state, setState] = createSignal(JSON.stringify(createDoc("Hello from @lexion-rte/solid"), null, 2));

  onMount(() => {
    if (!editorHost) {
      throw new Error("Missing editor host");
    }

    adapter = createLexionSolidAdapter({
      defaultValue: createDoc("Hello from @lexion-rte/solid"),
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

  const toggleBold = (): void => {
    if (!adapter) {
      return;
    }
    adapter.execute(starterKitCommandNames.toggleBold);
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
    <div class="toolbar">
      <button type="button" onClick=${toggleBold}>Toggle Bold</button>
      <button type="button" onClick=${toggleReadOnly}>${() =>
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
