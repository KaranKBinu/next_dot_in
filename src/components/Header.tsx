"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User as UserIcon, Heart, ShieldCheck, Search } from "lucide-react";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import CommandSearchModal from "./CommandSearchModal";

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
  const [scrolled, setScrolled] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <header
      className={`sticky top-0 z-40 bg-[#FAFAF8]/90 backdrop-blur-md border-b transition-all duration-300 ${
        scrolled ? "h-16 border-[#E7E5E4] shadow-sm bg-white/95" : "h-20 border-transparent bg-[#FAFAF8]/90"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-full flex items-center justify-between">
        <div className="flex items-center space-x-10">
          <Link href="/" className="text-xl font-bold tracking-tight text-[#111827] uppercase hover:opacity-80 transition-opacity">
            NEXT<span className="font-light text-[#6B7280]">.IN</span>
          </Link>

          <nav className="hidden md:flex space-x-8 text-xs font-semibold uppercase tracking-wider text-[#6B7280]">
            <Link
              href="/"
              className={`transition-all duration-200 hover:text-[#111827] relative py-1 ${
                pathname === "/" ? "text-[#111827] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#111827]" : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/catalog"
              className={`transition-all duration-200 hover:text-[#111827] relative py-1 ${
                pathname === "/catalog" ? "text-[#111827] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#111827]" : ""
              }`}
            >
              Collection
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-5">
          {/* Cmd+K Search Trigger Input */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#FAFAF8] hover:bg-[#F4F4F0] border border-[#E7E5E4] rounded-md text-xs text-[#6B7280] transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-[#111827]" />
            <span>Search products...</span>
            <kbd className="ml-2 px-1.5 py-0.5 bg-white border border-[#E7E5E4] rounded text-[9px] font-mono font-bold text-[#6B7280]">
              ⌘K
            </kbd>
          </button>

          <button
            onClick={() => setSearchModalOpen(true)}
            className="sm:hidden p-2 text-[#6B7280] hover:text-[#111827]"
            title="Search"
          >
            <Search className="w-5 h-5 text-[#111827]" />
          </button>
          {settings.wishlist_enabled && (
            <Link
              href="/profile/favorites"
              className="p-2 text-[#6B7280] hover:text-[#111827] transition-all hover:scale-105 active:scale-95 relative flex items-center justify-center group"
            >
              <Heart className="w-5 h-5 text-[#111827] fill-[#111827]/10 group-hover:scale-110 transition-transform" />
              {favoriteCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#111827] text-white rounded-full text-[9px] font-extrabold flex items-center justify-center border border-white animate-heart-pop">
                  {favoriteCount}
                </span>
              )}
            </Link>
          )}

          <Link
            href="/cart"
            className="p-2 text-[#6B7280] hover:text-[#111827] transition-all hover:scale-105 active:scale-95 relative flex items-center justify-center group"
          >
            <ShoppingBag className="w-5 h-5 text-[#111827] group-hover:scale-110 transition-transform" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#111827] text-white rounded-full text-[9px] font-extrabold flex items-center justify-center border border-white animate-fade-in">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="text-xs font-semibold uppercase tracking-wider text-[#6B7280] hover:text-[#111827] flex items-center gap-1 transition-colors">
                <UserIcon className="w-3.5 h-3.5" />
                <span>{user.name || "Account"}</span>
              </Link>

              {(user.role === "ADMIN" || user.role === "MASTER_ADMIN") && (
                <Link
                  href="/admin/dashboard"
                  className="px-3 py-1.5 bg-[#111827] text-white rounded text-[11px] font-semibold uppercase tracking-wider hover:bg-[#27272A] active:scale-95 transition-all flex items-center gap-1 shadow-sm"
                >
                  <ShieldCheck className="w-3 h-3" />
                  Admin
                </Link>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs font-semibold uppercase tracking-wider px-4 py-2 bg-[#111827] text-white rounded hover:bg-[#27272A] active:scale-95 transition-all shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      <CommandSearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </header>
  );
}
