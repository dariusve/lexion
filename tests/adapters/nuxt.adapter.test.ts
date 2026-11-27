import { createApp, defineComponent, h, nextTick, ref } from "vue";
import { describe, expect, test, vi } from "vitest";

import type { JSONDocument, LexionEditor } from "@lexion-rte/core";
import { starterKitCommandNames } from "@lexion-rte/starter-kit";
import { LexionNuxtEditorView } from "@lexion-rte/nuxt";

import { createDoc, editableRoot } from "../helpers/documents.js";

describe("@lexion-rte/nuxt", () => {
  test("renders client-side only, syncs v-model and destroys", async () => {
    const container = document.createElement("div");
    const model = ref<JSONDocument>(createDoc("nuxt"));
    const onChange = vi.fn();
    let editorRef = null as LexionEditor | null;

    const app = createApp(
      defineComponent({
        setup: () => () =>
          h(LexionNuxtEditorView, {
            modelValue: model.value,
            ariaLabel: "Nuxt editor",
            "onUpdate:modelValue": (value: JSONDocument) => {
              model.value = value;
            },
            onChange,
            onReady: (editor: LexionEditor) => {
              editorRef = editor;
            }
          })
      })
    );

    app.mount(container);
    // First render is empty (SSR-safe); the view mounts after onMounted.
    await nextTick();
    await nextTick();

    expect(editableRoot(container).textContent).toBe("nuxt");
    expect(editableRoot(container).getAttribute("aria-label")).toBe("Nuxt editor");

    model.value = createDoc("updated");
    await nextTick();
    expect(editableRoot(container).textContent).toBe("updated");
    expect(onChange).not.toHaveBeenCalled();

    editorRef!.execute(starterKitCommandNames.toggleHeading, 2);
    expect(onChange).toHaveBeenCalledTimes(1);

    app.unmount();
    expect(container.querySelector(".ProseMirror")).toBeNull();
  });
});
