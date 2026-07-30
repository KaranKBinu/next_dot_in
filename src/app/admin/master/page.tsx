import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSystemSettings } from "@/lib/settings";
import { redirect } from "next/navigation";
import AdminMasterDashboardClient from "@/components/AdminMasterDashboardClient";

export default async function MasterAdminControlCenterPage() {
  const session = await getCurrentSession();
  if (!session || session.role !== "MASTER_ADMIN") {
    redirect("/admin/dashboard");
  }

  const [
    totalProducts,
    publishedProducts,
    lowStockProducts,
    totalOrders,
    pendingOrders,
    totalCustomers,
    activeAdmins,
    totalReviews,
    pendingReviews,
    revenueAgg,
    settings,
    recentAudits,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isPublished: true } }),
    prisma.product.count({ where: { stock: { lte: 5 } } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.user.count({ where: { role: { in: ["ADMIN", "MASTER_ADMIN"] } } }),
    prisma.review.count(),
    prisma.review.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({ _sum: { totalAmount: true } }),
    getSystemSettings(),
    prisma.auditLog.findMany({
      take: 10,
      orderBy: { timestamp: "desc" },
      include: { actor: { select: { name: true, email: true } } },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: { id: true, orderNumber: true, totalAmount: true, status: true, createdAt: true },
    }),
  ]);

  const metrics = {
    totalRevenue: revenueAgg._sum.totalAmount ?? 0,
    totalOrders,
    pendingOrders,
    totalCustomers,
    totalProducts,
    publishedProducts,
    lowStockProducts,
    activeAdmins,
    totalReviews,
    pendingReviews,
    disabledFeaturesCount: Object.values(settings).filter((v) => !v).length,
  };

  const systemHealth = {
    database: "HEALTHY",
    paymentProvider: "HEALTHY",
    applicationStatus: settings.maintenance_mode ? "MAINTENANCE" : "HEALTHY",
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <AdminMasterDashboardClient
        metrics={metrics}
        systemHealth={systemHealth}
        settings={settings}
        recentAudits={recentAudits}
        recentOrders={recentOrders}
      />
    </div>
  );
}
