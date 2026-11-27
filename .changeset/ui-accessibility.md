---
"@lexion-rte/ui": minor
---

Toolbar accessibility and module split.

- `role="toolbar"` with an `aria-label` (new `ariaLabel` option), one Tab stop, and `ArrowLeft` / `ArrowRight` / `Home` / `End` navigation.
- Dropdown menus are keyboard operable: `ArrowDown` opens and focuses the first item, items have `role="menuitem"`, and `Escape` returns focus to the trigger.
- New `active` item field, plus `setItemActive()` / `setItemsActive()`. Toggle buttons expose `aria-pressed` and a `--active` class.
- Visible `:focus-visible` outline.
- Internal: `src/index.ts` was split into modules. The public exports are unchanged.
