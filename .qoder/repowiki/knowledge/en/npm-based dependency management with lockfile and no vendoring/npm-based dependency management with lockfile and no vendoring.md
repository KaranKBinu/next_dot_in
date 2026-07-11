---
kind: dependency_management
name: npm-based dependency management with lockfile and no vendoring
category: dependency_management
scope:
    - '**'
source_files:
    - package.json
    - package-lock.json
    - .gitignore
---

This Next.js project uses npm as its package manager, declared via the presence of `package.json` and a committed `package-lock.json` (lockfileVersion 3). There is no `yarn.lock`, `pnpm-lock.yaml`, or `bun.lock`, confirming npm is the authoritative resolver.

**Manifest structure (`package.json`)**
- Single workspace root — no `workspaces` field; all dependencies are declared at the top level.
- Runtime dependencies: `next`, `react`, `react-dom`, `@neondatabase/serverless`, `@prisma/adapter-neon`, `@prisma/client`, `lucide-react`, `three`, `@types/three`.
- Dev-only tooling: `typescript`, `eslint` + `eslint-config-next`, `tailwindcss` v4 + `@tailwindcss/postcss`, `prisma`, `@types/node`, `@types/react`, `@types/react-dom`.
- Version ranges use caret (`^`) for most packages, pinning only `next` and `react`/`react-dom` to exact versions (`16.2.7`, `19.2.4`).
- Scripts expose `dev`, `build`, `start`, `lint`; Prisma seeding is wired through the `prisma.seed` field pointing at `prisma/seed.js`.

**Lockfile & determinism**
- `package-lock.json` is committed to the repo, providing deterministic installs across environments.
- No `overrides` or `resolutions` fields are present, so transitive dependency versions come straight from the npm registry.

**Vendoring / private registries**
- No `vendor/` directory, no `.npmrc` file, and no `NODE_AUTH_TOKEN`/registry configuration in the repository — packages are resolved directly from the public npm registry.
- `node_modules/` and `.next/` are gitignored, so builds are reproducible only when the lockfile is present.

**Conventions observed**
- Framework/tooling versions that must stay in sync (`next` ↔ `eslint-config-next`, `@prisma/*` suite) are pinned to identical major/minor versions.
- Third-party libraries that are not framework-critical use caret ranges to allow safe patch updates.