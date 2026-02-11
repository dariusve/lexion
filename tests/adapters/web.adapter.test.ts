import { describe, expect, test } from "vitest";

import type { JSONDocument } from "@lexion/core";
import { createLexionWebEditor } from "@lexion/web";

const createDoc = (text: string): JSONDocument => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text }]
    }
  ]
});

describe("@lexion/web", () => {
  test("creates and updates a web editor instance", () => {
    const container = document.createElement("div");
    const editor = createLexionWebEditor({
      element: container,
      defaultValue: createDoc("hello")
    });

    expect(container.querySelector(".ProseMirror")).not.toBeNull();

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
