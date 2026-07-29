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
    <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 flex-1 w-full bg-[#FAFAF8]">
      <div className="flex items-center justify-between mb-6 sm:mb-8 border-b border-[#E7E5E4] pb-4">
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-[#111827]">Shopping Bag</h1>
        <button
          onClick={clearCart}
          className="text-xs text-rose-700 hover:text-rose-900 hover:underline font-bold uppercase tracking-wider p-2 min-h-[44px] cursor-pointer"
        >
          Clear Bag
        </button>
      </div>

      {/* Cart Items List */}
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6 shadow-xs">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E5E4] pb-5 last:border-0 last:pb-0"
          >
            {/* Upper row on mobile: Thumbnail + Info + Total Price */}
            <div className="flex items-start gap-3.5 flex-1 min-w-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F4F4F0] border border-[#E7E5E4] rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-[#6B7280] overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-lg">{item.name?.[0] || "P"}</span>
                )}
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-bold text-[#111827] text-sm leading-snug truncate">{item.name}</h3>
                <p className="text-xs text-[#6B7280] font-semibold mt-1">₹{item.price} each</p>
              </div>
              <div className="sm:hidden text-right font-black text-[#111827] text-base flex-shrink-0">
                ₹{item.price * item.quantity}
              </div>
            </div>

            {/* Controls row: Quantity counter + Desktop price + Delete action */}
            <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F4F4F0]">
              <div className="flex items-center border border-[#E7E5E4] rounded-lg bg-[#FAFAF8] overflow-hidden shadow-2xs">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  className="px-3.5 py-1.5 min-h-[40px] text-[#6B7280] hover:text-[#111827] hover:bg-[#E7E5E4] font-bold text-sm active:scale-95 transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-3 text-xs font-black text-[#111827] min-w-[28px] text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  className="px-3.5 py-1.5 min-h-[40px] text-[#6B7280] hover:text-[#111827] hover:bg-[#E7E5E4] font-bold text-sm active:scale-95 transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <span className="hidden sm:block font-black text-[#111827] text-sm min-w-[80px] text-right">
                ₹{item.price * item.quantity}
              </span>

              <button
                onClick={() => removeItem(item.productId)}
                className="p-2 min-h-[40px] min-w-[40px] text-[#9CA3AF] hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all flex items-center justify-center cursor-pointer"
                aria-label="Remove item"
                title="Remove item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Container */}
      <div className="mt-6 sm:mt-8 bg-white border border-[#E7E5E4] rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center justify-between sm:block">
          <span className="text-[11px] uppercase tracking-widest text-[#6B7280] font-extrabold">Total Order Amount</span>
          <p className="text-2xl sm:text-3xl font-black text-[#111827] mt-0.5">₹{totalAmount}</p>
        </div>

        <Link
          href="/checkout"
          className="w-full sm:w-auto px-8 py-3.5 bg-[#111827] hover:bg-[#27272A] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all text-center flex items-center justify-center gap-2.5 min-h-[48px] shadow-md"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </main>
  );
}
