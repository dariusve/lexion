import { Awareness, applyAwarenessUpdate, encodeAwarenessUpdate } from "y-protocols/awareness";
import * as Y from "yjs";

export interface CollaborationRoom {
  readonly id: string;
  readonly doc: Y.Doc;
  readonly awareness: Awareness;
  readonly sockets: Set<WebSocket>;
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
      sockets: new Set()
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

  public applyAwareness(room: CollaborationRoom, update: Uint8Array): void {
    applyAwarenessUpdate(room.awareness, update, "network");
  }

  public currentAwarenessUpdate(room: CollaborationRoom): Uint8Array {
    return encodeAwarenessUpdate(room.awareness, Array.from(room.awareness.getStates().keys()));
  }
}
