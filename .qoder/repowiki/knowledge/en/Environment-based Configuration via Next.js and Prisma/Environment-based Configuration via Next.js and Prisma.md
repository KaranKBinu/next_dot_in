---
kind: configuration_system
name: Environment-based Configuration via Next.js and Prisma
category: configuration_system
scope:
    - '**'
source_files:
    - next.config.ts
    - prisma.config.ts
    - src/lib/prisma.ts
    - src/middleware.ts
    - src/app/api/admin/login/route.ts
    - package.json
---

This project uses a minimal, environment-variable-driven configuration system with no dedicated config files or runtime loader. All settings are consumed directly from process.env at build time and request time across three layers:

Build-time / framework config:
- next.config.ts exposes ADMIN_SESSION_TOKEN and ADMIN_PASSWORD to the Edge runtime via the env field so middleware and API routes can read them.
- tsconfig.json defines path aliases (@/* -> ./src/*) and strict compiler flags; no runtime config here.
- package.json contains scripts (dev, build, start, lint) and Prisma seed entry point; no env keys declared.

Runtime service config:
- prisma.config.ts loads .env via dotenv.config() and resolves DATABASE_URL (with a local Postgres fallback) for migrations/CLI.
- src/lib/prisma.ts constructs the Neon adapter from DATABASE_URL; logs queries in development when NODE_ENV=development.
- src/middleware.ts reads ADMIN_SESSION_TOKEN from process.env to validate the admin_session cookie on /admin/** requests.
- src/app/api/admin/login/route.ts compares submitted password against ADMIN_PASSWORD, sets an httpOnly admin_session cookie using ADMIN_SESSION_TOKEN, and toggles secure based on NODE_ENV.

Environment variables used:
- DATABASE_URL: Neon/PostgreSQL connection string, consumed by prisma.config.ts and src/lib/prisma.ts
- ADMIN_SESSION_TOKEN: Static session token value, consumed by next.config.ts, src/middleware.ts, src/app/api/admin/login/route.ts
- ADMIN_PASSWORD: Admin login secret, consumed by src/app/api/admin/login/route.ts
- NODE_ENV: Development vs production toggle, consumed by src/lib/prisma.ts (logging) and src/app/api/admin/login/route.ts (cookie secure)

Architecture & conventions:
- No .env file is committed; secrets must be supplied by the host environment (Next.js/Vercel/Node).
- There is no typed config object, schema validation, or centralized config module — every consumer reads process.env directly where needed.
- Only two values (ADMIN_SESSION_TOKEN, ADMIN_PASSWORD) are explicitly whitelisted for Edge access through next.config.ts; everything else is Node-only.
- The admin auth model is a single shared static token compared against a cookie, not a database-backed session store.

Rules developers should follow:
- Add new secrets as process.env.XXX usages and, if they must reach the Edge runtime, expose them in next.config.ts under env.
- Keep DATABASE_URL out of source control; rely on the local fallback URL only for type-checking/static builds.
- Do not introduce a separate config loader — keep the pattern of direct process.env reads consistent with existing code.