"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Locale } from "@/utils/i18n";

export interface User {
    name: string;
    email: string;
    avatar?: string;
}

interface NavbarContextType {
    menuOpen: boolean;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
    scrolled: boolean;
    setScrolled: React.Dispatch<React.SetStateAction<boolean>>;
    searchFocused: boolean;
    setSearchFocused: React.Dispatch<React.SetStateAction<boolean>>;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    userDropOpen: boolean;
    setUserDropOpen: React.Dispatch<React.SetStateAction<boolean>>;
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    theme: "light" | "dark";
    toggleTheme: () => void;
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export function NavbarProvider({ children }: { children: React.ReactNode }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [userDropOpen, setUserDropOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [locale, setLocaleState] = useState<Locale>("en");

    useEffect(() => {
        // Retrieve stored theme, default to light
        const stored = localStorage.getItem("theme") as "light" | "dark" | null;
        if (stored) {
            setTheme(stored);
            if (stored === "dark") {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
        } else {
            setTheme("light");
            document.documentElement.classList.remove("dark");
        }

        // Retrieve stored locale and apply it to the document
        const storedLocale = localStorage.getItem("locale") as Locale | null;
        if (storedLocale === "en" || storedLocale === "hi" || storedLocale === "ml") {
            setLocaleState(storedLocale);
            document.documentElement.dataset.locale = storedLocale;
            document.documentElement.lang =
                storedLocale === "hi" ? "hi" : storedLocale === "ml" ? "ml" : "en";
        } else {
            // Default: ensure data-locale is set even for first-time visitors
            document.documentElement.dataset.locale = "en";
        }
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === "light" ? "dark" : "light";
        setTheme(nextTheme);
        localStorage.setItem("theme", nextTheme);
        if (nextTheme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
        localStorage.setItem("locale", newLocale);
        // Sync the HTML element so CSS font-family rules take effect immediately
        document.documentElement.dataset.locale = newLocale;
        document.documentElement.lang =
            newLocale === "hi" ? "hi" : newLocale === "ml" ? "ml" : "en";
    };

    return (
        <NavbarContext.Provider
            value={{
                menuOpen,
                setMenuOpen,
                scrolled,
                setScrolled,
                searchFocused,
                setSearchFocused,
                searchQuery,
                setSearchQuery,
                userDropOpen,
                setUserDropOpen,
                user,
                setUser,
                theme,
                toggleTheme,
                locale,
                setLocale,
            }}
        >
            {children}
        </NavbarContext.Provider>
    );
}

export function useNavbar() {
    const context = useContext(NavbarContext);
    if (!context) {
        throw new Error("useNavbar must be used within a NavbarProvider");
    }
    return context;
}
