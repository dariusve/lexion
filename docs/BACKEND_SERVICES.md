# Backend Services

## `apps/api`

Fastify service for editor-related server operations.

### Endpoints
- `GET /health`
- `POST /documents/from-text`
  - body: `{ "text": string }`
  - response: `{ "document": JSONDocument }`
- `POST /documents/to-text`
  - body: `{ "document": JSONDocument }`
  - response: `{ "text": string }`
- `POST /commands/execute`
  - body: `{ "document": JSONDocument, "command": string, "args"?: unknown[] }`
  - response: `{ "executed": boolean, "document": JSONDocument }`

### Run
```bash
pnpm --filter @lexion-rte/api build
pnpm --filter @lexion-rte/api start
```

## `apps/collab-server`

Fastify + WebSocket service with Yjs document synchronization.

### Endpoints
- `GET /health`
- `GET /collab/:docId` (WebSocket)

### Message Protocol
Client -> Server:
- `{ "type": "update", "update": "<base64-yjs-update>" }`
- `{ "type": "awareness", "update": "<base64-awareness-update>" }`

Server -> Client:
- `{ "type": "sync", "update": "<base64-yjs-update>" }`
- `{ "type": "update", "update": "<base64-yjs-update>" }`
- `{ "type": "awareness", "update": "<base64-awareness-update>" }`
- `{ "type": "error", "message": string }`

### Run
```bash
pnpm --filter @lexion-rte/collab-server build
pnpm --filter @lexion-rte/collab-server start
```
