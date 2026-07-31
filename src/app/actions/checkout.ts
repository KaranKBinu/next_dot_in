"use server";

import { razorpay } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { validateAndCalculateCoupon } from "@/lib/coupons";

export async function createRazorpayOrderAction(totalAmount: number, couponCode?: string) {
  try {
    let finalAmount = totalAmount;

    // Server-side recalculation of coupon discount if a coupon code is supplied
    if (couponCode) {
      const validation = await validateAndCalculateCoupon(couponCode, totalAmount);
      if (validation.valid && validation.payableAmount !== undefined) {
        finalAmount = validation.payableAmount;
      }
    }

    const amountInPaise = Math.round(finalAmount * 100);

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      finalAmount,
    };
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
  couponCode?: string;
  shippingAddress: { fullName: string; street: string; city: string; state: string; pincode: string; phone: string; email: string };
}) {
  const session = await getCurrentSession();
  const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);

  // Re-verify subtotal and server-side coupon discount
  const subtotal = data.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  let discountAmount = 0;
  let validatedCouponCode: string | null = null;
  let targetCouponId: string | null = null;

  if (data.couponCode) {
    const couponValidation = await validateAndCalculateCoupon(data.couponCode, subtotal, data.shippingAddress.email);
    if (couponValidation.valid) {
      discountAmount = couponValidation.discountAmount || 0;
      validatedCouponCode = couponValidation.couponCode || null;

      const couponObj = await prisma.coupon.findUnique({ where: { code: couponValidation.couponCode } });
      if (couponObj) targetCouponId = couponObj.id;
    }
  }

  const finalTotalAmount = Math.max(0, subtotal - discountAmount);

  try {
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.id || null,
        guestEmail: data.shippingAddress.email,
        guestName: data.shippingAddress.fullName,
        guestPhone: data.shippingAddress.phone,
        totalAmount: finalTotalAmount,
        discountAmount,
        couponCode: validatedCouponCode,
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

    // Record CouponUsage and increment Coupon usageCount upon successful payment
    if (targetCouponId) {
      await prisma.$transaction([
        prisma.couponUsage.create({
          data: {
            couponId: targetCouponId,
            userId: session?.id || null,
            guestEmail: data.shippingAddress.email || null,
            orderId: order.id,
            discountAmount,
          },
        }),
        prisma.coupon.update({
          where: { id: targetCouponId },
          data: { usageCount: { increment: 1 } },
        }),
      ]).catch((err) => console.error("Failed to record coupon usage transaction:", err));
    }

    // Reduce stock for all ordered products atomically
    const stockUpdates = data.items
      .filter((item) => item.productId)
      .map((item) =>
        prisma.product.update({
          where: { id: item.productId! },
          data: { stock: { decrement: item.quantity } },
        })
      );
    if (stockUpdates.length > 0) {
      await prisma.$transaction(stockUpdates).catch(() => {});
    }

    return { success: true, orderId: order.id, orderNumber: order.orderNumber };
  } catch (error: any) {
    console.error("Order completion error:", error);
    return { success: false, error: error.message };
  }
}
