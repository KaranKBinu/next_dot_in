import Link from "next/link";
import { getCurrentSession } from "@/lib/auth";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Sliders,
  Users,
  ShieldAlert,
  Store,
  FolderPlus,
  MessageSquare,
  UserCheck,
  ClipboardList,
  Crown,
} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import AdminMobileNav from "@/components/AdminMobileNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();
  const isAdmin = session && (session.role === "ADMIN" || session.role === "MASTER_ADMIN");

  if (!isAdmin) {
    return <div className="min-h-screen bg-[#FAFAF8]">{children}</div>;
  }

  const isMasterAdmin = session.role === "MASTER_ADMIN";

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAFAF8] text-[#111827]">
      {/* Mobile Top Navigation & Drawer Toggle */}
      <AdminMobileNav session={session} />

      {/* Desktop Admin Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E7E5E4] p-6 flex-col justify-between hidden md:flex shrink-0 min-h-screen">
        <div className="space-y-8">
          <Link href="/admin/dashboard" className="text-sm font-bold tracking-widest text-[#111827] uppercase flex items-center gap-2">
            <span className="w-6 h-6 bg-[#111827] text-white rounded flex items-center justify-center text-xs font-bold">N</span>
            NEXT.IN OS
          </Link>

          <nav className="space-y-6 text-xs font-medium">
            {/* OVERVIEW SECTION */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-widest px-3 block mb-1">
                Overview
              </span>
              <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 text-[#6B7280] rounded-lg hover:bg-[#FAFAF8] hover:text-[#111827] transition-all">
                <LayoutDashboard className="w-4 h-4 text-[#111827]" /> Store Dashboard
              </Link>
              {isMasterAdmin && (
                <Link href="/admin/master" className="flex items-center gap-3 px-3 py-2 text-[#111827] bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg hover:bg-[#F4F4F0] transition-all font-bold">
                  <ShieldAlert className="w-4 h-4 text-[#111827]" /> Control Center
                </Link>
              )}
            </div>

            {/* STORE SECTION */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-widest px-3 block mb-1">
                Storefront
              </span>
              <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 text-[#6B7280] rounded-lg hover:bg-[#FAFAF8] hover:text-[#111827] transition-all">
                <Package className="w-4 h-4 text-[#111827]" /> Products
              </Link>
              <Link href="/admin/categories" className="flex items-center gap-3 px-3 py-2 text-[#6B7280] rounded-lg hover:bg-[#FAFAF8] hover:text-[#111827] transition-all">
                <FolderPlus className="w-4 h-4 text-[#111827]" /> Categories & Attributes
              </Link>
              <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 text-[#6B7280] rounded-lg hover:bg-[#FAFAF8] hover:text-[#111827] transition-all">
                <ShoppingCart className="w-4 h-4 text-[#111827]" /> Orders
              </Link>
              <Link href="/admin/reviews" className="flex items-center gap-3 px-3 py-2 text-[#6B7280] rounded-lg hover:bg-[#FAFAF8] hover:text-[#111827] transition-all">
                <MessageSquare className="w-4 h-4 text-[#111827]" /> Reviews Moderation
              </Link>
              <Link href="/admin/customers" className="flex items-center gap-3 px-3 py-2 text-[#6B7280] rounded-lg hover:bg-[#FAFAF8] hover:text-[#111827] transition-all">
                <Users className="w-4 h-4 text-[#111827]" /> Customers
              </Link>
            </div>

            {/* ADMINISTRATION SECTION */}
            {isMasterAdmin && (
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-widest px-3 block mb-1">
                  Administration
                </span>
                <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 text-[#6B7280] rounded-lg hover:bg-[#FAFAF8] hover:text-[#111827] transition-all">
                  <UserCheck className="w-4 h-4 text-[#111827]" /> Users & Roles
                </Link>
                <Link href="/admin/audit-logs" className="flex items-center gap-3 px-3 py-2 text-[#6B7280] rounded-lg hover:bg-[#FAFAF8] hover:text-[#111827] transition-all">
                  <ClipboardList className="w-4 h-4 text-[#111827]" /> Audit Logs
                </Link>
              </div>
            )}

            {/* SYSTEM SECTION */}
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-[#9CA3AF] uppercase tracking-widest px-3 block mb-1">
                System
              </span>
              <Link href={isMasterAdmin ? "/admin/master/settings" : "/admin/settings"} className="flex items-center gap-3 px-3 py-2 text-[#6B7280] rounded-lg hover:bg-[#FAFAF8] hover:text-[#111827] transition-all">
                <Sliders className="w-4 h-4 text-[#111827]" /> System Settings
              </Link>
              {isMasterAdmin && (
                <>
                  <Link href="/admin/master/security" className="flex items-center gap-3 px-3 py-2 text-[#6B7280] rounded-lg hover:bg-[#FAFAF8] hover:text-[#111827] transition-all">
                    <Crown className="w-4 h-4 text-[#111827]" /> Security Center
                  </Link>
                  <Link href="/admin/master/danger-zone" className="flex items-center gap-3 px-3 py-2 text-rose-700 bg-rose-50/50 border border-rose-200/80 rounded-lg hover:bg-rose-50 transition-all font-semibold">
                    <ShieldAlert className="w-4 h-4 text-rose-700" /> Danger Zone
                  </Link>
                </>
              )}
            </div>
          </nav>

        </div>

        <div className="pt-6 border-t border-[#E7E5E4] space-y-3">
          <Link href="/" className="flex items-center gap-2 text-xs font-medium text-[#6B7280] hover:text-[#111827] transition-colors">
            <Store className="w-4 h-4" /> Return to Storefront
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-[#E7E5E4] px-4 sm:px-8 flex items-center justify-between bg-white hidden md:flex">
          <div className="flex items-center gap-3 text-xs font-semibold text-[#6B7280]">
            <span>NEXT.IN Operating System</span>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <span>Role:</span>
              <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                isMasterAdmin ? "bg-[#111827] text-white flex items-center gap-1.5 shadow-xs" : "bg-[#FAFAF8] border border-[#E7E5E4] text-[#111827]"
              }`}>
                {isMasterAdmin && <Crown className="w-3 h-3 text-amber-400" />}
                {session.role}
              </span>
            </div>
          </div>
          <div className="text-xs text-[#6B7280] font-medium">{session.email}</div>
        </header>


        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
