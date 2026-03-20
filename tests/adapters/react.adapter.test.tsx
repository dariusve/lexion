import React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, test, vi } from "vitest";

import type { JSONDocument } from "@lexion-rte/core";
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

    const proseMirrorElement = container.querySelector<HTMLElement>(".ProseMirror");
    expect(proseMirrorElement).not.toBeNull();
    expect(getComputedStyle(proseMirrorElement!).whiteSpace).toBe("pre-wrap");
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

    const prosemirrorWarnCalls = warnSpy.mock.calls.filter(([message]) =>
      /ProseMirror expects the CSS white-space property|TextSelection endpoint not pointing into a node with inline content/.test(
        String(message)
      )
    );
    expect(prosemirrorWarnCalls).toHaveLength(0);
    warnSpy.mockRestore();
  });
});
