import { describe, expect, test } from "vitest";

import { LexionEditor, type JSONDocument, type LexionExtension } from "@lexion/core";
import { starterKitCommandNames, starterKitExtension } from "@lexion/extensions";

const createDoc = (text: string): JSONDocument => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text }]
    }
  ]
});

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
});
