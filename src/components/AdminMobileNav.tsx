"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Sliders, Users, ShieldAlert, Store, FolderPlus, Menu, X, MessageSquare, UserCheck, ClipboardList, Tag } from "lucide-react";

import LogoutButton from "./LogoutButton";

export default function AdminMobileNav({ session }: { session: any }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border-b border-[#E7E5E4] px-4 py-3 md:hidden flex items-center justify-between sticky top-0 z-30">
      <Link href="/admin/dashboard" className="text-xs font-bold tracking-widest text-[#111827] uppercase flex items-center gap-2">
        <span className="w-6 h-6 bg-[#111827] text-white rounded flex items-center justify-center text-[10px] font-bold">N</span>
        NEXT.IN OS
      </Link>

      <button
        onClick={() => setOpen(true)}
        className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#111827] hover:bg-[#F4F4F0] rounded-md transition-colors"
        aria-label="Open Admin Mobile Drawer"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)}>
          <div
            className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white border-r border-[#E7E5E4] p-6 shadow-2xl flex flex-col justify-between animate-slide-in-left overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#111827]">NEXT.IN OS Portal</span>
                <button onClick={() => setOpen(false)} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#6B7280]">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1 text-xs font-semibold">
                <Link href="/admin/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 text-[#111827] rounded-lg hover:bg-[#F4F4F0]">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <Link href="/admin/products" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 text-[#111827] rounded-lg hover:bg-[#F4F4F0]">
                  <Package className="w-4 h-4" /> Products
                </Link>
                <Link href="/admin/categories" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 text-[#111827] rounded-lg hover:bg-[#F4F4F0]">
                  <FolderPlus className="w-4 h-4" /> Categories & Attributes
                </Link>
                <Link href="/admin/orders" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 text-[#111827] rounded-lg hover:bg-[#F4F4F0]">
                  <ShoppingCart className="w-4 h-4" /> Orders
                </Link>
                <Link href="/admin/reviews" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 text-[#111827] rounded-lg hover:bg-[#F4F4F0]">
                  <MessageSquare className="w-4 h-4" /> Reviews Moderation
                </Link>
                <Link href="/admin/coupons" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 text-[#111827] rounded-lg hover:bg-[#F4F4F0]">
                  <Tag className="w-4 h-4" /> Coupons & Promotions
                </Link>
                <Link href="/admin/customers" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 text-[#111827] rounded-lg hover:bg-[#F4F4F0]">
                  <Users className="w-4 h-4" /> Customers
                </Link>
                <Link href="/admin/settings" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 text-[#111827] rounded-lg hover:bg-[#F4F4F0]">
                  <Sliders className="w-4 h-4" /> System Settings
                </Link>

                {session.role === "MASTER_ADMIN" && (
                  <div className="pt-2 border-t border-[#E7E5E4] space-y-1">
                    <span className="text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-widest px-3 block">
                      Master Controls
                    </span>
                    <Link href="/admin/users" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
                      <UserCheck className="w-4 h-4" /> Users & Roles
                    </Link>
                    <Link href="/admin/audit-logs" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 text-[#111827] rounded-lg hover:bg-[#F4F4F0]">
                      <ClipboardList className="w-4 h-4" /> Audit Logs
                    </Link>
                    <Link href="/admin/master" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-3 text-rose-700 rounded-lg hover:bg-rose-50">
                      <ShieldAlert className="w-4 h-4" /> Master Overview
                    </Link>
                  </div>
                )}

              </nav>
            </div>

            <div className="pt-6 border-t border-[#E7E5E4] space-y-3">
              <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2 text-xs font-medium text-[#6B7280]">
                <Store className="w-4 h-4" /> Return to Storefront
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
