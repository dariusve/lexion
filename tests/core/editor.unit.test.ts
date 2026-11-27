import { describe, expect, test, vi } from "vitest";
import { TextSelection } from "prosemirror-state";

import {
  LexionEditor,
  LEXION_BRANDING_CLASS_NAME,
  createCoreSchema,
  type JSONArray,
  type JSONDocument,
  type LexionEditorUpdateEvent,
  type LexionExtension
} from "@lexion-rte/core";
import { starterKitCommandNames, starterKitExtension } from "@lexion-rte/starter-kit";

const createDoc = (text: string): JSONDocument => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text }]
    }
  ]
});

const createListDoc = (): JSONDocument => ({
  type: "doc",
  content: [
    {
      type: "bullet_list",
      content: [
        {
          type: "list_item",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Parent list item" }]
            }
          ]
        },
        {
          type: "list_item",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Child list item" }]
            }
          ]
        }
      ]
    }
  ]
});

const selectText = (editor: LexionEditor, text: string): void => {
  let selectionPosition: number | null = null;

  editor.state.doc.descendants((node, position) => {
    if (selectionPosition !== null || !node.isText || node.text !== text) {
      return selectionPosition === null;
    }

    selectionPosition = position + 1;
    return false;
  });

  if (selectionPosition === null) {
    throw new Error(`Missing text for selection: ${text}`);
  }

  editor.dispatchTransaction(
    editor.state.tr.setSelection(TextSelection.create(editor.state.doc, selectionPosition))
  );
};

describe("LexionEditor", () => {
  test("loads starter kit commands without core hardcoding", () => {
    const editor = new LexionEditor({
      extensions: [starterKitExtension],
      doc: createDoc("hello")
    });

    const executed = editor.execute(starterKitCommandNames.undo);
    expect(typeof executed).toBe("boolean");
    expect(() => editor.execute(starterKitCommandNames.toggleHeading, 2)).not.toThrow();

    editor.destroy();
  });

  test("indents and outdents a non-first list item", () => {
    const editor = new LexionEditor({
      extensions: [starterKitExtension],
      doc: createListDoc()
    });

    selectText(editor, "Child list item");

    expect(editor.execute(starterKitCommandNames.sinkListItem)).toBe(true);
    const indentedDocument = editor.getJSON();
    expect((indentedDocument.content as JSONArray)[0]).toMatchObject({
      type: "bullet_list",
      content: [
        {
          type: "list_item",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Parent list item" }]
            },
            {
              type: "bullet_list",
              content: [
                {
                  type: "list_item",
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "Child list item" }]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    });

    expect(editor.execute(starterKitCommandNames.liftListItem)).toBe(true);
    const liftedDocument = editor.getJSON();
    expect((liftedDocument.content as JSONArray)[0]).toMatchObject({
      type: "bullet_list",
      content: [
        {
          type: "list_item",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Parent list item" }]
            }
          ]
        },
        {
          type: "list_item",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Child list item" }]
            }
          ]
        }
      ]
    });

    editor.destroy();
  });

  test("registers and unregisters dynamic commands", () => {
    const extension: LexionExtension = {
      key: "insert-extension",
      commands: () => ({
        insertBang: ({ state, dispatch }) => {
          dispatch(state.tr.insertText("!", state.selection.from));
          return true;
        }
      })
    };

    const editor = new LexionEditor({
      extensions: [starterKitExtension],
      doc: createDoc("abc")
    });

    editor.use(extension);
    const ran = editor.execute("insertBang");

    expect(ran).toBe(true);
    expect(editor.getJSON()).toMatchObject({
      content: [
        {
          content: [{ text: "!abc" }]
        }
      ]
    });

    editor.removeExtension("insert-extension");
    expect(() => editor.execute("insertBang")).toThrow(/Unknown command/);

    // Deprecated alias still works.
    editor.use(extension);
    editor.removePlugin("insert-extension");
    expect(() => editor.execute("insertBang")).toThrow(/Unknown command/);

    editor.destroy();
  });

  test("does not leak commands when extension registration fails", () => {
    const editor = new LexionEditor({
      extensions: [starterKitExtension],
      doc: createDoc("abc")
    });

    const invalidExtension: LexionExtension = {
      key: "invalid-extension",
      commands: () => ({
        sideCommand: () => true,
        [starterKitCommandNames.undo]: () => true
      })
    };

    expect(() => editor.use(invalidExtension)).toThrow(/Command already registered/);
    expect(() => editor.execute("sideCommand")).toThrow(/Unknown command/);

    editor.destroy();
  });

  test("builds editor status bar items from core and extensions", () => {
    const metricsExtension: LexionExtension = {
      key: "metrics",
      statusBarItems: ({ doc }) => [
        {
          key: "characters",
          text: `${doc.textContent.length} chars`
        }
      ]
    };

    const editor = new LexionEditor({
      extensions: [starterKitExtension, metricsExtension],
      doc: createDoc("abc")
    });

    expect(editor.getStatusBarItems()).toEqual([
      {
        key: "characters",
        text: "3 chars"
      },
      expect.objectContaining({
        key: "branding",
        text: "Powered by lexion",
        align: "end"
      })
    ]);

    editor.setJSON(createDoc("hello world"));

    expect(editor.getStatusBarItems()).toEqual([
      {
        key: "characters",
        text: "11 chars"
      },
      expect.objectContaining({
        key: "branding",
        text: "Powered by lexion",
        align: "end"
      })
    ]);

    editor.destroy();
  });

  test("rejects schema-providing extensions in use()", () => {
    const editor = new LexionEditor({ extensions: [starterKitExtension], doc: createDoc("abc") });

    expect(() => editor.use({ key: "late-schema", schema: createCoreSchema() })).toThrow(
      /late-schema.*constructor/
    );
    // Nothing was registered, so the same key can be used by a valid extension.
    expect(() => editor.use({ key: "late-schema" })).not.toThrow();

    editor.destroy();
  });

  test("throws on every state accessor after destroy", () => {
    const editor = new LexionEditor({ extensions: [starterKitExtension], doc: createDoc("abc") });
    expect(editor.isDestroyed).toBe(false);

    editor.destroy();

    expect(editor.isDestroyed).toBe(true);
    expect(() => editor.state).toThrow(/destroyed/);
    expect(() => editor.doc).toThrow(/destroyed/);
    expect(() => editor.getJSON()).toThrow(/destroyed/);
    expect(() => editor.subscribe(() => {})).toThrow(/destroyed/);
    expect(editor.schema).toBeDefined();
    expect(() => editor.destroy()).not.toThrow();
  });
});

