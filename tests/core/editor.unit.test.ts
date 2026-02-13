import { describe, expect, test } from "vitest";

import { LexionEditor, type JSONDocument, type LexionExtension } from "@lexion-rte/core";
import { starterKitCommandNames, starterKitExtension } from "@lexion-rte/extensions";

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
});
