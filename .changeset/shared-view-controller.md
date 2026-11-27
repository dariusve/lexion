---
"@lexion-rte/core": minor
"@lexion-rte/web": minor
"@lexion-rte/react": minor
"@lexion-rte/vue": minor
"@lexion-rte/nuxt": minor
"@lexion-rte/next": patch
"@lexion-rte/angular": minor
"@lexion-rte/svelte": minor
"@lexion-rte/solid": minor
"@lexion-rte/vue2": minor
"@lexion-rte/astro": minor
---

Shared view controller, accessibility, and themeable status bar.

- **New `LexionViewController`** in `@lexion-rte/web`: the single implementation of view wiring that every adapter now uses (editor subscription, controlled-value sync, change emission, read-only state, ARIA attributes, stylesheet injection). `@lexion-rte/react` and `@lexion-rte/vue` now depend on `@lexion-rte/web`.
- **Accessibility:** the editable area has `role="textbox"`, `aria-multiline` and `aria-readonly`. Every adapter accepts `ariaLabel` / `ariaLabelledBy`.
- **Status bar:** it is now styled with CSS classes from an injected stylesheet (`lexionStatusBarStyles`, zero-specificity `:where()` selectors, `--lexion-status-bar-*` custom properties) instead of inline styles, so it can be themed. The font size went from 7.5px to 11px, and `text-wrap-mode` was replaced with `white-space: nowrap`. React and Vue now inject the stylesheet too; opt out with `injectStyles: false`.
- **Branding:** the new `LexionEditorOptions.branding` option hides (`false`) or customizes (`{ text, align, className, style }`) the "Powered by lexion" status bar item.
- New core helpers: `splitStatusBarItems`, `getStatusBarGroupClassName`, `getStatusBarItemClassName`, `resolveBrandingStatusItem`. `lexionStatusBarAppearance.style` / `groupStyles` are deprecated.
