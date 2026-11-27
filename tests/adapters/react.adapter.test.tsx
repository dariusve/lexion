import React, { StrictMode } from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, test, vi } from "vitest";
import { TextSelection } from "prosemirror-state";

import { LexionEditor, type JSONDocument } from "@lexion-rte/core";
import { starterKitCommandNames, starterKitExtension } from "@lexion-rte/starter-kit";
import { LexionEditorView } from "@lexion-rte/react";

const createDoc = (text: string): JSONDocument => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text }]
    }
  ]
});

describe("@lexion-rte/react", () => {
  test("mounts and syncs controlled value", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const root = createRoot(container);
    let readyEditorText = "";

    await act(async () => {
      root.render(
        <LexionEditorView
          value={createDoc("first")}
          onReady={(editor) => {
            readyEditorText = JSON.stringify(editor.getJSON());
          }}
        />
      );
    });

    const editorElement = container.querySelector<HTMLElement>(".ProseMirror");
    expect(editorElement).not.toBeNull();
    expect(getComputedStyle(editorElement!).whiteSpace).toBe("pre-wrap");
    expect(container.querySelector(".lexion-editor-status-bar")).not.toBeNull();
    expect(readyEditorText).toContain("first");
    expect(container.textContent ?? "").toContain("Powered by lexion");

    await act(async () => {
      root.render(<LexionEditorView value={createDoc("second")} />);
    });

    expect(container.textContent ?? "").toContain("second");

    await act(async () => {
      root.unmount();
    });

    const editorWarnCalls = warnSpy.mock.calls.filter(([message]) =>
      /ProseMirror expects the CSS white-space property|TextSelection endpoint not pointing into a node with inline content/.test(
        String(message)
      )
    );
    expect(editorWarnCalls).toHaveLength(0);
    warnSpy.mockRestore();
  });

  test("mounts under StrictMode with an internal editor", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    const onChange = vi.fn();

    await act(async () => {
      root.render(
        <StrictMode>
          <LexionEditorView defaultValue={createDoc("strict")} onChange={onChange} />
        </StrictMode>
      );
    });

    const editorElement = container.querySelector<HTMLElement>(".ProseMirror");
    expect(editorElement).not.toBeNull();
    expect(container.querySelectorAll(".ProseMirror")).toHaveLength(1);
    expect(container.textContent ?? "").toContain("strict");
    expect(container.textContent ?? "").toContain("Powered by lexion");

    await act(async () => {
      root.render(
        <StrictMode>
          <LexionEditorView value={createDoc("updated")} onChange={onChange} />
        </StrictMode>
      );
    });
    expect(container.textContent ?? "").toContain("updated");

    await act(async () => {
      root.unmount();
    });
    container.remove();
  });

  test("uses a provided editor under StrictMode and does not destroy it", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    const editor = new LexionEditor({
      doc: createDoc("external"),
      extensions: [starterKitExtension]
    });
    const readyEditors: LexionEditor[] = [];

    await act(async () => {
      root.render(
        <StrictMode>
          <LexionEditorView editor={editor} onReady={(ready) => readyEditors.push(ready)} />
        </StrictMode>
      );
    });

    expect(readyEditors.length).toBeGreaterThan(0);
    expect(readyEditors.every((ready) => ready === editor)).toBe(true);
    expect(container.textContent ?? "").toContain("external");

    await act(async () => {
      root.unmount();
    });

    expect(() => editor.getJSON()).not.toThrow();
    editor.destroy();
    container.remove();
  });

  test("reflects external editor changes and emits onChange only for doc changes", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    const editor = new LexionEditor({
      doc: createDoc("hello"),
      extensions: [starterKitExtension]
    });
    const onChange = vi.fn();

    await act(async () => {
      root.render(<LexionEditorView editor={editor} onChange={onChange} />);
    });

    await act(async () => {
      editor.dispatchTransaction(
        editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 3))
      );
    });
    expect(onChange).not.toHaveBeenCalled();

    await act(async () => {
      editor.execute(starterKitCommandNames.toggleHeading, 2);
    });
    expect(container.querySelector(".ProseMirror h2")?.textContent).toBe("hello");
    expect(onChange).toHaveBeenCalledTimes(1);

    await act(async () => {
      root.unmount();
    });
    editor.destroy();
    container.remove();
  });

  test("does not echo controlled value updates through onChange", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    const onChange = vi.fn();

    await act(async () => {
      root.render(<LexionEditorView value={createDoc("first")} onChange={onChange} />);
    });
    await act(async () => {
      root.render(<LexionEditorView value={createDoc("second")} onChange={onChange} />);
    });

    expect(container.querySelector(".ProseMirror")?.textContent).toBe("second");
    expect(onChange).not.toHaveBeenCalled();

    await act(async () => {
      root.unmount();
    });
    container.remove();
  });
});
