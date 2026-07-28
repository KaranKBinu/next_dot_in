"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <main className="max-w-4xl mx-auto px-6 py-16 text-center flex-1 bg-[#FAFAF8]">
        <div className="bg-white border border-[#E7E5E4] rounded-md p-12 space-y-4">
          <ShoppingBag className="w-10 h-10 mx-auto text-[#9CA3AF]" />
          <h2 className="text-xl font-bold uppercase tracking-wider text-[#111827]">Your Shopping Bag is Empty</h2>
          <p className="text-[#6B7280] text-xs">Explore our curated collection and add garments to your bag.</p>
          <Link
            href="/catalog"
            className="px-6 py-3 bg-[#111827] text-white rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-[#27272A] transition-colors inline-flex items-center gap-2"
          >
            Explore Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 sm:px-8 py-12 flex-1 w-full bg-[#FAFAF8]">
      <div className="flex items-center justify-between mb-8 border-b border-[#E7E5E4] pb-4">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-[#111827]">Shopping Bag</h1>
        <button
          onClick={clearCart}
          className="text-xs text-rose-700 hover:underline font-semibold uppercase tracking-wider"
        >
          Clear Bag
        </button>
      </div>

      <div className="bg-white border border-[#E7E5E4] rounded-md p-6 space-y-6">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center justify-between border-b border-[#E7E5E4] pb-6 last:border-0 last:pb-0">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#F4F4F0] border border-[#E7E5E4] rounded flex items-center justify-center font-bold text-[#6B7280]">
                {item.image ? <img src={item.image} alt={item.name} className="max-h-12 object-contain" /> : item.name?.[0] || "P"}
              </div>
              <div>
                <h3 className="font-bold text-[#111827] text-sm">{item.name}</h3>
                <p className="text-xs text-[#6B7280] font-semibold mt-0.5">₹{item.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center border border-[#E7E5E4] rounded bg-[#FAFAF8]">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="px-3 py-1 text-[#6B7280] hover:text-[#111827]"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-[#111827]">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="px-3 py-1 text-[#6B7280] hover:text-[#111827]"
                >
                  +
                </button>
              </div>

              <span className="font-bold text-[#111827] text-sm min-w-[70px] text-right">₹{item.price * item.quantity}</span>

              <button
                onClick={() => removeItem(item.productId)}
                className="text-[#9CA3AF] hover:text-rose-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white border border-[#E7E5E4] rounded-md p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#6B7280] font-bold">Total Order Amount</span>
          <p className="text-2xl font-bold text-[#111827]">₹{totalAmount}</p>
        </div>

        <Link
          href="/checkout"
          className="w-full sm:w-auto px-8 py-3.5 bg-[#111827] hover:bg-[#27272A] text-white font-semibold text-xs uppercase tracking-wider rounded-md transition-all text-center flex items-center justify-center gap-2"
        >
          Proceed to Checkout <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}
