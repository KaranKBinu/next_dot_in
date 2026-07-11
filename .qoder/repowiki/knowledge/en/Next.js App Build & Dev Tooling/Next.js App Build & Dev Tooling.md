---
kind: build_system
name: Next.js App Build & Dev Tooling
category: build_system
scope:
    - '**'
source_files:
    - package.json
    - next.config.ts
    - tsconfig.json
    - prisma.config.ts
    - postcss.config.mjs
    - eslint.config.mjs
---

This repository uses the standard Next.js 16 development and build toolchain with no custom Makefiles, Dockerfiles, or CI pipelines. The entire build system is driven by npm scripts and framework-native configuration files.

**Build pipeline**
- `npm run dev` → `next dev` (TurboPack-enabled development server)
- `npm run build` → `next build` (production static/SSR artifact generation into `.next/`)
- `npm run start` → `next start` (serves the production build)
- `npm run lint` → `eslint` (configured via `eslint.config.mjs`, using `eslint-config-next` v16)

**TypeScript compilation**
- `tsconfig.json` targets ES2017, enables strict mode, `isolatedModules`, and `noEmit` (Next.js handles emit). Path alias `@/*` maps to `./src/*`. The Next.js TS plugin is included for type inference of generated routes and config.

**Styling pipeline**
- Tailwind CSS v4 via PostCSS (`postcss.config.mjs`) with `@tailwindcss/postcss` adapter — no separate build step; Tailwind is processed during Next.js builds.

**Database / Prisma integration**
- `prisma.config.ts` defines schema location, Neon datasource URL (from `DATABASE_URL` env), and seeds `node ./prisma/seed.js` on migration.
- `package.json` prisma seed hook runs `node prisma/seed.js`.
- `@prisma/adapter-neon` connects Prisma to Neon Serverless Postgres at runtime.

**Environment exposure**
- `next.config.ts` explicitly exposes `ADMIN_SESSION_TOKEN` and `ADMIN_PASSWORD` to the Edge runtime so middleware can read them.

**What is NOT present**
- No Dockerfile, docker-compose, or containerization config.
- No Makefile, shell build/deploy scripts, or cross-compilation setup.
- No CI/CD configuration (no `.github/workflows`, `.gitlab-ci.yml`, Jenkinsfile, etc.).
- No version bump/release automation beyond the static `0.1.0` in `package.json`.

Developers should rely on `npm run dev/build/start` for local work and add external tooling (Docker, CI) only when needed.