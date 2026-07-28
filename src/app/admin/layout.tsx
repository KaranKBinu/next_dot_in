import Link from "next/link";
import { getCurrentSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LayoutDashboard, Package, ShoppingCart, Sliders, Users, ShieldAlert, Store, Layers, FolderPlus } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();

  if (!session || (session.role !== "ADMIN" && session.role !== "MASTER_ADMIN")) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-[#FAFAF8] text-[#111827]">
      {/* Admin Sidebar (Linear / Stripe Operating System Style) */}
      <aside className="w-64 bg-white border-r border-[#E7E5E4] p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-8">
          <Link href="/admin/dashboard" className="text-sm font-bold tracking-widest text-[#111827] uppercase flex items-center gap-2">
            <span className="w-6 h-6 bg-[#111827] text-white rounded flex items-center justify-center text-xs font-bold">N</span>
            NEXT.IN OS
          </Link>

          <nav className="space-y-1 text-xs font-medium">
            <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 text-[#6B7280] rounded-md hover:bg-[#F4F4F0] hover:text-[#111827] transition-colors">
              <LayoutDashboard className="w-4 h-4 text-[#111827]" /> Dashboard
            </Link>

            <Link href="/admin/products" className="flex items-center gap-3 px-3 py-2 text-[#6B7280] rounded-md hover:bg-[#F4F4F0] hover:text-[#111827] transition-colors">
              <Package className="w-4 h-4 text-[#111827]" /> Products
            </Link>

            <Link href="/admin/categories" className="flex items-center gap-3 px-3 py-2 text-[#6B7280] rounded-md hover:bg-[#F4F4F0] hover:text-[#111827] transition-colors">
              <FolderPlus className="w-4 h-4 text-[#111827]" /> Categories & Attributes
            </Link>

            <Link href="/admin/inventory" className="flex items-center gap-3 px-3 py-2 text-[#6B7280] rounded-md hover:bg-[#F4F4F0] hover:text-[#111827] transition-colors">
              <Layers className="w-4 h-4 text-[#111827]" /> Simplified Inventory
            </Link>

            <Link href="/admin/orders" className="flex items-center gap-3 px-3 py-2 text-[#6B7280] rounded-md hover:bg-[#F4F4F0] hover:text-[#111827] transition-colors">
              <ShoppingCart className="w-4 h-4 text-[#111827]" /> Orders
            </Link>

            <Link href="/admin/customers" className="flex items-center gap-3 px-3 py-2 text-[#6B7280] rounded-md hover:bg-[#F4F4F0] hover:text-[#111827] transition-colors">
              <Users className="w-4 h-4 text-[#111827]" /> Customers
            </Link>

            <Link href="/admin/settings" className="flex items-center gap-3 px-3 py-2 text-[#6B7280] rounded-md hover:bg-[#F4F4F0] hover:text-[#111827] transition-colors">
              <Sliders className="w-4 h-4 text-[#111827]" /> System Settings
            </Link>

            {session.role === "MASTER_ADMIN" && (
              <Link href="/admin/master" className="flex items-center gap-3 px-3 py-2 text-rose-700 bg-rose-50 border border-rose-200 rounded-md hover:bg-rose-100 transition-colors">
                <ShieldAlert className="w-4 h-4" /> Master Admin
              </Link>
            )}
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
        <header className="h-16 border-b border-[#E7E5E4] px-8 flex items-center justify-between bg-white">
          <div className="text-xs font-semibold text-[#6B7280]">
            Operating System • Role: <span className="text-[#111827] uppercase font-bold">{session.role}</span>
          </div>
          <div className="text-xs text-[#6B7280]">{session.email}</div>
        </header>

        <main className="p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
