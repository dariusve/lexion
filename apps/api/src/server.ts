import Fastify, { type FastifyInstance } from "fastify";

import { LexionEditor, type JSONDocument } from "@lexion-rte/core";
import { starterKitExtension } from "@lexion-rte/extensions";
import { fromText, toText } from "@lexion-rte/tools";

interface FromTextBody {
  readonly text: string;
}

interface ToTextBody {
  readonly document: JSONDocument;
}

interface ExecuteCommandBody {
  readonly document: JSONDocument;
  readonly command: string;
  readonly args?: readonly unknown[];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isString = (value: unknown): value is string => typeof value === "string";

const isJSONDocument = (value: unknown): value is JSONDocument => isRecord(value) && isString(value.type);

const createEditor = (document?: JSONDocument): LexionEditor =>
  new LexionEditor(
    document
      ? { doc: document, extensions: [starterKitExtension] }
      : { extensions: [starterKitExtension] }
  );

export const buildApiServer = (): FastifyInstance => {
  const app = Fastify({
    logger: true
  });

  app.get("/health", async () => ({
    status: "ok",
    service: "api"
  }));

  app.post<{ Body: FromTextBody }>("/documents/from-text", async (request, reply) => {
    if (!isRecord(request.body) || !isString(request.body.text)) {
      return reply.code(400).send({ error: "Invalid request body" });
    }

    const editor = createEditor();
    fromText(editor, request.body.text);
    const document = editor.getJSON();
    editor.destroy();

    return { document };
  });

  app.post<{ Body: ToTextBody }>("/documents/to-text", async (request, reply) => {
    if (!isRecord(request.body) || !isJSONDocument(request.body.document)) {
      return reply.code(400).send({ error: "Invalid request body" });
    }

    const editor = createEditor(request.body.document);
    const text = toText(editor);
    editor.destroy();

    return { text };
  });

  app.post<{ Body: ExecuteCommandBody }>("/commands/execute", async (request, reply) => {
    if (!isRecord(request.body) || !isJSONDocument(request.body.document) || !isString(request.body.command)) {
      return reply.code(400).send({ error: "Invalid request body" });
    }

    const editor = createEditor(request.body.document);

    let executed = false;
    try {
      executed = editor.execute(request.body.command, ...(request.body.args ?? []));
    } catch (error) {
      editor.destroy();
      return reply.code(400).send({
        error: error instanceof Error ? error.message : "Command execution failed"
      });
    }

    const document = editor.getJSON();
    editor.destroy();

    return {
      executed,
      document
    };
  });

  return app;
};
