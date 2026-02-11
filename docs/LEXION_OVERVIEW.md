# Lexion Overview

## What Lexion Is
Lexion is a framework-agnostic, headless rich text editor platform for SaaS products.

It provides:
- a typed editor core (`@lexion/core`)
- extension-based feature modules (`@lexion/extensions`)
- optional UI adapters (`@lexion/web`, `@lexion/react`, `@lexion/vue`, `@lexion/vue2`, `@lexion/angular`, `@lexion/svelte`, `@lexion/solid`, `@lexion/astro`, `@lexion/next`, `@lexion/nuxt`)
- backend-ready collaboration and AI integration surfaces

The architecture goal is simple: implement editor behavior once in core/extensions, then consume it from any UI stack.

## Headless Editor vs Other Rich Text Editor Packages
The key value of a headless editor is control: you own behavior, data model, and UI composition without being locked to a prebuilt editor UI.

| Concern | Headless (Lexion) | UI-First Editor Packages |
| --- | --- | --- |
| UI ownership | Build your own product UI while reusing core editing engine. | Must adapt product UX to package-provided editor components. |
| Framework flexibility | Same editor logic can be used across web/React/Vue/Vue2/Angular/Svelte/Solid/Astro/Next/Nuxt adapters. | Often optimized for one stack, with uneven support for others. |
| Feature boundaries | Features are extension modules with typed contracts. | Customization can require patching internals or plugin workarounds. |
| Domain integration | Easy to connect business workflows, APIs, AI, and collaboration around core JSON. | Integration points may be constrained by package architecture. |
| Long-term maintenance | Logic is centralized in core/extensions and reused across apps. | UI + behavior are frequently coupled, increasing migration cost. |

In short: headless architecture is better when you need product-specific UX, multi-framework portability, and strict control over editor behavior and data.

## Key Advantage vs Integrating ProseMirror Directly
The main advantage is that Lexion gives you a production-ready editor platform layer on top of ProseMirror, so your team ships product features instead of rebuilding editor infrastructure.

If you integrate ProseMirror directly, you still need to design and maintain:
- your own extension contracts and command conventions
- adapter bindings for each UI framework
- consistent JSON/content APIs across apps and services
- collaboration/AI integration boundaries

With Lexion, those concerns are already structured:
- `@lexion/core` standardizes lifecycle, state, and command execution
- `@lexion/extensions` defines feature delivery boundaries
- `@lexion/web`, `@lexion/react`, `@lexion/vue`, `@lexion/vue2`, `@lexion/angular`, `@lexion/svelte`, `@lexion/solid`, `@lexion/astro`, `@lexion/next`, and `@lexion/nuxt` provide thin, consistent adapters
- backend and tooling packages align around the same document model and APIs

Result: lower integration cost, less duplicated logic, and easier long-term maintenance across products.

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
