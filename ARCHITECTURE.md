# Architecture

## Core Editor (`packages/core`)
- Owns editor state, commands, schema composition, transactions, and plugin orchestration.
- Exposes framework-independent APIs for initialization, editing, serialization, and extension hooks.
- Contains domain logic and invariants for correctness and testability.

## Framework Adapters (`packages/web`, `packages/react`, `packages/vue`)
- Provide platform/framework bindings to the core.
- Responsible for rendering integration, lifecycle wiring, and event bridging.
- Must remain thin: no editor business rules, no feature logic duplication.

## Extensions System (`packages/extensions`)
- Primary mechanism for adding features (nodes, marks, commands, keymaps, input rules, plugins).
- Encapsulates feature behavior behind typed extension contracts.
- Enables composability, versioning, and selective adoption by downstream apps.

## Collaboration Layer (`apps/collab-server`, Yjs integration)
- Handles shared document synchronization, awareness, and conflict resolution.
- Integrates with core via collaboration extensions/plugins, not adapter-specific logic.
- Server components focus on transport, auth integration, and persistence boundaries.

## AI Layer
- Implements AI-native editing features as extensions on top of core APIs.
- Manages structured prompts, model I/O contracts, and deterministic editor transforms.
- Keeps model/provider concerns isolated so core remains provider-agnostic.

