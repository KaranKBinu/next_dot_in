import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Package, ShoppingBag, Users, IndianRupee, ArrowUpRight } from "lucide-react";

export default async function AdminDashboardPage() {
  const [productCount, orderCount, customerCount, orders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
  ]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Store Operations</h1>
        <p className="text-xs text-[#6B7280] mt-0.5">Overview & key performance metrics</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E7E5E4] rounded-md p-5">
          <div className="flex items-center justify-between text-[#6B7280] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Products</span>
            <Package className="w-4 h-4 text-[#111827]" />
          </div>
          <p className="text-2xl font-bold text-[#111827]">{productCount}</p>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-md p-5">
          <div className="flex items-center justify-between text-[#6B7280] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#111827]" />
          </div>
          <p className="text-2xl font-bold text-[#111827]">{orderCount}</p>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-md p-5">
          <div className="flex items-center justify-between text-[#6B7280] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Customers</span>
            <Users className="w-4 h-4 text-[#111827]" />
          </div>
          <p className="text-2xl font-bold text-[#111827]">{customerCount}</p>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-md p-5">
          <div className="flex items-center justify-between text-[#6B7280] mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Recent Revenue</span>
            <IndianRupee className="w-4 h-4 text-[#111827]" />
          </div>
          <p className="text-2xl font-bold text-[#111827]">₹{totalRevenue}</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white border border-[#E7E5E4] rounded-md p-6">
        <div className="flex items-center justify-between mb-6 border-b border-[#E7E5E4] pb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs font-semibold text-[#111827] hover:underline flex items-center gap-1">
            View All <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-[#9CA3AF] text-xs text-center py-6">No transactions recorded yet.</p>
        ) : (
          <div className="divide-y divide-[#E7E5E4]">
            {orders.map((o) => (
              <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-mono font-bold text-[#111827]">{o.orderNumber}</span>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">{new Date(o.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-semibold rounded-full uppercase">
                    {o.status}
                  </span>
                  <span className="font-bold text-[#111827]">₹{o.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
