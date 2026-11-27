import { createApp, defineComponent, h, nextTick, ref } from "vue";
import { describe, expect, test, vi } from "vitest";
import { TextSelection } from "prosemirror-state";

import { LexionEditor, type JSONDocument } from "@lexion-rte/core";
import { starterKitCommandNames, starterKitExtension } from "@lexion-rte/starter-kit";
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
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    let editorRef = null as LexionEditor | null;
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

    const editorElement = container.querySelector<HTMLElement>(".ProseMirror");
    expect(editorElement).not.toBeNull();
    expect(getComputedStyle(editorElement!).whiteSpace).toBe("pre-wrap");
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

    const editorWarnCalls = warnSpy.mock.calls.filter(([message]) =>
      /ProseMirror expects the CSS white-space property|TextSelection endpoint not pointing into a node with inline content/.test(
        String(message)
      )
    );
    expect(editorWarnCalls).toHaveLength(0);
    warnSpy.mockRestore();
  });

  test("preserves history when controlled state echoes editor commands", async () => {
    const container = document.createElement("div");
    let editorRef = null as LexionEditor | null;
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

  test("reflects external editor changes and emits only for doc changes", async () => {
    const container = document.createElement("div");
    const editor = new LexionEditor({ doc: createDoc("hello"), extensions: [starterKitExtension] });
    const onChange = vi.fn();
    const onUpdate = vi.fn();
    const model = ref<JSONDocument>(createDoc("hello"));

    const app = createApp(
      defineComponent({
        setup() {
          return () =>
            h(LexionEditorView, {
              editor,
              modelValue: model.value,
              "onUpdate:modelValue": (nextValue: JSONDocument) => {
                onUpdate(nextValue);
                model.value = nextValue;
              },
              onChange
            });
        }
      })
    );

    app.mount(container);
    await nextTick();

    editor.dispatchTransaction(
      editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 3))
    );
    expect(onChange).not.toHaveBeenCalled();

    model.value = createDoc("from parent");
    await nextTick();
    expect(container.querySelector(".ProseMirror")?.textContent).toBe("from parent");
    expect(onUpdate).not.toHaveBeenCalled();

    editor.execute(starterKitCommandNames.toggleHeading, 2);
    expect(container.querySelector(".ProseMirror h2")?.textContent).toBe("from parent");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onUpdate).toHaveBeenCalledTimes(1);
    await nextTick();

    // The echoed (reactive-proxied) model value must not reset history.
    expect(editor.execute(starterKitCommandNames.undo)).toBe(true);

    app.unmount();
    editor.destroy();
  });
});
