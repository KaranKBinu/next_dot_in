"use client";

import { useState } from "react";
import { Star, CheckCircle, XCircle, Trash2, ExternalLink, Search, Filter, ShieldCheck } from "lucide-react";
import { updateReviewStatusAction, deleteReviewAction } from "@/app/actions/reviews";
import Link from "next/link";

export default function AdminReviewsClient({ initialReviews }: { initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [ratingFilter, setRatingFilter] = useState<string>("ALL");

  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.product.name.toLowerCase().includes(search.toLowerCase()) ||
      r.user.email.toLowerCase().includes(search.toLowerCase()) ||
      (r.comment && r.comment.toLowerCase().includes(search.toLowerCase())) ||
      (r.title && r.title.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || r.status === statusFilter;
    const matchesRating = ratingFilter === "ALL" || r.rating === parseInt(ratingFilter, 10);

    return matchesSearch && matchesStatus && matchesRating;
  });

  const handleStatusUpdate = async (id: string, status: "APPROVED" | "REJECTED") => {
    const res = await updateReviewStatusAction(id, status);
    if (res.success) {
      setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    } else {
      alert(res.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;
    const res = await deleteReviewAction(id);
    if (res.success) {
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Controls */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by product, reviewer email, or comment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs font-medium focus:outline-none focus:border-[#111827]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-[#6B7280]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#111827]"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider text-[#111827]"
          >
            <option value="ALL">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Review List Table */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAFAF8] border-b border-[#E7E5E4] text-[10px] uppercase font-extrabold text-[#6B7280] tracking-wider">
                <th className="p-4">Product</th>
                <th className="p-4">Reviewer</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Comment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E5E4] text-xs font-medium">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#9CA3AF] uppercase tracking-wider">
                    No reviews match the selected criteria.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((r) => (
                  <tr key={r.id} className="hover:bg-[#FAFAF8] transition-colors">
                    <td className="p-4 max-w-[200px]">
                      <Link
                        href={`/product/${r.product.slug}`}
                        target="_blank"
                        className="font-bold text-[#111827] hover:underline flex items-center gap-1 truncate"
                      >
                        <span className="truncate">{r.product.name}</span>
                        <ExternalLink className="w-3 h-3 text-[#9CA3AF] shrink-0" />
                      </Link>
                      <span className="text-[10px] text-[#6B7280] block font-mono">
                        Order: {r.order?.orderNumber || r.orderId}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-[#111827]">{r.user.name || "Anonymous"}</div>
                      <div className="text-[10px] text-[#6B7280]">{r.user.email}</div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${star <= r.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </td>

                    <td className="p-4 max-w-[300px]">
                      {r.title && <div className="font-bold text-[#111827] truncate">{r.title}</div>}
                      <p className="text-[#6B7280] line-clamp-2 leading-relaxed">{r.comment}</p>
                      <span className="text-[10px] text-[#9CA3AF] block mt-1">
                        {new Date(r.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          r.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : r.status === "REJECTED"
                            ? "bg-rose-50 text-rose-800 border border-rose-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {r.status !== "APPROVED" && (
                          <button
                            onClick={() => handleStatusUpdate(r.id, "APPROVED")}
                            className="p-1.5 rounded hover:bg-emerald-50 text-emerald-700 transition-colors cursor-pointer"
                            title="Approve Review"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}

                        {r.status !== "REJECTED" && (
                          <button
                            onClick={() => handleStatusUpdate(r.id, "REJECTED")}
                            className="p-1.5 rounded hover:bg-amber-50 text-amber-700 transition-colors cursor-pointer"
                            title="Reject Review"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1.5 rounded hover:bg-rose-50 text-rose-700 transition-colors cursor-pointer"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
