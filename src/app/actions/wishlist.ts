"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getUserWishlistAction() {
  const session = await getCurrentSession();
  if (!session) return { success: false, items: [] };

  try {
    const items = await prisma.wishlist.findMany({
      where: { userId: session.id },
      include: {
        product: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, items };
  } catch (error: any) {
    return { success: false, error: error.message, items: [] };
  }
}

export async function toggleWishlistAction(productId: string) {
  const session = await getCurrentSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: session.id,
          productId,
        },
      },
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: { id: existing.id },
      });
      revalidatePath("/profile/favorites");
      revalidatePath("/catalog");
      return { success: true, favorited: false };
    } else {
      await prisma.wishlist.create({
        data: {
          userId: session.id,
          productId,
        },
      });
      revalidatePath("/profile/favorites");
      revalidatePath("/catalog");
      return { success: true, favorited: true };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
