"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function addAddressAction(data: {
  fullName: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault?: boolean;
}) {
  const session = await getCurrentSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: session.id,
        fullName: data.fullName,
        street: data.street,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        phone: data.phone,
        isDefault: data.isDefault ?? false,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/checkout");
    return { success: true, address };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

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

export async function createCategoryAction(data: {
  name: string;
  description?: string;
  attributes?: string[];
  parentId?: string;
}) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "MASTER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description || null,
        attributes: data.attributes || ["Size", "Color"],
        parentId: data.parentId || null,
      },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products/new");
    return { success: true, category };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
