"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingBag, Flame } from "lucide-react";
import { useNavbar } from "@/components/Navbar/NavbarContext";
import { TRANSLATIONS, formatINR } from "@/utils/i18n";
import { useCart } from "@/components/Cart/CartContext";

/* ── Product data (mirrors ThriftCarousel data structure) ────────────────── */

interface TrendingProduct {
    id: string;
    nameKey: "prod1Name" | "prod2Name" | "prod3Name" | "prod4Name";
    descKey: "prod1Desc" | "prod2Desc" | "prod3Desc" | "prod4Desc";
    imagePath: string;
    accentHex: string;
    priceInRupees: number;
    size: string;
    brand: string;
    year: string;
    /** 0–5 demand score displayed as fire dots */
    hotness: 1 | 2 | 3 | 4 | 5;
}

const TRENDING_PRODUCTS: TrendingProduct[] = [
    {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        nameKey: "prod1Name",
        descKey: "prod1Desc",
        imagePath: "/products/vintage_tee.png",
        accentHex: "#ff5722",
        priceInRupees: 2900,
        size: "L",
        brand: "Champion (Classic)",
        year: "1994",
        hotness: 5,
    },
    {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
        nameKey: "prod2Name",
        descKey: "prod2Desc",
        imagePath: "/products/denim_jeans.png",
        accentHex: "#2b4c7e",
        priceInRupees: 4800,
        size: "32 × 30",
        brand: "Levi's (Curated)",
        year: "1988",
        hotness: 4,
    },
    {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13",
        nameKey: "prod3Name",
        descKey: "prod3Desc",
        imagePath: "/products/worker_shirt.png",
        accentHex: "#bcaaa4",
        priceInRupees: 3900,
        size: "M",
        brand: "Carhartt WIP",
        year: "1997",
        hotness: 4,
    },
    {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14",
        nameKey: "prod4Name",
        descKey: "prod4Desc",
        imagePath: "/products/cargo_pants.png",
        accentHex: "#4e5d44",
        priceInRupees: 4400,
        size: "30 × 32",
        brand: "Rothco Vintage",
        year: "1992",
        hotness: 3,
    },
    /* Repeat with slight variation to fill the strip nicely */
    {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        nameKey: "prod1Name",
        descKey: "prod1Desc",
        imagePath: "/products/vintage_tee.png",
        accentHex: "#ff5722",
        priceInRupees: 2700,
        size: "M",
        brand: "Champion (Classic)",
        year: "1996",
        hotness: 3,
    },
    {
        id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12",
        nameKey: "prod2Name",
        descKey: "prod2Desc",
        imagePath: "/products/denim_jeans.png",
        accentHex: "#2b4c7e",
        priceInRupees: 5100,
        size: "30 × 30",
        brand: "Levi's (Curated)",
        year: "1991",
        hotness: 5,
    },
];

