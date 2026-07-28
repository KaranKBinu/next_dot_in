import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Order Fulfillment</h1>
        <p className="text-xs text-[#6B7280] mt-0.5">Track customer purchases and payment statuses</p>
      </div>

      <div className="bg-white border border-[#E7E5E4] rounded-md overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-[#6B7280] text-xs">
            No customer orders placed yet.
          </div>
        ) : (
          <div className="divide-y divide-[#E7E5E4]">
            {orders.map((o) => (
              <div key={o.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-[#111827]">{o.orderNumber}</span>
                    <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-full uppercase">
                      {o.status}
                    </span>
                  </div>
                  <p className="text-[#6B7280] mt-1">
                    Customer: {o.guestName || "Registered User"} ({o.guestEmail})
                  </p>
                  <p className="text-[#9CA3AF] mt-0.5 font-mono text-[11px]">
                    Razorpay Payment ID: {o.razorpayPaymentId || o.razorpayOrderId}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-lg font-bold text-[#111827]">₹{o.totalAmount}</span>
                  <p className="text-[#6B7280] mt-0.5 text-[11px]">{o.items.length} item(s)</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
