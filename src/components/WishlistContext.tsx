"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toggleWishlistAction, getUserWishlistAction } from "@/app/actions/wishlist";

type WishlistContextType = {
  favoriteIds: string[];
  favoriteItems: any[];
  toggleFavorite: (productId: string) => Promise<boolean>;
  isFavorite: (productId: string) => boolean;
  count: number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);

  useEffect(() => {
    // Load from DB for logged-in users, fallback to LocalStorage for guests
    const loadWishlist = async () => {
      const res = await getUserWishlistAction();
      if (res.success && res.items.length > 0) {
        setFavoriteIds(res.items.map((i: any) => i.productId));
        setFavoriteItems(res.items.map((i: any) => i.product));
      } else {
        const local = localStorage.getItem("next_in_guest_wishlist");
        if (local) {
          try {
            const parsed = JSON.parse(local);
            setFavoriteIds(parsed);
          } catch (e) {}
        }
      }
    };
    loadWishlist();
  }, []);

  const toggleFavorite = async (productId: string): Promise<boolean> => {
    const res = await toggleWishlistAction(productId);
    let newFavorited = false;

    if (res.success && typeof res.favorited === "boolean") {
      newFavorited = res.favorited;
      setFavoriteIds((prev) =>
        newFavorited ? [...prev, productId] : prev.filter((id) => id !== productId)
      );
    } else {
      // Guest local storage fallback
      setFavoriteIds((prev) => {
        const isFav = prev.includes(productId);
        newFavorited = !isFav;
        const updated = isFav ? prev.filter((id) => id !== productId) : [...prev, productId];
        localStorage.setItem("next_in_guest_wishlist", JSON.stringify(updated));
        return updated;
      });
    }

    return newFavorited;
  };

  const isFavorite = (productId: string) => favoriteIds.includes(productId);

  return (
    <WishlistContext.Provider
      value={{
        favoriteIds,
        favoriteItems,
        toggleFavorite,
        isFavorite,
        count: favoriteIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
