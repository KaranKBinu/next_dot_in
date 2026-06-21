"use client";

import React, { use, useState, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/components/Cart/CartContext";
import { useNavbar } from "@/components/Navbar/NavbarContext";
import { TRANSLATIONS, formatINR } from "@/utils/i18n";
import { PRODUCTS, CATEGORIES_META, Product } from "@/utils/catalog";
import Typography from "@/components/Typography";
import { 
    ShoppingBag, 
    ChevronRight, 
    ShieldCheck, 
    Leaf, 
    Heart, 
    ArrowLeft, 
    Info, 
    Sparkles,
    Flame,
    CheckCircle
} from "lucide-react";

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
    const { id: productId } = use(params);
    const { locale } = useNavbar();
    const t = TRANSLATIONS[locale];
    const { addToCart, cartItems } = useCart();
    
    // Accordion states
    const [activeTab, setActiveTab] = useState<"details" | "measurements" | "eco">("details");

    // Fetch product
    const product = useMemo(() => {
        return PRODUCTS.find(p => p.id === productId);
    }, [productId]);

    // Fetch related products (same category, excluding current)
    const relatedProducts = useMemo(() => {
        if (!product) return [];
        return PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
    }, [product]);

    if (!product) {
        return (
            <main className="flex-1 bg-white dark:bg-neutral-950 py-24 text-center space-y-6">
                <div className="max-w-md mx-auto space-y-4">
                    <Typography variant="h2" className="text-neutral-900 dark:text-white font-black">
                        Vintage Piece Not Found
                    </Typography>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        This one-of-one item may have already been sold or removed from our catalog.
                    </p>
                    <Link href="/catalog/all" className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-500 hover:bg-primary-400 text-white font-bold rounded-xl transition-all shadow-md">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Catalog
                    </Link>
                </div>
            </main>
        );
    }

    const inCart = cartItems.some(i => i.id === product.id);

    return (
        <main className="flex-1 bg-white dark:bg-neutral-950 pb-24 pt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ── Breadcrumb ── */}
                <nav className="flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-10 text-left">
                    <Link href="/" className="hover:text-primary-500 transition-colors">
                        {t.navHome}
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link href="/catalog/all" className="hover:text-primary-500 transition-colors">
                        {t.catalogTitle}
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <Link href={`/catalog/${product.category}`} className="hover:text-primary-500 transition-colors">
                        {t[CATEGORIES_META[product.category]?.labelKey as keyof typeof t] || product.category}
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-primary-500 truncate max-w-[200px]">
                        {t[product.nameKey as keyof typeof t] || product.nameKey}
                    </span>
                </nav>

                {/* ── Main PDP Split Grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                    
                    {/* ── Left Column: Large Image Gallery (6 cols) ── */}
                    <div className="lg:col-span-6 space-y-6">
                        <div 
                            className="relative w-full h-[400px] md:h-[520px] rounded-3xl flex items-center justify-center overflow-hidden border border-neutral-100 dark:border-neutral-900 shadow-lg"
                            style={{ backgroundColor: `${product.colorHex}0c` }}
                        >
                            {/* Ambient Glow */}
                            <div 
                                className="absolute inset-0 opacity-15 blur-[120px] scale-90"
                                style={{ backgroundColor: product.colorHex }}
                            />
                            
                            {/* Unique Badging */}
                            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-neutral-950/80 dark:bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-neutral-800 dark:border-neutral-700">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
                                <span className="text-[10px] font-black tracking-widest text-white uppercase">
                                    Grade A Certified
                                </span>
                            </div>

                            <img 
                                src={product.imagePath} 
                                alt={t[product.nameKey as keyof typeof t] || product.nameKey}
                                className="h-72 md:h-96 w-auto object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500 select-none relative z-10"
                                draggable="false"
                            />
                        </div>

                        {/* Condition verification bar */}
                        <div className="p-4 bg-neutral-50 dark:bg-neutral-900/30 rounded-2xl border border-neutral-100 dark:border-neutral-900 flex items-center gap-3 text-left">
                            <ShieldCheck className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <div className="space-y-0.5">
                                <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                                    Physically Inspected & Quality Verified
                                </p>
                                <p className="text-[10px] text-neutral-400">
                                    Checked for size accuracy, authentic branding, and zero fiber defects.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── Right Column: Specs & Purchasing controls (6 cols) ── */}
                    <div className="lg:col-span-6 space-y-8 text-left">
                        {/* Headers */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <span className="px-2.5 py-1 text-[10px] font-black bg-primary-100 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 rounded uppercase tracking-widest">
                                    Circa {product.year}
                                </span>
                                <span className="text-xs font-bold text-neutral-400">
                                    {product.brand}
                                </span>
                            </div>
                            <Typography variant="h1" className="text-neutral-950 dark:text-white font-black tracking-tight leading-tight">
                                {t[product.nameKey as keyof typeof t] || product.nameKey}
                            </Typography>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                {t[product.descKey as keyof typeof t] || product.descKey}
                            </p>
                        </div>

                        {/* Price Area */}
                        <div className="py-4 border-y border-neutral-100 dark:border-neutral-900 flex items-end justify-between">
                            <div>
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-0.5">
                                    {t.cardPrice}
                                </span>
                                <span className="text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
                                    {formatINR(product.priceInRupees)}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-0.5">
                                    Availability
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-extrabold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-full">
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    In Stock (1-of-1)
                                </span>
                            </div>
                        </div>

                        {/* Reservation Alert Note */}
                        <div className="p-4 bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/40 rounded-2xl flex items-start gap-3">
                            <Info className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed font-semibold">
                                **Reservation Note:** Claiming this item holds it for **2 days** (configurable). If not purchased, the reservation expires and the item returns to the store catalog where it can be claimed by others.
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => addToCart(product)}
                                className={`flex-1 inline-flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-extrabold transition-all active:scale-95 cursor-pointer ${
                                    inCart
                                        ? "bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/25"
                                        : "bg-primary-500 hover:bg-primary-400 text-white shadow-lg shadow-primary-500/25"
                                }`}
                            >
                                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                                {inCart ? "Item Reserved (Go to Cart)" : t.cardBtnClaim}
                            </button>
                            {inCart && (
                                <Link 
                                    href="/cart"
                                    className="px-6 py-4 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-sm font-bold rounded-xl transition-colors flex items-center justify-center"
                                >
                                    View Cart
                                </Link>
                            )}
                        </div>

                        {/* Accordion Panels */}
                        <div className="border border-neutral-200 dark:border-neutral-850 rounded-2xl overflow-hidden bg-neutral-50/30 dark:bg-neutral-900/10">
                            
                            {/* Accordion headers */}
                            <div className="flex border-b border-neutral-200 dark:border-neutral-850 text-xs font-bold bg-neutral-50/80 dark:bg-neutral-900/25">
                                {[
                                    { id: "details", label: t.prodDetailsTitle },
                                    { id: "measurements", label: t.measurementsTitle },
                                    { id: "eco", label: t.ecoSavingsTitle },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex-1 py-3 text-center border-b-2 transition-all ${
                                            activeTab === tab.id
                                                ? "border-primary-500 text-neutral-950 dark:text-white bg-white dark:bg-neutral-950"
                                                : "border-transparent text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Accordion Content */}
                            <div className="p-5 text-xs text-neutral-600 dark:text-neutral-450 leading-relaxed min-h-[120px]">
                                {activeTab === "details" && (
                                    <div className="space-y-2 text-left">
                                        <div className="grid grid-cols-2 gap-y-2">
                                            <span className="font-bold text-neutral-400">{t.conditionTitle}:</span>
                                            <span className="font-semibold text-neutral-800 dark:text-neutral-200">{t[product.conditionKey]}</span>
                                            
                                            <span className="font-bold text-neutral-400">Material:</span>
                                            <span className="font-semibold text-neutral-800 dark:text-neutral-200">{t[product.materialKey]}</span>
                                            
                                            <span className="font-bold text-neutral-400">Brand:</span>
                                            <span className="font-semibold text-neutral-800 dark:text-neutral-200">{product.brand}</span>
                                            
                                            <span className="font-bold text-neutral-400">Era:</span>
                                            <span className="font-semibold text-neutral-800 dark:text-neutral-200">1990s Vintage ({product.year})</span>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "measurements" && (
                                    <div className="space-y-3 text-left">
                                        <p className="font-semibold text-neutral-500 dark:text-neutral-400">
                                            Hand-measured dimensions (taken flat):
                                        </p>
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div className="p-2.5 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-900">
                                                <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Chest (Pit-to-pit)</span>
                                                <span className="font-extrabold text-sm text-neutral-850 dark:text-white">{product.measurements.chest}</span>
                                            </div>
                                            <div className="p-2.5 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-900">
                                                <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Length (Shoulder-to-hem)</span>
                                                <span className="font-extrabold text-sm text-neutral-850 dark:text-white">{product.measurements.length}</span>
                                            </div>
                                            <div className="p-2.5 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-900">
                                                <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Shoulder width</span>
                                                <span className="font-extrabold text-sm text-neutral-850 dark:text-white">{product.measurements.shoulder}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === "eco" && (
                                    <div className="space-y-3 text-left">
                                        <p className="font-semibold text-neutral-500 dark:text-neutral-400">
                                            Circular eco-savings from choosing pre-loved:
                                        </p>
                                        <div className="space-y-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                            <div className="flex items-center gap-2">
                                                <Leaf className="w-4 h-4 text-emerald-500" />
                                                <span>80% Carbon Footprint Saved vs Buying New</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                <span>2,700 Liters of Water Saved (equivalent to 3 years drinking water)</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Heart className="w-4 h-4 text-emerald-500" />
                                                <span>Extended clothing lifespan by 2+ years</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                {/* ── Related Products Carousel ── */}
                {relatedProducts.length > 0 && (
                    <div className="mt-24 pt-10 border-t border-neutral-100 dark:border-neutral-900 text-left">
                        <Typography variant="h2" className="text-neutral-950 dark:text-white font-black tracking-tight mb-8">
                            {t.relatedProductsTitle}
                        </Typography>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {relatedProducts.map((p) => {
                                const relInCart = cartItems.some(i => i.id === p.id);
                                return (
                                    <article
                                        key={p.id}
                                        className="group relative flex flex-col rounded-2xl bg-white dark:bg-neutral-900 ring-1 ring-neutral-200/60 dark:ring-neutral-800/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden text-left"
                                    >
                                        <Link
                                            href={`/product/${p.id}`}
                                            className="relative h-48 flex items-center justify-center overflow-hidden cursor-pointer"
                                            style={{ background: `${p.colorHex}0c` }}
                                        >
                                            <img
                                                src={p.imagePath}
                                                alt={t[p.nameKey as keyof typeof t] || p.nameKey}
                                                className="h-32 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-350"
                                            />
                                        </Link>
                                        <div className="p-4 space-y-2.5">
                                            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                                                {p.brand}
                                            </span>
                                            <Link href={`/product/${p.id}`}>
                                                <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white truncate hover:text-primary-500 transition-colors">
                                                    {t[p.nameKey as keyof typeof t] || p.nameKey}
                                                </h4>
                                            </Link>
                                            <div className="flex justify-between items-center pt-2 border-t border-neutral-100 dark:border-neutral-800">
                                                <p className="text-sm font-black text-neutral-950 dark:text-white">
                                                    {formatINR(p.priceInRupees)}
                                                </p>
                                                <button
                                                    onClick={() => addToCart(p)}
                                                    className={`flex items-center justify-center p-2 rounded-xl transition-all active:scale-90 ${
                                                        relInCart
                                                            ? "bg-green-500 text-white"
                                                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-primary-500 hover:text-white"
                                                    }`}
                                                >
                                                    <ShoppingBag className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}
