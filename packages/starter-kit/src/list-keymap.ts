import { keymap } from "prosemirror-keymap";
import type { Schema } from "prosemirror-model";
import type { Plugin } from "prosemirror-state";
import { liftListItem, sinkListItem, splitListItem } from "prosemirror-schema-list";

export const createListKeymapPlugin = (schema: Schema): Plugin => {
  const listItem = schema.nodes["list_item"];
  if (!listItem) {
    return keymap({});
  }

  return keymap({
    Enter: splitListItem(listItem),
    Tab: sinkListItem(listItem),
    "Shift-Tab": liftListItem(listItem)
  });
};
