import { Schema, type MarkSpec, type NodeSpec } from "prosemirror-model";

const coreNodeSpecs: Record<string, NodeSpec> = {
  doc: {
    content: "block+"
  },
  paragraph: {
    group: "block",
    content: "inline*",
    parseDOM: [{ tag: "p" }],
    toDOM() {
      return ["p", 0];
    }
  },
  text: {
    group: "inline"
  },
  hard_break: {
    inline: true,
    group: "inline",
    selectable: false,
    parseDOM: [{ tag: "br" }],
    toDOM() {
      return ["br"];
    }
  }
};

const coreMarkSpecs: Record<string, MarkSpec> = {};

export const createCoreSchema = (): Schema =>
  new Schema({
    nodes: coreNodeSpecs,
    marks: coreMarkSpecs
  });

export const coreSchema = createCoreSchema();
