import { baseKeymap, lift, setBlockType, toggleMark, wrapIn } from "prosemirror-commands";
import { dropCursor } from "prosemirror-dropcursor";
import { gapCursor } from "prosemirror-gapcursor";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { Schema, type MarkSpec, type MarkType, type NodeType } from "prosemirror-model";
import { schema as basicSchema } from "prosemirror-schema-basic";
import {
  addListNodes,
  liftListItem as pmLiftListItem,
  sinkListItem as pmSinkListItem,
  wrapInList
} from "prosemirror-schema-list";
import type { Command } from "prosemirror-state";
import type { CommandHandler, CommandMap, LexionExtension } from "@lexion-rte/core";

import { starterKitCommandNames } from "./command-names.js";
import { createListKeymapPlugin } from "./list-keymap.js";
import { createTrailingNodePlugin, createTrailingParagraphTransaction } from "./trailing-node.js";
import type { HeadingAttributes, LinkAttributes } from "./types.js";

const starterKitNodes = addListNodes(basicSchema.spec.nodes, "paragraph block*", "block");
const strikeMarkSpec: MarkSpec = {
  parseDOM: [{ tag: "s" }, { tag: "del" }, { tag: "strike" }, { style: "text-decoration=line-through" }],
  toDOM() {
    return ["s", 0];
  }
};
const underlineMarkSpec: MarkSpec = {
  parseDOM: [{ tag: "u" }, { style: "text-decoration=underline" }],
  toDOM() {
    return ["u", 0];
  }
};
const starterKitMarks = basicSchema.spec.marks
  .addToEnd("strike", strikeMarkSpec)
  .addToEnd("underline", underlineMarkSpec);

export const createStarterKitSchema = (): Schema =>
  new Schema({
    nodes: starterKitNodes,
    marks: starterKitMarks
  });

export const starterKitSchema = createStarterKitSchema();

const asProseMirrorCommand = (command: Command): CommandHandler => (context) =>
  command(context.state, context.dispatch);

const getNodeType = (name: string, schema: Schema): NodeType => {
  const nodeType = schema.nodes[name];
  if (!nodeType) {
    throw new Error(`Missing required node type: ${name}`);
  }
  return nodeType;
};

const getMarkType = (name: string, schema: Schema): MarkType => {
  const markType = schema.marks[name];
  if (!markType) {
    throw new Error(`Missing required mark type: ${name}`);
  }
  return markType;
};

const isSelectionInNodeType = (nodeType: NodeType, command: CommandHandler): CommandHandler =>
  (context, ...args) => {
    const { $from } = context.state.selection;
    for (let depth = $from.depth; depth > 0; depth -= 1) {
      if ($from.node(depth).type === nodeType) {
        return command(context, ...args);
      }
    }
    return false;
  };

const insertNode = (nodeType: NodeType): CommandHandler => (context) => {
  try {
    const transaction = context.state.tr.replaceSelectionWith(nodeType.create()).scrollIntoView();
    context.dispatch(transaction);
    return true;
  } catch {
    return false;
  }
};

const asHeadingAttributes = (value: unknown): HeadingAttributes | null => {
  if (typeof value !== "number") {
    return null;
  }
  if (value < 1 || value > 6) {
    return null;
  }
  return { level: value as HeadingAttributes["level"] };
};

const asLinkAttributes = (value: unknown): LinkAttributes | null => {
  if (typeof value !== "object" || value === null) {
    return null;
  }
  const candidate = value as Record<string, unknown>;
  if (typeof candidate["href"] !== "string" || candidate["href"].length === 0) {
    return null;
  }

  const titleValue = candidate["title"];
  if (titleValue !== undefined && titleValue !== null && typeof titleValue !== "string") {
    return null;
  }

  return {
    href: candidate["href"],
    title: (titleValue as string | null | undefined) ?? null
  };
};

