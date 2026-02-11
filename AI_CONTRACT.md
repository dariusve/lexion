# AI Contract

These rules are non-negotiable for all code in this repository.

## 1) Core Is Framework-Agnostic
- `packages/core` must not depend on React, Vue, DOM-specific APIs, or framework runtime concepts.
- Core APIs must be portable and consumable by any adapter.

## 2) No Business Logic In UI Adapters
- `packages/web`, `packages/react`, `packages/vue`, `packages/vue2`, `packages/angular`, `packages/svelte`, `packages/solid`, `packages/astro`, `packages/next`, and `packages/nuxt` are integration layers only.
- UI adapters may map events/state to core APIs, but must not implement editor domain logic.

## 3) Features Must Be Implemented As Extensions
- New editor capabilities must be delivered via the extensions system.
- Avoid one-off logic in core internals or adapters when an extension boundary is appropriate.

## 4) TypeScript Strict Mode Is Required
- All TypeScript packages must compile with strict type checking enabled.
- Code that weakens strictness is not accepted.

## 5) `any` Is Not Allowed
- Do not introduce explicit `any`.
- Do not bypass typing with implicit `any`; model unknown data using safe, explicit types.
