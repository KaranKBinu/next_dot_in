"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { ShoppingBag, Heart, Zap } from "lucide-react";

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
  const router = useRouter();
  const { addItem, startBuyNow } = useCart();
  const { isFavorite, toggleFavorite } = useWishlist();

  const handleCardClick = (slug: string) => {
    router.push(`/product/${slug}`);
  };

  const handleToggleFavorite = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    e.preventDefault();
    toggleFavorite(productId);
  };

  const handleAddToCart = (e: React.MouseEvent, product: ProductItem) => {
    e.stopPropagation();
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0],
    });
  };

  const handleBuyNow = (e: React.MouseEvent, product: ProductItem) => {
    e.stopPropagation();
    e.preventDefault();
    startBuyNow({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0],
    });
    router.push("/checkout?mode=buynow");
  };

  if (products.length === 0) {
    return (
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-8 sm:p-12 text-center text-[#6B7280]">
        <p className="text-xs uppercase tracking-wider font-semibold">No garments found matching your filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
      {products.map((product) => {
        const favorited = isFavorite(product.id);

        return (
          <div
            key={product.id}
            onClick={() => handleCardClick(product.slug)}
            className="group bg-white border border-[#E7E5E4] rounded-xl p-3 sm:p-4 flex flex-col justify-between hover:border-[#111827] hover:shadow-lg transition-all duration-300 relative transform hover:-translate-y-1 cursor-pointer select-none"
          >
            {/* Favorite Wishlist Icon Button */}
            <button
              onClick={(e) => handleToggleFavorite(e, product.id)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-xs border border-[#E7E5E4] shadow-xs hover:scale-110 active:scale-90 transition-all duration-200 min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
              title={favorited ? "Saved to favorites" : "Add to favorites"}
              aria-label="Toggle Favorite"
            >
              <Heart
                className={`w-4 h-4 transition-transform duration-300 ${
                  favorited ? "fill-rose-600 text-rose-600 animate-heart-pop" : "text-[#6B7280] group-hover:text-rose-600"
                }`}
              />
            </button>

            <div>
              {/* Image Preview */}
              <div className="aspect-[4/3] bg-[#F4F4F0] rounded-lg overflow-hidden mb-3 border border-[#E7E5E4] relative">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#9CA3AF] text-xs uppercase tracking-widest">
                    No Image
                  </div>
                )}
              </div>

              <span className="text-[9px] sm:text-[10px] font-bold text-[#6B7280] uppercase tracking-widest block">
                {product.category.name}
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-[#111827] mt-0.5 group-hover:text-[#111827] transition-colors line-clamp-1">
                {product.name}
              </h3>
              <p className="text-[11px] sm:text-xs text-[#6B7280] mt-1 line-clamp-2 hidden sm:block">
                {product.description}
              </p>
            </div>

            {/* Price & Action CTA Buttons */}
            <div className="mt-4 sm:mt-6 flex flex-col gap-3 pt-3 border-t border-[#E7E5E4]">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-sm sm:text-base font-bold text-[#111827]">₹{product.price}</span>
                  {product.compareAtPrice && (
                    <span className="ml-1.5 text-[10px] sm:text-xs text-[#9CA3AF] line-through">₹{product.compareAtPrice}</span>
                  )}
                </div>
                {product.stock <= 0 && (
                  <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Out of stock</span>
                )}
              </div>

              <div className="flex flex-col xs:flex-row gap-2 w-full">
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={product.stock <= 0}
                  className="flex-1 px-2.5 py-2.5 bg-[#F4F4F0] hover:bg-[#E7E5E4] text-[#111827] border border-[#E7E5E4] rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer whitespace-nowrap"
                  title="Add to Bag"
                >
                  <ShoppingBag className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">Add to Bag</span>
                </button>

                <button
                  onClick={(e) => handleBuyNow(e, product)}
                  disabled={product.stock <= 0}
                  className="flex-1 px-2.5 py-2.5 bg-[#111827] hover:bg-[#27272A] text-white border border-[#111827] rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 min-h-[44px] cursor-pointer shadow-xs whitespace-nowrap"
                  title="Buy Now"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
                  <span className="truncate">Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

