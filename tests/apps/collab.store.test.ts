import { describe, expect, test } from "vitest";

import { CollaborationStore } from "../../apps/collab-server/src/store.js";

describe("@lexion-rte/collab-server store", () => {
  test("removes socket awareness states on disconnect", () => {
    const store = new CollaborationStore();
    const sourceRoom = store.getRoom("source");
    const room = store.getRoom("target");
    const socket = {} as WebSocket;
    const now = Math.floor(Date.now() / 1000);

    const sourceClientId = 999_001;
    sourceRoom.awareness.states.set(sourceClientId, {
      user: {
        name: "test-user"
      }
    });
    sourceRoom.awareness.meta.set(sourceClientId, {
      clock: 1,
      lastUpdated: now
    });

    const awarenessUpdate = store.currentAwarenessUpdate(sourceRoom);
    store.applyAwareness(room, awarenessUpdate, socket);

    const trackedClientCount = room.awarenessClientIdsBySocket.get(socket)?.size ?? 0;
    const stateCountBeforeClear = room.awareness.getStates().size;
    expect(trackedClientCount).toBeGreaterThan(0);
    expect(stateCountBeforeClear).toBeGreaterThan(1);

    const removalUpdate = store.clearSocketAwareness(room, socket);

    expect(removalUpdate.byteLength).toBeGreaterThan(0);
    expect(room.awarenessClientIdsBySocket.has(socket)).toBe(false);
    expect(room.awareness.getStates().size).toBeLessThan(stateCountBeforeClear);
  });
});
