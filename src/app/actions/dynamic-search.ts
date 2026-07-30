"use server";

import { prisma } from "@/lib/prisma";

export async function getDynamicSearchInitialsAction() {
  try {
    const [popularProducts, trendingCategories] = await Promise.all([
      // Top featured products for Popular Searches
      prisma.product.findMany({
        where: { isPublished: true, isFeatured: true },
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          images: true,
          category: { select: { name: true, slug: true } },
        },
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
        select: {
          id: true,
          name: true,
          slug: true,
          _count: { select: { products: true } },
        },
        take: 6,
        orderBy: { name: "asc" },
      }),
    ]);

    // Derive search terms from the already-fetched featured products
    const popularSearchTerms = popularProducts.map((p) => p.name).slice(0, 6);

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
