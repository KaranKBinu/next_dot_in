"use server";

import { prisma } from "@/lib/prisma";
import { requireMasterAdmin, logAuditAction } from "@/lib/authorization";
import { hashPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createUserAction(formData: FormData) {
  try {
    const session = await requireMasterAdmin();

    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.toLowerCase().trim();
    const phone = (formData.get("phone") as string)?.trim() || null;
    const password = formData.get("password") as string;
    const role = formData.get("role") as "CUSTOMER" | "ADMIN" | "MASTER_ADMIN";

    if (!name || !email || !password || !role) {
      return { success: false, error: "Name, email, password, and role are required." };
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, error: "A user with this email already exists." };
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash: hashPassword(password),
        role,
      },
    });

    await logAuditAction(session.id, "USER_CREATED", "User", user.id, { email: user.email, role: user.role });

    revalidatePath("/admin/users");
    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create user." };
  }
}

export async function updateUserRoleAction(targetUserId: string, newRole: "CUSTOMER" | "ADMIN" | "MASTER_ADMIN") {
  try {
    const session = await requireMasterAdmin();

    // Prevent accidental self-demotion/modification
    if (targetUserId === session.id) {
      return { success: false, error: "You cannot modify your own role." };
    }

    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!targetUser) return { success: false, error: "Target user not found." };

    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
    });

    await logAuditAction(session.id, "USER_ROLE_CHANGED", "User", targetUserId, {
      email: targetUser.email,
      oldRole: targetUser.role,
      newRole,
    });

    revalidatePath("/admin/users");
    revalidatePath("/admin/master");
    return { success: true, user: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update user role." };
  }
}

export async function resetUserPasswordAction(targetUserId: string, newPassword: string) {
  try {
    const session = await requireMasterAdmin();

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: "Password must be at least 6 characters." };
    }

    const updated = await prisma.user.update({
      where: { id: targetUserId },
      data: { passwordHash: hashPassword(newPassword) },
    });

    await logAuditAction(session.id, "USER_PASSWORD_RESET", "User", targetUserId, { email: updated.email });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to reset password." };
  }
}

export async function deleteUserAction(targetUserId: string) {
  try {
    const session = await requireMasterAdmin();

    if (targetUserId === session.id) {
      return { success: false, error: "You cannot delete your own account." };
    }

    const user = await prisma.user.findUnique({ where: { id: targetUserId } });
    if (!user) return { success: false, error: "User not found." };

    await prisma.user.delete({ where: { id: targetUserId } });

    await logAuditAction(session.id, "USER_DELETED", "User", targetUserId, { email: user.email, role: user.role });

    revalidatePath("/admin/users");
    revalidatePath("/admin/master");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete user." };
  }
}
