"use client";

import React, { useState, use, useMemo } from "react";
import Link from "next/link";
import { useCart } from "@/components/Cart/CartContext";
import { useNavbar } from "@/components/Navbar/NavbarContext";
import { TRANSLATIONS, formatINR } from "@/utils/i18n";
import { PRODUCTS, CATEGORIES_META, Product, ProductVariant } from "@/utils/catalog";
import Typography from "@/components/Typography";
import { 
    Search, 
    SlidersHorizontal, 
    ArrowUpDown, 
    ShoppingBag, 
    ChevronRight,
    Flame,
    X,
    Sparkles
} from "lucide-react";

interface CategoryPageProps {
    params: Promise<{ category: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
    const { category: categorySlug } = use(params);
    const { locale } = useNavbar();
    const t = TRANSLATIONS[locale];
    const { addToCart, cartItems } = useCart();

    // Filters state
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [selectedColors, setSelectedColors] = useState<string[]>([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("hotness");
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Dynamic list of unique sizes from all variants in catalog
    const allSizes = useMemo(() => {
        const sizes = new Set<string>();
        PRODUCTS.forEach(p => p.variants.forEach(v => sizes.add(v.size)));
        return Array.from(sizes).sort();
    }, []);

    // Dynamic list of unique colors from all variants in catalog
    const allColors = useMemo(() => {
        const colorsMap = new Map<string, string>(); // colorName -> colorHex
        PRODUCTS.forEach(p => p.variants.forEach(v => colorsMap.set(v.colorName, v.colorHex)));
        return Array.from(colorsMap.entries()).map(([name, hex]) => ({ name, hex }));
    }, []);

    // Filter & Sort logic
    const filteredProductsWithVariants = useMemo(() => {
        const list: { product: Product; variant: ProductVariant }[] = [];

        PRODUCTS.forEach((product) => {
            // Category check
            if (categorySlug !== "all" && product.category !== categorySlug) {
                return;
            }

            // Search query check
            if (searchQuery.trim() !== "") {
                const query = searchQuery.toLowerCase();
                const name = (t[product.nameKey as keyof typeof t] || product.nameKey).toLowerCase();
                const brand = product.brand.toLowerCase();
                if (!name.includes(query) && !brand.includes(query)) {
                    return;
                }
            }

            // Check if any variants match filters
            const matchingVariants = product.variants.filter((variant) => {
                // Size filter
                if (selectedSizes.length > 0 && !selectedSizes.includes(variant.size)) {
                    return false;
                }

                // Color filter
                if (selectedColors.length > 0 && !selectedColors.includes(variant.colorName)) {
                    return false;
                }

                // Price filter
                if (selectedPriceRange !== "all") {
                    const price = variant.priceInRupees;
                    if (selectedPriceRange === "under3500" && price >= 3500) return false;
                    if (selectedPriceRange === "3500to5000" && (price < 3500 || price > 5000)) return false;
                    if (selectedPriceRange === "over5000" && price <= 5000) return false;
                }

                return true;
            });

            // If variants match, display the product using the first matching variant
            if (matchingVariants.length > 0) {
                list.push({ product, variant: matchingVariants[0] });
            }
        });

        // Sort items
        return list.sort((a, b) => {
            if (sortBy === "priceAsc") {
                return a.variant.priceInRupees - b.variant.priceInRupees;
            }
            if (sortBy === "priceDesc") {
                return b.variant.priceInRupees - a.variant.priceInRupees;
            }
            // default: hotness
            return b.variant.hotness - a.variant.hotness;
        });
    }, [categorySlug, searchQuery, selectedSizes, selectedColors, selectedPriceRange, sortBy, locale]);

    const handleSizeToggle = (size: string) => {
        setSelectedSizes(prev => 
            prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
        );
    };

    const handleColorToggle = (colorName: string) => {
        setSelectedColors(prev =>
            prev.includes(colorName) ? prev.filter(c => c !== colorName) : [...prev, colorName]
        );
    };

    const clearAllFilters = () => {
        setSearchQuery("");
        setSelectedSizes([]);
        setSelectedColors([]);
        setSelectedPriceRange("all");
        setSortBy("hotness");
    };

    // Hotness indicator helper
    const HotnessStars = ({ score }: { score: number }) => {
        return (
            <div className="flex items-center gap-0.5" aria-label={`Demand hotness: ${score}/5`}>
                {Array.from({ length: 5 }).map((_, i) => (
                    <Flame
                        key={i}
                        className={`w-3 h-3 ${
                            i < score
                                ? "text-orange-500 fill-orange-500"
                                : "text-neutral-200 dark:text-neutral-800 fill-neutral-200 dark:fill-neutral-800"
                        }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <main className="flex-1 bg-white dark:bg-neutral-950 pb-24 pt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* ── Breadcrumb ── */}
                <nav className="flex items-center gap-2 text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-6 text-left">
                    <Link href="/" className="hover:text-primary-500 transition-colors">
                        {t.navHome}
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-neutral-900 dark:text-white">
                        {t.catalogTitle}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-primary-500">
                        {categorySlug === "all" ? "All Collections" : t[CATEGORIES_META[categorySlug as keyof typeof CATEGORIES_META]?.labelKey as keyof typeof t] || categorySlug}
                    </span>
                </nav>

                {/* ── Title Header ── */}
                <div className="mb-10 text-left">
                    <Typography variant="overline" color="primary">
                        {t.browseCategories}
                    </Typography>
                    <Typography variant="h1" className="text-neutral-950 dark:text-white font-black tracking-tight mt-1 capitalize">
                        {categorySlug === "all" ? t.browseCategories : t[CATEGORIES_META[categorySlug as keyof typeof CATEGORIES_META]?.labelKey as keyof typeof t] || categorySlug}
                    </Typography>
                </div>

                {/* ── Topbar Search & Sort controls ── */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-5 border-b border-neutral-100 dark:border-neutral-900">
                    {/* Search Field */}
                    <div className="relative flex-1 max-w-md">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                            <Search className="w-4 h-4" />
                        </span>
                        <input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-3 text-sm bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all text-neutral-900 dark:text-white"
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery("")}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
                            >
                                <X className="w-4.5 h-4.5" />
                            </button>
                        )}
                    </div>

                    {/* Sorting & Mobile Filter Toggle */}
                    <div className="flex items-center gap-3 justify-between md:justify-end">
                        {/* Mobile filter toggle */}
                        <button
                            onClick={() => setMobileFiltersOpen(true)}
                            className="lg:hidden inline-flex items-center gap-2 px-4 py-3 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-bold text-neutral-700 dark:text-neutral-300 rounded-xl"
                        >
                            <SlidersHorizontal className="w-4 h-4" />
                            Filters
                        </button>

                        {/* Sort Dropdown */}
                        <div className="flex items-center gap-2">
                            <label htmlFor="catalog-sort" className="text-xs font-bold text-neutral-400 flex items-center gap-1">
                                <ArrowUpDown className="w-3.5 h-3.5" />
                                {t.sortBy}:
                            </label>
                            <select
                                id="catalog-sort"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-xs font-bold text-neutral-800 dark:text-neutral-200 focus:outline-none cursor-pointer"
                            >
                                <option value="hotness">Highest Demand</option>
                                <option value="priceAsc">Price: Low to High</option>
                                <option value="priceDesc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* ── Main Catalog Grid ── */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
                    
                    {/* ── Side Filters Panel (Desktop) (1 col) ── */}
                    <aside className="hidden lg:block space-y-8 text-left border-r border-neutral-100 dark:border-neutral-900 pr-8">
                        {/* Category links */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                                Categories
                            </h3>
                            <ul className="space-y-2 text-sm font-bold">
                                {Object.entries(CATEGORIES_META).map(([slug, meta]) => {
                                    const active = categorySlug === slug;
                                    const label = t[meta.labelKey as keyof typeof t] || meta.labelKey;
                                    return (
                                        <li key={slug}>
                                            <Link
                                                href={meta.href}
                                                className={`block py-1 transition-colors ${
                                                    active 
                                                        ? "text-primary-500" 
                                                        : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                                                }`}
                                            >
                                                {label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Sizes filter */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                                {t.filterSize}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {allSizes.map((size) => {
                                    const selected = selectedSizes.includes(size);
                                    return (
                                        <button
                                            key={size}
                                            onClick={() => handleSizeToggle(size)}
                                            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                                                selected
                                                    ? "bg-primary-500 border-primary-500 text-white"
                                                    : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700"
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Color filter */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                                Colors
                            </h3>
                            <div className="flex flex-wrap gap-2.5">
                                {allColors.map((color) => {
                                    const selected = selectedColors.includes(color.name);
                                    return (
                                        <button
                                            key={color.name}
                                            onClick={() => handleColorToggle(color.name)}
                                            className={`w-7 h-7 rounded-full border transition-all relative flex items-center justify-center cursor-pointer ${
                                                selected
                                                    ? "border-primary-500 scale-110 ring-2 ring-primary-500/20"
                                                    : "border-neutral-200 dark:border-neutral-800 hover:scale-105"
                                            }`}
                                            style={{ backgroundColor: color.hex }}
                                            title={color.name}
                                        >
                                            {selected && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-white mix-blend-difference" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Price Range filter */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                                {t.filterPrice}
                            </h3>
                            <div className="space-y-2 text-xs font-bold text-neutral-600 dark:text-neutral-400">
                                {[
                                    { label: "All Prices", value: "all" },
                                    { label: "Under ₹3,500", value: "under3500" },
                                    { label: "₹3,500 – ₹5,000", value: "3500to5000" },
                                    { label: "Over ₹5,000", value: "over5000" },
                                ].map((opt) => (
                                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer select-none">
                                        <input
                                            type="radio"
                                            name="desktop-price"
                                            value={opt.value}
                                            checked={selectedPriceRange === opt.value}
                                            onChange={() => setSelectedPriceRange(opt.value)}
                                            className="text-primary-500 focus:ring-0 focus:ring-offset-0 border-neutral-300 dark:border-neutral-800 cursor-pointer"
                                        />
                                        <span>{opt.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Reset Filters button */}
                        {(selectedSizes.length > 0 || selectedColors.length > 0 || selectedPriceRange !== "all" || searchQuery !== "") && (
                            <button
                                onClick={clearAllFilters}
                                className="w-full text-center py-2.5 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 text-xs font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-all cursor-pointer"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </aside>

                    {/* ── Products Display Grid (3 cols) ── */}
                    <div className="lg:col-span-3">
                        {filteredProductsWithVariants.length === 0 ? (
                            <div className="py-20 text-center space-y-4 max-w-md mx-auto border border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl bg-neutral-50/50 dark:bg-neutral-900/10">
                                <SlidersHorizontal className="w-10 h-10 text-neutral-400 mx-auto" />
                                <div className="space-y-1">
                                    <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                                        No vintage pieces found
                                    </h3>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-500">
                                        Try adjusting your keywords, sizing, color selection, or price filters.
                                    </p>
                                </div>
                                <button
                                    onClick={clearAllFilters}
                                    className="px-5 py-2.5 bg-neutral-900 text-white dark:bg-neutral-800 text-xs font-bold rounded-xl hover:bg-neutral-800 cursor-pointer"
                                >
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                {filteredProductsWithVariants.map(({ product, variant }) => {
                                    const inCart = cartItems.some(i => i.id === variant.sku);
                                    return (
                                        <article
                                            key={variant.sku}
                                            className="group relative flex flex-col rounded-2xl bg-white dark:bg-neutral-900 ring-1 ring-neutral-200/60 dark:ring-neutral-800/60 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden text-left"
                                        >
                                            {/* Category/Rank tag */}
                                            <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
                                                <span className="px-2 py-0.5 rounded-full bg-neutral-950/70 dark:bg-white/10 backdrop-blur-sm text-white text-[9px] font-black tracking-widest uppercase">
                                                    {product.year}
                                                </span>
                                            </div>

                                            {/* Link wrapper around Image */}
                                            <Link
                                                href={`/product/${product.id}`}
                                                className="relative h-56 flex items-center justify-center overflow-hidden cursor-pointer"
                                                style={{ background: `${variant.colorHex}0c` }}
                                            >
                                                {/* Color glow */}
                                                <div
                                                    className="absolute inset-0 opacity-10 blur-xl scale-75 transition-opacity duration-500 group-hover:opacity-20"
                                                    style={{ backgroundColor: variant.colorHex }}
                                                />
                                                <img
                                                    src={variant.imagePath}
                                                    alt={t[product.nameKey as keyof typeof t] || product.nameKey}
                                                    draggable="false"
                                                    className="relative z-10 h-40 w-auto object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500 select-none"
                                                />
                                            </Link>

                                            {/* Info block */}
                                            <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <HotnessStars score={variant.hotness} />
                                                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                                            {product.brand}
                                                        </span>
                                                    </div>

                                                    <Link href={`/product/${product.id}`}>
                                                        <h4 className="text-sm font-extrabold text-neutral-900 dark:text-white leading-tight line-clamp-1 hover:text-primary-500 transition-colors cursor-pointer">
                                                            {t[product.nameKey as keyof typeof t] || product.nameKey}
                                                        </h4>
                                                    </Link>
                                                    
                                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                                                        {t[product.descKey as keyof typeof t] || product.descKey}
                                                    </p>
                                                </div>

                                                <div className="space-y-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                                                    {/* Size & color badges */}
                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                                                            {t.cardSize}: {variant.size}
                                                        </span>
                                                        <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 lowercase">
                                                            {variant.colorName}
                                                        </span>
                                                    </div>

                                                    {/* Price + Add to cart */}
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-base font-black text-neutral-950 dark:text-white tracking-tight">
                                                            {formatINR(variant.priceInRupees)}
                                                        </p>
                                                        
                                                        <button
                                                            onClick={() => addToCart({
                                                                id: variant.sku,
                                                                productId: product.id,
                                                                nameKey: product.nameKey,
                                                                descKey: product.descKey,
                                                                imagePath: variant.imagePath,
                                                                priceInRupees: variant.priceInRupees,
                                                                size: variant.size,
                                                                brand: product.brand,
                                                                colorHex: variant.colorHex,
                                                                colorName: variant.colorName,
                                                            })}
                                                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all active:scale-95 cursor-pointer ${
                                                                inCart
                                                                    ? "bg-green-500 text-white shadow-md shadow-green-500/20"
                                                                    : "bg-primary-500 hover:bg-primary-400 text-white shadow-md shadow-primary-500/20"
                                                            }`}
                                                        >
                                                            <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
                                                            {inCart ? "✓ Reserved" : t.cardBtnClaim}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* ── MOBILE FILTERS SIDE DRAWER ── */}
            {mobileFiltersOpen && (
                <div className="relative z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                    <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
                        <div className="w-screen max-w-xs bg-white dark:bg-neutral-950 p-6 flex flex-col justify-between overflow-y-auto">
                            <div className="space-y-6 text-left">
                                <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-900">
                                    <h2 className="text-sm font-black uppercase tracking-wider text-neutral-950 dark:text-white">
                                        Filters
                                    </h2>
                                    <button 
                                        onClick={() => setMobileFiltersOpen(false)}
                                        className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-neutral-500 hover:text-neutral-800 cursor-pointer"
                                    >
                                        <X className="w-4.5 h-4.5" />
                                    </button>
                                </div>

                                {/* Category Links */}
                                <div className="space-y-3">
                                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-400">
                                        Categories
                                    </h3>
                                    <ul className="space-y-2 text-sm font-bold">
                                        {Object.entries(CATEGORIES_META).map(([slug, meta]) => {
                                            const active = categorySlug === slug;
                                            return (
                                                <li key={slug}>
                                                    <Link
                                                        href={meta.href}
                                                        onClick={() => setMobileFiltersOpen(false)}
                                                        className={`block py-0.5 ${
                                                            active ? "text-primary-500" : "text-neutral-600 dark:text-neutral-400"
                                                        }`}
                                                    >
                                                        {t[meta.labelKey as keyof typeof t] || meta.labelKey}
                                                    </Link>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>

                                {/* Sizing */}
                                <div className="space-y-3">
                                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-400">
                                        {t.filterSize}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {allSizes.map((size) => {
                                            const selected = selectedSizes.includes(size);
                                            return (
                                                <button
                                                    key={size}
                                                    onClick={() => handleSizeToggle(size)}
                                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                                                        selected
                                                            ? "bg-primary-500 border-primary-500 text-white"
                                                            : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-850 text-neutral-700 dark:text-neutral-350"
                                                    }`}
                                                >
                                                    {size}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Colors */}
                                <div className="space-y-3">
                                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-400">
                                        Colors
                                    </h3>
                                    <div className="flex flex-wrap gap-2.5">
                                        {allColors.map((color) => {
                                            const selected = selectedColors.includes(color.name);
                                            return (
                                                <button
                                                    key={color.name}
                                                    onClick={() => handleColorToggle(color.name)}
                                                    className={`w-7 h-7 rounded-full border transition-all relative flex items-center justify-center cursor-pointer ${
                                                        selected
                                                            ? "border-primary-500 scale-110 ring-2 ring-primary-500/20"
                                                            : "border-neutral-200 dark:border-neutral-850 hover:scale-105"
                                                    }`}
                                                    style={{ backgroundColor: color.hex }}
                                                    title={color.name}
                                                >
                                                    {selected && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-white mix-blend-difference" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Price Ranges */}
                                <div className="space-y-3">
                                    <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-400">
                                        {t.filterPrice}
                                    </h3>
                                    <div className="space-y-2 text-xs font-bold text-neutral-600 dark:text-neutral-450">
                                        {[
                                            { label: "All Prices", value: "all" },
                                            { label: "Under ₹3,500", value: "under3500" },
                                            { label: "₹3,500 – ₹5,000", value: "3500to5000" },
                                            { label: "Over ₹5,000", value: "over5000" },
                                        ].map((opt) => (
                                            <label key={opt.value} className="flex items-center gap-2 cursor-pointer select-none">
                                                <input
                                                    type="radio"
                                                    name="mobile-price"
                                                    value={opt.value}
                                                    checked={selectedPriceRange === opt.value}
                                                    onChange={() => setSelectedPriceRange(opt.value)}
                                                    className="text-primary-500 border-neutral-300 dark:border-neutral-800"
                                                />
                                                <span>{opt.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Sticky mobile actions */}
                            <div className="pt-6 border-t border-neutral-100 dark:border-neutral-900 mt-6 space-y-2.5">
                                <button
                                    onClick={() => setMobileFiltersOpen(false)}
                                    className="w-full text-center py-3 bg-primary-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                                >
                                    Apply Filters
                                </button>
                                <button
                                    onClick={() => {
                                        clearAllFilters();
                                        setMobileFiltersOpen(false);
                                    }}
                                    className="w-full text-center py-3 border border-neutral-200 dark:border-neutral-800 text-xs font-bold rounded-xl text-neutral-500 cursor-pointer"
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
