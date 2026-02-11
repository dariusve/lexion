import Fastify, { type FastifyInstance } from "fastify";
import websocketPlugin from "@fastify/websocket";
import * as Y from "yjs";

import { CollaborationStore, type CollaborationRoom } from "./store.js";

interface SyncMessage {
  readonly type: "sync";
  readonly update: string;
}

interface UpdateMessage {
  readonly type: "update";
  readonly update: string;
}

interface AwarenessMessage {
  readonly type: "awareness";
  readonly update: string;
}

interface ErrorMessage {
  readonly type: "error";
  readonly message: string;
}

type ServerMessage = SyncMessage | UpdateMessage | AwarenessMessage | ErrorMessage;
type ClientMessage = UpdateMessage | AwarenessMessage;

const encode = (update: Uint8Array): string => Buffer.from(update).toString("base64");
const decode = (payload: string): Uint8Array => Uint8Array.from(Buffer.from(payload, "base64"));

const send = (socket: WebSocket, message: ServerMessage): void => {
  socket.send(JSON.stringify(message));
};

const broadcast = (room: CollaborationRoom, source: WebSocket, message: ServerMessage): void => {
  for (const socket of room.sockets) {
    if (socket === source) {
      continue;
    }
    send(socket, message);
  }
};

const parseClientMessage = (raw: unknown): ClientMessage | null => {
  if (typeof raw !== "string") {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<ClientMessage>;
    if (
      (parsed.type === "update" || parsed.type === "awareness") &&
      typeof parsed.update === "string"
    ) {
      return parsed as ClientMessage;
    }
  } catch {
    return null;
  }

  return null;
};

export const buildCollabServer = (): FastifyInstance => {
  const app = Fastify({ logger: true });
  const store = new CollaborationStore();

  app.register(websocketPlugin);

  app.get("/health", async () => ({
    status: "ok",
    service: "collab-server",
    rooms: store.countRooms(),
    connections: store.countConnections()
  }));

  app.get("/collab/:docId", { websocket: true }, (socket, request) => {
    const params = request.params as { readonly docId: string };
    const room = store.getRoom(params.docId);

    room.sockets.add(socket as unknown as WebSocket);

    send(socket as unknown as WebSocket, {
      type: "sync",
      update: encode(Y.encodeStateAsUpdate(room.doc))
    });

    const awarenessUpdate = store.currentAwarenessUpdate(room);
    if (awarenessUpdate.byteLength > 0) {
      send(socket as unknown as WebSocket, {
        type: "awareness",
        update: encode(awarenessUpdate)
      });
    }

    socket.on("message", (raw: Buffer) => {
      const message = parseClientMessage(raw.toString());
      if (!message) {
        send(socket as unknown as WebSocket, {
          type: "error",
          message: "Invalid message payload"
        });
        return;
      }

      if (message.type === "update") {
        const update = decode(message.update);
        Y.applyUpdate(room.doc, update, socket);
        broadcast(room, socket as unknown as WebSocket, {
          type: "update",
          update: message.update
        });
        return;
      }

      const awarenessUpdatePayload = decode(message.update);
      store.applyAwareness(room, awarenessUpdatePayload);
      broadcast(room, socket as unknown as WebSocket, {
        type: "awareness",
        update: message.update
      });
    });

    socket.on("close", () => {
      room.sockets.delete(socket as unknown as WebSocket);
      store.deleteRoomIfEmpty(room.id);
    });
  });

  return app;
};
