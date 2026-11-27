import { describe, expect, test } from "vitest";
import { TextSelection } from "prosemirror-state";

import { LexionEditor } from "@lexion-rte/core";
import { starterKitCommandNames as cmd, starterKitExtension } from "@lexion-rte/starter-kit";

import { createDoc } from "../helpers/documents.js";

const createEditor = (text = "hello world"): LexionEditor =>
  new LexionEditor({ doc: createDoc(text), extensions: [starterKitExtension] });

/** Selects `from..to` inside the first paragraph (offsets are 0-based in its text). */
const select = (editor: LexionEditor, from: number, to = from): void => {
  editor.dispatchTransaction(
    editor.state.tr.setSelection(TextSelection.create(editor.state.doc, from + 1, to + 1))
  );
};

const markNames = (editor: LexionEditor): string[] => {
  const names = new Set<string>();
  editor.state.doc.descendants((node) => {
    node.marks.forEach((mark) => names.add(mark.type.name));
  });
  return [...names];
};

const blockTypes = (editor: LexionEditor): string[] => {
  const types: string[] = [];
  editor.state.doc.descendants((node) => {
    if (node.isBlock) {
      types.push(node.type.name);
    }
  });
  return types;
};

describe("starter-kit commands", () => {
  test.each([
    [cmd.toggleBold, "strong"],
    [cmd.toggleItalic, "em"],
    [cmd.toggleCode, "code"],
    [cmd.toggleStrike, "strike"],
    [cmd.toggleUnderline, "underline"]
  ])("%s toggles the %s mark", (command, mark) => {
    const editor = createEditor();
    select(editor, 0, 5);

    expect(editor.execute(command)).toBe(true);
    expect(markNames(editor)).toContain(mark);

    expect(editor.execute(command)).toBe(true);
    expect(markNames(editor)).not.toContain(mark);
    editor.destroy();
  });

  test("toggleHeading rejects invalid levels and setParagraph reverts", () => {
    const editor = createEditor();
    select(editor, 0);

    expect(editor.execute(cmd.toggleHeading, 3)).toBe(true);
    expect(editor.state.doc.firstChild?.type.name).toBe("heading");
    expect(editor.state.doc.firstChild?.attrs["level"]).toBe(3);

    expect(editor.execute(cmd.toggleHeading, 9)).toBe(false);

    expect(editor.execute(cmd.setParagraph)).toBe(true);
    expect(editor.state.doc.firstChild?.type.name).toBe("paragraph");
    editor.destroy();
  });

  test("toggleBlockquote and toggleCodeBlock wrap and unwrap", () => {
    const editor = createEditor();
    select(editor, 0);

    expect(editor.execute(cmd.toggleBlockquote)).toBe(true);
    expect(blockTypes(editor)).toContain("blockquote");
    expect(editor.execute(cmd.toggleBlockquote)).toBe(true);
    expect(blockTypes(editor)).not.toContain("blockquote");

    expect(editor.execute(cmd.toggleCodeBlock)).toBe(true);
    expect(blockTypes(editor)).toContain("code_block");
    expect(editor.execute(cmd.toggleCodeBlock)).toBe(true);
    expect(blockTypes(editor)).not.toContain("code_block");
    editor.destroy();
  });

  test.each([
    [cmd.wrapBulletList, "bullet_list"],
    [cmd.wrapOrderedList, "ordered_list"]
  ])("%s wraps in a %s and liftListItem unwraps", (command, listType) => {
    const editor = createEditor();
    select(editor, 0);

    expect(editor.execute(command)).toBe(true);
    expect(blockTypes(editor)).toContain(listType);
    expect(editor.execute(cmd.liftListItem)).toBe(true);
    expect(blockTypes(editor)).not.toContain(listType);
    editor.destroy();
  });

  test("setLink rejects a missing href and unsetLink removes it", () => {
    const editor = createEditor();
    select(editor, 0, 5);

    expect(editor.execute(cmd.setLink, {})).toBe(false);
    expect(editor.execute(cmd.setLink, { href: "https://example.com", title: "Example" })).toBe(
      true
    );
    expect(markNames(editor)).toContain("link");

    expect(editor.execute(cmd.unsetLink)).toBe(true);
    expect(markNames(editor)).not.toContain("link");
    editor.destroy();
  });

  test("inserts a horizontal rule and a hard break", () => {
    const editor = createEditor();
    select(editor, 5);

    expect(editor.execute(cmd.insertHardBreak)).toBe(true);
    expect(editor.state.doc.firstChild?.childCount).toBeGreaterThan(1);

    expect(editor.execute(cmd.insertHorizontalRule)).toBe(true);
    expect(blockTypes(editor)).toContain("horizontal_rule");
    editor.destroy();
  });

  test("undo and redo", () => {
    const editor = createEditor();
    select(editor, 0, 5);

    expect(editor.execute(cmd.redo)).toBe(false);
    editor.execute(cmd.toggleBold);
    expect(editor.execute(cmd.undo)).toBe(true);
    expect(markNames(editor)).not.toContain("strong");
    expect(editor.execute(cmd.redo)).toBe(true);
    expect(markNames(editor)).toContain("strong");
    editor.destroy();
  });
});
