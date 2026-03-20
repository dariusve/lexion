import { describe, expect, test, vi } from "vitest";

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
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const editor = createLexionWebEditor({
      element: container,
      defaultValue: createDoc("hello")
    });

    expect(document.getElementById("lexion-web-editor-styles")).not.toBeNull();
    const proseMirrorElement = container.querySelector<HTMLElement>(".ProseMirror");
    expect(proseMirrorElement).not.toBeNull();
    expect(getComputedStyle(proseMirrorElement!).whiteSpace).toBe("pre-wrap");
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

    const prosemirrorWarnCalls = warnSpy.mock.calls.filter(([message]) =>
      /ProseMirror expects the CSS white-space property|TextSelection endpoint not pointing into a node with inline content/.test(
        String(message)
      )
    );
    expect(prosemirrorWarnCalls).toHaveLength(0);
    warnSpy.mockRestore();
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

  test("can skip base style injection when injectStyles is false", () => {
    const styleId = "lexion-web-editor-styles-no-inject-test";
    document.getElementById(styleId)?.remove();

    const container = document.createElement("div");
    const webEditor = createLexionWebEditor({
      element: container,
      injectStyles: false,
      styleInjectionOptions: { id: styleId }
    });

    expect(document.getElementById(styleId)).toBeNull();
    webEditor.destroy();
  });
});
