"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import Tooltip from "@/components/Tooltip";
import { useNavbar } from "./NavbarContext";
import { useOutsideClick } from "@/hooks/useOutsideClick";

export default function ProfileDropdown() {
    const {
        user,
        setUser,
        userDropOpen,
        setUserDropOpen,
    } = useNavbar();

    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useOutsideClick([dropdownRef], () => setUserDropOpen(false));

    // Accessibility: Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && userDropOpen) {
                setUserDropOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.addEventListener("keydown", handleKeyDown);
    }, [userDropOpen, setUserDropOpen]);

    return (
        <div ref={dropdownRef} className="relative hidden md:block">
            <Tooltip
                content={userDropOpen ? null : (user ? "User account & profile" : "Guest account menu")}
                placement="bottom-end"
            >
                <button
                    id="navbar-profile-btn"
                    onClick={() => setUserDropOpen((v) => !v)}
                    className={`flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full transition-all duration-150 ${
                        userDropOpen
                            ? "bg-neutral-100 dark:bg-neutral-800 ring-1 ring-neutral-200 dark:ring-neutral-700"
                            : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                    aria-label="User menu"
                    aria-expanded={userDropOpen}
                >
                    {/* Avatar */}
                    <span className="w-7 h-7 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-bold text-neutral-600 dark:text-neutral-300 flex-shrink-0 overflow-hidden">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            user ? user.name[0].toUpperCase() : "G"
                        )}
                    </span>
                    {/* Name pill */}
                    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                        {user ? user.name.split(" ")[0] : "Guest"}
                    </span>
                    <ChevronIcon open={userDropOpen} />
                </button>
            </Tooltip>

            {/* Dropdown panel */}
            <div
                className={`absolute right-0 top-[calc(100%+8px)] w-64 transition-all duration-200 ease-out origin-top-right z-50 ${
                    userDropOpen
                        ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
                }`}
            >
                <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-2xl ring-1 ring-neutral-200/80 dark:ring-neutral-700/60 shadow-xl shadow-black/10 dark:shadow-black/40 overflow-hidden">
                    {/* User info header */}
                    <div className="px-4 py-3.5 border-b border-neutral-100 dark:border-neutral-800">
                        <div className="flex items-center gap-3">
                            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 flex items-center justify-center text-sm font-bold text-neutral-600 dark:text-neutral-300 flex-shrink-0">
                                {user ? user.name[0].toUpperCase() : "G"}
                            </span>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                                    {user ? user.name : "Hello, Guest!"}
                                </p>
                                <p className="text-xs text-neutral-400 dark:text-neutral-500 truncate">
                                    {user ? user.email : "Sign in to access your account"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Menu items — guest */}
                    {!user && (
                        <div className="p-2">
                            <button
                                onClick={() => {
                                    setUser({ name: "Karan Binu", email: "karan@next.in" });
                                    setUserDropOpen(false);
                                }}
                                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 transition-colors text-left"
                            >
                                <LoginIcon />
                                Sign in (Demo)
                            </button>
                            <Link
                                href="/auth/signup"
                                onClick={() => setUserDropOpen(false)}
                                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 transition-colors"
                            >
                                <UserPlusIcon />
                                Create account
                            </Link>
                            <Link
                                href="/admin"
                                onClick={() => setUserDropOpen(false)}
                                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 transition-colors"
                            >
                                <SettingsIcon />
                                Admin Console
                            </Link>
                            <div className="my-1.5 border-t border-neutral-100 dark:border-neutral-800" />
                            <Link
                                href="/sell"
                                onClick={() => setUserDropOpen(false)}
                                className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl text-sm font-semibold bg-primary-500 hover:bg-primary-400 text-white transition-all active:scale-95"
                            >
                                Start selling
                            </Link>
                        </div>
                    )}

                    {/* Menu items — logged in */}
                    {user && (
                        <div className="p-2">
                            <Link
                                href="/account"
                                onClick={() => setUserDropOpen(false)}
                                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 transition-colors"
                            >
                                <UserIcon />
                                My Profile
                            </Link>
                            <Link
                                href="/orders"
                                onClick={() => setUserDropOpen(false)}
                                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 transition-colors"
                            >
                                <OrdersIcon />
                                My Orders
                            </Link>
                            <Link
                                href="/listings"
                                onClick={() => setUserDropOpen(false)}
                                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 transition-colors"
                            >
                                <TagIcon />
                                My Listings
                            </Link>
                            <Link
                                href="/admin"
                                onClick={() => setUserDropOpen(false)}
                                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100/80 dark:hover:bg-neutral-800/80 transition-colors"
                            >
                                <SettingsIcon />
                                Admin Console
                            </Link>
                            <div className="my-1.5 border-t border-neutral-100 dark:border-neutral-800" />
                            <button
                                onClick={() => {
                                    setUser(null);
                                    setUserDropOpen(false);
                                }}
                                className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
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

/* ── Icons ── */

function ChevronIcon({ open }: { open: boolean }) {
    return (
        <svg
            className={`w-3 h-3 text-neutral-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden="true"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19 9-7 7-7-7" />
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

function SettingsIcon() {
    return (
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        </svg>
    );
}
