import type { JSONDocument } from "@lexion-rte/core";

export const createDoc = (text: string): JSONDocument => ({
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text }]
    }
  ]
});

export const editableRoot = (container: HTMLElement): HTMLElement => {
  const element = container.querySelector<HTMLElement>(".ProseMirror");
  if (!element) {
    throw new Error("ProseMirror root not found");
  }
  return element;
};
