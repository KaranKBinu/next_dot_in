"use client";

import React, { useState } from "react";
import Link from "next/link";
import ThriftCarousel from "@/components/Home/ThriftCarousel";
import TrendingCarousel from "@/components/Home/TrendingCarousel";
import Typography from "@/components/Typography";
import { useNavbar } from "@/components/Navbar/NavbarContext";
import { TRANSLATIONS } from "@/utils/i18n";
import { 
    Sparkles, 
    ArrowRight, 
    ShieldCheck, 
    Heart, 
    Leaf, 
    Bell, 
    Users, 
    Star, 
    Package, 
    ChevronDown, 
    ChevronUp, 
    Quote,
    CheckCircle2
} from "lucide-react";

/* ─────────────────────────────────────────────────────────────────────────────
   DATA MODELS
───────────────────────────────────────────────────────────────────────────── */

interface Category {
    id: string;
    slug: string;
    titleKey: "catTeesTitle" | "catDenimTitle" | "catKnitsTitle" | "catCargoTitle";
    descKey: "catTeesDesc" | "catDenimDesc" | "catKnitsDesc" | "catCargoDesc";
    imagePath: string;
    href: string;
    itemCount: number;
}

interface StatItem {
    value: string;
    labelKey: "statDrops" | "statSellers" | "statRating";
    icon: React.ElementType;
}

interface ValueProp {
    id: string;
    titleKey: "valueProp1Title" | "valueProp2Title" | "valueProp3Title";
    descKey: "valueProp1Desc" | "valueProp2Desc" | "valueProp3Desc";
    icon: React.ElementType;
}

// ── Static data ──────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
    {
        id: "cat-tees",
        slug: "tees",
        titleKey: "catTeesTitle",
        descKey: "catTeesDesc",
        imagePath: "/categories/retro_tees_cat.png",
        href: "/catalog/tees",
        itemCount: 214,
    },
    {
        id: "cat-denim",
        slug: "denim",
        titleKey: "catDenimTitle",
        descKey: "catDenimDesc",
        imagePath: "/categories/denim_jeans_cat.png",
        href: "/catalog/denim",
        itemCount: 138,
    },
    {
        id: "cat-knits",
        slug: "knits",
        titleKey: "catKnitsTitle",
        descKey: "catKnitsDesc",
        imagePath: "/categories/knits_sweaters_cat.png",
        href: "/catalog/knits",
        itemCount: 97,
    },
    {
        id: "cat-cargo",
        slug: "cargo",
        titleKey: "catCargoTitle",
        descKey: "catCargoDesc",
        imagePath: "/categories/cargo_outerwear_cat.png",
        href: "/catalog/cargo",
        itemCount: 76,
    },
];

const STATS: StatItem[] = [
    { value: "15k+", labelKey: "statDrops", icon: Package },
    { value: "9.8k", labelKey: "statSellers", icon: Users },
    { value: "99.4%", labelKey: "statRating", icon: Star },
];

const VALUE_PROPS: ValueProp[] = [
    { id: "vp-1", titleKey: "valueProp1Title", descKey: "valueProp1Desc", icon: ShieldCheck },
    { id: "vp-2", titleKey: "valueProp2Title", descKey: "valueProp2Desc", icon: Leaf },
    { id: "vp-3", titleKey: "valueProp3Title", descKey: "valueProp3Desc", icon: Heart },
];

const BRAND_LOGOS = [
    "Levi's", "Champion", "Carhartt WIP", "Patagonia", "Nike Vintage", "Ralph Lauren", "Adidas Originals"
];

