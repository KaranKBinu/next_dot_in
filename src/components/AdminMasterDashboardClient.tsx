"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  Search,
  Sliders,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  ClipboardList,
} from "lucide-react";
import { masterGlobalSearchAction } from "@/app/actions/master";

export default function AdminMasterDashboardClient({
  metrics,
  systemHealth,
  settings,
  recentAudits,
  recentOrders,
}: {
  metrics: any;
  systemHealth: any;
  settings: Record<string, boolean>;
  recentAudits: any[];
  recentOrders: any[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleGlobalSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    const res = await masterGlobalSearchAction(searchQuery);
    setIsSearching(false);

    if (res.success) {
      setSearchResults(res.results);
    }
  };

  return (
    <div className="space-y-8">
      {/* Control Center Header */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#FAFAF8] border border-[#E7E5E4] text-[#111827] rounded-xl">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black uppercase tracking-wider text-[#111827]">
                Master Control Center
              </h1>
              <span className="bg-[#111827] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-xs">
                MASTER ADMIN
              </span>
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5 font-medium">
              Platform status, operational overview, global overrides, and security control.
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleGlobalSearch} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Global search (Order #, Email, Product)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-xl text-xs font-medium focus:outline-none focus:border-[#111827]"
          />
        </form>
      </div>

      {/* Global Search Results Drawer/Modal */}
      {searchResults && (
        <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
              Global Search Results for "{searchQuery}"
            </h3>
            <button
              onClick={() => setSearchResults(null)}
              className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Clear Search
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Products */}
            <div>
              <h4 className="font-bold text-[#6B7280] uppercase text-[10px] mb-2">
                Products ({searchResults.products.length})
              </h4>
              <div className="space-y-1.5">
                {searchResults.products.map((p: any) => (
                  <Link
                    key={p.id}
                    href={`/admin/products/${p.id}`}
                    className="block p-2 bg-[#FAFAF8] rounded border border-[#E7E5E4] hover:border-[#111827] font-semibold text-[#111827]"
                  >
                    {p.name} — ₹{p.price}
                  </Link>
                ))}
              </div>
            </div>

            {/* Users */}
            <div>
              <h4 className="font-bold text-[#6B7280] uppercase text-[10px] mb-2">
                Users ({searchResults.users.length})
              </h4>
              <div className="space-y-1.5">
                {searchResults.users.map((u: any) => (
                  <Link
                    key={u.id}
                    href="/admin/users"
                    className="block p-2 bg-[#FAFAF8] rounded border border-[#E7E5E4] hover:border-[#111827] font-semibold text-[#111827]"
                  >
                    {u.name || u.email} ({u.role})
                  </Link>
                ))}
              </div>
            </div>

            {/* Orders */}
            <div>
              <h4 className="font-bold text-[#6B7280] uppercase text-[10px] mb-2">
                Orders ({searchResults.orders.length})
              </h4>
              <div className="space-y-1.5">
                {searchResults.orders.map((o: any) => (
                  <Link
                    key={o.id}
                    href={`/admin/orders?id=${o.id}`}
                    className="block p-2 bg-[#FAFAF8] rounded border border-[#E7E5E4] hover:border-[#111827] font-semibold text-[#111827]"
                  >
                    {o.orderNumber} — ₹{o.totalAmount} ({o.status})
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actionable Notifications & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health Indicators */}
        <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#111827] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#111827]" /> System Health & Status
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-[#FAFAF8] rounded-lg border border-[#E7E5E4]">
              <span className="font-semibold text-[#6B7280]">Database (Neon Serverless)</span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Operational
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FAFAF8] rounded-lg border border-[#E7E5E4]">
              <span className="font-semibold text-[#6B7280]">Payment Integration (Razorpay)</span>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Operational
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FAFAF8] rounded-lg border border-[#E7E5E4]">
              <span className="font-semibold text-[#6B7280]">Application Mode</span>
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                  systemHealth.applicationStatus === "MAINTENANCE"
                    ? "text-amber-800 bg-amber-50 border-amber-200"
                    : "text-emerald-800 bg-emerald-50 border-emerald-200"
                }`}
              >
                {systemHealth.applicationStatus === "MAINTENANCE" ? "Maintenance Mode" : "Online"}
              </span>
            </div>
          </div>
        </div>

        {/* Actionable Notification Center */}
        <div className="lg:col-span-2 bg-white border border-[#E7E5E4] rounded-xl p-6 shadow-xs space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#111827] flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" /> Actionable Operations Center
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <Link
              href="/admin/orders"
              className="p-4 bg-[#FAFAF8] border border-[#E7E5E4] hover:border-[#111827] rounded-xl transition-all block space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#6B7280] uppercase">Pending Orders</span>
                <ShoppingBag className="w-4 h-4 text-[#111827]" />
              </div>
              <p className="text-2xl font-black text-[#111827]">{metrics.pendingOrders}</p>
              <span className="text-[10px] text-[#6B7280] font-semibold">Requires fulfillment</span>
            </Link>

            <Link
              href="/admin/reviews"
              className="p-4 bg-[#FAFAF8] border border-[#E7E5E4] hover:border-[#111827] rounded-xl transition-all block space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#6B7280] uppercase">Pending Reviews</span>
                <MessageSquare className="w-4 h-4 text-[#111827]" />
              </div>
              <p className="text-2xl font-black text-[#111827]">{metrics.pendingReviews}</p>
              <span className="text-[10px] text-[#6B7280] font-semibold">Requires moderation</span>
            </Link>

            <Link
              href="/admin/inventory"
              className="p-4 bg-[#FAFAF8] border border-[#E7E5E4] hover:border-[#111827] rounded-xl transition-all block space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#6B7280] uppercase">Low Stock Products</span>
                <Package className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-2xl font-black text-rose-700">{metrics.lowStockProducts}</p>
              <span className="text-[10px] text-[#6B7280] font-semibold">Stock ≤ 5 units</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics High Level Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-[#E7E5E4] rounded-xl p-4">
          <span className="text-[10px] font-extrabold uppercase text-[#6B7280] block">Gross Revenue</span>
          <p className="text-xl font-black text-[#111827] mt-1">₹{metrics.totalRevenue}</p>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-xl p-4">
          <span className="text-[10px] font-extrabold uppercase text-[#6B7280] block">Total Orders</span>
          <p className="text-xl font-black text-[#111827] mt-1">{metrics.totalOrders}</p>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-xl p-4">
          <span className="text-[10px] font-extrabold uppercase text-[#6B7280] block">Customers</span>
          <p className="text-xl font-black text-[#111827] mt-1">{metrics.totalCustomers}</p>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-xl p-4">
          <span className="text-[10px] font-extrabold uppercase text-[#6B7280] block">Active Admins</span>
          <p className="text-xl font-black text-[#111827] mt-1">{metrics.activeAdmins}</p>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-xl p-4">
          <span className="text-[10px] font-extrabold uppercase text-[#6B7280] block">Published Products</span>
          <p className="text-xl font-black text-[#111827] mt-1">
            {metrics.publishedProducts}/{metrics.totalProducts}
          </p>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-xl p-4">
          <span className="text-[10px] font-extrabold uppercase text-[#6B7280] block">Disabled Features</span>
          <p className="text-xl font-black text-[#111827] mt-1">{metrics.disabledFeaturesCount}</p>
        </div>
      </div>

      {/* Control Quick Jump Navigation & Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E7E5E4] rounded-xl p-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
            Master Quick Actions
          </h2>

          <div className="space-y-2 text-xs font-semibold">
            <Link
              href="/admin/master/settings"
              className="w-full p-3 bg-[#FAFAF8] hover:bg-[#F4F4F0] border border-[#E7E5E4] rounded-lg flex items-center justify-between text-[#111827]"
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#111827]" />
                <span>Structured System Settings</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#9CA3AF]" />
            </Link>

            <Link
              href="/admin/master/security"
              className="w-full p-3 bg-[#FAFAF8] hover:bg-[#F4F4F0] border border-[#E7E5E4] rounded-lg flex items-center justify-between text-[#111827]"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#111827]" />
                <span>Security Center & Sessions</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#9CA3AF]" />
            </Link>

            <Link
              href="/admin/master/danger-zone"
              className="w-full p-3 bg-[#FAFAF8] hover:bg-[#F4F4F0] border border-[#E7E5E4] rounded-lg flex items-center justify-between text-[#111827] transition-all"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-700" />
                <span>Danger Zone & Overrides</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#9CA3AF]" />
            </Link>
          </div>
        </div>

        {/* Live Audit Trail Stream */}
        <div className="lg:col-span-2 bg-white border border-[#E7E5E4] rounded-xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#111827] flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-[#111827]" /> Live Platform Audit Trail
            </h2>
            <Link href="/admin/audit-logs" className="text-xs font-bold text-[#111827] hover:underline">
              View All Logs
            </Link>
          </div>

          <div className="divide-y divide-[#E7E5E4] text-xs">
            {recentAudits.map((a) => (
              <div key={a.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#111827] font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                    {a.action}
                  </span>
                  <span className="text-[#6B7280] text-[11px] ml-2">
                    by {a.actor?.name || a.actor?.email}
                  </span>
                </div>
                <span className="text-[10px] text-[#9CA3AF] font-mono">
                  {new Date(a.timestamp).toLocaleTimeString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
