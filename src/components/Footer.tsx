"use client";

import React from "react";
import { useNavbar } from "@/components/Navbar/NavbarContext";
import { TRANSLATIONS } from "@/utils/i18n";
import { AtSign, Hash, Play, ArrowUpRight } from "lucide-react";

// ── Social links ─────────────────────────────────────────────────────────────
const SOCIALS = [
    { id: "ig",  label: "Instagram", href: "#", Icon: AtSign },
    { id: "tw",  label: "Twitter / X", href: "#", Icon: Hash },
    { id: "yt",  label: "YouTube",   href: "#", Icon: Play },
];

// ── Footer nav structure ─────────────────────────────────────────────────────
// Columns are keyed so translation keys can be derived programmatically.
type FooterColKey = "Shop" | "Company" | "Support";

const FOOTER_COLS: { colKey: FooterColKey; links: { href: string; labelIndex: 1 | 2 | 3 | 4 }[] }[] = [
    {
        colKey: "Shop",
        links: [
            { href: "/catalog/tees",     labelIndex: 1 },
            { href: "/catalog/denim",    labelIndex: 2 },
            { href: "/catalog/knits",    labelIndex: 3 },
            { href: "/catalog/cargo",    labelIndex: 4 },
        ],
    },
    {
        colKey: "Company",
        links: [
            { href: "/about",      labelIndex: 1 },
            { href: "/how-it-works", labelIndex: 2 },
            { href: "/sell",       labelIndex: 3 },
        ],
    },
    {
        colKey: "Support",
        links: [
            { href: "/faq",               labelIndex: 1 },
            { href: "/shipping-returns",  labelIndex: 2 },
            { href: "/contact",           labelIndex: 3 },
        ],
    },
];

// ── Helper — derive translation key from column + index ──────────────────────
function colHeaderKey(col: FooterColKey) {
    const map: Record<FooterColKey, "footerShopCol" | "footerCompanyCol" | "footerSupportCol"> = {
        Shop:    "footerShopCol",
        Company: "footerCompanyCol",
        Support: "footerSupportCol",
    };
    return map[col];
}

function colLinkKey(col: FooterColKey, idx: 1 | 2 | 3 | 4) {
    const base: Record<FooterColKey, string> = {
        Shop:    "footerShopLink",
        Company: "footerCompanyLink",
        Support: "footerSupportLink",
    };
    return `${base[col]}${idx}` as keyof typeof TRANSLATIONS["en"];
}

// ── Component ────────────────────────────────────────────────────────────────
export default function Footer() {
    const { locale } = useNavbar();
    const t = TRANSLATIONS[locale];

    return (
        <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">

            {/* ── Main grid ── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

                {/* Brand column — spans 2 on large screens */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Logo */}
                    <a
                        href="/"
                        id="footer-logo"
                        className="inline-block text-xl font-black tracking-tight text-neutral-950 dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                    >
                        next<span className="text-primary-500">.</span>in
                    </a>

                    {/* Tagline */}
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs">
                        {t.footerTagline}
                    </p>

                    {/* Social icons */}
                    <div className="flex items-center gap-2 pt-1">
                        {SOCIALS.map(({ id, label, href, Icon }) => (
                            <a
                                key={id}
                                id={`footer-social-${id}`}
                                href={href}
                                aria-label={label}
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-primary-100 dark:hover:bg-primary-950/50 hover:text-primary-600 dark:hover:text-primary-400 ring-1 ring-neutral-200 dark:ring-neutral-700 transition-all duration-200"
                            >
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Nav columns */}
                {FOOTER_COLS.map(({ colKey, links }) => (
                    <div key={colKey} className="space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                            {t[colHeaderKey(colKey)]}
                        </h3>
                        <ul className="space-y-2.5">
                            {links.map(({ href, labelIndex }) => (
                                <li key={labelIndex}>
                                    <a
                                        id={`footer-link-${colKey.toLowerCase()}-${labelIndex}`}
                                        href={href}
                                        className="group inline-flex items-center gap-0.5 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                                    >
                                        {t[colLinkKey(colKey, labelIndex as 1 | 2 | 3 | 4)]}
                                        <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* ── Legal bar ── */}
            <div className="border-t border-neutral-100 dark:border-neutral-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-neutral-400 dark:text-neutral-500">
                        {t.footerLegal}
                    </p>
                    <div className="flex items-center gap-4">
                        {(["Privacy Policy", "Terms of Service"] as const).map((label) => (
                            <a
                                key={label}
                                href="#"
                                className="text-xs text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                            >
                                {label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
