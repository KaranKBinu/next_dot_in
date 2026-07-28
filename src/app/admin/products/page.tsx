import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Package } from "lucide-react";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Products</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">Manage store products and pricing</p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-[#111827] hover:bg-[#27272A] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" /> Add Product
        </Link>
      </div>

      <div className="bg-white border border-[#E7E5E4] rounded-md overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center text-[#6B7280]">
            <Package className="w-8 h-8 mx-auto text-[#9CA3AF] mb-2" />
            <p className="text-xs">No products in catalog yet.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs text-[#111827]">
            <thead className="bg-[#FAFAF8] text-[10px] uppercase font-bold text-[#6B7280] border-b border-[#E7E5E4] tracking-wider">
              <tr>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-4">Brand</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E5E4]">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAFAF8] transition-colors">
                  <td className="px-6 py-3.5 font-bold text-[#111827] flex items-center gap-3">
                    {p.images?.[0] && (
                      <img src={p.images[0]} alt={p.name} className="w-8 h-8 object-cover rounded bg-[#F4F4F0] border border-[#E7E5E4]" />
                    )}
                    <span>{p.name}</span>
                  </td>
                  <td className="px-6 py-3.5 text-[#6B7280]">{p.brand || "NEXT.IN"}</td>
                  <td className="px-6 py-3.5">{p.category.name}</td>
                  <td className="px-6 py-3.5 font-bold">₹{p.price}</td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${p.stock > 0 ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${p.isPublished ? "bg-slate-100 text-slate-800" : "bg-amber-50 text-amber-800"}`}>
                      {p.isPublished ? "Published" : "Draft"}
                    </span>
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
