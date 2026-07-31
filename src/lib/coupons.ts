"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { getSystemSettings } from "@/lib/settings";

export type CouponValidationCode =
  | "VALID"
  | "INVALID_CODE"
  | "COUPON_DISABLED"
  | "COUPON_NOT_STARTED"
  | "COUPON_EXPIRED"
  | "MINIMUM_ORDER_NOT_MET"
  | "USAGE_LIMIT_REACHED"
  | "USER_USAGE_LIMIT_REACHED";

export interface CouponValidationResult {
  valid: boolean;
  code: CouponValidationCode;
  message: string;
  couponCode?: string;
  discountType?: "PERCENTAGE" | "FIXED";
  discountValue?: number;
  discountAmount?: number;
  payableAmount?: number;
}

export async function validateAndCalculateCoupon(
  rawCode: string,
  subtotal: number,
  guestEmail?: string
): Promise<CouponValidationResult> {
  const settings = await getSystemSettings();
  if (!settings.coupons_enabled) {
    return {
      valid: false,
      code: "COUPON_DISABLED",
      message: "we are sorry but we have no offers going on at this time",
    };
  }

  const normalizedCode = rawCode ? rawCode.trim().toUpperCase() : "";
  if (!normalizedCode) {
    return {
      valid: false,
      code: "INVALID_CODE",
      message: "Please enter a valid promo code.",
    };
  }

  const coupon = await prisma.coupon.findUnique({
    where: { code: normalizedCode },
  });

  if (!coupon || !coupon.isActive) {
    return {
      valid: false,
      code: "INVALID_CODE",
      message: "The promo code entered is invalid or inactive.",
    };
  }

  const now = new Date();
  if (coupon.startsAt && now < coupon.startsAt) {
    return {
      valid: false,
      code: "COUPON_NOT_STARTED",
      message: "This promotion has not started yet.",
    };
  }

  if (coupon.expiresAt && now > coupon.expiresAt) {
    return {
      valid: false,
      code: "COUPON_EXPIRED",
      message: "This promo code has expired.",
    };
  }

  if (subtotal < coupon.minOrderAmount) {
    return {
      valid: false,
      code: "MINIMUM_ORDER_NOT_MET",
      message: `This code requires a minimum order of ₹${coupon.minOrderAmount}.`,
    };
  }

  if (coupon.usageLimit !== null && coupon.usageLimit !== undefined && coupon.usageCount >= coupon.usageLimit) {
    return {
      valid: false,
      code: "USAGE_LIMIT_REACHED",
      message: "This promo code has reached its maximum total redemptions.",
    };
  }

  // Check per-user limit
  const session = await getCurrentSession();
  const userId = session?.id;
  const userEmail = session?.email || guestEmail;

  if (coupon.perUserLimit !== null && coupon.perUserLimit !== undefined) {
    let userUsageCount = 0;
    if (userId) {
      userUsageCount = await prisma.couponUsage.count({
        where: { couponId: coupon.id, userId },
      });
    } else if (userEmail) {
      userUsageCount = await prisma.couponUsage.count({
        where: { couponId: coupon.id, guestEmail: userEmail },
      });
    }

    if (userUsageCount >= coupon.perUserLimit) {
      return {
        valid: false,
        code: "USER_USAGE_LIMIT_REACHED",
        message: "You have already reached the maximum usage limit for this promo code.",
      };
    }
  }

  // Calculate discount amount server-side
  let calculatedDiscount = 0;
  if (coupon.discountType === "PERCENTAGE") {
    calculatedDiscount = Math.round((subtotal * coupon.value) / 100);
    if (coupon.maxDiscountAmount && calculatedDiscount > coupon.maxDiscountAmount) {
      calculatedDiscount = coupon.maxDiscountAmount;
    }
  } else if (coupon.discountType === "FIXED") {
    calculatedDiscount = coupon.value;
  }

  // Ensure discount does not exceed subtotal and does not make total negative
  const discountAmount = Math.min(calculatedDiscount, subtotal);
  const payableAmount = Math.max(0, subtotal - discountAmount);

  return {
    valid: true,
    code: "VALID",
    message: `${coupon.discountType === "PERCENTAGE" ? `${coupon.value}%` : `₹${coupon.value}`} discount applied successfully.`,
    couponCode: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.value,
    discountAmount,
    payableAmount,
  };
}
