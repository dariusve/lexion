import { describe, expect, test } from "vitest";

import { LexionEditor } from "@lexion/core";
import { starterKitExtension } from "@lexion/extensions";
import { fromText, toText } from "@lexion/tools";
import { createLexionWebEditor } from "@lexion/web";

describe("editor integration", () => {
  test("bridges tools + core + web adapter", () => {
    const editor = new LexionEditor({
      extensions: [starterKitExtension]
    });

    fromText(editor, "Line one\nLine two\n\nLine three");
    expect(toText(editor)).toContain("Line three");

    const container = document.createElement("div");
    const webEditor = createLexionWebEditor({
      element: container,
      editor
    });

    expect(container.querySelector(".ProseMirror")).not.toBeNull();
    expect(toText(webEditor.editor)).toContain("Line one");

    webEditor.destroy();
    editor.destroy();
  });
});
