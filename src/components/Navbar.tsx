"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Tooltip from "@/components/Tooltip";
import { NavbarProvider, useNavbar } from "./Navbar/NavbarContext";
import { useCart } from "@/components/Cart/CartContext";
import SearchBar, { SearchSuggestions } from "./Navbar/SearchBar";
import ProfileDropdown from "./Navbar/ProfileDropdown";
import MobileMenu from "./Navbar/MobileMenu";

import { TRANSLATIONS, Locale } from "@/utils/i18n";

const NAV_LINKS = [
    { key: "navHome" as const, href: "/" },
    { key: "browseCategories" as const, href: "/catalog/all" },
    { key: "navAbout" as const, href: "/about" },
];

const NEXT_LOCALE: Record<Locale, Locale> = {
    en: "hi",
    hi: "ml",
    ml: "en",
};

const LANG_LABELS: Record<Locale, string> = {
    en: "EN",
    hi: "HI",
    ml: "ML",
};

const LANG_TOOLTIPS: Record<Locale, string> = {
    en: "Switch to Hindi (हिंदी)",
    hi: "Switch to Malayalam (മലയാളം)",
    ml: "Switch to English",
};

const getGoToLabel = (loc: Locale, label: string) => {
    if (loc === "hi") return `${label} पर जाएं`;
    if (loc === "ml") return `${label} സന്ദർശിക്കുക`;
    return `Go to ${label}`;
};

