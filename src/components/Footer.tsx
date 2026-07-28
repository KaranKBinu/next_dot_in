import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#FAFAF8] border-t border-[#E7E5E4] text-[#6B7280] py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <h3 className="text-lg font-bold text-[#111827] uppercase tracking-wider mb-4">NEXT.IN</h3>
          <p className="text-xs text-[#6B7280] leading-relaxed">
            Architectural garments and minimalist wardrobe essentials designed for timeless, refined living.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-[#111827] uppercase tracking-wider mb-4">Collection</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/catalog" className="hover:text-[#111827] transition-colors">All Products</Link></li>
            <li><Link href="/catalog?category=clothing" className="hover:text-[#111827] transition-colors">Clothing</Link></li>
            <li><Link href="/catalog?category=footwear" className="hover:text-[#111827] transition-colors">Footwear</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-[#111827] uppercase tracking-wider mb-4">Client Service</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/cart" className="hover:text-[#111827] transition-colors">Shopping Bag</Link></li>
            <li><Link href="/profile" className="hover:text-[#111827] transition-colors">Orders & Account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-[#111827] uppercase tracking-wider mb-4">Store Administration</h4>
          <ul className="space-y-2.5 text-xs">
            <li><Link href="/admin/login" className="hover:text-[#111827] transition-colors">Admin Portal</Link></li>
            <li><Link href="/admin/master" className="hover:text-[#111827] transition-colors">Master System</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 mt-12 pt-8 border-t border-[#E7E5E4] flex flex-col sm:flex-row items-center justify-between text-xs text-[#9CA3AF]">
        <span>&copy; {new Date().getFullYear()} NEXT.IN. All rights reserved.</span>
        <span className="mt-2 sm:mt-0 uppercase tracking-widest text-[10px]">Architectural Essentials</span>
      </div>
    </footer>
  );
}
