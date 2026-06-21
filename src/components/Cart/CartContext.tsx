"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
    id: string;
    nameKey: string;
    descKey: string;
    imagePath: string;
    priceInRupees: number;
    size: string;
    brand: string;
    colorHex?: string;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: Omit<CartItem, "quantity">) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    cartCount: number;
    abandonTimeoutDays: number; // e.g. 2 for 2 days, or decimals for minutes/seconds
    setAbandonTimeoutDays: (days: number) => void;
    lastInteractionTime: number; // timestamp
    timeLeftMs: number; // dynamic countdown
    cartExpiredAlert: boolean;
    setCartExpiredAlert: (show: boolean) => void;
    isItemOutOfStock: (id: string) => boolean;
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
    const [abandonTimeoutDays, setAbandonTimeoutDaysState] = useState<number>(2); // default 2 days
    const [lastInteractionTime, setLastInteractionTime] = useState<number>(0);
    const [cartExpiredAlert, setCartExpiredAlert] = useState<boolean>(false);
    const [timeLeftMs, setTimeLeftMs] = useState<number>(0);
    const [reservationCode, setReservationCode] = useState<string>("");
    const [isMounted, setIsMounted] = useState(false);

    // Initial load from localStorage on client mount
    useEffect(() => {
        setIsMounted(true);
        const storedCart = localStorage.getItem("next_in_cart");
        const storedTimeout = localStorage.getItem("next_in_cart_timeout");
        const storedTime = localStorage.getItem("next_in_cart_time");
        const storedCode = localStorage.getItem("next_in_cart_code");
        
        if (storedCart) {
            try {
                setCartItems(JSON.parse(storedCart));
            } catch (e) {
                console.error("Error parsing cart", e);
            }
        }
        if (storedTimeout) {
            setAbandonTimeoutDaysState(parseFloat(storedTimeout));
        }
        if (storedTime) {
            setLastInteractionTime(parseInt(storedTime, 10));
        } else if (storedCart && JSON.parse(storedCart).length > 0) {
            // fallback if items exist but no time
            const now = Date.now();
            setLastInteractionTime(now);
            localStorage.setItem("next_in_cart_time", now.toString());
        }
        if (storedCode) {
            setReservationCode(storedCode);
        }
    }, []);

    // Helper to save state to localStorage
    const saveCart = (items: CartItem[], time: number) => {
        setCartItems(items);
        setLastInteractionTime(time);
        if (typeof window !== "undefined") {
            localStorage.setItem("next_in_cart", JSON.stringify(items));
            localStorage.setItem("next_in_cart_time", time.toString());
        }
    };

    const addToCart = (item: Omit<CartItem, "quantity">) => {
        const now = Date.now();
        // check if item already exists
        const exists = cartItems.find((i) => i.id === item.id);
        if (exists) {
            alert("This 1-of-1 item is already reserved in your cart!");
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
        saveCart(newItems, now);
        setCartExpiredAlert(false);
    };

    const removeFromCart = (id: string) => {
        const now = Date.now();
        const newItems = cartItems.filter((i) => i.id !== id);
        // If cart is now empty, we can reset the timestamp to 0 and remove code
        const updatedTime = newItems.length === 0 ? 0 : now;
        if (newItems.length === 0) {
            setReservationCode("");
            if (typeof window !== "undefined") {
                localStorage.removeItem("next_in_cart_code");
            }
        }
        saveCart(newItems, updatedTime);
    };

    const clearCart = () => {
        saveCart([], 0);
        setReservationCode("");
        if (typeof window !== "undefined") {
            localStorage.removeItem("next_in_cart_code");
        }
    };

    const setAbandonTimeoutDays = (days: number) => {
        setAbandonTimeoutDaysState(days);
        if (typeof window !== "undefined") {
            localStorage.setItem("next_in_cart_timeout", days.toString());
            
            // If cart is not empty, update lastInteractionTime to now so the new timeout starts ticking from now
            if (cartItems.length > 0) {
                const now = Date.now();
                setLastInteractionTime(now);
                localStorage.setItem("next_in_cart_time", now.toString());
            }
        }
    };

    // Expiry check interval
    useEffect(() => {
        if (!isMounted || cartItems.length === 0 || lastInteractionTime === 0) {
            setTimeLeftMs(0);
            return;
        }

        const checkExpiry = () => {
            const now = Date.now();
            // Convert days to milliseconds
            const timeoutMs = abandonTimeoutDays * 24 * 60 * 60 * 1000;
            const elapsed = now - lastInteractionTime;
            const remaining = timeoutMs - elapsed;

            if (remaining <= 0) {
                // EXPIRED! Do NOT clear cart anymore, just set timeLeftMs to 0
                setTimeLeftMs(0);
            } else {
                setTimeLeftMs(remaining);
            }
        };

        // Run once immediately
        checkExpiry();

        // Run every 100ms for accurate visual ticking
        const interval = setInterval(checkExpiry, 100);
        return () => clearInterval(interval);
    }, [isMounted, cartItems, lastInteractionTime, abandonTimeoutDays]);

    const isItemOutOfStock = (id: string) => {
        if (timeLeftMs > 0 || cartItems.length === 0) return false;
        // If reservation is expired (timeLeftMs === 0), simulate that odd-numbered product IDs are sold
        return id.endsWith("-1") || id.endsWith("-3") || id.endsWith("-5");
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
                abandonTimeoutDays,
                setAbandonTimeoutDays,
                lastInteractionTime,
                timeLeftMs,
                cartExpiredAlert,
                setCartExpiredAlert,
                isItemOutOfStock,
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
