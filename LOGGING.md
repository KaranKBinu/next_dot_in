# NEXT.IN Observability & Structured Logging Guide

This document outlines the logging standards, configuration, security rules, and architectural design for NEXT.IN's observability system.

---

## 1. Core Principles

- **Structured Output**: All logs are emitted as structured JSON objects in Production and formatted text lines in Development.
- **Environment-Aware**: Behavior switches automatically based on `NODE_ENV` and `LOG_LEVEL`.
- **Sensitive Data Redaction**: Passwords, hashes, secrets, payment signatures, and tokens are automatically redacted by the logger before output.
- **No Console Pollution**: Direct `console.log` / `console.error` calls across server code are strictly replaced by the centralized logger.

---

## 2. Logger API & Usage

Import the singleton logger from `@/lib/logger`:

```ts
import { logger } from "@/lib/logger";
```

### Log Methods

```ts
logger.debug(context, message);
logger.info(context, message);
logger.warn(context, message);
logger.error(context, message);
logger.fatal(context, message);
```

### Examples

#### Normal Business Event (INFO)
```ts
logger.info(
  {
    operation: "PRODUCT_CREATED",
    productId: product.id,
    userId: session.id,
  },
  "Product created successfully"
);
```

#### Security / Authentication Warning (WARN)
```ts
logger.warn(
  {
    operation: "LOGIN_FAILED",
    email,
    reason: "INVALID_CREDENTIALS",
  },
  "Login failed: Invalid credentials"
);
```

#### Exception / System Error (ERROR)
```ts
logger.error(
  {
    operation: "PAYMENT_ORDER_CREATION_FAILED",
    totalAmount,
    error: error.message,
  },
  "Razorpay order creation error"
);
```

---

## 3. Environment Configuration (`LOG_LEVEL`)

Configure log output filtering via environment variables:

| Log Level | Level Value | Emitted Logs |
| :--- | :---: | :--- |
| `debug` | 10 | `debug`, `info`, `warn`, `error`, `fatal` |
| `info` (Default Prod) | 20 | `info`, `warn`, `error`, `fatal` |
| `warn` | 30 | `warn`, `error`, `fatal` |
| `error` | 40 | `error`, `fatal` |
| `fatal` | 50 | `fatal` only |

---

## 4. Prisma Slow Query & Database Observability

- **Slow Query Threshold**: Controlled via `SLOW_QUERY_THRESHOLD_MS` (Default: `500ms`).
- Queries taking longer than 500ms automatically emit a `DATABASE_SLOW_QUERY` warning log containing `durationMs` and target model information.
- Raw SQL parameters containing customer PII are **never** logged.

---

## 5. Health & Diagnostics Endpoint (`/api/health`)

- **URL**: `GET /api/health`
- **Output**:
  ```json
  {
    "status": "healthy",
    "timestamp": "2026-07-31T03:03:22.000Z",
    "database": "connected",
    "uptimeSeconds": 85023
  }
  ```
- Diagnostics pings the Neon PostgreSQL database via a lightweight `SELECT 1` query.

---

## 6. Difference Between Application Logs and Audit Logs

| Feature | Application Logger (`logger`) | Audit Log (`AuditLog` Model) |
| :--- | :--- | :--- |
| **Purpose** | Technical, operational, & runtime debugging | Historical business accountability & compliance |
| **Storage** | `stdout` / `stderr` stream | PostgreSQL Database (`audit_logs` table) |
| **Examples** | `PAYMENT_VERIFICATION_SUCCESS`, `DATABASE_SLOW_QUERY` | `MASTER_ADMIN_CHANGED_ROLE`, `PRODUCT_DELETED` |
