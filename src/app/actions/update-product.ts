"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProductAction(data: {
  id: string;
  name: string;
  brand?: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  lowStockThreshold?: number;
  categoryId: string;
  images: string[];
  attributes?: Record<string, string>;
  isFeatured?: boolean;
  isPublished?: boolean;
}) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "MASTER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const product = await prisma.product.update({
      where: { id: data.id },
      data: {
        name: data.name,
        brand: data.brand || null,
        description: data.description,
        price: data.price,
        compareAtPrice: data.compareAtPrice || null,
        stock: data.stock,
        lowStockThreshold: data.lowStockThreshold ?? 5,
        categoryId: data.categoryId,
        images: data.images,
        attributes: data.attributes || {},
        isFeatured: data.isFeatured ?? false,
        isPublished: data.isPublished ?? true,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${data.id}`);
    revalidatePath("/catalog");
    revalidatePath("/");
    return { success: true, product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
