"use client";

import React from "react";
import Link from "next/link";
import { useNavbar } from "./NavbarContext";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Browse Catalog", href: "/catalog/all" },
    { label: "About", href: "/about" },
];

export default function MobileMenu() {
    const {
        menuOpen,
        setMenuOpen,
        searchQuery,
        setSearchQuery,
        user,
        setUser,
    } = useNavbar();

    return (
        <div
            className={`md:hidden transition-all duration-300 ease-in-out ${
                menuOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
            }`}
            aria-hidden={!menuOpen}
        >
            <div className="bg-white/85 dark:bg-neutral-900/85 backdrop-blur-xl rounded-2xl ring-1 ring-neutral-200/80 dark:ring-neutral-700/60 shadow-xl shadow-black/10 dark:shadow-black/40 px-4 pt-3 pb-5 space-y-1">
                {/* Mobile search */}
                <div className="relative mb-3">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search vintage, brands…"
                        className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-neutral-200/50 dark:bg-neutral-800/80 text-neutral-900 dark:text-white placeholder:text-neutral-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary-400/50 transition-all"
                    />
                </div>

                {NAV_LINKS.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center px-3 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 rounded-xl transition-colors"
                    >
                        {link.label}
                    </Link>
                ))}

                {/* Mobile User Section */}
                <div className="pt-3.5 mt-2 border-t border-neutral-100 dark:border-neutral-800">
                    {!user ? (
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 px-3 py-1.5">
                                <span className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-500 dark:text-neutral-400">
                                    G
                                </span>
                                <div>
                                    <p className="text-xs font-semibold text-neutral-900 dark:text-white">Hello, Guest!</p>
                                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500">Sign in to access your account</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5 px-1">
                                <button
                                    onClick={() => {
                                        setUser({ name: "Karan Binu", email: "karan@next.in" });
                                        setMenuOpen(false);
                                    }}
                                    className="flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-[10px] font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-all truncate"
                                >
                                    <LoginIcon />
                                    Sign In
                                </button>
                                <Link
                                    href="/auth/signup"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-[10px] font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-all text-center truncate"
                                >
                                    <UserPlusIcon />
                                    Sign Up
                                </Link>
                                <Link
                                    href="/admin"
                                    onClick={() => setMenuOpen(false)}
                                    className="flex items-center justify-center gap-1.5 py-2 px-1 rounded-xl text-[10px] font-semibold text-neutral-700 dark:text-neutral-200 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition-all text-center truncate"
                                >
                                    Admin
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-3 px-3 py-1.5 mb-1">
                                <span className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-bold overflow-hidden">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        user.name[0].toUpperCase()
                                    )}
                                </span>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">Hello, {user.name.split(" ")[0]}!</p>
                                    <p className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate">{user.email}</p>
                                </div>
                            </div>
                            <Link
                                href="/account"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 transition-colors"
                            >
                                <UserIcon />
                                My Profile
                            </Link>
                            <Link
                                href="/orders"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 transition-colors"
                            >
                                <OrdersIcon />
                                My Orders
                            </Link>
                            <Link
                                href="/listings"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 transition-colors"
                            >
                                <TagIcon />
                                My Listings
                            </Link>
                            <Link
                                href="/admin"
                                onClick={() => setMenuOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100/60 dark:hover:bg-neutral-800/60 transition-colors"
                            >
                                <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                </svg>
                                Admin Console
                            </Link>
                            <button
                                onClick={() => {
                                    setUser(null);
                                    setMenuOpen(false);
                                }}
                                className="flex items-center gap-2.5 w-full px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                            >
                                <LogoutIcon />
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── Mobile Icons ── */

function SearchIcon({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35" />
        </svg>
    );
}

function LoginIcon() {
    return (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
        </svg>
    );
}

function UserPlusIcon() {
    return (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
    );
}

function OrdersIcon() {
    return (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 1 2-2h2a2 2 0 1 2 2" />
        </svg>
    );
}

function TagIcon() {
    return (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
        </svg>
    );
}

function LogoutIcon() {
    return (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25" />
        </svg>
    );
}
