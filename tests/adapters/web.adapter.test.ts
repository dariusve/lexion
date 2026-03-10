import { describe, expect, test } from "vitest";

import type { JSONDocument } from "@lexion-rte/core";
import { starterKitCommandNames } from "@lexion-rte/starter-kit";
import { createLexionWebEditor } from "@lexion-rte/web";

const createDoc = (text: string): JSONDocument => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text }]
    }
  ]
});

describe("@lexion-rte/web", () => {
  test("creates and updates a web editor instance", () => {
    const container = document.createElement("div");
    const editor = createLexionWebEditor({
      element: container,
      defaultValue: createDoc("hello")
    });

    expect(container.querySelector(".ProseMirror")).not.toBeNull();
    expect(container.querySelector(".lexion-editor-status-bar")).not.toBeNull();
    expect(container.textContent ?? "").toContain("Powered by lexion");

    editor.setValue(createDoc("updated"));
    expect(editor.getJSON()).toMatchObject({
      content: [
        {
          content: [{ text: "updated" }]
        }
      ]
    });

    editor.destroy();
    expect(() => editor.getJSON()).toThrow(/destroyed/);
  });

  test("preserves history when syncing the current document back in", () => {
    const container = document.createElement("div");
    const webEditor = createLexionWebEditor({
      element: container,
      defaultValue: createDoc("hello")
    });

    const editor = webEditor.editor;

    expect(editor.execute(starterKitCommandNames.toggleHeading, 2)).toBe(true);
    webEditor.setValue(editor.getJSON());

    expect(editor.execute(starterKitCommandNames.undo)).toBe(true);
    expect(editor.getJSON()).toMatchObject({
      content: [
        {
          type: "paragraph",
          content: [{ text: "hello" }]
        }
      ]
    });

    webEditor.destroy();
  });
});
