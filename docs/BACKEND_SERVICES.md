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

## Commercial Services

Commercial collaboration and other premium backend services are intentionally not included in this public repository.
