# Lexion Overview

## What Lexion Is
Lexion is a framework-agnostic, headless rich text editor platform for SaaS products.

It provides:
- a typed editor core (`@lexion/core`)
- extension-based feature modules (`@lexion/extensions`)
- optional UI adapters (`@lexion/web`, `@lexion/react`, `@lexion/vue`)
- backend-ready collaboration and AI integration surfaces

The architecture goal is simple: implement editor behavior once in core/extensions, then consume it from any UI stack.

## Why Lexion Uses ProseMirror
Lexion is built on ProseMirror because it gives a production-grade document model and editing engine that fits headless, extensible systems.

### 1) Document Model
ProseMirror uses a schema-driven tree model:
- explicit node/mark types and attributes
- structural validity enforced by schema rules
- deterministic JSON serialization for storage, APIs, and collaboration

For Lexion this means:
- portable document data across frontend/backend services
- predictable transforms for commands and AI-assisted editing
- extension-safe feature composition without ad hoc document shapes

### 2) Editing Engine
ProseMirror provides a transactional editing engine:
- immutable editor state transitions
- plugin/keymap/input-rule pipeline
- robust selection, history, and command primitives

For Lexion this means:
- command-based APIs with reliable behavior
- extension-first feature delivery (schema + commands + plugins)
- clear separation between engine logic and framework bindings

## Fit With Lexion Architecture
- `@lexion/core` hosts lifecycle, state, commands, and extension loading.
- `@lexion/extensions` provides feature behavior as reusable modules.
- UI adapters only bind rendering/lifecycle and do not implement domain rules.

This keeps Lexion modular, testable, and ready for collaboration and AI-native workflows.