const HOW_STEPS = [
    { titleKey: "howStep1Title", descKey: "howStep1Desc", icon: Sparkles, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20" },
    { titleKey: "howStep2Title", descKey: "howStep2Desc", icon: ShieldCheck, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20" },
    { titleKey: "howStep3Title", descKey: "howStep3Desc", icon: Package, color: "text-primary-500 bg-primary-50 dark:bg-primary-950/20" },
] as const;

const REVIEWS = [
    { textKey: "review1Text", authorKey: "review1Author", roleKey: "review1Role", initials: "AM" },
    { textKey: "review2Text", authorKey: "review2Author", roleKey: "review2Role", initials: "PS" },
    { textKey: "review3Text", authorKey: "review3Author", roleKey: "review3Role", initials: "RN" },
] as const;

const FAQS = [
    { qKey: "faqQ1", aKey: "faqA1" },
    { qKey: "faqQ2", aKey: "faqA2" },
    { qKey: "faqQ3", aKey: "faqA3" },
    { qKey: "faqQ4", aKey: "faqA4" },
] as const;

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────────────────────────────────────── */

export default function Home() {
    const { locale } = useNavbar();
    const t = TRANSLATIONS[locale];
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <main className="flex-1 bg-white dark:bg-neutral-950 pb-24 overflow-x-hidden">

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 1 — HERO
            ═══════════════════════════════════════════════════════════════ */}
            <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 md:pt-16 pb-12">
                {/* Background ambient radial glows */}
                <div className="absolute top-10 left-1/4 w-96 h-96 rounded-full bg-primary-200/20 dark:bg-primary-900/10 blur-[130px] pointer-events-none" />
                <div className="absolute top-40 right-1/4 w-80 h-80 rounded-full bg-amber-200/15 dark:bg-amber-900/5 blur-[120px] pointer-events-none" />

                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                    {/* ── Hero copy column ── */}
                    <div className="lg:col-span-6 space-y-8 text-left">

                        {/* Premium Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/40 ring-1 ring-primary-100 dark:ring-primary-800/30">
                            <Sparkles className="w-3.5 h-3.5 text-primary-500 flex-shrink-0 animate-pulse" />
                            <span className="text-[10px] font-bold tracking-widest text-primary-700 dark:text-primary-300 uppercase">
                                {t.heroBadge}
                            </span>
                        </div>

                        {/* Heading */}
                        <div className="space-y-4">
                            <Typography
                                variant="h1"
                                className="text-neutral-950 dark:text-white leading-[1.08] font-black tracking-tight"
                            >
                                {t.heroTitleFirst}{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-blue-600 dark:from-primary-400 dark:to-blue-500">
                                    {t.heroTitleAccent}
                                </span>{" "}
                                {t.heroTitleEnd}
                            </Typography>

                            <Typography variant="body1" color="muted" className="text-base md:text-lg leading-relaxed max-w-lg">
                                {t.heroDescription}
                            </Typography>
                        </div>

                        {/* Quality assurances banner */}
                        <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Quality Verified
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Eco-Friendly Packaging
                            </span>
                            <span className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Inspected 1-of-1s
                            </span>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/catalog/all" className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 active:scale-95 text-white text-sm font-bold transition-all shadow-lg shadow-primary-500/25 cursor-pointer">
                                {t.heroBtnShop}
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>


                    </div>

                    {/* ── Hero Carousel column ── */}
                    <div className="lg:col-span-6 w-full">
                        <ThriftCarousel />
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 1.5 — BRAND TRUST STRIP
            ═══════════════════════════════════════════════════════════════ */}
            <section className="bg-neutral-50 dark:bg-neutral-900/30 border-y border-neutral-100 dark:border-neutral-900 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-4">
                        {t.brandStripTitle}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-50 dark:opacity-40">
                        {BRAND_LOGOS.map((brand, i) => (
                            <span 
                                key={i} 
                                className="text-base md:text-lg font-black tracking-tight text-neutral-900 dark:text-white hover:opacity-100 transition-opacity duration-200 cursor-default select-none"
                            >
                                {brand}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 2 — TRENDING NOW
            ═══════════════════════════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
                {/* Section header */}
                <div className="flex items-end justify-between pb-6 border-b border-neutral-100 dark:border-neutral-900 mb-8">
                    <div className="space-y-1 text-left">
                        <Typography variant="overline" color="primary">
                            {t.trendingNow}
                        </Typography>
                        <Typography variant="h2" className="text-neutral-950 dark:text-white font-black tracking-tight">
                            {t.trendingNow}
                        </Typography>
                    </div>
                    <Link href="/catalog/all" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors cursor-pointer">
                        {t.catViewAll}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Horizontal product carousel */}
                <TrendingCarousel />
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 3 — HOW IT WORKS
            ═══════════════════════════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28">
                <div className="text-center max-w-lg mx-auto space-y-3 mb-16">
                    <Typography variant="overline" color="primary">
                        {t.howItWorksTitle}
                    </Typography>
                    <Typography variant="h2" className="text-neutral-950 dark:text-white font-black tracking-tight">
                        {t.howItWorksTitle}
                    </Typography>
                    <Typography variant="body2" color="muted" className="leading-relaxed">
                        {t.howItWorksSubtitle}
                    </Typography>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {HOW_STEPS.map((step, idx) => {
                        const StepIcon = step.icon;
                        return (
                            <div 
                                key={idx} 
                                className="group relative p-8 bg-neutral-50 dark:bg-neutral-900/30 rounded-2xl border border-neutral-100 dark:border-neutral-900 hover:border-primary-100 dark:hover:border-primary-950 transition-all duration-300 hover:shadow-lg text-left"
                            >
                                <div className="absolute top-4 right-4 text-xs font-bold text-neutral-200 dark:text-neutral-800">
                                    0{idx + 1}
                                </div>
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${step.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <StepIcon className="w-6 h-6 stroke-[2]" />
                                </div>
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                                    {t[step.titleKey]}
                                </h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                    {t[step.descKey]}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 4 — WHY NEXT.IN
            ═══════════════════════════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28">

                {/* Section header */}
                <div className="text-center max-w-lg mx-auto space-y-3 mb-16">
                    <Typography variant="overline" color="primary">
                        {t.valueTitle}
                    </Typography>
                    <Typography variant="h2" className="text-neutral-950 dark:text-white font-black tracking-tight">
                        {t.valueTitle}
                    </Typography>
                    <Typography variant="body2" color="muted" className="leading-relaxed">
                        {t.valueSubtitle}
                    </Typography>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {VALUE_PROPS.map((vp) => {
                        const Icon = vp.icon;
                        return (
                            <div
                                key={vp.id}
                                className="group p-8 bg-neutral-50 dark:bg-neutral-900/30 rounded-2xl border border-neutral-100 dark:border-neutral-900 hover:border-primary-100 dark:hover:border-primary-950 transition-all duration-300 hover:shadow-lg space-y-4 text-left"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/30 flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-300">
                                    <Icon className="w-6 h-6 stroke-[2]" />
                                </div>
                                <div className="space-y-2">
                                    <Typography variant="h6" className="font-bold text-neutral-900 dark:text-white">
                                        {t[vp.titleKey]}
                                    </Typography>
                                    <Typography variant="body2" color="muted" className="leading-relaxed text-sm">
                                        {t[vp.descKey]}
                                    </Typography>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 5 — CATALOG CATEGORIES
            ═══════════════════════════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28">

                {/* Section header */}
                <div className="flex items-end justify-between pb-6 border-b border-neutral-100 dark:border-neutral-900">
                    <div className="space-y-1 text-left">
                        <Typography variant="overline" color="primary">
                            {t.catSubtitle}
                        </Typography>
                        <Typography variant="h2" className="text-neutral-950 dark:text-white font-black tracking-tight">
                            {t.catTitle}
                        </Typography>
                    </div>
                    <Link href="/catalog/all" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors cursor-pointer">
                        {t.catViewAll}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Category grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                    {CATEGORIES.map((cat) => (
                        <Link
                            key={cat.id}
                            href={cat.href}
                            className="group relative h-80 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-neutral-100 dark:border-neutral-900 flex flex-col justify-end text-left"
                        >
                            {/* Cover image */}
                            <img
                                src={cat.imagePath}
                                alt={t[cat.titleKey]}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                            />
                            {/* Scrim overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                            {/* Label block */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1.5 z-10">
                                <Typography variant="h5" className="font-black text-white leading-tight">
                                    {t[cat.titleKey]}
                                </Typography>
                                <span className="inline-block px-2.5 py-0.5 text-[9px] font-bold bg-white/20 text-white rounded-full uppercase tracking-wider backdrop-blur-sm">
                                    {cat.itemCount} items
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Mobile view-all */}
                <div className="mt-6 sm:hidden">
                    <Link href="/catalog/all" className="w-full inline-flex items-center justify-center gap-1.5 py-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-sm font-bold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all cursor-pointer">
                        {t.catViewAll}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>



            {/* ═══════════════════════════════════════════════════════════════
                SECTION 7 — INTERACTIVE FAQ
            ═══════════════════════════════════════════════════════════════ */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-28">
                <div className="text-center space-y-3 mb-16">
                    <Typography variant="overline" color="primary">
                        {t.faqTitle}
                    </Typography>
                    <Typography variant="h2" className="text-neutral-950 dark:text-white font-black tracking-tight">
                        {t.faqTitle}
                    </Typography>
                    <Typography variant="body2" color="muted" className="leading-relaxed max-w-lg mx-auto">
                        {t.faqSubtitle}
                    </Typography>
                </div>

                <div className="space-y-4">
                    {FAQS.map((faq, idx) => {
                        const isOpen = openFaq === idx;
                        return (
                            <div 
                                key={idx} 
                                className="bg-neutral-50 dark:bg-neutral-900/30 rounded-xl border border-neutral-100 dark:border-neutral-900 overflow-hidden transition-all duration-200"
                            >
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full flex items-center justify-between p-6 text-left font-bold text-neutral-900 dark:text-white hover:bg-neutral-100/50 dark:hover:bg-neutral-800/20 transition-colors cursor-pointer"
                                >
                                    <span className="text-sm md:text-base pr-4">{t[faq.qKey]}</span>
                                    {isOpen ? (
                                        <ChevronUp className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                                    )}
                                </button>
                                <div 
                                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                        isOpen ? "max-h-[250px] opacity-100" : "max-h-0 opacity-0"
                                    }`}
                                >
                                    <p className="p-6 pt-0 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed border-t border-neutral-100/50 dark:border-neutral-900">
                                        {t[faq.aKey]}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════
                SECTION 8 — EMAIL DROP ALERTS
            ═══════════════════════════════════════════════════════════════ */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-28">
                <div className="relative bg-neutral-950 dark:bg-neutral-900/60 rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl">
                    {/* Background abstract glowing shapes */}
                    <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-primary-600/10 blur-[130px] pointer-events-none" />
                    <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-blue-600/10 blur-[110px] pointer-events-none" />

                    <div className="relative px-6 py-16 md:px-16 text-center space-y-6 max-w-xl mx-auto z-10">

                        {/* Bell icon */}
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-neutral-900 dark:bg-neutral-800 border border-neutral-800 text-primary-400">
                            <Bell className="w-6 h-6 animate-bounce" />
                        </div>

                        {/* Copy */}
                        <div className="space-y-3">
                            <Typography variant="h2" className="text-white font-black tracking-tight">
                                {t.newsTitle}
                            </Typography>
                            <Typography variant="body2" className="text-neutral-400 leading-relaxed">
                                {t.newsDesc}
                            </Typography>
                        </div>

                        {/* Email form */}
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
                            <input
                                type="email"
                                id="homepage-email-subscribe"
                                placeholder={t.newsPlaceholder}
                                className="flex-1 px-4 py-3.5 text-sm rounded-xl bg-neutral-900/80 border border-neutral-800 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all shadow-inner"
                            />
                            <button className="px-6 py-3.5 rounded-xl bg-primary-500 hover:bg-primary-400 active:scale-95 text-white text-sm font-bold transition-all whitespace-nowrap shadow-lg shadow-primary-500/20 cursor-pointer">
                                {t.newsBtn}
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
