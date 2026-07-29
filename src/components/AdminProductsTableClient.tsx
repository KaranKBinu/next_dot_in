"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteProductAction, duplicateProductAction, togglePublishAction } from "@/app/actions/admin-crud";
import { useRouter } from "next/navigation";
import { Eye, Edit, Trash2, Copy, ArrowUp, ArrowDown, Search } from "lucide-react";

export default function AdminProductsTableClient({
  products,
  categories,
  initialParams,
}: {
  products: any[];
  categories: any[];
  initialParams: any;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(initialParams.search || "");
  const [categoryFilter, setCategoryFilter] = useState(initialParams.category || "");
  const [statusFilter, setStatusFilter] = useState(initialParams.status || "");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Client filtering
  const filteredProducts = products.filter((p) => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase());
    const matchesCat = !categoryFilter || p.categoryId === categoryFilter;
    const matchesStatus = !statusFilter || (statusFilter === "published" ? p.isPublished : !p.isPublished);
    return matchesSearch && matchesCat && matchesStatus;
  });

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    const res = await deleteProductAction(id);
    if (res.success) {
      setNotice(res.message || "Action completed.");
      setDeleteConfirmId(null);
      router.refresh();
    }
    setLoadingId(null);
  };

  const handleDuplicate = async (id: string) => {
    setLoadingId(id);
    const res = await duplicateProductAction(id);
    if (res.success) {
      setNotice("Product duplicated as draft!");
      router.refresh();
    }
    setLoadingId(null);
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setLoadingId(id);
    const res = await togglePublishAction(id, !currentStatus);
    if (res.success) {
      setNotice(`Product ${!currentStatus ? "published" : "unpublished"}.`);
      router.refresh();
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-4">
      {notice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-md flex justify-between items-center">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-emerald-900 font-bold text-xs min-h-[44px] min-w-[44px] flex items-center justify-center">Dismiss</button>
        </div>
      )}

      {/* Search & Filters Controls */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search product name or brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs text-[#111827] focus:outline-none focus:border-[#111827] w-full sm:w-64 min-h-[44px]"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto justify-between">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs text-[#111827] min-h-[44px]"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs text-[#111827] min-h-[44px]"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Table with Horizontal Scroll Container */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl overflow-hidden shadow-sm">
        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-[#6B7280] text-xs">
            No products found matching your search and filter options.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#111827] min-w-[640px]">
              <thead className="bg-[#FAFAF8] text-[10px] uppercase font-bold text-[#6B7280] border-b border-[#E7E5E4] tracking-wider">
                <tr>
                  <th className="px-4 sm:px-6 py-3.5">Product</th>
                  <th className="px-4 sm:px-6 py-3.5">Category</th>
                  <th className="px-4 sm:px-6 py-3.5">Price</th>
                  <th className="px-4 sm:px-6 py-3.5">Stock</th>
                  <th className="px-4 sm:px-6 py-3.5">Status</th>
                  <th className="px-4 sm:px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5E4]">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="px-4 sm:px-6 py-3.5 font-bold text-[#111827] flex items-center gap-3">
                      {p.images?.[0] && (
                        <img src={p.images[0]} alt={p.name} className="w-8 h-8 object-cover rounded bg-[#F4F4F0] border border-[#E7E5E4] shrink-0" />
                      )}
                      <div>
                        <span>{p.name}</span>
                        <span className="block text-[10px] font-normal text-[#6B7280]">{p.brand || "NEXT.IN"}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5">{p.category?.name}</td>
                    <td className="px-4 sm:px-6 py-3.5 font-bold">₹{p.price}</td>
                    <td className="px-4 sm:px-6 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${p.stock > 0 ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${p.isPublished ? "bg-[#111827] text-white" : "bg-amber-50 text-amber-800"}`}>
                        {p.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3.5 text-right space-x-1.5">
                      <Link
                        href={`/product/${p.slug}`}
                        target="_blank"
                        className="p-2 bg-[#FAFAF8] hover:bg-[#F4F4F0] text-[#111827] border border-[#E7E5E4] rounded-lg inline-flex items-center justify-center min-h-[36px] min-w-[36px]"
                        title="View on storefront"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href={`/admin/products/${p.id}`}
                        className="p-2 bg-[#FAFAF8] hover:bg-[#F4F4F0] text-[#111827] border border-[#E7E5E4] rounded-lg inline-flex items-center justify-center min-h-[36px] min-w-[36px]"
                        title="Edit Product"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleDuplicate(p.id)}
                        disabled={loadingId === p.id}
                        className="p-2 bg-[#FAFAF8] hover:bg-[#F4F4F0] text-[#111827] border border-[#E7E5E4] rounded-lg inline-flex items-center justify-center min-h-[36px] min-w-[36px]"
                        title="Duplicate Product"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleTogglePublish(p.id, p.isPublished)}
                        disabled={loadingId === p.id}
                        className="p-2 bg-[#FAFAF8] hover:bg-[#F4F4F0] text-[#111827] border border-[#E7E5E4] rounded-lg inline-flex items-center justify-center min-h-[36px] min-w-[36px]"
                        title={p.isPublished ? "Unpublish Product" : "Publish Product"}
                      >
                        {p.isPublished ? <ArrowDown className="w-3.5 h-3.5 text-amber-700" /> : <ArrowUp className="w-3.5 h-3.5 text-emerald-700" />}
                      </button>

                      {deleteConfirmId === p.id ? (
                        <div className="inline-flex items-center gap-1 bg-rose-50 border border-rose-200 p-1 rounded-lg">
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="px-2.5 py-1 bg-rose-700 text-white rounded text-[10px] font-bold min-h-[36px]"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2 text-[10px] text-[#6B7280] min-h-[36px]"
                          >
                            X
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg inline-flex items-center justify-center min-h-[36px] min-w-[36px]"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
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
