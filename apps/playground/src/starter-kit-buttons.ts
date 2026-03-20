import type { JSONDocument } from "@lexion-rte/core";
import { createStarterKitToolbarItems, type LexionToolbarItemInput } from "@lexion-rte/ui";

export interface ToolbarButtonConfig {
  readonly label: string;
  readonly command: string;
  readonly args?: readonly unknown[];
}

const toToolbarButtonConfig = (item: LexionToolbarItemInput): ToolbarButtonConfig => {
  if (!item.label || !item.command) {
    throw new Error(`Starter-kit preset item "${item.id}" is missing label or command.`);
  }

  return {
    label: item.label,
    command: item.command,
    ...(item.args !== undefined ? { args: item.args } : {})
  };
};

export const fullStarterKitToolbarButtons: readonly ToolbarButtonConfig[] =
  createStarterKitToolbarItems({ withLabels: true }).map(toToolbarButtonConfig);

export const createStarterKitSampleDocument = (): JSONDocument => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text: "Select text to try inline marks, links, and block transforms." }]
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "Use the toolbar to compare the full starter-kit command set." }]
    },
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
              content: [{ type: "text", text: "Place the cursor here to test indent, then outdent." }]
            }
          ]
        }
      ]
    }
  ]
});
