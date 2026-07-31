"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin, logAuditAction } from "@/lib/authorization";
import { validateAndCalculateCoupon } from "@/lib/coupons";
import { revalidatePath } from "next/cache";

export async function validateCouponAction(code: string, subtotal: number, guestEmail?: string) {
  return await validateAndCalculateCoupon(code, subtotal, guestEmail);
}

export async function createCouponAction(formData: FormData) {
  try {
    const session = await requireAdmin();

    const rawCode = formData.get("code") as string;
    const description = (formData.get("description") as string)?.trim() || null;
    const discountType = formData.get("discountType") as "PERCENTAGE" | "FIXED";
    const value = parseInt(formData.get("value") as string, 10);
    const maxDiscountAmountStr = formData.get("maxDiscountAmount") as string;
    const minOrderAmountStr = formData.get("minOrderAmount") as string;
    const startsAtStr = formData.get("startsAt") as string;
    const expiresAtStr = formData.get("expiresAt") as string;
    const usageLimitStr = formData.get("usageLimit") as string;
    const perUserLimitStr = formData.get("perUserLimit") as string;
    const isActive = formData.get("isActive") === "true";

    if (!rawCode || isNaN(value) || value <= 0) {
      return { success: false, error: "Valid Coupon Code and positive Discount Value are required." };
    }

    if (discountType === "PERCENTAGE" && (value < 1 || value > 100)) {
      return { success: false, error: "Percentage discount must be between 1% and 100%." };
    }

    const code = rawCode.trim().toUpperCase();

    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      return { success: false, error: "A coupon with this code already exists." };
    }

    const maxDiscountAmount = maxDiscountAmountStr ? parseInt(maxDiscountAmountStr, 10) : null;
    const minOrderAmount = minOrderAmountStr ? parseInt(minOrderAmountStr, 10) : 0;
    const usageLimit = usageLimitStr ? parseInt(usageLimitStr, 10) : null;
    const perUserLimit = perUserLimitStr ? parseInt(perUserLimitStr, 10) : null;
    const startsAt = startsAtStr ? new Date(startsAtStr) : new Date();
    const expiresAt = expiresAtStr ? new Date(expiresAtStr) : null;

    if (expiresAt && startsAt && expiresAt <= startsAt) {
      return { success: false, error: "Expiration date must be after the start date." };
    }

    const coupon = await prisma.coupon.create({
      data: {
        code,
        description,
        discountType,
        value,
        maxDiscountAmount,
        minOrderAmount,
        startsAt,
        expiresAt,
        usageLimit,
        perUserLimit,
        isActive,
      },
    });

    await logAuditAction(session.id, "COUPON_CREATED", "Coupon", coupon.id, { code: coupon.code, discountType, value });

    revalidatePath("/admin/coupons");
    revalidatePath("/admin/master/settings");

    return { success: true, coupon };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create coupon." };
  }
}

export async function toggleCouponStatusAction(couponId: string, isActive: boolean) {
  try {
    const session = await requireAdmin();

    const coupon = await prisma.coupon.update({
      where: { id: couponId },
      data: { isActive },
    });

    await logAuditAction(session.id, isActive ? "COUPON_ENABLED" : "COUPON_DISABLED", "Coupon", couponId, { code: coupon.code });

    revalidatePath("/admin/coupons");
    return { success: true, coupon };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update coupon status." };
  }
}

export async function deleteCouponAction(couponId: string) {
  try {
    const session = await requireAdmin();

    const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
    if (!coupon) return { success: false, error: "Coupon not found." };

    await prisma.coupon.delete({ where: { id: couponId } });

    await logAuditAction(session.id, "COUPON_DELETED", "Coupon", couponId, { code: coupon.code });

    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete coupon." };
  }
}
