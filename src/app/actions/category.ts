"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateCategoryAction(data: {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  attributes?: string[];
  parentId?: string;
}) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "MASTER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const category = await prisma.category.update({
      where: { id: data.id },
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        attributes: data.attributes || ["Size", "Color"],
        parentId: data.parentId || null,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/catalog");
    revalidatePath("/");
    return { success: true, category };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
