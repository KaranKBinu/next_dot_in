import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { getSystemSettings } from "@/lib/settings";
import ProductDetailClient from "@/components/ProductDetailClient";
import ProductReviewSection from "@/components/ProductReviewSection";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await getCurrentSession();
  const settings = await getSystemSettings();

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) notFound();

  // Fetch approved reviews + current user's pending review (if any)
  const reviews = settings.reviews_enabled
    ? await prisma.review.findMany({
        where: {
          productId: product.id,
          OR: [
            { status: "APPROVED" },
            ...(session ? [{ userId: session.id, status: "PENDING" as const }] : []),
          ],
        },
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      })
    : [];

  // Check if authenticated user is eligible to review (delivered order contains this product & no existing review)
  let isEligibleToReview = false;
  if (session && settings.reviews_enabled) {
    const deliveredOrder = await prisma.order.findFirst({
      where: {
        userId: session.id,
        status: "DELIVERED",
        items: { some: { productId: product.id } },
      },
      select: { id: true },
    });

    if (deliveredOrder) {
      const existingReview = await prisma.review.findUnique({
        where: {
          userId_productId_orderId: {
            userId: session.id,
            productId: product.id,
            orderId: deliveredOrder.id,
          },
        },
      });
      isEligibleToReview = !existingReview;
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 space-y-12">
      <ProductDetailClient product={product} />

      {settings.reviews_enabled && (
        <ProductReviewSection
          productId={product.id}
          reviews={reviews}
          userSession={session}
          isEligibleToReview={isEligibleToReview}
          reviewsEnabled={settings.reviews_enabled}
        />
      )}
    </main>
  );
}

