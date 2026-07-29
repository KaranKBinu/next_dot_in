"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { ShoppingBag, CheckCircle2, Heart, Zap } from "lucide-react";

export default function ProductDetailClient({ product }: { product: any }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, startBuyNow } = useCart();
  const { isFavorite, toggleFavorite } = useWishlist();
  const favorited = isFavorite(product.id);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    startBuyNow({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.images[0],
    });
    router.push("/checkout?mode=buynow");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white border border-[#E7E5E4] rounded-xl p-6 sm:p-12 shadow-xs">
      <div className="lg:col-span-7 bg-[#F4F4F0] border border-[#E7E5E4] rounded-lg p-8 flex items-center justify-center min-h-[400px] relative">
        <button
          onClick={() => toggleFavorite(product.id)}
          className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white border border-[#E7E5E4] shadow-xs hover:scale-105 active:scale-95 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111827] cursor-pointer"
        >
          <Heart className={`w-5 h-5 ${favorited ? "fill-rose-600 text-rose-600" : "text-[#6B7280]"}`} />
          <span>{favorited ? "Saved" : "Save to Favorites"}</span>
        </button>
        {product.images.length > 0 ? (
          <img src={product.images[0]} alt={product.name} className="max-h-[420px] object-contain" />
        ) : (
          <div className="text-[#9CA3AF] text-xs uppercase tracking-widest">No Image Available</div>
        )}
      </div>

      <div className="lg:col-span-5 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-extrabold text-[#6B7280] uppercase tracking-widest">{product.category.name}</span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827] mt-1 tracking-tight">{product.name}</h1>
          
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-black text-[#111827]">₹{product.price}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-[#9CA3AF] line-through">₹{product.compareAtPrice}</span>
            )}
          </div>

          <div className="mt-8 border-t border-b border-[#E7E5E4] py-6">
            <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-2">Description & Care</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">{product.description}</p>
          </div>

          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider mb-3">Garment Details</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(product.attributes).map(([key, val]) => (
                  <div key={key} className="bg-[#FAFAF8] p-2.5 rounded-lg border border-[#E7E5E4]">
                    <span className="text-[#9CA3AF] uppercase text-[10px] block font-bold">{key}</span>
                    <span className="font-semibold text-[#111827]">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-5">
          <div className="flex items-center gap-4">
            <label className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Quantity:</label>
            <div className="flex items-center border border-[#E7E5E4] rounded-lg bg-[#FAFAF8] overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3.5 py-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#E7E5E4] font-bold transition-colors cursor-pointer min-h-[40px]"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="px-4 text-xs font-black text-[#111827] min-w-[32px] text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3.5 py-2 text-[#6B7280] hover:text-[#111827] hover:bg-[#E7E5E4] font-bold transition-colors cursor-pointer min-h-[40px]"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border cursor-pointer min-h-[48px] ${
                added
                  ? "bg-emerald-700 border-emerald-700 text-white"
                  : "bg-[#FAFAF8] hover:bg-[#F4F4F0] border-[#111827] text-[#111827] active:scale-[0.98]"
              } disabled:opacity-50`}
            >
              {added ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Added to Bag
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> {product.stock > 0 ? "Add to Bag" : "Sold Out"}
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 bg-[#111827] hover:bg-[#27272A] text-white active:scale-[0.98] disabled:opacity-50 cursor-pointer min-h-[48px] shadow-md"
            >
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Purchase Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E7E5E4] p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-2xl animate-fade-in">
        <div className="flex items-center gap-2.5 max-w-md mx-auto">
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`flex-1 py-3 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border cursor-pointer min-h-[48px] ${
              added
                ? "bg-emerald-700 border-emerald-700 text-white"
                : "bg-[#FAFAF8] active:bg-[#F4F4F0] border-[#111827] text-[#111827]"
            } disabled:opacity-50 whitespace-nowrap`}
          >
            {added ? (
              <>
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4 flex-shrink-0" />
                <span>Add to Bag</span>
              </>
            )}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            className="flex-1 py-3 px-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 bg-[#111827] active:bg-[#27272A] text-white disabled:opacity-50 cursor-pointer min-h-[48px] shadow-md whitespace-nowrap"
          >
            <Zap className="w-4 h-4 text-amber-400 fill-amber-400 flex-shrink-0" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}

