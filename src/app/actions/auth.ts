"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, setSessionCookie, clearSessionCookie } from "@/lib/auth";

import { logger } from "@/lib/logger";

export async function loginAction(formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;

  if (!email || !password) {
    logger.warn({ operation: "LOGIN_FAILED", reason: "MISSING_FIELDS" }, "Login failed: Missing email or password");
    return { success: false, error: "Email and password required." };
  }

  // Admin fallback check
  if ((email === "admin@next.in" || email === "master@next.in") && password === (process.env.ADMIN_PASSWORD || "admin123")) {
    const targetRole = email === "master@next.in" ? "MASTER_ADMIN" : "ADMIN";
    const targetName = email === "master@next.in" ? "Master Admin" : "Store Admin";

    const adminUser = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: targetName,
        passwordHash: hashPassword(password),
        role: targetRole,
      },
    });

    await setSessionCookie(adminUser.id, adminUser.role);
    logger.info({ operation: "LOGIN_SUCCESS", userId: adminUser.id, userRole: adminUser.role }, `Admin session established for ${adminUser.role}`);
    return { success: true, role: adminUser.role };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !verifyPassword(password, user.passwordHash)) {
    logger.warn({ operation: "LOGIN_FAILED", email }, "Login failed: Invalid credentials");
    return { success: false, error: "Invalid email or password." };
  }

  await setSessionCookie(user.id, user.role);
  logger.info({ operation: "LOGIN_SUCCESS", userId: user.id, userRole: user.role }, "User login successful");
  return { success: true, role: user.role };
}

export async function signupAction(formData: FormData) {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const phone = (formData.get("phone") as string)?.trim();
  const password = formData.get("password") as string;

  // Address fields
  const street = (formData.get("street") as string)?.trim();
  const area = (formData.get("area") as string)?.trim();
  const city = (formData.get("city") as string)?.trim();
  const state = (formData.get("state") as string)?.trim();
  const pincode = (formData.get("pincode") as string)?.trim();
  const landmark = (formData.get("landmark") as string)?.trim();

  if (!name || !email || !password) {
    return { success: false, error: "Full Name, Email, and Password are required." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: "This email address is already registered. Please sign in instead." };
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone: phone || null,
      passwordHash: hashPassword(password),
      role: "CUSTOMER",
    },
  });

  // Save Default Shipping Address if provided during onboarding
  if (street && city && state && pincode) {
    await prisma.address.create({
      data: {
        userId: user.id,
        fullName: name,
        phone: phone || "N/A",
        street,
        area: area || null,
        city,
        state,
        pincode,
        landmark: landmark || null,
        isDefault: true,
      } as any,
    });
  }

  await setSessionCookie(user.id, user.role);
  return { success: true, role: user.role };
}

export async function logoutAction() {
  await clearSessionCookie();
  return { success: true };
}
