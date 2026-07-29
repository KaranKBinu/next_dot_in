import { prisma } from "@/lib/prisma";
import AdminOrdersDashboardClient from "@/components/AdminOrdersDashboardClient";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Order Operations Dashboard</h1>
        <p className="text-xs text-[#6B7280] mt-0.5">Shopify & Stripe style order management, status workflow, and customer fulfillment</p>
      </div>

      <AdminOrdersDashboardClient initialOrders={orders} />
    </div>
  );
}
