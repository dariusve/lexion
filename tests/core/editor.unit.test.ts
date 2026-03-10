import { describe, expect, test } from "vitest";
import { TextSelection } from "prosemirror-state";

import { LexionEditor, type JSONDocument, type LexionExtension } from "@lexion-rte/core";
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
    expect(indentedDocument.content[0]).toMatchObject({
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
    expect(liftedDocument.content[0]).toMatchObject({
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
});
