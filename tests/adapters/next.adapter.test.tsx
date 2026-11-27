import React, { StrictMode, act } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, test } from "vitest";

import { LexionNextEditorView } from "@lexion-rte/next";

import { createDoc, editableRoot } from "../helpers/documents.js";

describe("@lexion-rte/next", () => {
  test("renders the React view under StrictMode", async () => {
    const container = document.createElement("div");
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <StrictMode>
          <LexionNextEditorView defaultValue={createDoc("next")} ariaLabel="Next editor" />
        </StrictMode>
      );
    });

    expect(container.querySelectorAll(".ProseMirror")).toHaveLength(1);
    expect(editableRoot(container).textContent).toBe("next");
    expect(editableRoot(container).getAttribute("aria-label")).toBe("Next editor");

    await act(async () => {
      root.render(
        <StrictMode>
          <LexionNextEditorView value={createDoc("controlled")} />
        </StrictMode>
      );
    });
    expect(editableRoot(container).textContent).toBe("controlled");

    await act(async () => {
      root.unmount();
    });
    expect(container.querySelector(".ProseMirror")).toBeNull();
  });
});
