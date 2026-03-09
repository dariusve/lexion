# Backend Services

## `apps/api`

Fastify service for editor-related server operations.

This app is currently a neutral developer service. If commercial APIs are added later, entitlement checks should be enforced at the route or service layer rather than in editor core packages.

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

In the open-core packaging model, this service is intended to back the commercial collaboration feature set and should enforce entitlements in production deployments.

Minimum production concerns for the commercial track:
- authenticate the caller before room access
- verify workspace or organization entitlements
- enforce document, seat, and room limits server-side
- keep usage/audit data outside the editor runtime

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
