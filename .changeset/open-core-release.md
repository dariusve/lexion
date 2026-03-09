---
"@lexion-rte/starter-kit": minor
"@lexion-rte/core": patch
"@lexion-rte/tools": patch
"@lexion-rte/web": patch
"@lexion-rte/react": patch
"@lexion-rte/vue": patch
"@lexion-rte/vue2": patch
"@lexion-rte/angular": patch
"@lexion-rte/svelte": patch
"@lexion-rte/solid": patch
"@lexion-rte/astro": patch
"@lexion-rte/next": patch
"@lexion-rte/nuxt": patch
---

Introduce the open-core package split for Lexion.

Community editing features now ship in `@lexion-rte/starter-kit`, while commercial-only capabilities move behind private package boundaries. Public documentation and package metadata now describe the dual-license/open-core model consistently.

Migration note:

- replace imports from `@lexion-rte/extensions` with `@lexion-rte/starter-kit` for starter-kit commands and extensions
- use the new package/docs structure for community versus commercial features going forward
