import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminReviewsClient from "@/components/AdminReviewsClient";

export default async function AdminReviewsPage() {
  const session = await getCurrentSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "MASTER_ADMIN")) {
    redirect("/admin/login");
  }

  const reviews = await prisma.review.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      product: { select: { id: true, name: true, slug: true, images: true } },
      order: { select: { id: true, orderNumber: true, status: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-[#111827]">Review Moderation</h1>
          <p className="text-xs text-[#6B7280]">Approve, reject, or manage verified customer reviews.</p>
        </div>
      </div>

      <AdminReviewsClient initialReviews={reviews} />
    </div>
  );
}
