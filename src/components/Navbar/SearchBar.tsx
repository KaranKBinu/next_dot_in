"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { useNavbar } from "./NavbarContext";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { Sparkles, Shirt, Footprints, ShoppingBag, Glasses, Gem } from "lucide-react";

const QUICK_CATEGORIES = [
    { label: "Women", href: "/shop/women", icon: Sparkles },
    { label: "Men", href: "/shop/men", icon: Shirt },
    { label: "Sneakers", href: "/shop/sneakers", icon: Footprints },
    { label: "Bags", href: "/shop/bags", icon: ShoppingBag },
    { label: "Vintage", href: "/vintage", icon: Glasses },
    { label: "Accessories", href: "/shop/accessories", icon: Gem },
];

const TRENDING = ["Y2K tops", "Levi's denim", "vintage tees", "leather jackets"];

export default function SearchBar() {
    const {
        searchQuery,
        setSearchQuery,
        searchFocused,
        setSearchFocused,
    } = useNavbar();

    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useOutsideClick([containerRef], () => setSearchFocused(false));

    // Accessibility: Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && searchFocused) {
                setSearchFocused(false);
                inputRef.current?.blur();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [searchFocused, setSearchFocused]);

    return (
        <div ref={containerRef} className="flex-1 min-w-0 hidden md:block">
            <div
                className={`relative flex items-center rounded-xl transition-all duration-200 ${searchFocused
                        ? "bg-neutral-200/90 dark:bg-neutral-800 ring-2 ring-primary-400/60"
                        : "bg-neutral-200/50 dark:bg-neutral-800/60 ring-1 ring-neutral-300/50 dark:ring-neutral-700/40 hover:bg-neutral-200/80 dark:hover:bg-neutral-800"
                    }`}
            >
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 flex-shrink-0 pointer-events-none" />
                <input
                    id="navbar-search-input"
                    ref={inputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    placeholder="Search vintage, brands, styles…"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-transparent text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none"
                />
                {searchQuery && (
                    <button
                        onMouseDown={(e) => {
                            e.preventDefault();
                            setSearchQuery("");
                            inputRef.current?.focus();
                        }}
                        className="mr-1 p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all flex-shrink-0"
                        aria-label="Clear Search"
                    >
                        <XIcon />
                    </button>
                )}
                {searchQuery && (
                    <button className="flex-shrink-0 mr-1.5 px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-400 text-white text-xs font-semibold transition-all active:scale-95">
                        Go
                    </button>
                )}
            </div>
        </div>
    );
}

export function SearchSuggestions() {
    const {
        searchQuery,
        setSearchQuery,
        searchFocused,
        setSearchFocused,
    } = useNavbar();

    const panelRef = useRef<HTMLDivElement>(null);

    // Close on outside click of the suggestions panel (excluding the input container which has its own listener)
    useOutsideClick([panelRef], () => setSearchFocused(false));

    const suggestionsOpen = searchFocused;

    return (
        <div
            ref={panelRef}
            className={`transition-all duration-200 ease-out origin-top ${suggestionsOpen
                    ? "opacity-100 scale-y-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-y-95 -translate-y-1 pointer-events-none"
                }`}
            aria-hidden={!suggestionsOpen}
        >
            <div className="bg-white/85 dark:bg-neutral-900/85 backdrop-blur-xl rounded-2xl ring-1 ring-neutral-200/80 dark:ring-neutral-700/60 shadow-xl shadow-black/10 dark:shadow-black/40 p-4">
                {/* Quick categories */}
                <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2.5">
                    Browse categories
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {QUICK_CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        return (
                            <Link
                                key={cat.href}
                                href={cat.href}
                                onMouseDown={() => setSearchFocused(false)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-neutral-100/80 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-400 ring-1 ring-neutral-200 dark:ring-neutral-700 hover:ring-primary-300 dark:hover:ring-primary-700 transition-all"
                            >
                                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                                {cat.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Trending */}
                <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2.5">
                        Trending now
                    </p>
                    <div className="flex flex-wrap gap-x-5 gap-y-2">
                        {TRENDING.map((tag) => (
                            <button
                                key={tag}
                                onMouseDown={() => {
                                    setSearchQuery(tag);
                                }}
                                className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                                <TrendingIcon />
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Search Icons ── */

function SearchIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 6 6 18M6 6l12 12" />
        </svg>
    );
}

function TrendingIcon() {
    return (
        <svg className="w-3 h-3 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
        </svg>
    );
}
