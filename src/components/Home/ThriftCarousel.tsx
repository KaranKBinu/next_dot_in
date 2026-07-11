"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import Typography from "@/components/Typography";
import { useNavbar } from "@/components/Navbar/NavbarContext";
import { TRANSLATIONS, formatINR } from "@/utils/i18n";
import { useCart } from "@/components/Cart/CartContext";

interface CarouselProduct {
    id: string;
    nameKey: string;
    descKey: string;
    imagePath: string;
    colorHex: string;
    priceInRupees: number;
    size: string;
    brand: string;
    year: string;
    createdAt: string;
}

export default function ThriftCarousel() {
    const [products, setProducts] = useState<CarouselProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const { locale } = useNavbar();
    const { addToCart } = useCart();
    const t = TRANSLATIONS[locale];

    useEffect(() => {
        interface DbProduct {
            id: string;
            parentProductId: string | null;
            name: string;
            description: string;
            imagePath: string;
            colorHex: string;
            priceInRupees: number;
            size: string;
            brand: string;
            year: string;
            createdAt: string;
        }

        fetch("/api/products")
            .then((r) => r.json())
            .then((data: DbProduct[]) => {
                const groups: { [key: string]: DbProduct[] } = {};
                data.forEach((p) => {
                    const key = p.parentProductId || p.id;
                    if (!groups[key]) groups[key] = [];
                    groups[key].push(p);
                });

                const mapped = Object.entries(groups).map(([groupId, items]) => {
                    const primary = items[0];
                    return {
                        id: groupId,
                        nameKey: primary.name,
                        descKey: primary.description,
                        imagePath: primary.imagePath,
                        colorHex: primary.colorHex,
                        priceInRupees: primary.priceInRupees,
                        size: primary.size,
                        brand: primary.brand,
                        year: primary.year,
                        createdAt: primary.createdAt,
                    };
                });

                mapped.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setProducts(mapped.slice(0, 5));
            })
            .catch((err) => console.error("Failed to load carousel products:", err))
            .finally(() => setLoading(false));
    }, []);

    const activeProduct = products[activeIndex];

    const handlePrev = () => {
        if (isAnimating || products.length <= 1) return;
        setIsAnimating(true);
        setActiveIndex((prev) => (prev === 0 ? products.length - 1 : prev - 1));
    };

    const handleNext = () => {
        if (isAnimating || products.length <= 1) return;
        setIsAnimating(true);
        setActiveIndex((prev) => (prev === products.length - 1 ? 0 : prev + 1));
    };

    useEffect(() => {
        if (products.length > 0) {
            const timer = setTimeout(() => setIsAnimating(false), 400);
            return () => clearTimeout(timer);
        }
    }, [activeIndex, products]);

    if (loading) {
        return (
            <div className="w-full h-[500px] md:h-[600px] bg-neutral-50 dark:bg-neutral-900 rounded-3xl flex items-center justify-center border border-neutral-200/80 dark:border-neutral-850">
                <div className="flex flex-col items-center gap-3">
                    <span className="w-8 h-8 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Loading New Arrivals...</p>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return null;
    }

    return (
        <div className="relative w-full h-[500px] md:h-[600px] flex flex-col justify-end bg-gradient-to-b from-neutral-50 to-neutral-100/50 dark:from-neutral-900 dark:to-neutral-950 rounded-3xl ring-1 ring-neutral-200/80 dark:ring-neutral-800/80 overflow-hidden shadow-xl">
            
            {/* Dynamic Product Image Viewport */}
            <div className="absolute inset-0 flex items-center justify-center p-8 pb-36">
                {products.map((prod, idx) => {
                    const isActive = idx === activeIndex;
                    const isLeft = (activeIndex - 1 + products.length) % products.length === idx;
                    const isRight = (activeIndex + 1) % products.length === idx;

                    let positionClass = "opacity-0 scale-75 pointer-events-none translate-x-full";
                    if (isActive) {
                        positionClass = "opacity-100 scale-100 z-10 translate-x-0";
                    } else if (isLeft) {
                        positionClass = "opacity-20 scale-85 -translate-x-[70%] pointer-events-none z-0";
                    } else if (isRight) {
                        positionClass = "opacity-20 scale-85 translate-x-[70%] pointer-events-none z-0";
                    }

                    return (
                        <div
                            key={`${prod.id}-${idx}`}
                            className={`absolute w-64 h-64 md:w-80 md:h-80 flex items-center justify-center transition-all duration-500 ease-out ${positionClass}`}
                        >
                            {isActive ? (
                                <Link href={`/product/${prod.id}`} className="w-full h-full flex items-center justify-center cursor-pointer">
                                    <img
                                        src={prod.imagePath}
                                        alt={t[prod.nameKey as keyof typeof t] || prod.nameKey}
                                        className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_15px_30px_rgba(255,255,255,0.05)] hover:scale-105 transition-transform duration-300 select-none"
                                        draggable="false"
                                    />
                                </Link>
                            ) : (
                                <img
                                    src={prod.imagePath}
                                    alt={t[prod.nameKey as keyof typeof t] || prod.nameKey}
                                    className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.18)] dark:drop-shadow-[0_15px_30px_rgba(255,255,255,0.05)] select-none"
                                    draggable="false"
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Light Mode Color Spill Highlight Behind Product Image */}
            <div 
                className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full filter blur-[110px] opacity-20 dark:opacity-10 transition-all duration-700 pointer-events-none"
                style={{ backgroundColor: activeProduct.colorHex }}
            />

            {/* Left/Right Transition Arrows */}
            {products.length > 1 && (
                <div className="absolute inset-x-4 top-[40%] -translate-y-1/2 flex justify-between z-20 pointer-events-none">
                    <button
                        onClick={handlePrev}
                        className="p-3.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-md hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-95 transition-all pointer-events-auto"
                        aria-label="Previous clothing item"
                    >
                        <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="p-3.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 shadow-md hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-95 transition-all pointer-events-auto"
                        aria-label="Next clothing item"
                    >
                        <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                    </button>
                </div>
            )}

            {/* Active Item Description Box (HTML Overlay) */}
            <div className="relative mx-4 mb-4 sm:mx-6 sm:mb-6 p-5 sm:p-6 bg-white/85 dark:bg-neutral-900/85 backdrop-blur-xl rounded-2xl ring-1 ring-neutral-200/80 dark:ring-neutral-800/80 shadow-lg z-20 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 min-w-0 md:max-w-md text-left">
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold tracking-widest bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 rounded-full uppercase">
                            New Arrival ({activeProduct.year})
                        </span>
                        <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-full">
                            {t.cardSize}: {activeProduct.size}
                        </span>
                    </div>
                    
                    <Link href={`/product/${activeProduct.id}`}>
                        <Typography variant="h4" className="text-neutral-950 dark:text-white font-extrabold tracking-tight hover:text-primary-500 transition-colors cursor-pointer">
                            {t[activeProduct.nameKey as keyof typeof t] || activeProduct.nameKey}
                        </Typography>
                    </Link>
                    
                    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                        {activeProduct.brand} &mdash; {t[activeProduct.descKey as keyof typeof t] || activeProduct.descKey}
                    </p>
                </div>

                <div className="flex items-center gap-3 justify-between md:justify-end flex-shrink-0">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest leading-none">
                            {t.cardPrice}
                        </p>
                        <p className="text-2xl font-black text-neutral-950 dark:text-white tracking-tight">
                            {formatINR(activeProduct.priceInRupees)}
                        </p>
                    </div>

                    <button 
                        onClick={() => addToCart({
                            id: activeProduct.id,
                            nameKey: activeProduct.nameKey,
                            descKey: activeProduct.descKey,
                            imagePath: activeProduct.imagePath,
                            priceInRupees: activeProduct.priceInRupees,
                            size: activeProduct.size,
                            brand: activeProduct.brand,
                            colorHex: activeProduct.colorHex
                        })}
                        className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary-500 hover:bg-primary-400 active:scale-95 text-white text-sm font-extrabold transition-all shadow-md shadow-primary-500/20"
                    >
                        <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                        {t.cardBtnClaim}
                    </button>
                </div>
            </div>
            
            {/* Dynamic Progress Indicator Pips */}
            {products.length > 1 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md px-3 py-2 rounded-full ring-1 ring-neutral-200/50 dark:ring-neutral-800/50">
                    {products.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                idx === activeIndex 
                                    ? "w-6 bg-primary-500" 
                                    : "w-1.5 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600"
                            }`}
                            aria-label={`Go to item ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
