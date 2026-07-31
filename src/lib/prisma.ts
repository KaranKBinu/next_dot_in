import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";

import { logger } from "./logger";

const SLOW_QUERY_THRESHOLD_MS = parseInt(process.env.SLOW_QUERY_THRESHOLD_MS || "500", 10);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

function createPrismaInstance() {
  const client = new PrismaClient({
    adapter,
    log: [
      { emit: "event", level: "query" },
      { emit: "event", level: "error" },
      { emit: "event", level: "warn" },
    ],
  });

  // Attach query performance listener
  (client as any).$on("query", (e: any) => {
    if (e.duration >= SLOW_QUERY_THRESHOLD_MS) {
      logger.warn(
        {
          operation: "DATABASE_SLOW_QUERY",
          durationMs: e.duration,
          target: e.target,
        },
        `Prisma slow query detected (${e.duration}ms)`
      );
    }
  });

  (client as any).$on("error", (e: any) => {
    logger.error(
      {
        operation: "DATABASE_ERROR",
        target: e.target,
      },
      e.message || "Prisma client error"
    );
  });

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaInstance();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

