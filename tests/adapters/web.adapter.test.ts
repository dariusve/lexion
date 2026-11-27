import { describe, expect, test, vi } from "vitest";
import { TextSelection } from "prosemirror-state";

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
    const editorElement = container.querySelector<HTMLElement>(".ProseMirror");
    expect(editorElement).not.toBeNull();
    expect(getComputedStyle(editorElement!).whiteSpace).toBe("pre-wrap");
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

    const editorWarnCalls = warnSpy.mock.calls.filter(([message]) =>
      /ProseMirror expects the CSS white-space property|TextSelection endpoint not pointing into a node with inline content/.test(
        String(message)
      )
    );
    expect(editorWarnCalls).toHaveLength(0);
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

  test("emits onChange only for document changes", () => {
    const container = document.createElement("div");
    const onChange = vi.fn();
    const webEditor = createLexionWebEditor({
      element: container,
      defaultValue: createDoc("hello"),
      onChange
    });
    const editor = webEditor.editor;

    // Selection-only transaction
    editor.dispatchTransaction(
      editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 3))
    );
    expect(onChange).not.toHaveBeenCalled();

    // Command that cannot run (nothing to undo)
    expect(webEditor.execute(starterKitCommandNames.undo)).toBe(false);
    expect(onChange).not.toHaveBeenCalled();

    // Controlled value applied by the adapter is not echoed back
    webEditor.setValue(createDoc("from parent"));
    expect(onChange).not.toHaveBeenCalled();
    expect(container.textContent ?? "").toContain("from parent");

    expect(webEditor.execute(starterKitCommandNames.toggleHeading, 2)).toBe(true);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]?.[0].content[0]).toMatchObject({ type: "heading" });

    // Passing the emitted value back is a no-op
    webEditor.setValue(onChange.mock.calls[0]?.[0]);
    expect(editor.execute(starterKitCommandNames.undo)).toBe(true);

    webEditor.destroy();
  });

  test("updates the view when the underlying editor changes directly", () => {
    const container = document.createElement("div");
    const onChange = vi.fn();
    const webEditor = createLexionWebEditor({
      element: container,
      defaultValue: createDoc("hello"),
      onChange
    });

    webEditor.editor.execute(starterKitCommandNames.toggleHeading, 2);
    expect(container.querySelector(".ProseMirror h2")?.textContent).toBe("hello");
    expect(onChange).toHaveBeenCalledTimes(1);

    webEditor.editor.setJSON(createDoc("replaced"));
    expect(container.querySelector(".ProseMirror")?.textContent).toBe("replaced");
    expect(onChange).toHaveBeenCalledTimes(2);

    webEditor.destroy();
  });

  test("exposes textbox semantics and updates ARIA attributes", () => {
    const container = document.createElement("div");
    const webEditor = createLexionWebEditor({
      element: container,
      defaultValue: createDoc("hello"),
      ariaLabel: "Message body"
    });
    const root = container.querySelector<HTMLElement>(".ProseMirror")!;

    expect(root.getAttribute("role")).toBe("textbox");
    expect(root.getAttribute("aria-multiline")).toBe("true");
    expect(root.getAttribute("aria-label")).toBe("Message body");
    expect(root.getAttribute("aria-readonly")).toBe("false");

    webEditor.update({ readOnly: true, ariaLabelledBy: "heading-id" });
    expect(root.getAttribute("aria-readonly")).toBe("true");
    expect(root.getAttribute("contenteditable")).toBe("false");
    expect(root.getAttribute("aria-labelledby")).toBe("heading-id");
    expect(root.getAttribute("aria-label")).toBe("Message body");

    webEditor.destroy();
  });

  test("styles the status bar with themeable classes, not inline styles", () => {
    const container = document.createElement("div");
    const webEditor = createLexionWebEditor({ element: container });
    const statusBar = container.querySelector<HTMLElement>(".lexion-editor-status-bar")!;
    const branding = container.querySelector<HTMLElement>(".lexion-editor-status-item--branding")!;

    expect(statusBar.getAttribute("style")).toBeNull();
    expect(branding.getAttribute("style")).toBeNull();
    expect(branding.textContent).toBe("Powered by lexion");
    expect(document.getElementById("lexion-web-editor-styles")?.textContent).toContain(
      ":where(.lexion-editor-status-bar)"
    );
    expect(getComputedStyle(statusBar).whiteSpace).toBe("nowrap");

    webEditor.destroy();
  });
});
