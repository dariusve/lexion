import type { LexionExtension, CommandHandler } from "@lexion/core";
import type { Awareness } from "y-protocols/awareness";
import type { XmlFragment } from "yjs";
import { yCursorPlugin, ySyncPlugin, yUndoPlugin, undo, redo } from "y-prosemirror";
import type { Command } from "prosemirror-state";

export const collaborationCommandNames = {
  undo: "collaboration.undo",
  redo: "collaboration.redo"
} as const;

export interface CollaborationExtensionOptions {
  readonly fragment: XmlFragment;
  readonly awareness: Awareness;
  readonly withCursor?: boolean;
  readonly withUndo?: boolean;
}

const asCommand = (command: Command): CommandHandler => (context) =>
  command(context.state, context.dispatch);

export const createCollaborationExtension = (
  options: CollaborationExtensionOptions
): LexionExtension => {
  const withCursor = options.withCursor ?? true;
  const withUndo = options.withUndo ?? true;

  return {
    key: "collaboration",
    prosemirrorPlugins: () => {
      const plugins = [ySyncPlugin(options.fragment)];

      if (withCursor) {
        plugins.push(yCursorPlugin(options.awareness));
      }

      if (withUndo) {
        plugins.push(yUndoPlugin());
      }

      return plugins;
    },
    commands: () => ({
      [collaborationCommandNames.undo]: asCommand(undo),
      [collaborationCommandNames.redo]: asCommand(redo)
    })
  };
};
