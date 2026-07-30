"use server";

import { prisma } from "@/lib/prisma";
import { requireAuth, requireAdmin, logAuditAction } from "@/lib/authorization";
import { getSystemSettings } from "@/lib/settings";
import { revalidatePath } from "next/cache";

export async function submitReviewAction(formData: FormData) {
  try {
    const session = await requireAuth();
    const settings = await getSystemSettings();
    if (!settings.reviews_enabled) {
      return { success: false, error: "Reviews are currently disabled." };
    }

    const productId = formData.get("productId") as string;
    const rating = parseInt(formData.get("rating") as string, 10);
    const title = (formData.get("title") as string)?.trim() || null;
    const comment = (formData.get("comment") as string)?.trim();

    if (!productId || isNaN(rating) || rating < 1 || rating > 5 || !comment) {
      return { success: false, error: "Rating (1-5) and comment are required." };
    }

    // Verify customer has a DELIVERED order for this product
    const eligibleOrder = await prisma.order.findFirst({
      where: {
        userId: session.id,
        status: "DELIVERED",
        items: {
          some: { productId },
        },
      },
      select: { id: true },
      orderBy: { createdAt: "desc" },
    });

    if (!eligibleOrder) {
      return { success: false, error: "Verified Purchase required: You can only review products you have purchased and paid for." };
    }

    // Check for existing review for this user + product + order combination
    const existing = await prisma.review.findUnique({
      where: {
        userId_productId_orderId: {
          userId: session.id,
          productId,
          orderId: eligibleOrder.id,
        },
      },
    });

    if (existing) {
      return { success: false, error: "You have already submitted a review for this purchase." };
    }

    const review = await prisma.review.create({
      data: {
        userId: session.id,
        productId,
        orderId: eligibleOrder.id,
        rating,
        title,
        comment,
        status: "PENDING",
      },
    });

    revalidatePath(`/product/[slug]`, "page");
    revalidatePath("/profile");

    return {
      success: true,
      message: "Your review has been submitted and is awaiting approval.",
      review,
    };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to submit review." };
  }
}

export async function updateReviewAction(formData: FormData) {
  try {
    const session = await requireAuth();
    const reviewId = formData.get("reviewId") as string;
    const rating = parseInt(formData.get("rating") as string, 10);
    const title = (formData.get("title") as string)?.trim() || null;
    const comment = (formData.get("comment") as string)?.trim();

    if (!reviewId || isNaN(rating) || rating < 1 || rating > 5 || !comment) {
      return { success: false, error: "Rating and comment are required." };
    }

    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review || review.userId !== session.id) {
      return { success: false, error: "Review not found or unauthorized." };
    }

    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: {
        rating,
        title,
        comment,
        status: "PENDING", // Re-queue for approval upon editing
      },
    });

    revalidatePath(`/product/[slug]`, "page");
    revalidatePath("/profile");

    return { success: true, message: "Review updated. Your edit is awaiting approval.", review: updated };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update review." };
  }
}

export async function deleteReviewAction(reviewId: string) {
  try {
    const session = await requireAuth();
    const review = await prisma.review.findUnique({ where: { id: reviewId } });

    if (!review) return { success: false, error: "Review not found." };

    // Allow owner or Admin/Master Admin to delete
    const isOwner = review.userId === session.id;
    const isAdmin = session.role === "ADMIN" || session.role === "MASTER_ADMIN";

    if (!isOwner && !isAdmin) {
      return { success: false, error: "Unauthorized to delete this review." };
    }

    await prisma.review.delete({ where: { id: reviewId } });

    if (isAdmin) {
      await logAuditAction(session.id, "REVIEW_DELETED", "Review", reviewId, { productId: review.productId });
    }

    revalidatePath(`/product/[slug]`, "page");
    revalidatePath("/profile");
    revalidatePath("/admin/reviews");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete review." };
  }
}

export async function updateReviewStatusAction(reviewId: string, status: "APPROVED" | "REJECTED") {
  try {
    const session = await requireAdmin();

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { status },
    });

    await logAuditAction(session.id, `REVIEW_${status}`, "Review", reviewId, {
      productId: review.productId,
      userId: review.userId,
    });

    revalidatePath("/admin/reviews");
    revalidatePath(`/product/[slug]`, "page");

    return { success: true, review };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update review status." };
  }
}
