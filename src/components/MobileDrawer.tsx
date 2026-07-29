"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ArrowRight, HelpCircle, Mail, User as UserIcon, ShieldCheck } from "lucide-react";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: { name?: string | null; role: string } | null;
}

export const MobileDrawer = React.memo(function MobileDrawer({
  isOpen,
  onClose,
  user,
}: MobileDrawerProps) {
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Body scroll locking with previous overflow restoration
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      // Focus move into drawer
      setTimeout(() => closeButtonRef.current?.focus(), 50);

      return () => {
        document.body.style.overflow = originalOverflow || "auto";
      };
    }
  }, [isOpen]);

  // Close drawer on pathname change
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
  }, [pathname]);

  // ESC key listener & focus trapping
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md md:hidden animate-fade-in transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
    >
      <div
        ref={drawerRef}
        className="fixed inset-y-0 left-0 z-[201] w-4/5 max-w-xs bg-white/95 backdrop-blur-xl border-r border-[#E7E5E4] shadow-2xl flex flex-col justify-between p-6 transform-gpu will-change-transform animate-slide-in-left overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          {/* Drawer Header */}
          <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-4">
            <Link
              href="/"
              onClick={onClose}
              className="text-lg font-black tracking-tight text-[#111827] uppercase flex items-center gap-1.5"
            >
              <span className="font-bold text-[#111827]">NEXT</span>
              <span className="font-light text-[#6B7280]">.IN</span>
            </Link>
            <button
              ref={closeButtonRef}
              onClick={onClose}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#6B7280] hover:text-[#111827] hover:bg-[#F4F4F0] active:scale-95 transition-all rounded-full cursor-pointer"
              aria-label="Close Mobile Navigation"
            >
              <X className="w-5 h-5 transition-transform duration-200 hover:rotate-90" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1.5 text-xs font-semibold uppercase tracking-wider text-[#111827]">
            <Link
              href="/"
              onClick={onClose}
              className={`py-3 px-3.5 rounded-xl flex items-center justify-between transition-all min-h-[46px] ${pathname === "/"
                ? "bg-[#111827] text-white shadow-sm font-bold"
                : "text-[#4B5563] hover:text-[#111827] hover:bg-[#F4F4F0]"
                }`}
            >
              <span>Home</span>
              <ArrowRight className={`w-4 h-4 transition-transform ${pathname === "/" ? "text-white translate-x-0.5" : "text-[#9CA3AF]"}`} />
            </Link>

            <Link
              href="/catalog"
              onClick={onClose}
              className={`py-3 px-3.5 rounded-xl flex items-center justify-between transition-all min-h-[46px] ${pathname === "/catalog"
                ? "bg-[#111827] text-white shadow-sm font-bold"
                : "text-[#4B5563] hover:text-[#111827] hover:bg-[#F4F4F0]"
                }`}
            >
              <span>Collection</span>
              <ArrowRight className={`w-4 h-4 transition-transform ${pathname === "/catalog" ? "text-white translate-x-0.5" : "text-[#9CA3AF]"}`} />
            </Link>

            <Link
              href="/about"
              onClick={onClose}
              className={`py-3 px-3.5 rounded-xl flex items-center justify-between transition-all min-h-[46px] ${pathname === "/about"
                ? "bg-[#111827] text-white shadow-sm font-bold"
                : "text-[#4B5563] hover:text-[#111827] hover:bg-[#F4F4F0]"
                }`}
            >
              <span>About Us</span>
              <ArrowRight className={`w-4 h-4 transition-transform ${pathname === "/about" ? "text-white translate-x-0.5" : "text-[#9CA3AF]"}`} />
            </Link>

            <Link
              href="/faq"
              onClick={onClose}
              className={`py-3 px-3.5 rounded-xl flex items-center justify-between transition-all min-h-[46px] ${pathname === "/faq"
                ? "bg-[#111827] text-white shadow-sm font-bold"
                : "text-[#4B5563] hover:text-[#111827] hover:bg-[#F4F4F0]"
                }`}
            >
              <span>Help Center / FAQ</span>
              <HelpCircle className={`w-4 h-4 ${pathname === "/faq" ? "text-white" : "text-[#9CA3AF]"}`} />
            </Link>

            <Link
              href="/contact"
              onClick={onClose}
              className={`py-3 px-3.5 rounded-xl flex items-center justify-between transition-all min-h-[46px] ${pathname === "/contact"
                ? "bg-[#111827] text-white shadow-sm font-bold"
                : "text-[#4B5563] hover:text-[#111827] hover:bg-[#F4F4F0]"
                }`}
            >
              <span>Contact Support</span>
              <Mail className={`w-4 h-4 ${pathname === "/contact" ? "text-white" : "text-[#9CA3AF]"}`} />
            </Link>
          </nav>
        </div>

        {/* Drawer Bottom Account Section */}
        <div className="pt-6 border-t border-[#E7E5E4] space-y-2.5">
          {user ? (
            <>
              <Link
                href="/profile"
                onClick={onClose}
                className="w-full py-3 px-4 bg-[#F4F4F0] hover:bg-[#E7E5E4] border border-[#E7E5E4] rounded-xl text-xs font-bold text-[#111827] uppercase tracking-wider flex items-center justify-center gap-2 min-h-[46px] active:scale-[0.98] transition-all shadow-xs"
              >
                <UserIcon className="w-4 h-4 text-[#111827]" />
                <span className="truncate">My Account ({user.name || "Client"})</span>
              </Link>

              {(user.role === "ADMIN" || user.role === "MASTER_ADMIN") && (
                <Link
                  href="/admin/dashboard"
                  onClick={onClose}
                  className="w-full py-3 px-4 bg-[#111827] hover:bg-[#27272A] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[46px] active:scale-[0.98] transition-all shadow-md"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Admin Operations</span>
                </Link>
              )}
            </>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="w-full py-3 px-4 bg-[#111827] hover:bg-[#27272A] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 min-h-[46px] active:scale-[0.98] transition-all shadow-md"
            >
              <span>Sign In to Account</span>
            </Link>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
});
