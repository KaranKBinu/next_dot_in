"use client";

import React, { createContext, useContext, useState } from "react";

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
    cartCount: number;
    userDropOpen: boolean;
    setUserDropOpen: React.Dispatch<React.SetStateAction<boolean>>;
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export function NavbarProvider({ children }: { children: React.ReactNode }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [cartCount] = useState(3);
    const [userDropOpen, setUserDropOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);

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
                cartCount,
                userDropOpen,
                setUserDropOpen,
                user,
                setUser,
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
