import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Package, AlertTriangle } from "lucide-react";

export default async function AdminInventoryPage() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { stock: "asc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Simplified Inventory</h1>
          <p className="text-sm text-slate-400 mt-1">Track stock levels and low-stock alerts</p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Package className="w-10 h-10 mx-auto text-slate-500 mb-3" />
            <p className="text-sm">No inventory items recorded yet.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Current Stock</th>
                <th className="px-6 py-4">Low Stock Limit</th>
                <th className="px-6 py-4">Stock Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {products.map((p) => {
                const isLow = p.stock <= p.lowStockThreshold;
                const isOut = p.stock <= 0;

                return (
                  <tr key={p.id} className="hover:bg-slate-800/50">
                    <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                      {p.images?.[0] && (
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-slate-950" />
                      )}
                      <span>{p.name}</span>
                    </td>
                    <td className="px-6 py-4">{p.category.name}</td>
                    <td className="px-6 py-4 font-bold text-white">{p.stock} units</td>
                    <td className="px-6 py-4 text-slate-400">{p.lowStockThreshold} units</td>
                    <td className="px-6 py-4">
                      {isOut ? (
                        <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold rounded-full flex items-center gap-1.5 w-max">
                          <AlertTriangle className="w-3.5 h-3.5" /> Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold rounded-full flex items-center gap-1.5 w-max">
                          <AlertTriangle className="w-3.5 h-3.5" /> Low Stock Warning
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full w-max">
                          In Stock
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
