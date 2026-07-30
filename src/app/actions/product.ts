"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getCategoriesAction() {
  try {
    const categories = await prisma.category.findMany({
      include: { children: true },
      orderBy: { name: "asc" },
    });
    return { success: true, categories };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createProductAction(data: {
  name: string;
  brand?: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  barcode?: string;
  stock: number;
  lowStockThreshold?: number;
  categoryId: string;
  images: string[];
  attributes?: Record<string, string>;
  tags?: string[];
  isFeatured?: boolean;
  isPublished?: boolean;
}) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "MASTER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "") + "-" + Date.now();

    // Resolve categoryId — must be a valid UUID from the admin UI dropdown
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } });
    if (!category) {
      return { success: false, error: "Invalid category. Please select a valid category." };
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        brand: data.brand || null,
        description: data.description,
        price: data.price,
        compareAtPrice: data.compareAtPrice || null,
        barcode: data.barcode || null,
        stock: data.stock,
        lowStockThreshold: data.lowStockThreshold ?? 5,
        categoryId: category.id,
        images: data.images,
        attributes: data.attributes || {},
        tags: data.tags || [],
        isFeatured: data.isFeatured ?? false,
        isPublished: data.isPublished ?? true,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/catalog");
    revalidatePath("/");
    return { success: true, product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateStockAction(productId: string, delta: number) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "MASTER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        stock: {
          increment: delta,
        },
      },
    });

    revalidatePath("/admin/inventory");
    revalidatePath("/admin/products");
    return { success: true, product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
