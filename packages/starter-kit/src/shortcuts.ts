import { chainCommands, exitCode, setBlockType, toggleMark, wrapIn } from "prosemirror-commands";
import { redo, undo } from "prosemirror-history";
import {
  InputRule,
  inputRules,
  textblockTypeInputRule,
  wrappingInputRule
} from "prosemirror-inputrules";
import { keymap } from "prosemirror-keymap";
import type { Schema } from "prosemirror-model";
import type { Command, Plugin } from "prosemirror-state";
import { wrapInList } from "prosemirror-schema-list";

const isMac = (): boolean =>
  typeof navigator !== "undefined" && /Mac|iP(hone|[oa]d)/.test(navigator.platform);

/**
 * Keyboard shortcuts for the starter kit (`Mod` is Cmd on macOS, Ctrl elsewhere).
 * Follows common editor conventions so muscle memory from other editors carries over.
 */
export const createStarterKitKeymapPlugin = (schema: Schema): Plugin => {
  const bindings: Record<string, Command> = {
    "Mod-z": undo,
    "Shift-Mod-z": redo
  };
  if (!isMac()) {
    bindings["Mod-y"] = redo;
  }

  const mark = (name: string, key: string): void => {
    const type = schema.marks[name];
    if (type) {
      bindings[key] = toggleMark(type);
    }
  };
  mark("strong", "Mod-b");
  mark("em", "Mod-i");
  mark("underline", "Mod-u");
  mark("code", "Mod-e");
  mark("strike", "Shift-Mod-s");

  const { paragraph, heading, blockquote, code_block, bullet_list, ordered_list, hard_break } =
    schema.nodes;
  if (paragraph) {
    bindings["Mod-Alt-0"] = setBlockType(paragraph);
  }
  if (heading) {
    for (let level = 1; level <= 6; level += 1) {
      bindings[`Mod-Alt-${level}`] = setBlockType(heading, { level });
    }
  }
  if (code_block) {
    bindings["Mod-Alt-c"] = setBlockType(code_block);
  }
  if (blockquote) {
    bindings["Shift-Mod-b"] = wrapIn(blockquote);
  }
  if (bullet_list) {
    bindings["Shift-Mod-8"] = wrapInList(bullet_list);
  }
  if (ordered_list) {
    bindings["Shift-Mod-7"] = wrapInList(ordered_list);
  }
  if (hard_break) {
    const insertHardBreak = chainCommands(exitCode, (state, dispatch) => {
      dispatch?.(state.tr.replaceSelectionWith(hard_break.create()).scrollIntoView());
      return true;
    });
    bindings["Mod-Enter"] = insertHardBreak;
    bindings["Shift-Enter"] = insertHardBreak;
  }

  return keymap(bindings);
};

/**
 * Markdown-style shortcuts while typing: `# ` heading, `> ` quote, `- `/`* ` bullet list,
 * `1. ` ordered list, ``` code block, `---` horizontal rule.
 */
export const createStarterKitInputRulesPlugin = (schema: Schema): Plugin => {
  const rules: InputRule[] = [];
  const { heading, blockquote, code_block, bullet_list, ordered_list, horizontal_rule } =
    schema.nodes;

  if (heading) {
    rules.push(
      textblockTypeInputRule(/^(#{1,6})\s$/, heading, (match) => ({
        level: match[1]?.length ?? 1
      }))
    );
  }
  if (blockquote) {
    rules.push(wrappingInputRule(/^\s*>\s$/, blockquote));
  }
  if (code_block) {
    rules.push(textblockTypeInputRule(/^```$/, code_block));
  }
  if (bullet_list) {
    rules.push(wrappingInputRule(/^\s*([-+*])\s$/, bullet_list));
  }
  if (ordered_list) {
    rules.push(
      wrappingInputRule(
        /^(\d+)\.\s$/,
        ordered_list,
        (match) => ({ order: Number(match[1]) }),
        (match, node) => node.childCount + Number(node.attrs["order"]) === Number(match[1])
      )
    );
  }
  if (horizontal_rule) {
    rules.push(
      new InputRule(/^(?:---|___|\*\*\*)$/, (state, _match, start, end) => {
        const $start = state.doc.resolve(start);
        if (!$start.parent.isTextblock || $start.parent.content.size !== end - start) {
          // Only convert when the marker is the whole line.
          return null;
        }
        return state.tr
          .replaceRangeWith($start.before(), $start.after(), horizontal_rule.create())
          .scrollIntoView();
      })
    );
  }

  return inputRules({ rules });
};
