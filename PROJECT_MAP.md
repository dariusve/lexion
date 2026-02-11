# Project Map

## What The System Does
Lexion is a production-grade, framework-agnostic rich text editor platform for SaaS products.  
It provides a headless core, optional UI adapters, extension-driven features, collaboration support, and AI-native editing workflows.

## Main Packages
- `packages/core`: editor engine and domain logic.
- `packages/extensions`: reusable feature modules implemented as extensions.
- `packages/web`: framework-neutral browser integration utilities.
- `packages/react`: React adapter layer.
- `packages/vue`: Vue adapter layer.
- `apps/api`: backend API surface (Fastify/Node.js).
- `apps/collab-server`: real-time collaboration backend (Yjs transport/persistence).
- `apps/docs`, `apps/playground`: documentation and interactive validation environments.

## Data Flow
1. Client app initializes an editor instance through a framework adapter or web binding.
2. Adapter wires UI events to core commands and transactions.
3. Core applies transactions and invokes extension hooks/plugins.
4. Optional collaboration sync propagates shared updates through Yjs and collab server.
5. Optional AI extensions transform document state via typed core APIs.
6. Updated state is rendered by the adapter layer.

## Where To Implement Features
- New editor behavior: `packages/extensions` (default path).
- Shared editor rules/invariants: `packages/core`.
- Rendering or framework lifecycle integration: `packages/web`, `packages/react`, `packages/vue`.
- Realtime sync transport/persistence: `apps/collab-server`.
- API endpoints and backend workflows: `apps/api`.

Rule of thumb: implement logic once in core or extensions, then expose it through adapters.

