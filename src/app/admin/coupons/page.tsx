import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authorization";
import AdminCouponsClient from "@/components/AdminCouponsClient";

export default async function AdminCouponsPage() {
  await requireAdmin();

  const [coupons, usages] = await Promise.all([
    prisma.coupon.findMany({
      include: {
        usages: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: { user: { select: { email: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.couponUsage.findMany({
      select: { discountAmount: true },
    }),
  ]);

  const now = new Date();
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const metrics = {
    totalCoupons: coupons.length,
    activeCoupons: coupons.filter((c) => c.isActive && (!c.expiresAt || new Date(c.expiresAt) > now)).length,
    expiringSoon: coupons.filter((c) => c.expiresAt && new Date(c.expiresAt) > now && new Date(c.expiresAt) <= threeDaysFromNow).length,
    totalRedemptions: usages.length,
    totalDiscountGiven: usages.reduce((acc, u) => acc + u.discountAmount, 0),
  };

  return <AdminCouponsClient coupons={coupons} metrics={metrics} />;
}
