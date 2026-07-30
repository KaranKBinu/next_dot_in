import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Customers</h1>
        <p className="text-xs text-[#6B7280] mt-0.5">Registered store customer directory</p>
      </div>

      <div className="bg-white border border-[#E7E5E4] rounded-md overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-12 text-center text-[#6B7280] text-xs">
            No customer accounts created yet.
          </div>
        ) : (
          <table className="w-full text-left text-xs text-[#111827]">
            <thead className="bg-[#FAFAF8] text-[10px] uppercase font-bold text-[#6B7280] border-b border-[#E7E5E4] tracking-wider">
              <tr>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Orders Placed</th>
                <th className="px-6 py-3">Joined Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E5E4]">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAFAF8] transition-colors">
                  <td className="px-6 py-3.5 font-bold text-[#111827]">{c.name || "N/A"}</td>
                  <td className="px-6 py-3.5 text-[#6B7280]">{c.email}</td>
                  <td className="px-6 py-3.5 font-bold">{c._count.orders}</td>
                  <td className="px-6 py-3.5 text-[#6B7280]">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-3.5 text-right">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="px-3 py-1 bg-[#FAFAF8] hover:bg-[#F4F4F0] text-[#111827] border border-[#E7E5E4] rounded text-[10px] font-semibold uppercase tracking-wider"
                    >
                      View CRM Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
