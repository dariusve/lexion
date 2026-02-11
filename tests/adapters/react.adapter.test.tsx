import React from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, test } from "vitest";

import type { JSONDocument } from "@lexion/core";
import { LexionEditorView } from "@lexion/react";

const createDoc = (text: string): JSONDocument => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text }]
    }
  ]
});

describe("@lexion/react", () => {
  test("mounts and syncs controlled value", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

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

    expect(container.querySelector(".ProseMirror")).not.toBeNull();
    expect(readyEditorText).toContain("first");

    await act(async () => {
      root.render(<LexionEditorView value={createDoc("second")} />);
    });

    expect(container.textContent ?? "").toContain("second");

    await act(async () => {
      root.unmount();
    });
  });
});
