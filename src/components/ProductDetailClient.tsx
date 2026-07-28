"use client";

import { useState } from "react";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { ShoppingBag, CheckCircle2, Heart } from "lucide-react";

export default function ProductDetailClient({ product }: { product: any }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white border border-[#E7E5E4] rounded-md p-8 sm:p-12">
      <div className="lg:col-span-7 bg-[#F4F4F0] border border-[#E7E5E4] rounded-sm p-8 flex items-center justify-center min-h-[400px] relative">
        <button
          onClick={() => toggleFavorite(product.id)}
          className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white border border-[#E7E5E4] shadow-md hover:scale-110 active:scale-95 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#111827]"
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
          <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-widest">{product.category.name}</span>
          <h1 className="text-3xl font-bold text-[#111827] mt-1 tracking-tight">{product.name}</h1>
          
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-[#111827]">₹{product.price}</span>
            {product.compareAtPrice && (
              <span className="text-sm text-[#9CA3AF] line-through">₹{product.compareAtPrice}</span>
            )}
          </div>

          <div className="mt-8 border-t border-b border-[#E7E5E4] py-6">
            <h3 className="text-xs font-semibold text-[#111827] uppercase tracking-wider mb-2">Description & Care</h3>
            <p className="text-xs text-[#6B7280] leading-relaxed">{product.description}</p>
          </div>

          {product.attributes && Object.keys(product.attributes).length > 0 && (
            <div className="mt-6 space-y-2">
              <h3 className="text-xs font-semibold text-[#111827] uppercase tracking-wider mb-3">Garment Details</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(product.attributes).map(([key, val]) => (
                  <div key={key} className="bg-[#FAFAF8] p-2.5 rounded border border-[#E7E5E4]">
                    <span className="text-[#9CA3AF] uppercase text-[10px] block">{key}</span>
                    <span className="font-semibold text-[#111827]">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Quantity:</label>
            <div className="flex items-center border border-[#E7E5E4] rounded bg-[#FAFAF8]">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1.5 text-[#6B7280] hover:text-[#111827]"
              >
                -
              </button>
              <span className="px-4 text-xs font-bold text-[#111827]">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1.5 text-[#6B7280] hover:text-[#111827]"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`w-full py-4 rounded-md font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              added
                ? "bg-emerald-700 text-white"
                : "bg-[#111827] hover:bg-[#27272A] text-white"
            } disabled:opacity-50`}
          >
            {added ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Added to Shopping Bag
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> {product.stock > 0 ? "Add to Bag" : "Sold Out"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
