import { describe, expect, test, vi } from "vitest";

import type { JSONDocument, LexionEditor } from "@lexion-rte/core";
import { starterKitCommandNames } from "@lexion-rte/starter-kit";
import { createLexionSolidAdapter } from "@lexion-rte/solid";
import { createLexionVue2Adapter } from "@lexion-rte/vue2";
import { LexionAstroAdapter, mountLexionAstroEditor } from "@lexion-rte/astro";

import { createDoc, editableRoot } from "../helpers/documents.js";

// Solid, Vue 2 and Astro expose the same class-based API on top of @lexion-rte/web.
interface ClassAdapter {
  mount(element: HTMLElement): void;
  update(options: { value?: JSONDocument; readOnly?: boolean }): void;
  execute(command: string, ...args: readonly unknown[]): boolean;
  readonly editor: LexionEditor | null;
  destroy(): void;
}

type AdapterFactory = (options: {
  defaultValue: JSONDocument;
  onChange: (value: JSONDocument) => void;
  ariaLabel: string;
}) => ClassAdapter;

const adapters: ReadonlyArray<readonly [string, AdapterFactory]> = [
  ["@lexion-rte/solid", (options) => createLexionSolidAdapter(options)],
  ["@lexion-rte/vue2", (options) => createLexionVue2Adapter(options)],
  ["@lexion-rte/astro", (options) => new LexionAstroAdapter(options)]
];

describe.each(adapters)("%s", (_name, create) => {
  test("mounts, syncs value, emits changes and destroys", () => {
    const container = document.createElement("div");
    const onChange = vi.fn();
    const adapter = create({ defaultValue: createDoc("hello"), onChange, ariaLabel: "Body" });

    expect(adapter.editor).toBeNull();
    adapter.mount(container);

    const root = editableRoot(container);
    expect(root.textContent).toBe("hello");
    expect(root.getAttribute("role")).toBe("textbox");
    expect(root.getAttribute("aria-label")).toBe("Body");
    expect(container.textContent ?? "").toContain("Powered by lexion");

    adapter.update({ value: createDoc("synced") });
    expect(editableRoot(container).textContent).toBe("synced");
    expect(onChange).not.toHaveBeenCalled();

    adapter.update({ readOnly: true });
    expect(editableRoot(container).getAttribute("contenteditable")).toBe("false");
    expect(editableRoot(container).getAttribute("aria-readonly")).toBe("true");

    expect(adapter.execute(starterKitCommandNames.toggleHeading, 2)).toBe(true);
    expect(container.querySelector(".ProseMirror h2")?.textContent).toBe("synced");
    expect(onChange).toHaveBeenCalledTimes(1);

    adapter.destroy();
    expect(container.querySelector(".ProseMirror")).toBeNull();
    expect(container.querySelector(".lexion-editor-status-bar")).toBeNull();
    expect(adapter.editor).toBeNull();
  });
});

describe("@lexion-rte/astro mountLexionAstroEditor", () => {
  test("mounts immediately", () => {
    const element = document.createElement("div");
    const adapter = mountLexionAstroEditor({ element, defaultValue: createDoc("astro") });

    expect(editableRoot(element).textContent).toBe("astro");
    adapter.destroy();
    expect(element.querySelector(".ProseMirror")).toBeNull();
  });
});
