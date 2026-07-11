"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
    id: string;
    productId?: string;
    nameKey: string;
    descKey: string;
    imagePath: string;
    priceInRupees: number;
    size: string;
    brand: string;
    colorHex?: string;
    colorName?: string;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    cartCount: number;
    reservationCode: string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Simple words lists for reservation codes (non-human-understandable as a logical ID, but simple to read)
const ADJECTIVES = ["cool", "retro", "sweet", "happy", "fuzzy", "cozy", "bright", "golden", "funky", "classic", "vintage", "wild", "gentle", "fancy", "smart"];
const COLORS = ["blue", "green", "red", "yellow", "orange", "purple", "pink", "brown", "black", "white", "grey", "silver", "gold", "bronze", "indigo"];
const NOUNS = ["jacket", "denim", "shirt", "pants", "cargo", "tee", "sweater", "fleece", "knit", "boots", "cap", "socks", "scarf", "vest", "coat"];

function generateReservationCode(): string {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    return `${adj}-${color}-${noun}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [reservationCode, setReservationCode] = useState<string>("");

    // Initial load from localStorage on client mount
    useEffect(() => {
        const storedCart = localStorage.getItem("next_in_cart");
        const storedCode = localStorage.getItem("next_in_cart_code");
        
        if (storedCart) {
            try {
                setCartItems(JSON.parse(storedCart));
            } catch (e) {
                console.error("Error parsing cart", e);
            }
        }
        if (storedCode) {
            setReservationCode(storedCode);
        }
    }, []);

    // Helper to save state to localStorage
    const saveCart = (items: CartItem[]) => {
        setCartItems(items);
        if (typeof window !== "undefined") {
            localStorage.setItem("next_in_cart", JSON.stringify(items));
        }
    };

    const addToCart = (item: Omit<CartItem, "quantity">) => {
        // check if item already exists
        const exists = cartItems.find((i) => i.id === item.id);
        if (exists) {
            alert("This item is already in your cart!");
            return;
        }

        // Generate reservation code if cart was empty or code is missing
        let code = reservationCode;
        if (cartItems.length === 0 || !code) {
            code = generateReservationCode();
            setReservationCode(code);
            if (typeof window !== "undefined") {
                localStorage.setItem("next_in_cart_code", code);
            }
        }

        const newItems = [...cartItems, { ...item, quantity: 1 }];
        saveCart(newItems);
    };

    const removeFromCart = (id: string) => {
        const newItems = cartItems.filter((i) => i.id !== id);
        if (newItems.length === 0) {
            setReservationCode("");
            if (typeof window !== "undefined") {
                localStorage.removeItem("next_in_cart_code");
            }
        }
        saveCart(newItems);
    };

    const clearCart = () => {
        saveCart([]);
        setReservationCode("");
        if (typeof window !== "undefined") {
            localStorage.removeItem("next_in_cart_code");
        }
    };

    const cartCount = cartItems.length;

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                clearCart,
                cartCount,
                reservationCode,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
