# Release Process

Lexion uses Changesets for versioning and publishing.

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

## GitHub Automation
- CI workflow: `.github/workflows/ci.yml`
  - runs install, lint, build, test
- Release workflow: `.github/workflows/release.yml`
  - runs Changesets action on `main`
  - opens release PR or publishes when release changes are present

## Required Secrets
- `NPM_TOKEN` for publishing packages.
