"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(data: { name: string; phone: string }) {
  const session = await getCurrentSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const user = await prisma.user.update({
      where: { id: session.id },
      data: {
        name: data.name,
        phone: data.phone,
      },
    });

    revalidatePath("/profile");
    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
