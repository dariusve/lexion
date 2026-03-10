import { createApp, defineComponent, h, nextTick, ref } from "vue";
import { describe, expect, test } from "vitest";

import type { JSONDocument, LexionEditor } from "@lexion-rte/core";
import { starterKitCommandNames } from "@lexion-rte/starter-kit";
import { LexionEditorView } from "@lexion-rte/vue";

const createDoc = (text: string): JSONDocument => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text }]
    }
  ]
});

describe("@lexion-rte/vue", () => {
  test("mounts and syncs controlled model", async () => {
    const container = document.createElement("div");
    let editorRef: LexionEditor | null = null;
    const model = ref<JSONDocument>(createDoc("first"));

    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h(LexionEditorView, {
              modelValue: model.value,
              "onUpdate:modelValue": (nextValue: JSONDocument) => {
                model.value = nextValue;
              },
              onReady: (editor: LexionEditor) => {
                editorRef = editor;
              }
            });
        }
      })
    );

    app.mount(container);
    await nextTick();

    expect(container.querySelector(".ProseMirror")).not.toBeNull();
    expect(container.querySelector(".lexion-editor-status-bar")).not.toBeNull();
    expect(container.textContent ?? "").toContain("Powered by lexion");
    expect(editorRef?.getJSON()).toMatchObject({
      content: [
        {
          content: [{ text: "first" }]
        }
      ]
    });

    model.value = createDoc("second");
    await nextTick();

    expect(editorRef?.getJSON()).toMatchObject({
      content: [
        {
          content: [{ text: "second" }]
        }
      ]
    });

    app.unmount();
  });

  test("preserves history when controlled state echoes editor commands", async () => {
    const container = document.createElement("div");
    let editorRef: LexionEditor | null = null;
    const model = ref<JSONDocument>(createDoc("first"));

    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h(LexionEditorView, {
              modelValue: model.value,
              "onUpdate:modelValue": (nextValue: JSONDocument) => {
                model.value = nextValue;
              },
              onReady: (editor: LexionEditor) => {
                editorRef = editor;
              }
            });
        }
      })
    );

    app.mount(container);
    await nextTick();

    expect(editorRef?.execute(starterKitCommandNames.toggleHeading, 2)).toBe(true);
    model.value = editorRef!.getJSON();
    await nextTick();

    expect(editorRef?.execute(starterKitCommandNames.undo)).toBe(true);
    expect(editorRef?.getJSON()).toMatchObject({
      content: [
        {
          type: "paragraph",
          content: [{ text: "first" }]
        }
      ]
    });

    app.unmount();
  });
});
