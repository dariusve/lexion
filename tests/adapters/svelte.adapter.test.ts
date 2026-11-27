import { describe, expect, test, vi } from "vitest";

import { LexionEditor } from "@lexion-rte/core";
import { starterKitCommandNames, starterKitExtension } from "@lexion-rte/starter-kit";
import { lexion } from "@lexion-rte/svelte";

import { createDoc, editableRoot } from "../helpers/documents.js";

describe("@lexion-rte/svelte", () => {
  test("action mounts, updates and destroys", () => {
    const node = document.createElement("div");
    const onChange = vi.fn();
    const action = lexion(node, { value: createDoc("hello"), onChange, ariaLabel: "Notes" });

    expect(editableRoot(node).textContent).toBe("hello");
    expect(editableRoot(node).getAttribute("aria-label")).toBe("Notes");

    action.update({ value: createDoc("updated"), onChange });
    expect(editableRoot(node).textContent).toBe("updated");
    expect(onChange).not.toHaveBeenCalled();

    action.update({ readOnly: true });
    expect(editableRoot(node).getAttribute("contenteditable")).toBe("false");

    action.destroy();
    expect(node.querySelector(".ProseMirror")).toBeNull();
  });

  test("switches to a new shared editor", () => {
    const node = document.createElement("div");
    const first = new LexionEditor({ doc: createDoc("first"), extensions: [starterKitExtension] });
    const second = new LexionEditor({
      doc: createDoc("second"),
      extensions: [starterKitExtension]
    });
    const onChange = vi.fn();
    const action = lexion(node, { editor: first, onChange });

    action.update({ editor: second });
    expect(node.querySelectorAll(".ProseMirror")).toHaveLength(1);
    expect(editableRoot(node).textContent).toBe("second");

    second.execute(starterKitCommandNames.toggleHeading, 2);
    expect(onChange).toHaveBeenCalledWith(expect.anything(), second);

    action.destroy();
    // Shared editors are owned by the caller.
    expect(first.isDestroyed).toBe(false);
    expect(second.isDestroyed).toBe(false);
    first.destroy();
    second.destroy();
  });
});
