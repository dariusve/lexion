import { describe, expect, test } from "vitest";

import type { JSONDocument } from "@lexion-rte/core";
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
    expect(container.textContent ?? "").toContain("Open Source Limited Version");

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
});
