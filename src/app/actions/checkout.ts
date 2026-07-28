"use server";

import { razorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";

export async function createRazorpayOrderAction(totalAmount: number) {
  try {
    const amountInPaise = Math.round(totalAmount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    return { success: true, orderId: order.id, amount: order.amount, keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID };
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return { success: false, error: error.message || "Failed to initiate Razorpay order." };
  }
}

export async function completeOrderAction(data: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  items: { productId: string; name: string; price: number; quantity: number; image?: string }[];
  totalAmount: number;
  shippingAddress: { fullName: string; street: string; city: string; state: string; pincode: string; phone: string; email: string };
}) {
  const session = await getCurrentSession();
  const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);

  try {
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.id || null,
        guestEmail: data.shippingAddress.email,
        guestName: data.shippingAddress.fullName,
        guestPhone: data.shippingAddress.phone,
        totalAmount: data.totalAmount,
        status: "PAID",
        razorpayOrderId: data.razorpayOrderId,
        razorpayPaymentId: data.razorpayPaymentId,
        shippingAddress: data.shippingAddress as any,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || null,
          })),
        },
      },
    });

    // Reduce stock for ordered products
    for (const item of data.items) {
      if (item.productId) {
        await prisma.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        }).catch(() => {});
      }
    }

    return { success: true, orderId: order.id, orderNumber: order.orderNumber };
  } catch (error: any) {
    console.error("Order completion error:", error);
    return { success: false, error: error.message };
  }
}