/* ── Hotness indicator ───────────────────────────────────────────────────── */
function HotnessBar({ score }: { score: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Flame
                    key={i}
                    className={`w-3 h-3 transition-colors ${
                        i < score
                            ? "text-orange-500 fill-orange-500"
                            : "text-neutral-200 dark:text-neutral-700 fill-neutral-200 dark:fill-neutral-700"
                    }`}
                />
            ))}
        </div>
    );
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function TrendingCarousel() {
    const { locale } = useNavbar();
    const { addToCart, cartItems } = useCart();
    const t = TRANSLATIONS[locale];

    const stripRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft,  setCanScrollLeft]  = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [addedId, setAddedId] = useState<string | null>(null);

    /* ── Scroll helpers ── */
    const SCROLL_AMT = 340;

    const scrollBy = useCallback((dir: "left" | "right") => {
        stripRef.current?.scrollBy({
            left: dir === "left" ? -SCROLL_AMT : SCROLL_AMT,
            behavior: "smooth",
        });
    }, []);

    const syncButtons = useCallback(() => {
        const el = stripRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, []);

    useEffect(() => {
        const el = stripRef.current;
        if (!el) return;
        syncButtons();
        el.addEventListener("scroll", syncButtons, { passive: true });
        window.addEventListener("resize", syncButtons);
        return () => {
            el.removeEventListener("scroll", syncButtons);
            window.removeEventListener("resize", syncButtons);
        };
    }, [syncButtons]);

    /* ── Add-to-cart flash ── */
    const handleClaim = (prod: TrendingProduct) => {
        const exists = cartItems.some((item) => item.id === prod.id);
        if (exists) {
            alert("This item is already in your cart!");
            return;
        }
        addToCart({
            id: prod.id,
            nameKey: prod.nameKey,
            descKey: prod.descKey,
            imagePath: prod.imagePath,
            priceInRupees: prod.priceInRupees,
            size: prod.size,
            brand: prod.brand,
            colorHex: prod.accentHex
        });
        setAddedId(prod.id);
        setTimeout(() => setAddedId(null), 1800);
    };

    return (
        <div className="relative">
            {/* ── Arrow buttons ── */}
            <button
                onClick={() => scrollBy("left")}
                disabled={!canScrollLeft}
                className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-md text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-95 transition-all disabled:opacity-0 disabled:pointer-events-none"
                aria-label="Scroll left"
            >
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <button
                onClick={() => scrollBy("right")}
                disabled={!canScrollRight}
                className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-md text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-95 transition-all disabled:opacity-0 disabled:pointer-events-none"
                aria-label="Scroll right"
            >
                <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* ── Scroll strip ── */}
            <div
                ref={stripRef}
                className="flex gap-4 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory hide-scrollbar"
                style={{ scrollbarWidth: "none" }}
            >
                {TRENDING_PRODUCTS.map((prod, rank) => (
                    <article
                        key={`${prod.id}-${rank}`}
                        className="group relative flex-shrink-0 w-64 sm:w-72 snap-start rounded-2xl bg-white dark:bg-neutral-900 ring-1 ring-neutral-200/70 dark:ring-neutral-800/70 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                    >
                        {/* Rank badge */}
                        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-950/70 dark:bg-white/10 backdrop-blur-sm text-white text-[10px] font-black tracking-widest">
                            #{rank + 1}
                        </div>

                        {/* Product image area */}
                        <Link
                            href={`/product/${prod.id}`}
                            className="relative h-52 flex items-center justify-center overflow-hidden cursor-pointer"
                            style={{ background: `${prod.accentHex}12` }}
                        >
                            {/* Ambient glow */}
                            <div
                                className="absolute inset-0 opacity-20 blur-2xl scale-75 transition-opacity duration-500 group-hover:opacity-30"
                                style={{ backgroundColor: prod.accentHex }}
                            />
                            <img
                                src={prod.imagePath}
                                alt={t[prod.nameKey]}
                                draggable="false"
                                className="relative z-10 h-40 w-auto object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500 select-none"
                            />
                        </Link>

                        {/* Info panel */}
                        <div className="p-4 space-y-3">
                            {/* Hotness + year chip */}
                            <div className="flex items-center justify-between">
                                <HotnessBar score={prod.hotness} />
                                <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                                    {prod.year}
                                </span>
                            </div>

                            {/* Name */}
                            <div>
                                <Link href={`/product/${prod.id}`}>
                                    <p className="text-sm font-extrabold text-neutral-900 dark:text-white leading-tight line-clamp-1 hover:text-primary-500 transition-colors cursor-pointer">
                                        {t[prod.nameKey]}
                                    </p>
                                </Link>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                                    {prod.brand}
                                </p>
                            </div>

                            {/* Size pill */}
                            <div className="flex flex-wrap gap-1.5">
                                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 ring-1 ring-neutral-200 dark:ring-neutral-700">
                                    {t.cardSize}: {prod.size}
                                </span>
                            </div>

                            {/* Price + CTA */}
                            <div className="flex items-center justify-between pt-1 border-t border-neutral-100 dark:border-neutral-800">
                                <p className="text-lg font-black text-neutral-950 dark:text-white tracking-tight">
                                    {formatINR(prod.priceInRupees)}
                                </p>
                                <button
                                    id={`trending-claim-${prod.id}`}
                                    onClick={() => handleClaim(prod)}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                                        addedId === prod.id
                                            ? "bg-green-500 text-white shadow-md shadow-green-500/20"
                                            : "bg-primary-500 hover:bg-primary-400 text-white shadow-md shadow-primary-500/20"
                                    }`}
                                >
                                    <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
                                    {addedId === prod.id ? "✓ Added!" : t.cardBtnClaim}
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}
