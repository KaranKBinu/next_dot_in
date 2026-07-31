import { getCurrentSession, UserSession } from "./auth";
import { prisma } from "./prisma";
import { logger } from "./logger";

export async function requireAuth(): Promise<UserSession> {
  const session = await getCurrentSession();
  if (!session) {
    throw new Error("Unauthorized: Authentication required.");
  }
  return session;
}

export async function requireAdmin(): Promise<UserSession> {
  const session = await requireAuth();
  if (session.role !== "ADMIN" && session.role !== "MASTER_ADMIN") {
    throw new Error("Forbidden: Admin privileges required.");
  }
  return session;
}

export async function requireMasterAdmin(): Promise<UserSession> {
  const session = await requireAuth();
  if (session.role !== "MASTER_ADMIN") {
    throw new Error("Forbidden: Master Admin privileges required.");
  }
  return session;
}

export async function logAuditAction(
  actorId: string,
  action: string,
  entityType: string,
  entityId?: string,
  metadata?: Record<string, any>
) {
  try {
    const safeMetadata = metadata ? { ...metadata } : undefined;
    if (safeMetadata) {
      delete safeMetadata.password;
      delete safeMetadata.passwordHash;
      delete safeMetadata.token;
      delete safeMetadata.secret;
    }
    await prisma.auditLog.create({
      data: {
        actorId,
        action,
        entityType,
        entityId,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined,
      },
    });

    logger.info(
      {
        operation: "AUDIT_LOG_RECORDED",
        actorId,
        action,
        entityType,
        entityId,
      },
      `Audit log recorded: ${action}`
    );
  } catch (error) {
    logger.error(
      {
        operation: "AUDIT_LOG_CREATION_FAILED",
        actorId,
        action,
        entityType,
        entityId,
        error: (error as any)?.message,
      },
      "Audit log creation failed"
    );
  }
}
