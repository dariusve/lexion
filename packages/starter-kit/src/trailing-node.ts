import type { Node as ProseMirrorNode, NodeType } from "prosemirror-model";
import { Plugin, PluginKey, type EditorState, type Transaction } from "prosemirror-state";

const trailingNodePluginKey = new PluginKey("starter-kit-trailing-node");

const needsTrailingParagraph = (document: ProseMirrorNode, paragraph: NodeType): boolean => {
  const lastChild = document.lastChild;
  return !lastChild || lastChild.type !== paragraph;
};

export const createTrailingParagraphTransaction = (state: EditorState): Transaction | null => {
  const paragraph = state.schema.nodes["paragraph"];
  if (!paragraph || !needsTrailingParagraph(state.doc, paragraph)) {
    return null;
  }

  return state.tr.insert(state.doc.content.size, paragraph.create());
};

export const createTrailingNodePlugin = (): Plugin =>
  new Plugin({
    key: trailingNodePluginKey,
    appendTransaction: (transactions, _oldState, newState) => {
      if (!transactions.some((transaction) => transaction.docChanged)) {
        return null;
      }

      return createTrailingParagraphTransaction(newState);
    }
  });
