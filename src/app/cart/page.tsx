"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/Cart/CartContext";
import { useNavbar } from "@/components/Navbar/NavbarContext";
import { TRANSLATIONS, formatINR } from "@/utils/i18n";
import Typography from "@/components/Typography";
import { 
    Trash2, 
    Clock, 
    AlertCircle, 
    ArrowRight, 
    ShoppingBag, 
    Settings, 
    CheckCircle, 
    ChevronRight,
    Sparkles
} from "lucide-react";

// Predefined timeout options mapped to days
const TIMEOUT_OPTIONS = [
    { label: "30 Seconds (Demo)", value: 30 / (24 * 3600) },
    { label: "2 Minutes (Demo)", value: 120 / (24 * 3600) },
    { label: "1 Hour", value: 1 / 24 },
    { label: "1 Day", value: 1 },
    { label: "2 Days (Default)", value: 2 },
];

export default function CartPage() {
    const { locale } = useNavbar();
    const t = TRANSLATIONS[locale];
    
    const {
        cartItems,
        removeFromCart,
        clearCart,
        abandonTimeoutDays,
        setAbandonTimeoutDays,
        timeLeftMs,
        isItemOutOfStock,
        reservationCode,
    } = useCart();

    const router = useRouter();

    const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
    const [placedReservationCode, setPlacedReservationCode] = useState("");
    const [debugOpen, setDebugOpen] = useState(false);

    // Calculate subtotal for items that are not out of stock
    const subtotal = cartItems.reduce((acc, item) => {
        const outOfStock = isItemOutOfStock(item.id);
        return outOfStock ? acc : acc + item.priceInRupees;
    }, 0);
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    const hasOutOfStockItems = cartItems.some((item) => isItemOutOfStock(item.id));

    // Format remaining time (for debug tools)
    const formatTimeLeft = (ms: number) => {
        if (ms <= 0) return "00:00:00";
        const totalSecs = Math.floor(ms / 1000);
        const days = Math.floor(totalSecs / (24 * 3600));
        const hours = Math.floor((totalSecs % (24 * 3600)) / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;
        
        const parts = [];
        if (days > 0) parts.push(`${days}d`);
        parts.push(`${hours.toString().padStart(2, "0")}h`);
        parts.push(`${mins.toString().padStart(2, "0")}m`);
        parts.push(`${secs.toString().padStart(2, "0")}s`);
        return parts.join(" ");
    };

    const handleCheckout = () => {
        if (hasOutOfStockItems) return;
        router.push("/checkout");
    };

    // Clear checkout success screen after 5 seconds
    useEffect(() => {
        if (isCheckoutSuccess) {
            const timer = setTimeout(() => setIsCheckoutSuccess(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isCheckoutSuccess]);

    return (
        <main className="flex-1 bg-white dark:bg-neutral-950 pb-24 pt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ── Breadcrumb ── */}
                <nav className="flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-6">
                    <Link href="/" className="hover:text-primary-500 transition-colors">
                        {t.navHome}
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-neutral-900 dark:text-white">
                        {t.cartTitle}
                    </span>
                </nav>

                {/* ── Page Header ── */}
                <div className="mb-10 text-left">
                    <Typography variant="h1" className="text-neutral-950 dark:text-white font-black tracking-tight flex items-center gap-3">
                        {t.cartTitle}
                        {cartItems.length > 0 && (
                            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                                {cartItems.length} {cartItems.length === 1 ? "Item" : "Items"}
                            </span>
                        )}
                    </Typography>
                </div>

                {/* ── CHECKOUT SUCCESS ── */}
                {isCheckoutSuccess && (
                    <div className="mb-12 p-8 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-3xl text-center space-y-4 max-w-2xl mx-auto shadow-lg animate-scale-in">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle className="w-8 h-8 stroke-[2.5]" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-neutral-900 dark:text-white">
                                {locale === "en" ? "Order Placed!" : locale === "hi" ? "ऑर्डर सबमिट हो गया!" : "ഓർഡർ വിജയകരമായി!"}
                            </h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
                                {t.checkoutSuccess}
                            </p>
                            {placedReservationCode && (
                                <div className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-white dark:bg-neutral-950 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl shadow-sm mt-3">
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450">
                                        Reservation Code:
                                    </span>
                                    <span className="font-mono text-sm font-black text-emerald-600 dark:text-emerald-400 lowercase tracking-wider">
                                        {placedReservationCode}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="pt-2">
                            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-800 dark:hover:bg-neutral-700 text-sm font-bold rounded-xl transition-all shadow-md">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                )}

                {/* ── EMPTY CART STATE ── */}
                {!isCheckoutSuccess && cartItems.length === 0 && (
                    <div className="py-20 text-center space-y-6 max-w-md mx-auto border border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl bg-neutral-50/50 dark:bg-neutral-900/25">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600">
                            <ShoppingBag className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                                {t.cartEmpty}
                            </h3>
                            <p className="text-sm text-neutral-400 dark:text-neutral-500 px-4">
                                {t.cartEmptySub}
                            </p>
                        </div>
                        <div>
                            <Link href="/" className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-500 hover:bg-primary-400 active:scale-95 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-primary-500/20">
                                Explore Products
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                )}

                {/* ── ACTIVE CART GRID ── */}
                {!isCheckoutSuccess && cartItems.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* ── Cart Items Column (8 cols) ── */}
                        <div className="lg:col-span-8 space-y-4">
                            {cartItems.map((item) => {
                                const outOfStock = isItemOutOfStock(item.id);
                                return (
                                    <article 
                                        key={item.id}
                                        className={`group relative flex flex-col sm:flex-row gap-5 p-5 bg-neutral-50 dark:bg-neutral-900/30 rounded-2xl border transition-all duration-300 text-left ${
                                            outOfStock 
                                                ? "border-red-200 dark:border-red-950 bg-red-50/50 dark:bg-red-950/5 opacity-80" 
                                                : "border-neutral-100 dark:border-neutral-900 hover:border-neutral-200 dark:hover:border-neutral-800 hover:shadow-md"
                                        }`}
                                    >
                                        {/* Thumbnail image with bg tint */}
                                        <div 
                                            className={`relative w-full sm:w-28 h-28 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 ${
                                                outOfStock ? "filter grayscale opacity-60" : ""
                                            }`}
                                            style={{ backgroundColor: item.colorHex ? `${item.colorHex}12` : "rgba(0,0,0,0.02)" }}
                                        >
                                            <img 
                                                src={item.imagePath} 
                                                alt={t[item.nameKey as keyof typeof t] || item.nameKey} 
                                                className="h-20 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300 select-none"
                                                draggable="false"
                                            />
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 space-y-3 sm:space-y-0">
                                            <div className="space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {outOfStock ? (
                                                        <span className="px-2 py-0.5 text-[9px] font-black tracking-wider bg-red-500 text-white rounded">
                                                            Out of Stock
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-0.5 text-[9px] font-bold tracking-wider bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-300 rounded uppercase">
                                                            1 of 1 Vintage
                                                        </span>
                                                    )}
                                                    <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-600">
                                                        {item.brand}
                                                    </span>
                                                </div>
                                                <h3 className={`text-base font-extrabold truncate ${
                                                    outOfStock ? "text-neutral-500 dark:text-neutral-500 line-through" : "text-neutral-900 dark:text-white"
                                                }`}>
                                                    {t[item.nameKey as keyof typeof t] || item.nameKey}
                                                </h3>
                                                {outOfStock ? (
                                                    <p className="text-xs text-red-500 font-bold flex items-center gap-1">
                                                        <AlertCircle className="w-3.5 h-3.5" />
                                                        Reservation expired. Sold to another buyer.
                                                    </p>
                                                ) : (
                                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 leading-relaxed">
                                                        {t[item.descKey as keyof typeof t] || item.descKey}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Size & color badges & price */}
                                            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    <span className="px-2 py-0.5 text-[10px] font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800/80 rounded-md">
                                                        {t.cardSize}: {item.size}
                                                    </span>
                                                    {item.colorName && (
                                                        <span className="px-2 py-0.5 text-[10px] font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800/80 rounded-md lowercase">
                                                            {item.colorName}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={`text-lg font-black tracking-tight ${
                                                    outOfStock ? "text-neutral-400 dark:text-neutral-600" : "text-neutral-950 dark:text-white"
                                                }`}>
                                                    {formatINR(item.priceInRupees)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Remove Button */}
                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="sm:absolute sm:top-5 sm:right-5 p-2 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 active:scale-95 transition-all self-end sm:self-auto border border-transparent hover:border-red-100 dark:hover:border-red-900/50"
                                            aria-label="Remove item from cart"
                                        >
                                            <Trash2 className="w-4.5 h-4.5" />
                                        </button>
                                    </article>
                                );
                            })}
                        </div>

                        {/* ── Checkout Sidebar (4 cols) ── */}
                        <div className="lg:col-span-4 space-y-6">
                            
                            {/* Warning notification if there are out of stock items */}
                            {hasOutOfStockItems && (
                                <div className="bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/50 rounded-3xl p-5 text-left flex items-start gap-3 shadow-sm">
                                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <h4 className="text-xs font-black uppercase tracking-wider text-red-800 dark:text-red-400">
                                            Action Required
                                        </h4>
                                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-normal font-semibold">
                                            Some items in your cart are no longer available. Please remove them to proceed.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* ── ORDER SUMMARY CARD ── */}
                            <div className="bg-neutral-50 dark:bg-neutral-900/30 rounded-3xl border border-neutral-100 dark:border-neutral-900 p-6 space-y-5 text-left">
                                <h3 className="text-base font-extrabold text-neutral-900 dark:text-white pb-3 border-b border-neutral-200/60 dark:border-neutral-800/60">
                                    Order Summary
                                </h3>

                                {reservationCode && (
                                    <div className="flex justify-between items-center text-xs font-bold bg-neutral-100/80 dark:bg-neutral-800/40 p-3 rounded-xl border border-neutral-200/40 dark:border-neutral-800/40">
                                        <span className="text-neutral-450 uppercase tracking-widest text-[9px] flex items-center gap-1.5 font-extrabold">
                                            <Sparkles className="w-3 h-3 text-primary-500 animate-pulse" />
                                            Code:
                                        </span>
                                        <span className="font-mono text-primary-600 dark:text-primary-400 lowercase tracking-wider bg-white dark:bg-neutral-950 px-2 py-0.5 rounded border border-neutral-200/30 dark:border-neutral-800/30 shadow-xs">
                                            {reservationCode}
                                        </span>
                                    </div>
                                )}

                                <div className="space-y-3.5 text-sm font-semibold">
                                    <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                                        <span>{t.cartSubtotal}</span>
                                        <span className="text-neutral-900 dark:text-white">{formatINR(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-neutral-500 dark:text-neutral-400">
                                        <span>{t.cartShipping}</span>
                                        <span className="text-emerald-600 dark:text-emerald-400 uppercase tracking-widest text-xs font-bold">
                                            Free
                                        </span>
                                    </div>
                                    <div className="pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60 flex justify-between items-end">
                                        <span className="text-neutral-900 dark:text-white font-bold">{t.cartTotal}</span>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-neutral-950 dark:text-white tracking-tight leading-none">
                                                {formatINR(total)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleCheckout}
                                    disabled={hasOutOfStockItems}
                                    className="w-full inline-flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 active:scale-95 text-white text-sm font-extrabold rounded-xl transition-all shadow-lg shadow-primary-500/20 cursor-pointer disabled:from-neutral-200 disabled:to-neutral-200 dark:disabled:from-neutral-800 dark:disabled:to-neutral-800 disabled:text-neutral-400 dark:disabled:text-neutral-600 disabled:shadow-none disabled:scale-100 disabled:cursor-not-allowed"
                                >
                                    {t.checkoutBtn}
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>

                        </div>
                    </div>
                )}

                {/* ── COLLAPSIBLE DEVELOPER DEBUG PANEL ── */}
                {!isCheckoutSuccess && cartItems.length > 0 && (
                    <div className="mt-16 border-t border-neutral-100 dark:border-neutral-900 pt-8">
                        <div className="max-w-xl mx-auto">
                            <div className="border border-neutral-200 dark:border-neutral-850 rounded-2xl overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/10">
                                <button
                                    onClick={() => setDebugOpen(!debugOpen)}
                                    className="w-full flex items-center justify-between p-4 text-xs font-bold text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/20 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <Settings className="w-4 h-4" />
                                        🛠️ Developer Debug Tools (Timeout Tester)
                                    </span>
                                    <span className="text-[10px] uppercase tracking-wider bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded">
                                        {debugOpen ? "Hide" : "Show"}
                                    </span>
                                </button>
                                {debugOpen && (
                                    <div className="p-5 border-t border-neutral-200 dark:border-neutral-850 space-y-4 text-left text-xs text-neutral-600 dark:text-neutral-400">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <span className="font-bold text-neutral-400 block uppercase tracking-wider text-[9px]">
                                                    Reservation Clock:
                                                </span>
                                                <span className="font-black text-sm text-neutral-900 dark:text-white bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 px-2.5 py-1 rounded inline-block font-mono">
                                                    {formatTimeLeft(timeLeftMs)}
                                                </span>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="font-bold text-neutral-400 block uppercase tracking-wider text-[9px]">
                                                    Reservation Status:
                                                </span>
                                                <span className={`inline-block font-black uppercase tracking-widest text-[9px] px-2.5 py-1.5 rounded ${
                                                    timeLeftMs > 0 
                                                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400" 
                                                        : "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400"
                                                }`}>
                                                    {timeLeftMs > 0 ? "Active / Reserved" : "Expired (Checking Catalog Stock)"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-2 border-t border-neutral-200/50 dark:border-neutral-800/50">
                                            <label htmlFor="debug-timeout-select" className="font-bold text-neutral-500 block">
                                                Inactivity Timeout Limit:
                                            </label>
                                            <select
                                                id="debug-timeout-select"
                                                value={abandonTimeoutDays}
                                                onChange={(e) => setAbandonTimeoutDays(parseFloat(e.target.value))}
                                                className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2.5 font-semibold text-neutral-800 dark:text-neutral-200 focus:outline-none cursor-pointer"
                                            >
                                                {TIMEOUT_OPTIONS.map((opt) => (
                                                    <option key={opt.label} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="text-[10px] text-neutral-400 italic mt-1 leading-normal">
                                                Testing tip: Set the timeout limit to "30 Seconds" to test background expiration. Once it expires (Reservation Clock hits 0), odd-numbered items in your cart will dynamically report as "Out of stock", while even-numbered items remain in stock and check out normally.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}
