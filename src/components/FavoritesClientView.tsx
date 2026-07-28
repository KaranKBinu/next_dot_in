"use client";

import Link from "next/link";
import { useWishlist } from "./WishlistContext";
import { useCart } from "./CartContext";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";

export default function FavoritesClientView({ initialFavorites }: { initialFavorites: any[] }) {
  const { favoriteItems, favoriteIds, toggleFavorite } = useWishlist();
  const { addItem } = useCart();

  const items = favoriteItems.length > 0 ? favoriteItems : initialFavorites;

  if (items.length === 0 && favoriteIds.length === 0) {
    return (
      <div className="bg-white border border-[#E7E5E4] rounded-md p-16 text-center space-y-4 max-w-lg mx-auto my-8">
        <div className="w-16 h-16 bg-[#FAFAF8] border border-[#E7E5E4] rounded-full flex items-center justify-center mx-auto text-[#6B7280]">
          <Heart className="w-8 h-8 text-rose-600 fill-rose-600/10" />
        </div>
        <h2 className="text-xl font-bold uppercase tracking-wider text-[#111827]">Save Pieces You Love</h2>
        <p className="text-xs text-[#6B7280]">
          Save pieces you love and find them here later when you are ready to complete your order.
        </p>
        <div className="pt-2">
          <Link
            href="/catalog"
            className="px-6 py-3 bg-[#111827] text-white rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-[#27272A] transition-colors inline-flex items-center gap-2"
          >
            Explore Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const handleMoveAllToCart = () => {
    items.forEach((product) => {
      if (product.stock > 0) {
        addItem({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.images?.[0],
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={handleMoveAllToCart}
          className="px-4 py-2 bg-[#111827] text-white rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-[#27272A] transition-colors flex items-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" /> Move All Available to Bag
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((product) => (
          <div key={product.id} className="bg-white border border-[#E7E5E4] rounded-md p-4 flex flex-col justify-between relative group">
            <button
              onClick={() => toggleFavorite(product.id)}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/90 border border-[#E7E5E4] shadow-sm hover:text-rose-700 transition-colors"
              title="Remove from favorites"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
            </button>

            <div>
              <div className="aspect-[4/3] bg-[#F4F4F0] rounded-sm overflow-hidden mb-4 border border-[#E7E5E4]">
                {product.images?.[0] ? (
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#9CA3AF] text-xs uppercase">No Image</div>
                )}
              </div>

              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">{product.category?.name || "Apparel"}</span>
              <h3 className="text-sm font-bold text-[#111827] mt-1">{product.name}</h3>
              <p className="text-xs text-[#6B7280] mt-1 line-clamp-2">{product.description}</p>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#E7E5E4]">
              <div>
                <span className="text-base font-bold text-[#111827]">₹{product.price}</span>
                {product.compareAtPrice && (
                  <span className="ml-2 text-xs text-[#9CA3AF] line-through">₹{product.compareAtPrice}</span>
                )}
              </div>

              <button
                onClick={() => {
                  addItem({
                    productId: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    image: product.images?.[0],
                  });
                }}
                disabled={product.stock <= 0}
                className="px-3 py-2 bg-[#111827] text-white border border-[#111827] rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-[#27272A] transition-colors disabled:opacity-50 flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                {product.stock > 0 ? "Add to Bag" : "Sold Out"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
