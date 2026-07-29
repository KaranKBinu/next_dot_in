"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalAmount: number;
  itemCount: number;
  buyNowItem: CartItem | null;
  startBuyNow: (item: CartItem) => void;
  clearBuyNow: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [buyNowItem, setBuyNowItem] = useState<CartItem | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("next_in_cart");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {}
    }

    const storedBuyNow = sessionStorage.getItem("next_in_buy_now");
    if (storedBuyNow) {
      try {
        setBuyNowItem(JSON.parse(storedBuyNow));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("next_in_cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (buyNowItem) {
      sessionStorage.setItem("next_in_buy_now", JSON.stringify(buyNowItem));
    } else {
      sessionStorage.removeItem("next_in_buy_now");
    }
  }, [buyNowItem]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  };

  const clearCart = () => setItems([]);

  const startBuyNow = (item: CartItem) => {
    setBuyNowItem(item);
  };

  const clearBuyNow = () => {
    setBuyNowItem(null);
  };

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalAmount,
        itemCount,
        buyNowItem,
        startBuyNow,
        clearBuyNow,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
