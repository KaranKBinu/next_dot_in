---
kind: error_handling
name: Ad-hoc try/catch with NextResponse.json error bodies
category: error_handling
scope:
    - '**'
source_files:
    - src/middleware.ts
    - src/lib/auth.ts
    - src/app/api/admin/login/route.ts
    - src/app/api/products/route.ts
    - src/app/api/products/[sku]/route.ts
    - src/app/api/orders/route.ts
    - src/app/api/qr-config/route.ts
---

This repository does not define a centralized error-handling system. Errors are handled locally inside each route and component using bare `try`/`catch` blocks that return `NextResponse.json({ error: ... })` responses, with no shared error types, sentinel errors, or global middleware for error normalization.

**Server-side (API routes)**
- Every mutating route (`POST /api/products`, `PATCH /api/products/[sku]`, `PUT /api/orders`, `POST /api/admin/login`) wraps its body in `try`/`catch` and returns a JSON `{ error }` payload with an HTTP status code (400, 401, 409, 500). There is no central error class or response factory — each route constructs its own message string.
- Prisma constraint violations are detected by inspecting the thrown object's `code === "P2002"` field to map database unique-constraint failures to HTTP 409 Conflict (`SKU already exists`). This check is duplicated in both `src/app/api/products/route.ts` and `src/app/api/products/[sku]/route.ts`.
- Database unavailability is treated as non-fatal: `GET /api/orders` and `GET /api/qr-config` catch DB errors, log a `console.warn`, and return empty/default data instead of failing the request.
- Authentication failures are short-circuited via the `isAdminAuthed(request)` helper from `src/lib/auth.ts`, which parses cookies manually and returns early with `{ error: "Unauthorized" }, { status: 401 }`. The Edge `src/middleware.ts` additionally redirects `/admin/*` to `/admin/login` when the `admin_session` cookie is missing or invalid.

**Client-side (pages & components)**
- Client pages use local React state (`setError`, `setPaymentError`) to surface API error messages to the user; there is no global error boundary or toast library.
- Context hooks throw a descriptive `new Error("useXxx must be used within a XxxProvider")` at runtime if misused — these are developer-facing invariant checks, not runtime error paths.

**Conventions observed**
- Always wrap async DB calls in `try`/`catch` inside Route Handlers.
- Return `NextResponse.json({ error: <string> }, { status })` for all client-visible failures.
- Map Prisma `P2002` to HTTP 409.
- Treat DB downtime gracefully on read-only endpoints by returning defaults.
- Guard admin mutations with `isAdminAuthed` before any business logic.

There is no dedicated `errors/` directory, no custom `AppError` class, no `unhandledRejection` handler, and no `next.config` error-page overrides.