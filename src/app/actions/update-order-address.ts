"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateOrderShippingAddressAction(orderId: string, shippingAddress: {
  name?: string;
  phone?: string;
  street: string;
  area?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "MASTER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        shippingAddress: shippingAddress as any,
      },
    });

    revalidatePath("/admin/orders");
    return { success: true, order };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
