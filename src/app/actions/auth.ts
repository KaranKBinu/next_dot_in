"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, setSessionCookie, clearSessionCookie } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password required." };
  }

  // Admin fallback shortcut check
  if ((email === "admin@next.in" || email === "master@next.in") && password === (process.env.ADMIN_PASSWORD || "admin123")) {
    const targetRole = email === "master@next.in" ? "MASTER_ADMIN" : "ADMIN";
    const targetName = email === "master@next.in" ? "Master Admin" : "Store Admin";

    let adminUser = await prisma.user.findUnique({ where: { email } });
    if (!adminUser) {
      adminUser = await prisma.user.create({
        data: {
          email,
          name: targetName,
          passwordHash: hashPassword(password),
          role: targetRole,
        },
      });
    } else if (adminUser.role !== targetRole) {
      adminUser = await prisma.user.update({
        where: { email },
        data: { role: targetRole },
      });
    }

    await setSessionCookie(adminUser.id, adminUser.role);
    return { success: true, role: adminUser.role };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return { success: false, error: "Invalid credentials." };
  }

  await setSessionCookie(user.id, user.role);
  return { success: true, role: user.role };
}

export async function signupAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password required." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "Email already exists." };
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashPassword(password),
      role: "CUSTOMER",
    },
  });

  await setSessionCookie(user.id, user.role);
  return { success: true, role: user.role };
}

export async function logoutAction() {
  await clearSessionCookie();
  return { success: true };
}
