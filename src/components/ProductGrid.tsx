"use client";

import Link from "next/link";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { ShoppingBag, Heart } from "lucide-react";

export type ProductItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  images: string[];
  category: { name: string };
};

export default function ProductGrid({ products }: { products: ProductItem[] }) {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useWishlist();

  if (products.length === 0) {
    return (
      <div className="bg-white border border-[#E7E5E4] rounded-md p-12 text-center text-[#6B7280]">
        <p className="text-xs uppercase tracking-wider font-semibold">No garments found matching your filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => {
        const favorited = isFavorite(product.id);

        return (
          <div
            key={product.id}
            className="group bg-white border border-[#E7E5E4] rounded-md p-4 flex flex-col justify-between hover:border-[#111827] hover:shadow-lg transition-all duration-300 relative transform hover:-translate-y-1"
          >
            <button
              onClick={() => toggleFavorite(product.id)}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/90 border border-[#E7E5E4] shadow-sm hover:scale-110 active:scale-90 transition-all duration-200"
              title={favorited ? "Saved to favorites" : "Add to favorites"}
            >
              <Heart
                className={`w-4 h-4 transition-transform duration-300 ${
                  favorited ? "fill-rose-600 text-rose-600 animate-heart-pop" : "text-[#6B7280] group-hover:text-rose-600"
                }`}
              />
            </button>

            <div>
              <div className="aspect-[4/3] bg-[#F4F4F0] rounded-sm overflow-hidden mb-4 border border-[#E7E5E4] relative">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#9CA3AF] text-xs uppercase tracking-widest">No Image</div>
                )}
              </div>

              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-widest">{product.category.name}</span>
              <h3 className="text-sm font-bold text-[#111827] mt-1 group-hover:text-[#111827] transition-colors">{product.name}</h3>
              <p className="text-xs text-[#6B7280] mt-1 line-clamp-2">{product.description}</p>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-[#E7E5E4]">
              <div>
                <span className="text-base font-bold text-[#111827]">₹{product.price}</span>
                {product.compareAtPrice && (
                  <span className="ml-2 text-xs text-[#9CA3AF] line-through">₹{product.compareAtPrice}</span>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => addItem({ productId: product.id, name: product.name, price: product.price, quantity: 1, image: product.images[0] })}
                  disabled={product.stock <= 0}
                  className="px-3 py-2 bg-[#111827] text-white border border-[#111827] rounded text-xs font-semibold uppercase tracking-wider hover:bg-[#27272A] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {product.stock > 0 ? "Add" : "Sold Out"}
                </button>

                <Link
                  href={`/product/${product.slug}`}
                  className="px-3 py-2 bg-[#FAFAF8] text-[#111827] border border-[#E7E5E4] text-xs font-semibold uppercase tracking-wider rounded hover:border-[#111827] hover:bg-[#F4F4F0] active:scale-95 transition-all"
                >
                  View
                </Link>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
