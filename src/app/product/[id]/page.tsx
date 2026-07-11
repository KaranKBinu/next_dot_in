"use client";

import React, { use, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/components/Cart/CartContext";
import { useNavbar } from "@/components/Navbar/NavbarContext";
import { TRANSLATIONS, formatINR } from "@/utils/i18n";
import { PRODUCTS, CATEGORIES_META, Product, ProductVariant } from "@/utils/catalog";
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
    CheckCircle,
    Loader2,
    X
} from "lucide-react";

// Shape coming back from /api/products
interface DbProduct {
    id: string;
    parentProductId: string | null;
    sku: string;
    name: string;
    description: string;
    brand: string;
    year: string;
    category: string;
    material: string;
    size: string;
    colorName: string;
    colorHex: string;
    priceInRupees: number;
    imagePath: string;
    chestInch: string;
    lengthInch: string;
    shoulderInch: string;
    condition: string;
    hotness: number;
    stockQuantity: number;
}

/** Map and group flat DB product rows by parentProductId (or id if null) */
function groupDbProducts(data: DbProduct[]): { product: Product; variant: ProductVariant }[] {
    const groups: { [key: string]: DbProduct[] } = {};
    data.forEach((p) => {
        const key = p.parentProductId || p.id;
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(p);
    });

    const result: { product: Product; variant: ProductVariant }[] = [];
    Object.entries(groups).forEach(([groupId, items]) => {
        const variants: ProductVariant[] = items.map((p) => ({
            sku: p.sku,
            size: p.size,
            colorName: p.colorName,
            colorHex: p.colorHex,
            priceInRupees: p.priceInRupees,
            imagePath: p.imagePath,
            measurements: { chest: p.chestInch, length: p.lengthInch, shoulder: p.shoulderInch },
            conditionKey: (p.condition as ProductVariant["conditionKey"]) || "condVeryGood",
            hotness: (Math.min(5, Math.max(1, p.hotness)) as 1 | 2 | 3 | 4 | 5),
            stockQuantity: p.stockQuantity,
        }));

        const primaryItem = items[0];
        const primaryVariant = variants[0];

        const product: Product = {
            id: groupId,
            nameKey: primaryItem.name,
            descKey: primaryItem.description,
            brand: primaryItem.brand,
            year: primaryItem.year,
            category: primaryItem.category as Product["category"],
            materialKey: "matCotton" as Product["materialKey"],
            variants: variants,
            sku: primaryVariant.sku,
            size: primaryVariant.size,
            colorName: primaryVariant.colorName,
            colorHex: primaryVariant.colorHex,
            priceInRupees: primaryVariant.priceInRupees,
            imagePath: primaryVariant.imagePath,
            measurements: primaryVariant.measurements,
            conditionKey: primaryVariant.conditionKey,
            hotness: primaryVariant.hotness,
            stockQuantity: primaryVariant.stockQuantity,
        };

        result.push({ product, variant: primaryVariant });
    });

    return result;
}

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
    const { id: productId } = use(params);
    const { locale } = useNavbar();
    const t = TRANSLATIONS[locale];
    const { addToCart, cartItems, reservationCode } = useCart();
    
    // Accordion states
    const [activeTab, setActiveTab] = useState<"details" | "measurements" | "eco">("details");

    // DB products state
    const [dbProducts, setDbProducts] = useState<{ product: Product; variant: ProductVariant }[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    useEffect(() => {
        fetch("/api/products")
            .then((r) => r.json())
            .then((data: DbProduct[]) => {
                setDbProducts(groupDbProducts(data));
            })
            .catch((err) => console.error("Failed to load DB products:", err))
            .finally(() => setLoadingProducts(false));
    }, []);

    // Merged product list (DB + static PRODUCTS fallback)
    const dbSkus = useMemo(() => new Set(dbProducts.map((e) => e.variant.sku)), [dbProducts]);
    const allProductEntries = useMemo(() => {
        const staticEntries = PRODUCTS
            .filter((p) => !dbSkus.has(p.sku))
            .map((p) => ({ product: p, variant: p.variants[0] }));
        return [...dbProducts, ...staticEntries];
    }, [dbProducts, dbSkus]);

    // Find the product matching the current URL ID
    const product = useMemo(() => {
        const found = allProductEntries.find(e => e.product.id === productId);
        return found ? found.product : null;
    }, [allProductEntries, productId]);

    // Active variant state (initialized to first variant of the product)
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

    // Initialize selectedVariant on client once product is resolved
    useEffect(() => {
        if (product) {
            setSelectedVariant(product.variants[0]);
        }
    }, [product]);

    // Fetch related products (same category, excluding current)
    const relatedProducts = useMemo(() => {
        if (!product) return [];
        return allProductEntries
            .filter(e => e.product.category === product.category && e.product.id !== product.id)
            .map(e => e.product)
            .slice(0, 4);
    }, [product, allProductEntries]);

    // Calculate unique colors for swatches
    const colors = useMemo(() => {
        if (!product) return [];
        const seen = new Set<string>();
        const res: { name: string; hex: string }[] = [];
        product.variants.forEach(v => {
            if (!seen.has(v.colorName)) {
                seen.add(v.colorName);
                res.push({ name: v.colorName, hex: v.colorHex });
            }
        });
        return res;
    }, [product]);

    if (loadingProducts) {
        return (
            <main className="flex-1 bg-white dark:bg-neutral-950 py-24 text-center space-y-4 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                <p className="text-xs font-bold text-neutral-500">Loading product details...</p>
            </main>
        );
    }

    if (!product || !selectedVariant) {
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

    const inCart = cartItems.some(i => i.id === selectedVariant.sku);

    const handleClaim = () => {
        addToCart({
            id: selectedVariant.sku,
            productId: product.id,
            nameKey: product.nameKey,
            descKey: product.descKey,
            imagePath: selectedVariant.imagePath,
            priceInRupees: selectedVariant.priceInRupees,
            size: selectedVariant.size,
            brand: product.brand,
            colorHex: selectedVariant.colorHex,
            colorName: selectedVariant.colorName,
        });
    };

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
                            style={{ backgroundColor: `${selectedVariant.colorHex}0c` }}
                        >
                            {/* Ambient Glow */}
                            <div 
                                className="absolute inset-0 opacity-15 blur-[120px] scale-90"
                                style={{ backgroundColor: selectedVariant.colorHex }}
                            />
                            
                            {/* Unique Badging */}
                            <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-neutral-950/80 dark:bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-neutral-800 dark:border-neutral-700">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
                                <span className="text-[10px] font-black tracking-widest text-white uppercase">
                                    Grade A Certified
                                </span>
                            </div>

                            <img 
                                src={selectedVariant.imagePath} 
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

                        {/* ── Variant Selectors (Color & Size Swatches) ── */}
                        {product.variants.length > 1 && (
                            <div className="space-y-5 py-5 border-y border-neutral-100 dark:border-neutral-900 text-left">
                                {/* Color Swatch Selector */}
                                <div className="space-y-2.5">
                                    <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest block">
                                        Color: <span className="text-neutral-800 dark:text-neutral-200 lowercase font-black">{selectedVariant.colorName}</span>
                                    </span>
                                    <div className="flex flex-wrap gap-3">
                                        {colors.map((c) => {
                                            const isActive = selectedVariant.colorName === c.name;
                                            return (
                                                <button
                                                    key={c.name}
                                                    onClick={() => {
                                                        // Switch to first variant matching this color
                                                        const match = product.variants.find(v => v.colorName === c.name);
                                                        if (match) setSelectedVariant(match);
                                                    }}
                                                    className={`w-8 h-8 rounded-full border-2 transition-all relative flex items-center justify-center cursor-pointer active:scale-90 ${
                                                        isActive 
                                                            ? "border-primary-500 scale-110 shadow-md ring-2 ring-primary-500/20" 
                                                            : "border-neutral-200/60 dark:border-neutral-800 hover:scale-105"
                                                    }`}
                                                    style={{ backgroundColor: c.hex }}
                                                    title={c.name}
                                                >
                                                    {isActive && (
                                                        <span className="w-1.5 h-1.5 rounded-full bg-white mix-blend-difference" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Size Swatch Selector */}
                                <div className="space-y-2.5">
                                    <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest block">
                                        Size: <span className="text-neutral-800 dark:text-neutral-200 font-black">{selectedVariant.size}</span>
                                    </span>
                                    <div className="flex flex-wrap gap-2.5">
                                        {product.variants
                                            .filter(v => v.colorName === selectedVariant.colorName)
                                            .map((v) => {
                                                const isActive = selectedVariant.sku === v.sku;
                                                return (
                                                    <button
                                                        key={v.sku}
                                                        onClick={() => setSelectedVariant(v)}
                                                        className={`px-4 py-2.5 text-xs font-black rounded-xl border transition-all cursor-pointer active:scale-95 ${
                                                            isActive
                                                                ? "bg-primary-500 border-primary-500 text-white shadow-md shadow-primary-500/10"
                                                                : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700"
                                                        }`}
                                                    >
                                                        {v.size}
                                                    </button>
                                                );
                                            })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Price Area */}
                        <div className="py-4 border-b border-neutral-100 dark:border-neutral-900 flex items-end justify-between">
                            <div>
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-0.5">
                                    {t.cardPrice}
                                </span>
                                <span className="text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
                                    {formatINR(selectedVariant.priceInRupees)}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-0.5">
                                    Availability
                                </span>
                                {selectedVariant.stockQuantity > 0 ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-extrabold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-full">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        Only {selectedVariant.stockQuantity} Left!
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-extrabold bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-full">
                                        <X className="w-3.5 h-3.5" />
                                        Out of Stock
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleClaim}
                                    disabled={selectedVariant.stockQuantity <= 0}
                                    className={`flex-1 inline-flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-extrabold transition-all cursor-pointer ${
                                        selectedVariant.stockQuantity <= 0
                                            ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                                            : inCart
                                                ? "bg-green-500 hover:bg-green-400 text-white shadow-lg shadow-green-500/25 active:scale-95"
                                                : "bg-primary-500 hover:bg-primary-400 text-white shadow-lg shadow-primary-500/25 active:scale-95"
                                    }`}
                                >
                                    <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                                    {selectedVariant.stockQuantity <= 0 ? "Out of Stock" : inCart ? `Added to Cart` : t.cardBtnClaim}
                                </button>
                                <Link
                                    href={selectedVariant.stockQuantity > 0 ? `/checkout?sku=${selectedVariant.sku}` : "#"}
                                    className={`flex-1 inline-flex items-center justify-center gap-2 py-4 text-white text-sm font-extrabold rounded-xl transition-all cursor-pointer shadow-lg shadow-neutral-900/10 ${
                                        selectedVariant.stockQuantity <= 0
                                            ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 pointer-events-none cursor-not-allowed"
                                            : "bg-neutral-950 hover:bg-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-700 active:scale-95"
                                    }`}
                                >
                                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                                    Buy Now (Direct)
                                </Link>
                            </div>
                            {inCart && (
                                <Link 
                                    href="/cart"
                                    className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                                >
                                    <span>This item is in your cart. View Cart</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
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
                                            <span className="font-semibold text-neutral-800 dark:text-neutral-200">{t[selectedVariant.conditionKey]}</span>
                                            
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
                                                <span className="font-extrabold text-sm text-neutral-850 dark:text-white">{selectedVariant.measurements.chest}</span>
                                            </div>
                                            <div className="p-2.5 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-900">
                                                <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Length (Shoulder-to-hem)</span>
                                                <span className="font-extrabold text-sm text-neutral-850 dark:text-white">{selectedVariant.measurements.length}</span>
                                            </div>
                                            <div className="p-2.5 bg-white dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-900">
                                                <span className="block text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Shoulder width</span>
                                                <span className="font-extrabold text-sm text-neutral-850 dark:text-white">{selectedVariant.measurements.shoulder}</span>
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
                                const relInCart = cartItems.some(i => i.id === p.sku);
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
                                                    onClick={() => addToCart({
                                                        id: p.sku,
                                                        productId: p.id,
                                                        nameKey: p.nameKey,
                                                        descKey: p.descKey,
                                                        imagePath: p.imagePath,
                                                        priceInRupees: p.priceInRupees,
                                                        size: p.size,
                                                        brand: p.brand,
                                                        colorHex: p.colorHex,
                                                        colorName: p.colorName,
                                                    })}
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
