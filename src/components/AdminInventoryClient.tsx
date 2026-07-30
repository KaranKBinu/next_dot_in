"use client";

import { useState } from "react";
import { updateStockAction } from "@/app/actions/product";
import { useRouter } from "next/navigation";
import { Package, AlertTriangle, RefreshCw, TrendingDown, TrendingUp, CheckCircle2 } from "lucide-react";

type InventoryProduct = {
  id: string;
  name: string;
  slug: string;
  stock: number;
  lowStockThreshold: number;
  isPublished: boolean;
  images: string[];
  category: { name: string };
};

export default function AdminInventoryClient({ products }: { products: InventoryProduct[] }) {
  const router = useRouter();
  const [adjustments, setAdjustments] = useState<Record<string, string>>({});
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.name.toLowerCase().includes(search.toLowerCase())
  );

  const outOfStock = products.filter((p) => p.stock <= 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
  const healthy = products.filter((p) => p.stock > p.lowStockThreshold).length;

  const handleAdjust = async (productId: string, delta: number) => {
    setUpdatingId(productId);
    const res = await updateStockAction(productId, delta);
    if (res.success) {
      setNotice(`Stock adjusted by ${delta > 0 ? "+" : ""}${delta}`);
      router.refresh();
    } else {
      setNotice(`Error: ${res.error}`);
    }
    setUpdatingId(null);
  };

  const handleManualAdjust = async (e: React.FormEvent, productId: string) => {
    e.preventDefault();
    const raw = adjustments[productId];
    if (!raw) return;
    const delta = parseInt(raw, 10);
    if (isNaN(delta)) return;
    await handleAdjust(productId, delta);
    setAdjustments((prev) => ({ ...prev, [productId]: "" }));
  };

  const getStockBadge = (p: InventoryProduct) => {
    if (p.stock <= 0) {
      return <span className="px-2.5 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold rounded-full uppercase">Out of Stock</span>;
    }
    if (p.stock <= p.lowStockThreshold) {
      return <span className="px-2.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold rounded-full uppercase">Low Stock</span>;
    }
    return <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold rounded-full uppercase">In Stock</span>;
  };

  return (
    <div className="space-y-5">
      {notice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-md flex justify-between items-center">
          <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {notice}</span>
          <button onClick={() => setNotice(null)} className="font-bold">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-[#E7E5E4] rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Out of Stock</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl font-bold text-rose-700">{outOfStock}</p>
        </div>
        <div className="bg-white border border-[#E7E5E4] rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Low Stock</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-amber-700">{lowStock}</p>
        </div>
        <div className="bg-white border border-[#E7E5E4] rounded-xl p-4 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Healthy Stock</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-700">{healthy}</p>
        </div>
      </div>

      <div className="bg-white border border-[#E7E5E4] rounded-xl p-4 flex items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Search products or categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#111827] w-72 min-h-[44px]"
        />
        <button
          onClick={() => router.refresh()}
          className="p-2.5 bg-[#FAFAF8] hover:bg-[#F4F4F0] border border-[#E7E5E4] rounded-lg text-[#111827] min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-white border border-[#E7E5E4] rounded-xl overflow-hidden shadow-sm">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-[#6B7280] text-xs">
            <Package className="w-8 h-8 mx-auto mb-3 text-[#9CA3AF]" />
            <p className="font-bold text-[#111827]">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#111827] min-w-[640px]">
              <thead className="bg-[#FAFAF8] text-[10px] uppercase font-bold text-[#6B7280] border-b border-[#E7E5E4] tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Product</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Stock</th>
                  <th className="px-4 py-3.5">Threshold</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5E4]">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt={p.name} className="w-8 h-8 object-cover rounded bg-[#F4F4F0] border border-[#E7E5E4] shrink-0" />
                        ) : (
                          <div className="w-8 h-8 bg-[#E7E5E4] rounded flex items-center justify-center text-[9px] font-bold shrink-0">IMG</div>
                        )}
                        <div>
                          <p className="font-bold text-[#111827] line-clamp-1">{p.name}</p>
                          {!p.isPublished && <span className="text-[9px] text-rose-600 font-bold uppercase">Unpublished</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[#6B7280]">{p.category.name}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-base font-bold ${p.stock <= 0 ? "text-rose-700" : p.stock <= p.lowStockThreshold ? "text-amber-700" : "text-emerald-700"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-[#6B7280]">{p.lowStockThreshold}</td>
                    <td className="px-4 py-3.5">{getStockBadge(p)}</td>
                    <td className="px-4 py-3.5">
                      <form onSubmit={(e) => handleManualAdjust(e, p.id)} className="flex items-center gap-1.5">
                        <button type="button" onClick={() => handleAdjust(p.id, -1)} disabled={updatingId === p.id}
                          className="w-8 h-8 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg font-bold text-sm flex items-center justify-center disabled:opacity-50">−</button>
                        <input type="number" placeholder="±qty"
                          value={adjustments[p.id] || ""}
                          onChange={(e) => setAdjustments((prev) => ({ ...prev, [p.id]: e.target.value }))}
                          className="w-16 px-2 py-1.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs text-center min-h-[32px]" />
                        <button type="button" onClick={() => handleAdjust(p.id, 1)} disabled={updatingId === p.id}
                          className="w-8 h-8 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-bold text-sm flex items-center justify-center disabled:opacity-50">+</button>
                        <button type="submit" disabled={updatingId === p.id || !adjustments[p.id]}
                          className="px-3 py-1.5 bg-[#111827] hover:bg-[#27272A] text-white rounded-lg text-[10px] font-bold uppercase disabled:opacity-40 min-h-[32px]">Set</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
