import { cookies } from "next/headers";
import { prisma } from "./prisma";
import crypto from "crypto";

export type UserSession = {
  id: string;
  email: string;
  name: string | null;
  role: "CUSTOMER" | "ADMIN" | "MASTER_ADMIN";
};

export function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, "next_dot_in_salt", 1000, 64, "sha512").toString("hex");
}

export function verifyPassword(password: string, hash: string): boolean {
  const newHash = hashPassword(password);
  return newHash === hash;
}

export async function getCurrentSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("next_in_session")?.value;

  if (!sessionToken) return null;

  try {
    const [userId, role] = sessionToken.split(":");
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) return null;
    return user as UserSession;
  } catch (error) {
    return null;
  }
}

export async function setSessionCookie(userId: string, role: string) {
  const cookieStore = await cookies();
  cookieStore.set("next_in_session", `${userId}:${role}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("next_in_session");
}
