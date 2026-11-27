import { describe, expect, test } from "vitest";
import { TextSelection } from "prosemirror-state";
import type { EditorView } from "prosemirror-view";

import { LexionViewController } from "@lexion-rte/web";

import { createDoc } from "../helpers/documents.js";

const mount = (text: string) => {
  const element = document.createElement("div");
  document.body.appendChild(element);
  const defaultValue =
    text === "" ? { type: "doc", content: [{ type: "paragraph" }] } : createDoc(text);
  const controller = new LexionViewController({ element, defaultValue });
  return { controller, view: controller.view, element };
};

/** Simulates typing `text` at the cursor the way ProseMirror's DOM observer would. */
const type = (view: EditorView, text: string): void => {
  for (const char of text) {
    const { from, to } = view.state.selection;
    const handled = view.someProp("handleTextInput", (handler) =>
      handler(view, from, to, char, () => view.state.tr.insertText(char, from, to))
    );
    if (!handled) {
      view.dispatch(view.state.tr.insertText(char, from, to));
    }
  }
};

const press = (view: EditorView, key: string, modifiers: KeyboardEventInit = {}): void => {
  view.dom.dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...modifiers })
  );
};

const selectAll = (view: EditorView): void => {
  view.dispatch(
    view.state.tr.setSelection(
      TextSelection.create(view.state.doc, 1, view.state.doc.firstChild!.nodeSize - 1)
    )
  );
};

describe("starter-kit keyboard shortcuts", () => {
  test("Mod-b toggles bold and Mod-z / Mod-y undo and redo", () => {
    const { controller, view } = mount("hello");
    selectAll(view);

    press(view, "b", { ctrlKey: true });
    expect(view.dom.querySelector("strong")?.textContent).toBe("hello");

    press(view, "z", { ctrlKey: true });
    expect(view.dom.querySelector("strong")).toBeNull();

    press(view, "y", { ctrlKey: true });
    expect(view.dom.querySelector("strong")).not.toBeNull();
    controller.destroy();
  });

  test("Mod-Alt-2 makes a heading", () => {
    const { controller, view } = mount("title");
    press(view, "2", { ctrlKey: true, altKey: true });
    expect(view.dom.querySelector("h2")?.textContent).toBe("title");
    controller.destroy();
  });
});

describe("starter-kit input rules", () => {
  const cursorAtStart = (view: EditorView): void => {
    view.dispatch(view.state.tr.setSelection(TextSelection.create(view.state.doc, 1)));
  };

  test.each([
    ["## ", "h2"],
    ["> ", "blockquote"],
    ["- ", "ul"],
    ["1. ", "ol"],
    ["```", "pre"]
  ])("typing %j creates <%s>", (input, tag) => {
    const { controller, view } = mount("");
    cursorAtStart(view);
    type(view, input);
    expect(view.dom.querySelector(tag)).not.toBeNull();
    controller.destroy();
  });

  test("--- on an empty line becomes a horizontal rule", () => {
    const { controller, view } = mount("");
    cursorAtStart(view);
    type(view, "---");
    expect(view.dom.querySelector("hr")).not.toBeNull();
    controller.destroy();
  });

  test("--- inside existing text does not", () => {
    const { controller, view } = mount("abc");
    cursorAtStart(view);
    type(view, "---");
    expect(view.dom.querySelector("hr")).toBeNull();
    controller.destroy();
  });
});