describe("LexionEditor branding option", () => {
  test("shows the branding item by default", () => {
    const editor = new LexionEditor();
    expect(editor.getStatusBarItems()).toEqual([
      expect.objectContaining({
        key: "branding",
        text: "Powered by lexion",
        className: LEXION_BRANDING_CLASS_NAME
      })
    ]);
    editor.destroy();
  });

  test("branding: false hides it", () => {
    const editor = new LexionEditor({ branding: false });
    expect(editor.getStatusBarItems()).toEqual([]);
    editor.destroy();
  });

  test("an object customizes it", () => {
    const editor = new LexionEditor({
      branding: { text: "Acme editor", align: "start", className: "acme" }
    });
    expect(editor.getStatusBarItems()).toEqual([
      expect.objectContaining({
        key: "branding",
        text: "Acme editor",
        align: "start",
        className: `${LEXION_BRANDING_CLASS_NAME} acme`
      })
    ]);
    editor.destroy();
  });
});

describe("LexionEditor.subscribe", () => {
  const collect = (editor: LexionEditor) => {
    const events: LexionEditorUpdateEvent[] = [];
    const unsubscribe = editor.subscribe((event) => events.push(event));
    return { events, unsubscribe };
  };

  test("emits transaction updates with docChanged", () => {
    const editor = new LexionEditor({ extensions: [starterKitExtension], doc: createDoc("hello") });
    const { events } = collect(editor);
    const previousState = editor.state;

    editor.dispatchTransaction(editor.state.tr.insertText("!", 1));

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      editor,
      source: "transaction",
      docChanged: true,
      previousState,
      state: editor.state
    });
    expect(events[0]?.transaction).not.toBeNull();

    editor.destroy();
  });

  test("reports selection-only transactions as docChanged: false", () => {
    const editor = new LexionEditor({ extensions: [starterKitExtension], doc: createDoc("hello") });
    const { events } = collect(editor);

    editor.dispatchTransaction(
      editor.state.tr.setSelection(TextSelection.create(editor.state.doc, 3))
    );

    expect(events).toHaveLength(1);
    expect(events[0]?.docChanged).toBe(false);

    editor.destroy();
  });

  test("emits for execute(), setJSON() and extension changes", () => {
    const editor = new LexionEditor({ extensions: [starterKitExtension], doc: createDoc("hello") });
    const { events } = collect(editor);

    expect(editor.execute(starterKitCommandNames.toggleHeading, 2)).toBe(true);
    editor.setJSON(createDoc("replaced"));
    editor.setJSON(createDoc("replaced"));
    editor.use({ key: "noop" });
    editor.removeExtension("noop");

    expect(events.map((event) => [event.source, event.docChanged])).toEqual([
      ["transaction", true],
      ["setJSON", true],
      ["setJSON", false],
      ["extensions", false],
      ["extensions", false]
    ]);
    expect(events[1]?.transaction).toBeNull();

    editor.destroy();
  });

  test("unsubscribes and clears listeners on destroy", () => {
    const editor = new LexionEditor({ extensions: [starterKitExtension], doc: createDoc("hello") });
    const first = vi.fn();
    const second = vi.fn();
    const unsubscribeFirst = editor.subscribe(first);
    const unsubscribeSecond = editor.subscribe(second);

    unsubscribeFirst();
    editor.setJSON(createDoc("one"));
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);

    editor.destroy();
    expect(() => unsubscribeSecond()).not.toThrow();
  });

  test("lets a listener unsubscribe while being notified", () => {
    const editor = new LexionEditor({ extensions: [starterKitExtension], doc: createDoc("hello") });
    const later = vi.fn();
    const unsubscribe = editor.subscribe(() => unsubscribe());
    editor.subscribe(later);

    editor.setJSON(createDoc("one"));
    editor.setJSON(createDoc("two"));

    expect(later).toHaveBeenCalledTimes(2);
    editor.destroy();
  });
});
