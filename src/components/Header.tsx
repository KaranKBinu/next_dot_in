"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User as UserIcon, Heart, ShieldCheck } from "lucide-react";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";

export default function Header({
  user,
  settings,
}: {
  user: { name?: string | null; role: string } | null;
  settings: Record<string, boolean>;
}) {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { count: favoriteCount } = useWishlist();

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-[#E7E5E4] text-[#111827]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-10">
          <Link href="/" className="text-xl font-bold tracking-tight text-[#111827] uppercase">
            NEXT<span className="font-light text-[#6B7280]">.IN</span>
          </Link>

          <nav className="hidden md:flex space-x-8 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
            <Link href="/" className="hover:text-[#111827] transition-colors">
              Home
            </Link>
            <Link href="/catalog" className="hover:text-[#111827] transition-colors">
              Collection
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-5">
          {settings.wishlist_enabled && (
            <Link href="/profile/favorites" className="p-2 text-[#6B7280] hover:text-[#111827] transition-colors relative flex items-center justify-center">
              <Heart className="w-5 h-5 text-rose-600 fill-rose-600/10" />
              {favoriteCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-600 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center border border-white">
                  {favoriteCount}
                </span>
              )}
            </Link>
          )}

          <Link href="/cart" className="p-2 text-[#6B7280] hover:text-[#111827] transition-colors relative flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-[#111827]" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#111827] text-white rounded-full text-[9px] font-extrabold flex items-center justify-center border border-white">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] hover:text-[#111827] flex items-center gap-1">
                <UserIcon className="w-3.5 h-3.5" />
                <span>{user.name || "Account"}</span>
              </Link>

              {(user.role === "ADMIN" || user.role === "MASTER_ADMIN") && (
                <Link
                  href="/admin/dashboard"
                  className="px-3 py-1.5 bg-[#111827] text-white rounded-md text-[11px] font-semibold uppercase tracking-wider hover:bg-[#27272A] transition-colors flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3" />
                  Admin
                </Link>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs font-semibold uppercase tracking-wider px-4 py-2 bg-[#111827] text-white rounded-md hover:bg-[#27272A] transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
