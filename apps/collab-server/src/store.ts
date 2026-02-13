import {
  Awareness,
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
  removeAwarenessStates
} from "y-protocols/awareness";
import * as Y from "yjs";

export interface CollaborationRoom {
  readonly id: string;
  readonly doc: Y.Doc;
  readonly awareness: Awareness;
  readonly sockets: Set<WebSocket>;
  readonly awarenessClientIdsBySocket: Map<WebSocket, Set<number>>;
}

export class CollaborationStore {
  private readonly rooms: Map<string, CollaborationRoom> = new Map();

  public getRoom(id: string): CollaborationRoom {
    const existing = this.rooms.get(id);
    if (existing) {
      return existing;
    }

    const doc = new Y.Doc();
    const awareness = new Awareness(doc);
    const room: CollaborationRoom = {
      id,
      doc,
      awareness,
      sockets: new Set(),
      awarenessClientIdsBySocket: new Map()
    };

    this.rooms.set(id, room);
    return room;
  }

  public deleteRoomIfEmpty(id: string): void {
    const room = this.rooms.get(id);
    if (!room || room.sockets.size > 0) {
      return;
    }

    room.awareness.destroy();
    room.doc.destroy();
    this.rooms.delete(id);
  }

  public countRooms(): number {
    return this.rooms.size;
  }

  public countConnections(): number {
    let count = 0;
    for (const room of this.rooms.values()) {
      count += room.sockets.size;
    }
    return count;
  }

  public applyAwareness(room: CollaborationRoom, update: Uint8Array, socket: WebSocket): void {
    const trackedClientIds = room.awarenessClientIdsBySocket.get(socket) ?? new Set<number>();

    const trackUpdate = (
      change: { readonly added: readonly number[]; readonly updated: readonly number[]; readonly removed: readonly number[] },
      origin: unknown
    ): void => {
      if (origin !== socket) {
        return;
      }

      for (const clientId of change.added) {
        trackedClientIds.add(clientId);
      }

      for (const clientId of change.updated) {
        if (room.awareness.getStates().has(clientId)) {
          trackedClientIds.add(clientId);
        } else {
          trackedClientIds.delete(clientId);
        }
      }

      for (const clientId of change.removed) {
        trackedClientIds.delete(clientId);
      }
    };

    room.awareness.on("update", trackUpdate);
    try {
      applyAwarenessUpdate(room.awareness, update, socket);
    } finally {
      room.awareness.off("update", trackUpdate);
    }

    if (trackedClientIds.size > 0) {
      room.awarenessClientIdsBySocket.set(socket, trackedClientIds);
    } else {
      room.awarenessClientIdsBySocket.delete(socket);
    }
  }

  public clearSocketAwareness(room: CollaborationRoom, socket: WebSocket): Uint8Array {
    const trackedClientIds = room.awarenessClientIdsBySocket.get(socket);
    room.awarenessClientIdsBySocket.delete(socket);

    if (!trackedClientIds || trackedClientIds.size === 0) {
      return new Uint8Array(0);
    }

    const removedClientIds = Array.from(trackedClientIds.values());
    removeAwarenessStates(room.awareness, removedClientIds, "disconnect");
    return encodeAwarenessUpdate(room.awareness, removedClientIds);
  }

  public currentAwarenessUpdate(room: CollaborationRoom): Uint8Array {
    return encodeAwarenessUpdate(room.awareness, Array.from(room.awareness.getStates().keys()));
  }
}
