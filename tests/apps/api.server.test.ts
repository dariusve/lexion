import type { FastifyInstance } from "fastify";
import { afterEach, describe, expect, test } from "vitest";

import { buildApiServer } from "../../apps/api/src/server.js";

describe("@lexion-rte/api", () => {
  let app: FastifyInstance | null = null;

  afterEach(async () => {
    if (app) {
      await app.close();
      app = null;
    }
  });

  test("returns 400 for malformed documents on /documents/to-text", async () => {
    app = buildApiServer();

    const response = await app.inject({
      method: "POST",
      url: "/documents/to-text",
      payload: {
        document: {
          type: "doc",
          content: "invalid-content"
        }
      }
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: "Invalid document payload"
    });
  });

  test("returns 400 for malformed documents on /commands/execute", async () => {
    app = buildApiServer();

    const response = await app.inject({
      method: "POST",
      url: "/commands/execute",
      payload: {
        document: {
          type: "doc",
          content: "invalid-content"
        },
        command: "toggleBold"
      }
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: "Invalid document payload"
    });
  });
});
