import { starterKitCommandNames } from "@lexion-rte/starter-kit";

import { lexionToolbarIcons } from "./icons.js";
import type {
  LexionStarterKitToolbarPresetOptions,
  LexionToolbarItemInput,
  LexionToolbarItemState
} from "./types.js";

export const createToolbarSeparatorItem = (
  id: string,
  state: LexionToolbarItemState = "enabled"
): LexionToolbarItemInput => ({
  id,
  separator: true,
  state
});

const defaultStarterKitLinkAttributes = {
  href: "https://lexion.app",
  title: "Lexion"
} as const;

const withStarterKitLabel = (
  label: string,
  withLabels: boolean | undefined
): Pick<LexionToolbarItemInput, "label" | "title"> => ({
  ...(withLabels === false ? {} : { label }),
  title: label
});

export const createStarterKitToolbarItems = (
  options: LexionStarterKitToolbarPresetOptions = {}
): readonly LexionToolbarItemInput[] => {
  const state = options.state ?? "enabled";
  const withLabels = options.withLabels ?? true;
  const linkAttributes = options.linkAttributes ?? defaultStarterKitLinkAttributes;

  return [
    {
      id: "paragraph",
      iconClass: lexionToolbarIcons.paragraph,
      command: starterKitCommandNames.setParagraph,
      state,
      ...withStarterKitLabel("Paragraph", withLabels)
    },
    {
      id: "heading-1",
      iconClass: lexionToolbarIcons.heading1,
      command: starterKitCommandNames.toggleHeading,
      args: [1],
      state,
      ...withStarterKitLabel("H1", withLabels)
    },
    {
      id: "heading-2",
      iconClass: lexionToolbarIcons.heading2,
      command: starterKitCommandNames.toggleHeading,
      args: [2],
      state,
      ...withStarterKitLabel("H2", withLabels)
    },
    {
      id: "heading-3",
      iconClass: lexionToolbarIcons.heading3,
      command: starterKitCommandNames.toggleHeading,
      args: [3],
      state,
      ...withStarterKitLabel("H3", withLabels)
    },
    {
      id: "bold",
      iconClass: lexionToolbarIcons.bold,
      command: starterKitCommandNames.toggleBold,
      state,
      ...withStarterKitLabel("Bold", withLabels)
    },
    {
      id: "italic",
      iconClass: lexionToolbarIcons.italic,
      command: starterKitCommandNames.toggleItalic,
      state,
      ...withStarterKitLabel("Italic", withLabels)
    },
    {
      id: "code",
      iconClass: lexionToolbarIcons.code,
      command: starterKitCommandNames.toggleCode,
      state,
      ...withStarterKitLabel("Code", withLabels)
    },
    {
      id: "strike",
      iconClass: lexionToolbarIcons.strike,
      command: starterKitCommandNames.toggleStrike,
      state,
      ...withStarterKitLabel("Strike", withLabels)
    },
    {
      id: "underline",
      iconClass: lexionToolbarIcons.underline,
      command: starterKitCommandNames.toggleUnderline,
      state,
      ...withStarterKitLabel("Underline", withLabels)
    },
    {
      id: "blockquote",
      iconClass: lexionToolbarIcons.quote,
      command: starterKitCommandNames.toggleBlockquote,
      state,
      ...withStarterKitLabel("Quote", withLabels)
    },
    {
      id: "code-block",
      iconClass: lexionToolbarIcons.codeBlock,
      command: starterKitCommandNames.toggleCodeBlock,
      state,
      ...withStarterKitLabel("Code Block", withLabels)
    },
    {
      id: "bullet-list",
      iconClass: lexionToolbarIcons.bulletList,
      command: starterKitCommandNames.wrapBulletList,
      state,
      ...withStarterKitLabel("Bullet List", withLabels)
    },
    {
      id: "ordered-list",
      iconClass: lexionToolbarIcons.orderedList,
      command: starterKitCommandNames.wrapOrderedList,
      state,
      ...withStarterKitLabel("Ordered List", withLabels)
    },
    {
      id: "outdent",
      iconClass: lexionToolbarIcons.outdent,
      command: starterKitCommandNames.liftListItem,
      state,
      ...withStarterKitLabel("Outdent", withLabels)
    },
    {
      id: "indent",
      iconClass: lexionToolbarIcons.indent,
      command: starterKitCommandNames.sinkListItem,
      state,
      ...withStarterKitLabel("Indent", withLabels)
    },
    {
      id: "set-link",
      iconClass: lexionToolbarIcons.link,
      command: starterKitCommandNames.setLink,
      args: [linkAttributes],
      state,
      ...withStarterKitLabel("Set Link", withLabels)
    },
    {
      id: "unset-link",
      iconClass: lexionToolbarIcons.unlink,
      command: starterKitCommandNames.unsetLink,
      state,
      ...withStarterKitLabel("Unset Link", withLabels)
    },
    {
      id: "horizontal-rule",
      iconClass: lexionToolbarIcons.horizontalRule,
      command: starterKitCommandNames.insertHorizontalRule,
      state,
      ...withStarterKitLabel("Rule", withLabels)
    },
    {
      id: "hard-break",
      iconClass: lexionToolbarIcons.hardBreak,
      command: starterKitCommandNames.insertHardBreak,
      state,
      ...withStarterKitLabel("Break", withLabels)
    },
    {
      id: "undo",
      iconClass: lexionToolbarIcons.undo,
      command: starterKitCommandNames.undo,
      state,
      ...withStarterKitLabel("Undo", withLabels)
    },
    {
      id: "redo",
      iconClass: lexionToolbarIcons.redo,
      command: starterKitCommandNames.redo,
      state,
      ...withStarterKitLabel("Redo", withLabels)
    }
  ];
};
