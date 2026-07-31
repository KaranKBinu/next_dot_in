import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function GET() {
  const startTime = Date.now();

  try {
    // Perform a lightweight database ping
    await prisma.$queryRaw`SELECT 1`;
    const durationMs = Date.now() - startTime;

    logger.debug(
      {
        operation: "HEALTH_CHECK",
        durationMs,
        status: "UP",
      },
      "Application health check successful"
    );

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      uptimeSeconds: Math.floor(process.uptime()),
    });
  } catch (error: any) {
    const durationMs = Date.now() - startTime;

    logger.error(
      {
        operation: "HEALTH_CHECK_FAILED",
        durationMs,
        error: error.message,
      },
      "Application health check failed: Database connection issue"
    );

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "disconnected",
      },
      { status: 503 }
    );
  }
}