export const createStarterKitCommands = (): CommandMap => ({
  [starterKitCommandNames.setParagraph]: (context) => {
    const paragraph = getNodeType("paragraph", context.schema);
    return setBlockType(paragraph)(context.state, context.dispatch);
  },

  [starterKitCommandNames.toggleHeading]: (context, levelValue) => {
    const heading = getNodeType("heading", context.schema);
    const headingAttributes = asHeadingAttributes(levelValue);
    if (!headingAttributes) {
      return false;
    }

    return setBlockType(heading, { level: headingAttributes.level })(context.state, context.dispatch);
  },

  [starterKitCommandNames.toggleBold]: (context) => {
    const strong = getMarkType("strong", context.schema);
    return toggleMark(strong)(context.state, context.dispatch);
  },

  [starterKitCommandNames.toggleItalic]: (context) => {
    const em = getMarkType("em", context.schema);
    return toggleMark(em)(context.state, context.dispatch);
  },

  [starterKitCommandNames.toggleCode]: (context) => {
    const code = getMarkType("code", context.schema);
    return toggleMark(code)(context.state, context.dispatch);
  },

  [starterKitCommandNames.toggleStrike]: (context) => {
    const strike = getMarkType("strike", context.schema);
    return toggleMark(strike)(context.state, context.dispatch);
  },

  [starterKitCommandNames.toggleUnderline]: (context) => {
    const underline = getMarkType("underline", context.schema);
    return toggleMark(underline)(context.state, context.dispatch);
  },

  [starterKitCommandNames.toggleBlockquote]: (context) => {
    const blockquote = getNodeType("blockquote", context.schema);
    const removeBlockquote = isSelectionInNodeType(blockquote, asProseMirrorCommand(lift));
    return removeBlockquote(context) || wrapIn(blockquote)(context.state, context.dispatch);
  },

  [starterKitCommandNames.toggleCodeBlock]: (context) => {
    const paragraph = getNodeType("paragraph", context.schema);
    const codeBlock = getNodeType("code_block", context.schema);
    const unsetCodeBlock = isSelectionInNodeType(
      codeBlock,
      (commandContext) => setBlockType(paragraph)(commandContext.state, commandContext.dispatch)
    );
    return (
      unsetCodeBlock(context) ||
      setBlockType(codeBlock)(context.state, context.dispatch)
    );
  },

  [starterKitCommandNames.wrapBulletList]: (context) => {
    const bulletList = getNodeType("bullet_list", context.schema);
    return wrapInList(bulletList)(context.state, context.dispatch);
  },

  [starterKitCommandNames.wrapOrderedList]: (context) => {
    const orderedList = getNodeType("ordered_list", context.schema);
    return wrapInList(orderedList)(context.state, context.dispatch);
  },

  [starterKitCommandNames.liftListItem]: (context) => {
    const listItem = getNodeType("list_item", context.schema);
    return pmLiftListItem(listItem)(context.state, context.dispatch);
  },

  [starterKitCommandNames.sinkListItem]: (context) => {
    const listItem = getNodeType("list_item", context.schema);
    return pmSinkListItem(listItem)(context.state, context.dispatch);
  },

  [starterKitCommandNames.setLink]: (context, linkValue) => {
    const link = getMarkType("link", context.schema);
    const attributes = asLinkAttributes(linkValue);
    if (!attributes || context.state.selection.empty) {
      return false;
    }

    const { from, to } = context.state.selection;
    const transaction = context.state.tr.removeMark(from, to, link).addMark(from, to, link.create(attributes));
    context.dispatch(transaction.scrollIntoView());
    return true;
  },

  [starterKitCommandNames.unsetLink]: (context) => {
    const link = getMarkType("link", context.schema);
    const { from, to } = context.state.selection;
    const transaction = context.state.tr.removeMark(from, to, link);
    context.dispatch(transaction.scrollIntoView());
    return true;
  },

  [starterKitCommandNames.insertHorizontalRule]: (context) => {
    const horizontalRule = getNodeType("horizontal_rule", context.schema);
    return insertNode(horizontalRule)(context);
  },

  [starterKitCommandNames.insertHardBreak]: (context) => {
    const hardBreak = getNodeType("hard_break", context.schema);
    return insertNode(hardBreak)(context);
  },

  [starterKitCommandNames.undo]: asProseMirrorCommand(undo),
  [starterKitCommandNames.redo]: asProseMirrorCommand(redo)
});

export const starterKitExtension: LexionExtension = {
  key: "starter-kit",
  schema: starterKitSchema,
  commands: () => createStarterKitCommands(),
  prosemirrorPlugins: ({ schema }) => [
    history(),
    createListKeymapPlugin(schema),
    keymap(baseKeymap),
    gapCursor(),
    dropCursor(),
    createTrailingNodePlugin()
  ],
  onCreate: ({ editor }) => {
    const transaction = createTrailingParagraphTransaction(editor.state);
    if (transaction) {
      editor.dispatchTransaction(transaction);
    }
  }
};
