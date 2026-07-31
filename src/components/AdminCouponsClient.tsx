"use client";

import { useState } from "react";
import {
  Tag,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Power,
  TrendingUp,
  Percent,
  DollarSign,
  AlertCircle,
  Eye,
} from "lucide-react";
import { createCouponAction, toggleCouponStatusAction, deleteCouponAction } from "@/app/actions/coupons";

export default function AdminCouponsClient({
  coupons,
  metrics,
}: {
  coupons: any[];
  metrics: {
    totalCoupons: number;
    activeCoupons: number;
    expiringSoon: number;
    totalRedemptions: number;
    totalDiscountGiven: number;
  };
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "ACTIVE" | "DISABLED" | "EXPIRED">("ALL");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ success?: string; error?: string } | null>(null);

  // Form State
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");

  const filteredCoupons = coupons.filter((c) => {
    const matchesQuery =
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const now = new Date();
    const isExpired = c.expiresAt && new Date(c.expiresAt) < now;

    if (!matchesQuery) return false;
    if (filterStatus === "ACTIVE") return c.isActive && !isExpired;
    if (filterStatus === "DISABLED") return !c.isActive;
    if (filterStatus === "EXPIRED") return isExpired;
    return true;
  });

  const handleCreateCoupon = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    const res = await createCouponAction(formData);
    setIsSubmitting(false);

    if (res.success) {
      setShowCreateModal(false);
      setFeedback({ success: `Coupon ${res.coupon?.code} created successfully.` });
    } else {
      setFeedback({ error: res.error });
    }
  };

  const handleToggleStatus = async (couponId: string, currentStatus: boolean) => {
    const res = await toggleCouponStatusAction(couponId, !currentStatus);
    if (res.success) {
      setFeedback({ success: "Coupon status updated." });
    } else {
      setFeedback({ error: res.error });
    }
  };

  const handleDeleteCoupon = async (couponId: string, code: string) => {
    if (!confirm(`Are you sure you want to permanently delete coupon "${code}"?`)) return;

    const res = await deleteCouponAction(couponId);
    if (res.success) {
      setFeedback({ success: `Coupon "${code}" deleted.` });
    } else {
      setFeedback({ error: res.error });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E7E5E4] pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-[#111827]">
            Coupons & Promotions Management
          </h1>
          <p className="text-xs text-[#6B7280] font-medium">
            Create promotional codes, manage discount caps, minimum order thresholds, and monitor redemptions.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-[#111827] hover:bg-[#27272A] text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" /> Create Promo Coupon
        </button>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
            feedback.success ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{feedback.success || feedback.error}</span>
        </div>
      )}

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E7E5E4] p-5 rounded-xl shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9CA3AF]">Active Coupons</span>
          <p className="text-2xl font-black text-[#111827] mt-1">{metrics.activeCoupons} / {metrics.totalCoupons}</p>
        </div>

        <div className="bg-white border border-[#E7E5E4] p-5 rounded-xl shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9CA3AF]">Expiring Soon</span>
          <p className="text-2xl font-black text-amber-700 mt-1">{metrics.expiringSoon}</p>
        </div>

        <div className="bg-white border border-[#E7E5E4] p-5 rounded-xl shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9CA3AF]">Total Redemptions</span>
          <p className="text-2xl font-black text-[#111827] mt-1">{metrics.totalRedemptions}</p>
        </div>

        <div className="bg-white border border-[#E7E5E4] p-5 rounded-xl shadow-xs">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#9CA3AF]">Total Savings Granted</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">₹{metrics.totalDiscountGiven}</p>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by code or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs font-medium focus:outline-none focus:border-[#111827]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {(["ALL", "ACTIVE", "DISABLED", "EXPIRED"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                filterStatus === st
                  ? "bg-[#111827] text-white"
                  : "bg-[#FAFAF8] border border-[#E7E5E4] text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Coupon Table */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAFAF8] border-b border-[#E7E5E4] text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280]">
              <tr>
                <th className="p-4">Code / Description</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min Spend</th>
                <th className="p-4">Usage</th>
                <th className="p-4">Expiry</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E5E4] text-[#111827]">
              {filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-[#9CA3AF] uppercase tracking-wider">
                    No promotional coupons match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((c) => {
                  const now = new Date();
                  const isExpired = c.expiresAt && new Date(c.expiresAt) < now;

                  return (
                    <tr key={c.id} className="hover:bg-[#FAFAF8] transition-colors">
                      <td className="p-4">
                        <span className="font-mono font-bold text-xs text-[#111827] block">{c.code}</span>
                        {c.description && <span className="text-[11px] text-[#6B7280]">{c.description}</span>}
                      </td>
                      <td className="p-4 font-bold">
                        {c.discountType === "PERCENTAGE" ? (
                          <span>
                            {c.value}% OFF
                            {c.maxDiscountAmount && (
                              <span className="block text-[10px] text-[#6B7280] font-normal">Cap: ₹{c.maxDiscountAmount}</span>
                            )}
                          </span>
                        ) : (
                          <span>₹{c.value} OFF</span>
                        )}
                      </td>
                      <td className="p-4 font-semibold text-[#6B7280]">
                        {c.minOrderAmount > 0 ? `₹${c.minOrderAmount}` : "None"}
                      </td>
                      <td className="p-4 font-medium">
                        <span>{c.usageCount}</span>
                        {c.usageLimit ? <span className="text-[#9CA3AF]"> / {c.usageLimit}</span> : <span className="text-[#9CA3AF]"> / ∞</span>}
                      </td>
                      <td className="p-4 text-[11px] text-[#6B7280]">
                        {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "Never"}
                      </td>
                      <td className="p-4">
                        {isExpired ? (
                          <span className="px-2 py-0.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-full text-[10px] font-bold uppercase">
                            Expired
                          </span>
                        ) : c.isActive ? (
                          <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[10px] font-bold uppercase">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-[10px] font-bold uppercase">
                            Disabled
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedCoupon(c)}
                          className="p-1.5 hover:bg-gray-100 rounded text-[#6B7280] hover:text-[#111827]"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(c.id, c.isActive)}
                          className="p-1.5 hover:bg-gray-100 rounded text-[#6B7280] hover:text-[#111827]"
                          title={c.isActive ? "Disable Coupon" : "Enable Coupon"}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCoupon(c.id, c.code)}
                          className="p-1.5 hover:bg-rose-50 rounded text-rose-600"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E5E4] rounded-xl max-w-xl w-full p-6 shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#E7E5E4] pb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Create Promotional Coupon</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-xs text-[#6B7280] hover:text-[#111827] font-bold">✕</button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280] block mb-1">Coupon Code *</label>
                <input
                  type="text"
                  name="code"
                  required
                  placeholder="e.g. WELCOME10"
                  className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs font-mono font-bold uppercase focus:outline-none focus:border-[#111827]"
                />
              </div>

              <div>
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280] block mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="e.g. 10% discount on architectural outerwear"
                  className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs font-medium focus:outline-none focus:border-[#111827]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280] block mb-1">Discount Type *</label>
                  <select
                    name="discountType"
                    value={discountType}
                    onChange={(e: any) => setDiscountType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs font-bold focus:outline-none focus:border-[#111827]"
                  >
                    <option value="PERCENTAGE">PERCENTAGE (%)</option>
                    <option value="FIXED">FIXED AMOUNT (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280] block mb-1">
                    {discountType === "PERCENTAGE" ? "Discount Percentage (1-100) *" : "Discount Value (₹) *"}
                  </label>
                  <input
                    type="number"
                    name="value"
                    required
                    min={1}
                    max={discountType === "PERCENTAGE" ? 100 : undefined}
                    placeholder={discountType === "PERCENTAGE" ? "10" : "500"}
                    className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs font-bold focus:outline-none focus:border-[#111827]"
                  />
                </div>
              </div>

              {discountType === "PERCENTAGE" && (
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280] block mb-1">Maximum Discount Cap (₹)</label>
                  <input
                    type="number"
                    name="maxDiscountAmount"
                    min={1}
                    placeholder="e.g. 1000 (Optional)"
                    className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs font-medium focus:outline-none focus:border-[#111827]"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280] block mb-1">Minimum Order Amount (₹)</label>
                  <input
                    type="number"
                    name="minOrderAmount"
                    min={0}
                    defaultValue={0}
                    className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs font-medium focus:outline-none focus:border-[#111827]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280] block mb-1">Status</label>
                  <select name="isActive" defaultValue="true" className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs font-bold">
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280] block mb-1">Total Usage Limit</label>
                  <input
                    type="number"
                    name="usageLimit"
                    min={1}
                    placeholder="Unlimited if blank"
                    className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs font-medium focus:outline-none focus:border-[#111827]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280] block mb-1">Per-User Limit</label>
                  <input
                    type="number"
                    name="perUserLimit"
                    min={1}
                    placeholder="Unlimited if blank"
                    className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs font-medium focus:outline-none focus:border-[#111827]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280] block mb-1">Start Date</label>
                  <input
                    type="datetime-local"
                    name="startsAt"
                    className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs font-medium focus:outline-none focus:border-[#111827]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280] block mb-1">Expiration Date</label>
                  <input
                    type="datetime-local"
                    name="expiresAt"
                    className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs font-medium focus:outline-none focus:border-[#111827]"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#E7E5E4]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-[#6B7280] uppercase hover:underline cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#111827] hover:bg-[#27272A] text-white rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Creating..." : "Save Promo Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Detail Modal */}
      {selectedCoupon && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E5E4] rounded-xl max-w-xl w-full p-6 shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-[#E7E5E4] pb-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827] font-mono">{selectedCoupon.code}</h2>
                <p className="text-xs text-[#6B7280]">{selectedCoupon.description || "No description provided."}</p>
              </div>
              <button onClick={() => setSelectedCoupon(null)} className="text-xs text-[#6B7280] hover:text-[#111827] font-bold">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg">
                <span className="text-[10px] text-[#6B7280] uppercase font-bold block">Discount Value</span>
                <span className="font-bold text-[#111827]">
                  {selectedCoupon.discountType === "PERCENTAGE" ? `${selectedCoupon.value}% OFF` : `₹${selectedCoupon.value} OFF`}
                </span>
              </div>

              <div className="p-3 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg">
                <span className="text-[10px] text-[#6B7280] uppercase font-bold block">Total Usage</span>
                <span className="font-bold text-[#111827]">{selectedCoupon.usageCount} times</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Recent Redemptions</h3>
              {selectedCoupon.usages?.length === 0 ? (
                <p className="text-xs text-[#9CA3AF] text-center py-4">No redemption history recorded yet.</p>
              ) : (
                <div className="space-y-2 max-h-40 overflow-y-auto text-xs">
                  {selectedCoupon.usages?.map((u: any) => (
                    <div key={u.id} className="p-2.5 border border-[#E7E5E4] rounded-lg flex justify-between items-center">
                      <div>
                        <span className="font-bold text-[#111827]">{u.user?.email || u.guestEmail || "Customer"}</span>
                        <span className="text-[10px] text-[#6B7280] block">{new Date(u.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className="font-bold text-emerald-700">-₹{u.discountAmount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
