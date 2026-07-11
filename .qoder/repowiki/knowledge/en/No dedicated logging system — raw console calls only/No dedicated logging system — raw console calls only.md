---
kind: logging_system
name: No dedicated logging system — raw console calls only
category: logging_system
scope:
    - '**'
source_files:
    - src/app/api/orders/route.ts
    - src/app/api/products/route.ts
    - src/app/api/products/[sku]/route.ts
    - src/app/api/qr-config/route.ts
    - src/app/admin/page.tsx
    - prisma/seed.js
---

This repository does not implement a structured logging system. There is no logger framework (pino, winston, bunyan, etc.), no `src/lib/logger.ts` or similar module, and no logging configuration in `next.config.ts`, `middleware.ts`, or elsewhere.

All output is produced via bare Node/Edge runtime `console.log`, `console.warn`, and `console.error` calls scattered across API routes (`src/app/api/*`), the admin page (`src/app/admin/page.tsx`), and the Prisma seed script (`prisma/seed.js`). These calls are ad-hoc: they mix human-readable messages with error objects, have no consistent log level strategy, no request correlation IDs, and no centralized sink or rotation.

The `debug` package appears transitively through Prisma's dev dependencies but is never imported by application code. No ESLint rules enforce or forbid specific logging patterns.