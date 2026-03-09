# Licensing Model

Lexion uses an open-core, dual-license model.

## Community Track

The following packages form the community distribution and are available under GPL-3.0-or-later:

- `@lexion-rte/core`
- `@lexion-rte/starter-kit`
- `@lexion-rte/tools`
- framework adapters such as `@lexion-rte/web`, `@lexion-rte/react`, `@lexion-rte/vue`, and the other adapter packages

## Commercial Track

Commercial distribution is available under separate written terms. Premium capabilities ship from private codebases and commercial services.

Commercial rights also cover hosted services, support, and any enterprise add-ons sold separately.

## Default Workspace Behavior

The root workspace commands are optimized for the community track:

- `pnpm build` validates the public packages and sample apps
- `pnpm lint` validates the public packages and sample apps

Premium implementation code is kept out of the public workspace and is not published from this repository.

## Repository Rules

- Community features should land in the open packages.
- Premium features should land in private commercial packages or commercial services.
- Adapter packages should stay thin and should not embed plan logic.
- Server-side commercial services should enforce entitlements; the client should only load allowed premium packages.

## Practical Packaging Guidance

- Put baseline editor behavior in `@lexion-rte/starter-kit`.
- Put proprietary or paid feature bundles in private packages.
- Keep shared contracts in `@lexion-rte/core` only when they are neutral and reusable across both community and commercial tracks.

## Source of Truth

The GPL text lives in [LICENSE](../LICENSE). Commercial availability is described in [LICENSE-COMMERCIAL.md](../LICENSE-COMMERCIAL.md).
