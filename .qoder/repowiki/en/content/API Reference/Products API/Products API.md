# Products API

<cite>
**Referenced Files in This Document**
- [route.ts](file://src/app/api/products/route.ts)
- [route.ts](file://src/app/api/products/[sku]/route.ts)
- [schema.prisma](file://prisma/schema.prisma)
- [auth.ts](file://src/lib/auth.ts)
- [login/route.ts](file://src/app/api/admin/login/route.ts)
- [logout/route.ts](file://src/app/api/admin/logout/route.ts)
- [catalog.ts](file://src/utils/catalog.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Authentication](#authentication)
3. [Endpoints Overview](#endpoints-overview)
4. [GET /api/products](#get-apiproducts)
5. [POST /api/products](#post-apiproducts)
6. [DELETE /api/products?sku=xxx](#delete-apiproductsskuxxx)
7. [Error Handling and Status Codes](#error-handling-and-status-codes)
8. [Request/Response Schemas](#requestresponse-schemas)
9. [Examples](#examples)
10. [Notes on Image Paths](#notes-on-image-paths)
11. [Appendix: Related PATCH Endpoint](#appendix-related-patch-endpoint)

## Introduction
This document describes the Products API endpoints for listing, creating, and soft-deleting products. It includes authentication requirements using admin session cookies, request/response schemas, error handling patterns (including unique constraint violations), status codes, and concrete examples.

## Authentication
- Admin-only endpoints require a valid admin session cookie named admin_session.
- The server validates this cookie by comparing it to an environment variable ADMIN_SESSION_TOKEN.
- To obtain a session, POST to /api/admin/login with your password; the server sets the admin_session cookie.
- To log out, POST to /api/admin/logout to clear the cookie.

Key behaviors:
- Missing or invalid admin_session results in 401 Unauthorized for protected endpoints.
- Login returns a success response and sets the cookie with httpOnly, secure (in production), sameSite lax, and a 7-day max age.

**Section sources**
- [auth.ts:1-16](file://src/lib/auth.ts#L1-L16)
- [login/route.ts:1-29](file://src/app/api/admin/login/route.ts#L1-L29)
- [logout/route.ts:1-12](file://src/app/api/admin/logout/route.ts#L1-L12)

## Endpoints Overview
- GET /api/products — Fetch all active products. Public access.
- POST /api/products — Create a new product. Admin only.
- DELETE /api/products?sku=xxx — Soft-delete a product by setting isActive=false. Admin only.

Note: There is also a PATCH /api/products/[sku] endpoint for updating fields. See Appendix.

## GET /api/products
- Method: GET
- Path: /api/products
- Access: Public
- Description: Returns all products where isActive=true, ordered by creation date descending.

Response
- 200 OK: JSON array of product objects.
- 500 Internal Server Error: JSON error object if database query fails.

Example Response Fields (selected):
- id: string
- sku: string
- name: string
- brand: string
- category: string
- priceInRupees: number
- imagePath: string
- isActive: boolean
- createdAt: datetime

**Section sources**
- [route.ts:6-17](file://src/app/api/products/route.ts#L6-L17)

## POST /api/products
- Method: POST
- Path: /api/products
- Access: Admin only (requires admin_session cookie)
- Description: Creates a new product. Required fields are validated; missing required fields return 400. Unique SKU constraint violation returns 409.

Request Body
- Content-Type: application/json
- Required fields:
  - sku: string (unique)
  - name: string
  - brand: string
  - category: string
  - priceInRupees: number
  - imagePath: string
- Optional fields (defaults applied if omitted):
  - parentProductId: string | null
  - description: string (default "")
  - year: string (default current year as string)
  - material: string (default "")
  - size: string (default "")
  - colorName: string (default "")
  - colorHex: string (default "#000000")
  - chestInch: string (default "")
  - lengthInch: string (default "")
  - shoulderInch: string (default "")
  - condition: string (default "condVeryGood")
  - hotness: number (default 3)
  - isActive: boolean (forced true)

Responses
- 201 Created: JSON product object created.
- 400 Bad Request: Missing required fields.
- 401 Unauthorized: Missing or invalid admin_session.
- 409 Conflict: SKU already exists (unique constraint).
- 500 Internal Server Error: Unexpected failure.

**Section sources**
- [route.ts:19-72](file://src/app/api/products/route.ts#L19-L72)

## DELETE /api/products?sku=xxx
- Method: DELETE
- Path: /api/products?sku={sku}
- Access: Admin only (requires admin_session cookie)
- Description: Soft-deletes a product by setting isActive=false for the given SKU.

Query Parameters
- sku: string (required)

Responses
- 200 OK: JSON { success: true }
- 400 Bad Request: Missing SKU parameter.
- 401 Unauthorized: Missing or invalid admin_session.
- 500 Internal Server Error: Unexpected failure.

**Section sources**
- [route.ts:74-97](file://src/app/api/products/route.ts#L74-L97)

## Error Handling and Status Codes
Common patterns:
- 400 Bad Request: Validation errors such as missing required fields or missing query parameters.
- 401 Unauthorized: Missing or invalid admin_session cookie.
- 409 Conflict: Unique constraint violation (SKU already exists).
- 500 Internal Server Error: Database or unexpected failures.

Unique Constraint Violations
- When creating or updating a product, if the provided SKU conflicts with an existing record, the server detects Prisma error code P2002 and responds with 409 and a descriptive message.

**Section sources**
- [route.ts:61-71](file://src/app/api/products/route.ts#L61-L71)
- [route.ts:23-33](file://src/app/api/products/[sku]/route.ts#L23-L33)

## Request/Response Schemas
Product Data Model (database-backed fields used by the API)
- id: string (UUID)
- parentProductId: string | null
- sku: string (unique)
- name: string
- description: string
- brand: string
- year: string
- category: string (e.g., "tees", "denim", "knits", "cargo")
- material: string
- size: string
- colorName: string
- colorHex: string
- priceInRupees: number
- imagePath: string
- chestInch: string
- lengthInch: string
- shoulderInch: string
- condition: string (e.g., "condExcellent", "condVeryGood", "condGood")
- hotness: number (default 3)
- isActive: boolean (default true)
- createdAt: datetime

Notes on measurement fields:
- chestInch, lengthInch, shoulderInch represent measurements in inches. These map to the ProductMeasurements concept used elsewhere in the app.

Frontend-facing variant model (for reference)
- ProductVariant includes measurements as an object with chest, length, shoulder.
- Product includes a default variant snapshot for compatibility.

These types inform how clients may interpret measurement fields when building UIs.

**Section sources**
- [schema.prisma:44-66](file://prisma/schema.prisma#L44-L66)
- [catalog.ts:1-39](file://src/utils/catalog.ts#L1-L39)

## Examples
Below are concrete examples for each endpoint. Replace placeholders with actual values.

Get all active products
- Request
  - Method: GET
  - URL: /api/products
- Response
  - Status: 200
  - Body: Array of product objects

Create a new product (admin only)
- Request
  - Method: POST
  - URL: /api/products
  - Headers: Cookie: admin_session=<token>
  - Body:
    {
      "sku": "prod-1-L-orange",
      "name": "Vintage Tee",
      "brand": "BrandCo",
      "category": "tees",
      "priceInRupees": 1200,
      "imagePath": "/products/vintage-tee.jpg",
      "size": "L",
      "colorName": "Rust Orange",
      "colorHex": "#ff5722",
      "chestInch": "20",
      "lengthInch": "28",
      "shoulderInch": "18",
      "condition": "condVeryGood",
      "hotness": 4
    }
- Response
  - Status: 201
  - Body: Created product object

Soft-delete a product by SKU (admin only)
- Request
  - Method: DELETE
  - URL: /api/products?sku=prod-1-L-orange
  - Headers: Cookie: admin_session=<token>
- Response
  - Status: 200
  - Body: { "success": true }

Unauthorized example
- Request
  - Method: POST
  - URL: /api/products
  - Body: {...}
- Response
  - Status: 401
  - Body: { "error": "Unauthorized" }

Unique constraint violation example
- Request
  - Method: POST
  - URL: /api/products
  - Headers: Cookie: admin_session=<token>
  - Body: { "sku": "existing-sku", ... }
- Response
  - Status: 409
  - Body: { "error": "SKU already exists" }

Missing required fields example
- Request
  - Method: POST
  - URL: /api/products
  - Headers: Cookie: admin_session=<token>
  - Body: { "sku": "new-sku" }
- Response
  - Status: 400
  - Body: { "error": "Missing required fields" }

Missing SKU parameter example
- Request
  - Method: DELETE
  - URL: /api/products
  - Headers: Cookie: admin_session=<token>
- Response
  - Status: 400
  - Body: { "error": "SKU is required" }

[No sources needed since this section provides usage examples without analyzing specific files]

## Notes on Image Paths
- The API expects imagePath to be a string path stored in the database.
- No image upload logic is implemented in these routes; clients should provide a valid path string.
- Ensure the referenced images exist at the expected location for successful rendering.

[No sources needed since this section provides general guidance]

## Appendix: Related PATCH Endpoint
PATCH /api/products/[sku]
- Method: PATCH
- Path: /api/products/{sku}
- Access: Admin only
- Description: Updates one or more fields of a product identified by its SKU.
- Responses:
  - 200 OK: Updated product object
  - 401 Unauthorized: Missing or invalid admin_session
  - 409 Conflict: If updating SKU to a value that already exists
  - 500 Internal Server Error: Unexpected failure

**Section sources**
- [route.ts:5-34](file://src/app/api/products/[sku]/route.ts#L5-L34)