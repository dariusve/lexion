import { type JSONDocument, type LexionEditor } from "@lexion-rte/core";
import {
  DOMParser as ProseMirrorDOMParser,
  DOMSerializer,
  type Node as ProseMirrorNode,
  type Schema
} from "prosemirror-model";

export interface ToolsDOMContext {
  readonly document?: Document;
}

const getDocument = (context?: ToolsDOMContext): Document => {
  if (context?.document) {
    return context.document;
  }

  if (typeof document !== "undefined") {
    return document;
  }

  throw new Error("A DOM Document is required. Pass { document } when running outside the browser.");
};

const setEditorDocument = (editor: LexionEditor, documentNode: ProseMirrorNode): void => {
  editor.setJSON(documentNode.toJSON() as JSONDocument);
};

export const toHTML = (editor: LexionEditor, context?: ToolsDOMContext): string => {
  const schema = editor.schema;
  const doc = getDocument(context);
  const serializer = DOMSerializer.fromSchema(schema);
  const fragment = serializer.serializeFragment(editor.doc.content, { document: doc });
  const container = doc.createElement("div");
  container.appendChild(fragment);
  return container.innerHTML;
};

export const toText = (editor: LexionEditor): string =>
  editor.doc.textBetween(0, editor.doc.content.size, "\n\n", "\n");

export const fromHTML = (editor: LexionEditor, html: string, context?: ToolsDOMContext): void => {
  const schema = editor.schema;
  const doc = getDocument(context);
  const parser = ProseMirrorDOMParser.fromSchema(schema);
  const container = doc.createElement("div");
  container.innerHTML = html;
  const parsedDocument = parser.parse(container);
  setEditorDocument(editor, parsedDocument);
};

const requireNodeType = (schema: Schema, name: string) => {
  const nodeType = schema.nodes[name];
  if (!nodeType) {
    throw new Error(`Schema is missing required node type: ${name}`);
  }
  return nodeType;
};

const createParagraphNode = (schema: Schema, value: string): ProseMirrorNode => {
  const paragraphType = requireNodeType(schema, "paragraph");
  const hardBreakType = schema.nodes["hard_break"];
  const lines = value.split("\n");
  const inlineNodes: ProseMirrorNode[] = [];

  for (const [index, line] of lines.entries()) {
    if (index > 0) {
      if (hardBreakType) {
        inlineNodes.push(hardBreakType.create());
      } else if (line.length > 0) {
        inlineNodes.push(schema.text(" "));
      }
    }

    if (line.length > 0) {
      inlineNodes.push(schema.text(line));
    }
  }

  return inlineNodes.length > 0 ? paragraphType.create(null, inlineNodes) : paragraphType.create();
};

export const fromText = (editor: LexionEditor, text: string): void => {
  const schema = editor.schema;
  const normalized = text.replace(/\r\n?/g, "\n").trim();
  const chunks = normalized.length === 0 ? [""] : normalized.split(/\n{2,}/);
  const paragraphNodes = chunks.map((chunk) => createParagraphNode(schema, chunk));

  const documentNode = schema.topNodeType.createAndFill(null, paragraphNodes);
  if (!documentNode) {
    throw new Error("Unable to create document from text for the current schema");
  }

  setEditorDocument(editor, documentNode);
};
