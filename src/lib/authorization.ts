import { getCurrentSession, UserSession } from "./auth";
import { prisma } from "./prisma";

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
        entityId: entityId || null,
        metadata: safeMetadata ?? undefined,
      },
    });
  } catch (error) {
    console.error("Audit log creation failed:", error);
  }
}
