import Link from "next/link";
import { ShieldCheck, Lock, CreditCard } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#FAFAF8] border-t border-[#E7E5E4] text-[#6B7280] py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-xs">
        {/* Brand & Newsletter Column */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-[#111827] uppercase tracking-wider">NEXT.IN</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed max-w-sm">
            Architectural garments and minimalist wardrobe essentials designed for timeless, refined living.
          </p>

          <div className="pt-2 space-y-2 max-w-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#111827] block">
              Subscribe to Curated Releases
            </span>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3.5 py-2 bg-white border border-[#E7E5E4] rounded-md text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
              />
              <button className="px-4 py-2 bg-[#111827] hover:bg-[#27272A] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors shrink-0">
                Join
              </button>
            </div>
            <p className="text-[10px] text-[#9CA3AF]">Privacy-first. Unsubscribe anytime.</p>
          </div>
        </div>

        {/* Shop Column */}
        <div>
          <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-4">Shop</h4>
          <ul className="space-y-2.5">
            <li><Link href="/catalog" className="hover:text-[#111827] transition-colors">All Products</Link></li>
            <li><Link href="/catalog?category=clothing" className="hover:text-[#111827] transition-colors">Clothing</Link></li>
            <li><Link href="/catalog?category=footwear" className="hover:text-[#111827] transition-colors">Footwear</Link></li>
            <li><Link href="/catalog?category=accessories" className="hover:text-[#111827] transition-colors">Accessories</Link></li>
          </ul>
        </div>

        {/* Customer Service Column */}
        <div>
          <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-4">Customer Care</h4>
          <ul className="space-y-2.5">
            <li><Link href="/profile" className="hover:text-[#111827] transition-colors">My Account</Link></li>
            <li><Link href="/profile" className="hover:text-[#111827] transition-colors">Order History</Link></li>
            <li><Link href="/profile/favorites" className="hover:text-[#111827] transition-colors">Wishlist</Link></li>
            <li><Link href="/faq" className="hover:text-[#111827] transition-colors">Help Center / FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-[#111827] transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        {/* Company & Legal Column */}
        <div>
          <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-4">Company & Policies</h4>
          <ul className="space-y-2.5">
            <li><Link href="/about" className="hover:text-[#111827] transition-colors">About Us</Link></li>
            <li><Link href="/privacy" className="hover:text-[#111827] transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-[#111827] transition-colors">Terms & Conditions</Link></li>
            <li><Link href="/shipping" className="hover:text-[#111827] transition-colors">Shipping Policy</Link></li>
            <li><Link href="/returns" className="hover:text-[#111827] transition-colors">Return & Refund Policy</Link></li>
            <li><Link href="/cookies" className="hover:text-[#111827] transition-colors">Cookie Policy</Link></li>
            <li><Link href="/accessibility" className="hover:text-[#111827] transition-colors">Accessibility Statement</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-12 pt-8 border-t border-[#E7E5E4] flex flex-col sm:flex-row items-center justify-between text-xs text-[#9CA3AF] gap-4">
        <span>&copy; {new Date().getFullYear()} NEXT.IN. All rights reserved.</span>
      </div>
    </footer>
  );
}
