"use client";

import { useState, useEffect, useRef } from "react";
import { liveSearchAction } from "@/app/actions/search";
import { getDynamicSearchInitialsAction } from "@/app/actions/dynamic-search";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Command, Package, Folder, Clock, TrendingUp, Sparkles } from "lucide-react";

export default function CommandSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ products: any[]; categories: any[] }>({ products: [], categories: [] });

  // Dynamic initial data state (fetched from real DB)
  const [dynamicInitials, setDynamicInitials] = useState<{
    popularSearchTerms: string[];
    trendingCategories: any[];
    featuredProducts: any[];
  }>({
    popularSearchTerms: [],
    trendingCategories: [],
    featuredProducts: [],
  });

  // Recent Searches local storage
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("next_recent_searches");
      if (saved) setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Fetch real database search recommendations when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";

      // Fetch dynamic database categories and popular products
      getDynamicSearchInitialsAction().then((res) => {
        if (res.success) {
          setDynamicInitials({
            popularSearchTerms: res.popularSearchTerms || [],
            trendingCategories: res.trendingCategories || [],
            featuredProducts: res.featuredProducts || [],
          });
        }
      });
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Handle ESC keybinding
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced live search
  useEffect(() => {
    if (!query.trim()) {
      setResults({ products: [], categories: [] });
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      const res = await liveSearchAction(query);
      if (res.success) {
        setResults({ products: res.products || [], categories: res.categories || [] });
      }
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectSearch = (term: string) => {
    saveRecentSearch(term);
    onClose();
    router.push(`/catalog?search=${encodeURIComponent(term)}`);
  };

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 8);
    setRecentSearches(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("next_recent_searches", JSON.stringify(updated));
    }
  };

  const removeRecentSearch = (term: string) => {
    const updated = recentSearches.filter((s) => s !== term);
    setRecentSearches(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("next_recent_searches", JSON.stringify(updated));
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("next_recent_searches");
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/15 backdrop-blur-[3px] flex items-start justify-center pt-16 sm:pt-20 px-4 sm:px-8 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#E7E5E4] rounded-2xl max-w-5xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[82vh] relative z-[101] animate-dropdown-unfold transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Pinned Search Input Header with Compact Circular Close Button */}
        <div className="p-4 sm:p-5 border-b border-[#E7E5E4] flex items-center gap-3 bg-[#FAFAF8] sticky top-0 z-20">
          <Search className="w-5 h-5 text-[#111827]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search products, categories, or apparel styles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim()) {
                handleSelectSearch(query);
              }
            }}
            className="w-full bg-transparent text-base font-medium text-[#111827] focus:outline-none placeholder-[#9CA3AF]"
          />

          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#E7E5E4] rounded-full transition-colors"
              title="Clear text"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Compact Circular Close Button */}
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded border border-[#E7E5E4] bg-white hover:bg-[#F4F4F0] text-[#6B7280] hover:text-[#111827] cursor-pointer shadow-sm border-gray-40"
            title="Close Search (ESC)"
          >
            <X className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1 text-xs bg-white">
          {/* EMPTY QUERY: Real Database Recommendations */}
          {!query.trim() && (
            <div className="space-y-8">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-[#6B7280] mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-[#111827]">
                      <Clock className="w-3.5 h-3.5" /> Recent Searches
                    </span>
                    <button onClick={clearRecentSearches} className="text-[13px] hover:text-[#111827] underline">
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {recentSearches.map((term) => (
                      <div key={term} className="inline-flex items-center bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg">
                        <button
                          onClick={() => handleSelectSearch(term)}
                          className="px-3.5 py-1.5 text-[#111827] font-semibold text-xs hover:bg-[#F4F4F0] rounded-l-lg transition-colors"
                        >
                          {term}
                        </button>
                        <button
                          onClick={() => removeRecentSearch(term)}
                          className="px-2 py-1.5 text-[#9CA3AF] hover:text-rose-600 border-l border-[#E7E5E4] rounded-r-lg transition-colors"
                          title="Remove search"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Popular Searches from Database Products */}
              {dynamicInitials.popularSearchTerms.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#111827] block mb-3 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" /> Popular Products
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {dynamicInitials.popularSearchTerms.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSelectSearch(term)}
                        className="px-4 py-2 bg-[#FAFAF8] hover:bg-[#F4F4F0] border border-[#E7E5E4] rounded-lg text-[#111827] font-medium transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Categories from Database */}
              {dynamicInitials.trendingCategories.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#111827] block mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Active Categories
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {dynamicInitials.trendingCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          onClose();
                          router.push(`/catalog?category=${cat.slug}`);
                        }}
                        className="p-4 bg-[#FAFAF8] hover:bg-[#F4F4F0] border border-[#E7E5E4] rounded-xl text-left transition-all hover:border-[#111827] hover:scale-[1.01] cursor-pointer"
                      >
                        <p className="font-bold text-[#111827] text-sm">{cat.name}</p>
                        <p className="text-[11px] text-[#6B7280] mt-1">{cat._count?.products || 0} Products available</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* LIVE SEARCH RESULTS */}
          {query.trim() && (
            <div className="space-y-8">
              {/* Category Results */}
              {results.categories.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#111827] block mb-3">Categories</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {results.categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          onClose();
                          router.push(`/catalog?category=${c.slug}`);
                        }}
                        className="p-3 bg-[#FAFAF8] hover:bg-[#F4F4F0] border border-[#E7E5E4] rounded-xl flex items-center justify-between transition-all hover:border-[#111827] text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <Folder className="w-4 h-4 text-[#111827]" />
                          <span className="font-bold text-[#111827]">{c.name}</span>
                        </div>
                        <span className="text-[10px] text-[#6B7280]">{c._count?.products || 0} products</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Results */}
              {results.products.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#111827] block mb-3">Matching Garments</span>
                  <div className="divide-y divide-[#E7E5E4] border border-[#E7E5E4] rounded-xl overflow-hidden bg-white">
                    {results.products.map((p) => (
                      <Link
                        key={p.id}
                        href={`/product/${p.slug}`}
                        onClick={() => { saveRecentSearch(query); onClose(); }}
                        className="p-4 hover:bg-[#FAFAF8] flex items-center justify-between gap-4 transition-colors block group"
                      >
                        <div className="flex items-center gap-4">
                          {p.images?.[0] && (
                            <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover rounded-lg bg-[#F4F4F0] border border-[#E7E5E4] group-hover:scale-105 transition-transform duration-300" />
                          )}
                          <div>
                            <p className="font-bold text-[#111827] text-sm group-hover:underline">{p.name}</p>
                            <p className="text-[11px] text-[#6B7280] mt-0.5">{p.category?.name || "Apparel"}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-[#111827] text-sm">₹{p.price}</span>
                          <span className="block text-[10px] font-semibold text-emerald-800 mt-0.5">In Stock</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* NO RESULTS STATE */}
              {!loading && results.products.length === 0 && results.categories.length === 0 && (
                <div className="py-12 text-center space-y-4">
                  <Package className="w-10 h-10 text-[#9CA3AF] mx-auto" />
                  <div>
                    <p className="font-bold text-[#111827] text-sm">No products found for "{query}"</p>
                    <p className="text-[#6B7280] text-xs mt-1">Try searching with a different keyword or browse our full catalog.</p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      router.push("/catalog");
                    }}
                    className="px-5 py-2.5 bg-[#111827] hover:bg-[#27272A] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-all active:scale-95 shadow-sm"
                  >
                    Browse All Products
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#FAFAF8] border-t border-[#E7E5E4] flex items-center justify-between text-[11px] text-[#6B7280]">
          <span className="flex items-center gap-1.5">
            Press <kbd className="px-1.5 py-0.5 bg-white border border-[#E7E5E4] rounded font-mono font-bold text-[#111827]">↵</kbd> to view catalog results
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Command className="w-3.5 h-3.5 text-[#111827]" /> ESC to close
          </span>
        </div>
      </div>
    </div>
  );
}
