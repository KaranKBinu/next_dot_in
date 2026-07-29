"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { hashPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateCustomerProfileAction(data: {
  userId: string;
  name: string;
  email: string;
  phone?: string;
}) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "MASTER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const user = await prisma.user.update({
      where: { id: data.userId },
      data: {
        name: data.name,
        email: data.email.toLowerCase().trim(),
        phone: data.phone || null,
      },
    });

    revalidatePath("/admin/customers");
    revalidatePath(`/admin/customers/${data.userId}`);
    return { success: true, user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function resetCustomerPasswordAction(userId: string) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "MASTER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const temporaryPassword = `Next${Math.floor(100000 + Math.random() * 900000)}`;
    const passwordHash = hashPassword(temporaryPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    return { success: true, temporaryPassword };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addCustomerAddressAction(data: {
  userId: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
}) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "MASTER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: data.userId },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.create({
      data: {
        userId: data.userId,
        name: data.name,
        phone: data.phone,
        street: data.street,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        landmark: data.landmark || null,
        isDefault: data.isDefault ?? false,
      },
    });

    revalidatePath(`/admin/customers/${data.userId}`);
    return { success: true, address };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteCustomerAddressAction(addressId: string, userId: string) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "MASTER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.address.delete({ where: { id: addressId } });
    revalidatePath(`/admin/customers/${userId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
