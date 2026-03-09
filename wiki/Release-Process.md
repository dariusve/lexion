# Release Process

Lexion uses Changesets for versioning and publishing.

Public community packages are published from this workspace. Private premium packages remain internal to the commercial distribution and should not be published to the public npm registry.

## Local Workflow
1. Add a changeset:
```bash
pnpm changeset
```
2. Apply version updates:
```bash
pnpm version-packages
```
3. Publish:
```bash
pnpm release
```

Use this workflow for public community packages. Premium packages are private and should follow the commercial release process you run outside the public npm publication path.

## GitHub Automation
- CI workflow: `.github/workflows/ci.yml`
  - runs install, lint, build, test
- Release workflow: `.github/workflows/release.yml`
  - runs Changesets action on `main`
  - opens release PR or publishes when release changes are present

## Required Secrets
- `NPM_TOKEN` for publishing packages.

## Packaging Guidance
- Add changesets for public community packages.
- Do not publish `@lexion-rte/ai` or `@lexion-rte/collab` to the public npm registry.
- Keep release notes explicit about whether a change affects the community track, the commercial track, or both.
