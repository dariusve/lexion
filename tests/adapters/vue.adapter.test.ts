import { createApp, defineComponent, h, nextTick, ref } from "vue";
import { describe, expect, test } from "vitest";

import type { JSONDocument, LexionEditor } from "@lexion/core";
import { LexionEditorView } from "@lexion/vue";

const createDoc = (text: string): JSONDocument => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text }]
    }
  ]
});

describe("@lexion/vue", () => {
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
    expect(container.textContent ?? "").toContain("Open Source Limited Version");
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
});
