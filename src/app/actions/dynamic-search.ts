"use server";

import { prisma } from "@/lib/prisma";

export async function getDynamicSearchInitialsAction() {
  try {
    const [popularProducts, trendingCategories, featuredProducts] = await Promise.all([
      // Top wishlisted / featured products for Popular Searches
      prisma.product.findMany({
        where: { isPublished: true, isFeatured: true },
        include: { category: true },
        take: 6,
        orderBy: { createdAt: "desc" },
      }),
      // Active Categories with product count
      prisma.category.findMany({
        where: {
          products: {
            some: { isPublished: true },
          },
        },
        include: {
          _count: { select: { products: true } },
        },
        take: 6,
        orderBy: { name: "asc" },
      }),
      // Fallback latest arrivals
      prisma.product.findMany({
        where: { isPublished: true },
        select: { name: true },
        take: 6,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Format popular search terms from real database product names
    const popularSearchTerms = Array.from(
      new Set([
        ...popularProducts.map((p) => p.name),
        ...featuredProducts.map((p) => p.name),
      ])
    ).slice(0, 6);

    return {
      success: true,
      popularSearchTerms,
      trendingCategories,
      featuredProducts: popularProducts,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      popularSearchTerms: [],
      trendingCategories: [],
      featuredProducts: [],
    };
  }
}
