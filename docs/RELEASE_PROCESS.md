# Release Process

Lexion uses Changesets for versioning and publishing.

Public community packages are published from this workspace. Commercial packages are published from separate private infrastructure and do not live in this repo.

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

Use this workflow for public community packages. Commercial packages should follow the separate private release process outside this repository.

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
- Keep release notes explicit about whether a change affects the community track, the commercial track, or both.
