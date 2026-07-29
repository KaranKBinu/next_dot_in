"use server";

import { prisma } from "@/lib/prisma";

export async function liveSearchAction(query: string) {
  if (!query || query.trim().length === 0) {
    return { success: true, products: [], categories: [] };
  }

  const q = query.trim().toLowerCase();

  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: {
          isPublished: true,
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { brand: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { category: { name: { contains: q, mode: "insensitive" } } },
          ],
        },
        include: { category: true },
        take: 6,
      }),
      prisma.category.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
          ],
        },
        include: { _count: { select: { products: true } } },
        take: 3,
      }),
    ]);

    return { success: true, products, categories };
  } catch (error: any) {
    return { success: false, error: error.message, products: [], categories: [] };
  }
}
