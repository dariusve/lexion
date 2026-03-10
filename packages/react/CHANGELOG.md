# @lexion-rte/react

## 0.1.8

### Patch Changes

- Preserve undo history when a controlled editor value is synced back into the adapter without any actual document change. This also keeps the rendered editor state and status bar aligned when React, Vue, or the web adapter receives the current document again.

## 0.1.7

### Patch Changes

- Updated dependencies
  - @lexion-rte/starter-kit@0.2.2

## 0.1.6

### Patch Changes

- Updated dependencies [7679d1f]
  - @lexion-rte/starter-kit@0.2.1

## 0.1.5

### Patch Changes

- 1d74f2e: Introduce the open-core package split for Lexion.

  Community editing features now ship in `@lexion-rte/starter-kit`, while commercial-only capabilities move behind private package boundaries. Public documentation and package metadata now describe the dual-license/open-core model consistently.

  Migration note:

  - replace imports from `@lexion-rte/extensions` with `@lexion-rte/starter-kit` for starter-kit commands and extensions
  - use the new package/docs structure for community versus commercial features going forward

- Updated dependencies [1d74f2e]
  - @lexion-rte/starter-kit@0.2.0
  - @lexion-rte/core@0.1.5

## 0.1.4

### Patch Changes

- Add a shared Lexion framework overview and logo at the top of each package README.
- Updated dependencies
  - @lexion-rte/core@0.1.4
  - @lexion-rte/extensions@0.1.4

## 0.1.3

### Patch Changes

- Release `0.1.3` with framework-native adapter samples and documentation alignment.

  - Add runnable sample apps for each adapter package in `apps/*-sample`.
  - Ensure adapter and extension docs use real framework code style (React JSX, Vue SFC, Vue 2 Options API, Angular component lifecycle, Svelte action/component usage, Solid JSX).
  - Update guides and task tracking to reflect the full adapter sample matrix and framework-accurate examples.

- Updated dependencies
  - @lexion-rte/core@0.1.3
  - @lexion-rte/extensions@0.1.3

## 0.1.2

### Patch Changes

- Refresh package metadata links and expand package-level README documentation.
- Updated dependencies
  - @lexion-rte/core@0.1.2
  - @lexion-rte/extensions@0.1.2

## 0.1.1

### Patch Changes

- Update package metadata and documentation for the `@lexion-rte` package set.

  - Align repository/homepage/bugs metadata with the current GitHub repository owner.
  - Add package-level README files with package purpose and usage examples.

- Updated dependencies
  - @lexion-rte/core@0.1.1
  - @lexion-rte/extensions@0.1.1