function NavbarShell() {
    const {
        menuOpen,
        setMenuOpen,
        scrolled,
        setScrolled,
        theme,
        toggleTheme,
        locale,
        setLocale,
    } = useNavbar();
    const { cartCount } = useCart();

    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [setScrolled]);

    useEffect(() => {
        const onResize = () => {
            if (window.innerWidth >= 768) setMenuOpen(false);
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [setMenuOpen]);

    // Accessibility: Close mobile menu on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && menuOpen) {
                setMenuOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [menuOpen, setMenuOpen]);

    return (
        <>
            {/* Outer wrapper — anchors both the bar AND the suggestion panel */}
            <div ref={wrapperRef} className="fixed top-4 left-4 right-4 sm:left-6 sm:right-6 z-50 flex flex-col gap-2">

                {/* ── Navbar bar ── */}
                <header
                    className={`rounded-2xl transition-all duration-300
                        bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl
                        ring-1 ring-neutral-200/80 dark:ring-neutral-700/60
                        ${scrolled
                            ? "shadow-xl shadow-black/10 dark:shadow-black/40"
                            : "shadow-md shadow-black/5 dark:shadow-black/20"
                        }`}
                >
                    <div className="px-3 sm:px-4">
                        <div className="flex items-center h-14 gap-3">

                            {/* ── Logo ── */}
                            <Tooltip content="next.in Homepage" placement="bottom-start">
                                <Link
                                    href="/"
                                    className="flex-shrink-0 group"
                                    aria-label="next.in home"
                                >
                                    <span className="text-xl font-extrabold tracking-tight text-neutral-900 dark:text-white transition-opacity group-hover:opacity-70">
                                        next
                                        <span className="text-primary-500">.</span>
                                        <span className="text-neutral-400 dark:text-neutral-500">in</span>
                                    </span>
                                </Link>
                            </Tooltip>

                            {/* Divider */}
                            <span className="hidden md:block h-5 w-px bg-neutral-200 dark:bg-neutral-700 flex-shrink-0" aria-hidden="true" />

                            {/* Nav links */}
                            <nav className="hidden md:flex items-center gap-0.5 flex-shrink-0" aria-label="Main navigation">
                                {NAV_LINKS.map((link) => {
                                    const label = TRANSLATIONS[locale][link.key];
                                    return (
                                        <Tooltip key={link.href} content={getGoToLabel(locale, label)} placement="bottom">
                                            <Link
                                                href={link.href}
                                                className="relative px-3.5 py-1.5 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-xl transition-all duration-200 group"
                                            >
                                                {label}
                                                {/* Pill Background expand */}
                                                <span className="absolute inset-0 bg-neutral-100/80 dark:bg-neutral-800/60 rounded-xl scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200 -z-10" />
                                                {/* Centered active brand dot */}
                                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full scale-0 group-hover:scale-100 transition-transform duration-200 origin-center" />
                                            </Link>
                                        </Tooltip>
                                    );
                                })}
                            </nav>

                            {/* ── Inline search bar (fills remaining space) ── */}
                            <SearchBar />

                            {/* ── Right icons ── */}
                            <div className="flex items-center gap-0.5 flex-shrink-0 ml-auto">
                                {/* Language Toggle */}
                                <Tooltip content={LANG_TOOLTIPS[locale]} placement="bottom">
                                    <button
                                        id="navbar-lang-toggle"
                                        onClick={() => setLocale(NEXT_LOCALE[locale])}
                                        className="inline-flex items-center justify-center w-9 h-9 text-xs font-black tracking-wider text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-all duration-150"
                                        aria-label={LANG_TOOLTIPS[locale]}
                                    >
                                        {LANG_LABELS[locale]}
                                    </button>
                                </Tooltip>

                                {/* Theme Toggle */}
                                <Tooltip content={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"} placement="bottom">
                                    <button
                                        id="navbar-theme-toggle"
                                        onClick={toggleTheme}
                                        className="inline-flex p-2 rounded-full text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-150"
                                        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                                    >
                                        <ThemeToggleIcon theme={theme} />
                                    </button>
                                </Tooltip>

                                {/* Cart */}
                                <Tooltip content={TRANSLATIONS[locale].cartTooltip} placement="bottom">
                                    <Link
                                        id="navbar-cart-btn"
                                        href="/cart"
                                        className="relative inline-flex p-2 rounded-full text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-150"
                                        aria-label={TRANSLATIONS[locale].cartTooltip}
                                    >
                                        <CartIcon />
                                        {cartCount > 0 && (
                                            <span className="absolute top-0.5 right-0.5 flex items-center justify-center w-4 h-4 text-[10px] font-bold leading-none bg-primary-500 text-white rounded-full ring-2 ring-white dark:ring-neutral-900">
                                                {cartCount > 9 ? "9+" : cartCount}
                                            </span>
                                        )}
                                    </Link>
                                </Tooltip>

                                {/* Profile / User dropdown */}
                                <ProfileDropdown />

                                {/* Mobile hamburger */}
                                <button
                                    id="navbar-mobile-menu-btn"
                                    onClick={() => setMenuOpen((v) => !v)}
                                    className="md:hidden p-2 rounded-full text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                                    aria-expanded={menuOpen}
                                >
                                    <HamburgerIcon open={menuOpen} />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ── Search suggestion panel ── */}
                <SearchSuggestions />

                {/* ── Mobile slide-down menu ── */}
                <MobileMenu />
            </div>

            {/* ── Spacer ── */}
            <div className="h-24" aria-hidden="true" />
        </>
    );
}

export default function Navbar() {
    return <NavbarShell />;
}

/* ── Icons ── */

function CartIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 10a4 4 0 0 1-8 0" />
        </svg>
    );
}

function HamburgerIcon({ open }: { open: boolean }) {
    return (
        <div className="w-5 h-5 relative flex items-center justify-center" aria-hidden="true">
            <span className={`absolute h-0.5 w-5 bg-neutral-600 dark:bg-neutral-300 rounded-full transition-all duration-300 ${
                open ? "rotate-45" : "-translate-y-1.5"
            }`} />
            <span className={`absolute h-0.5 w-5 bg-neutral-600 dark:bg-neutral-300 rounded-full transition-all duration-300 ${
                open ? "opacity-0" : ""
            }`} />
            <span className={`absolute h-0.5 w-5 bg-neutral-600 dark:bg-neutral-300 rounded-full transition-all duration-300 ${
                open ? "-rotate-45" : "translate-y-1.5"
            }`} />
        </div>
    );
}

function ThemeToggleIcon({ theme }: { theme: "light" | "dark" }) {
    if (theme === "dark") {
        // Sun icon for dark mode (click to toggle to light)
        return (
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m12.72-12.72l-1.41 1.41" />
            </svg>
        );
    }
    // Moon icon for light mode (click to toggle to dark)
    return (
        <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
    );
}
