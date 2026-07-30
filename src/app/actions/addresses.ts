"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export type AddressPayload = {
  fullName: string;
  phone: string;
  street: string;
  area?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
};

export async function getUserAddressesAction() {
  const session = await getCurrentSession();
  if (!session) {
    return { success: false, error: "Unauthorized", addresses: [] };
  }

  try {
    const addresses = await prisma.address.findMany({
      where: { userId: session.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return { success: true, addresses };
  } catch (error: any) {
    return { success: false, error: error.message, addresses: [] };
  }
}

export async function createAddressAction(data: AddressPayload) {
  const session = await getCurrentSession();
  if (!session) return { success: false, error: "Unauthorized" };

  if (!data.fullName || !data.phone || !data.street || !data.city || !data.state || !data.pincode) {
    return { success: false, error: "Please fill in all required address fields." };
  }

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
        phone: data.phone,
        street: data.street,
        area: data.area || null,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        landmark: data.landmark || null,
        isDefault: data.isDefault ?? false,
      } as any,
    });

    revalidatePath("/profile");
    revalidatePath("/checkout");
    return { success: true, address };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateAddressAction(id: string, data: AddressPayload) {
  const session = await getCurrentSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.id) {
      return { success: false, error: "Address not found or unauthorized." };
    }

    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.id },
        data: { isDefault: false },
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        fullName: data.fullName,
        phone: data.phone,
        street: data.street,
        area: data.area || null,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        landmark: data.landmark || null,
        isDefault: data.isDefault ?? false,
      } as any,
    });

    revalidatePath("/profile");
    revalidatePath("/checkout");
    return { success: true, address };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteAddressAction(id: string) {
  const session = await getCurrentSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== session.id) {
      return { success: false, error: "Address not found or unauthorized." };
    }

    await prisma.address.delete({ where: { id } });

    // If deleted address was default, set another address as default if exists
    if (existing.isDefault) {
      const firstRemaining = await prisma.address.findFirst({
        where: { userId: session.id },
        orderBy: { createdAt: "desc" },
      });
      if (firstRemaining) {
        await prisma.address.update({
          where: { id: firstRemaining.id },
          data: { isDefault: true },
        });
      }
    }

    revalidatePath("/profile");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function setDefaultAddressAction(id: string) {
  const session = await getCurrentSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    // Transaction: unset all defaults, then set the chosen one.
    // The update's where clause validates ownership — throws if not found.
    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId: session.id },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id, userId: session.id } as any,
        data: { isDefault: true },
      }),
    ]);

    revalidatePath("/profile");
    revalidatePath("/checkout");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
