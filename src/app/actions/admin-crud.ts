"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function deleteProductAction(productId: string) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "MASTER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const orderItems = await prisma.orderItem.count({
      where: { productId },
    });

    if (orderItems > 0) {
      // Unpublish/archive instead of hard deleting to preserve order history integrity
      await prisma.product.update({
        where: { id: productId },
        data: { isPublished: false },
      });
      revalidatePath("/admin/products");
      return { success: true, archived: true, message: "Product referenced in orders. Unpublished & archived." };
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    revalidatePath("/admin/products");
    return { success: true, archived: false, message: "Product deleted permanently." };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function duplicateProductAction(productId: string) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "MASTER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const source = await prisma.product.findUnique({ where: { id: productId } });
    if (!source) return { success: false, error: "Source product not found." };

    const newSlug = `${source.slug}-copy-${Date.now()}`;
    const copy = await prisma.product.create({
      data: {
        name: `${source.name} (Copy)`,
        slug: newSlug,
        brand: source.brand,
        description: source.description,
        price: source.price,
        compareAtPrice: source.compareAtPrice,
        stock: source.stock,
        lowStockThreshold: source.lowStockThreshold,
        images: source.images,
        attributes: source.attributes || {},
        categoryId: source.categoryId,
        isFeatured: false,
        isPublished: false,
      },
    });

    revalidatePath("/admin/products");
    return { success: true, product: copy };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function togglePublishAction(productId: string, isPublished: boolean) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "MASTER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data: { isPublished },
    });
    revalidatePath("/admin/products");
    return { success: true, product };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCategoryAction(categoryId: string) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "MASTER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const productCount = await prisma.product.count({ where: { categoryId } });
    if (productCount > 0) {
      return { success: false, error: `Cannot delete category. Reassign or remove its ${productCount} product(s) first.` };
    }

    await prisma.category.delete({ where: { id: categoryId } });
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
