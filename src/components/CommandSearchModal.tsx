"use client";

import { useState, useEffect, useRef } from "react";
import { liveSearchAction } from "@/app/actions/search";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, Command, ArrowRight, Package, Folder, Clock, TrendingUp, Sparkles } from "lucide-react";

export default function CommandSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ products: any[]; categories: any[] }>({ products: [], categories: [] });

  // Recent Searches local storage
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("next_recent_searches");
      if (saved) setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Handle Ctrl+K / Cmd+K and ESC keybindings
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
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, 5);
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
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 p-4 animate-fade-in">
      <div className="bg-white border border-[#E7E5E4] rounded-md max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Command Search Header */}
        <div className="p-4 border-b border-[#E7E5E4] flex items-center gap-3 bg-[#FAFAF8]">
          <Search className="w-5 h-5 text-[#6B7280]" />
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
            className="w-full bg-transparent text-sm text-[#111827] focus:outline-none placeholder-[#9CA3AF]"
          />
          {query && (
            <button onClick={() => setQuery("")} className="p-1 text-[#6B7280] hover:text-[#111827]">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="px-2 py-0.5 bg-[#E7E5E4] text-[#6B7280] text-[10px] font-bold rounded flex items-center gap-1 uppercase">
            ESC
          </span>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* EMPTY QUERY: Popular Searches & Categories */}
          {!query.trim() && (
            <div className="space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between text-[#6B7280] mb-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Recent Searches
                    </span>
                    <button onClick={clearRecentSearches} className="text-[10px] hover:text-[#111827] underline">
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSelectSearch(term)}
                        className="px-3 py-1.5 bg-[#FAFAF8] hover:bg-[#F4F4F0] border border-[#E7E5E4] rounded-md text-[#111827] font-semibold flex items-center gap-1.5"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-2.5 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {["Linen Shirt", "Oversized T-Shirt", "Sneakers", "Raw Denim Jeans", "Hoodies"].map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSelectSearch(term)}
                      className="px-3 py-1.5 bg-white hover:bg-[#FAFAF8] border border-[#E7E5E4] rounded-md text-[#111827] font-medium"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Categories */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Trending Categories
                </span>
                <div className="grid grid-cols-3 gap-3">
                  {["Clothing", "Footwear", "Accessories"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onClose();
                        router.push(`/catalog?category=${cat.toLowerCase()}`);
                      }}
                      className="p-3 bg-[#FAFAF8] hover:bg-[#F4F4F0] border border-[#E7E5E4] rounded-md text-left transition-colors"
                    >
                      <p className="font-bold text-[#111827]">{cat}</p>
                      <p className="text-[10px] text-[#6B7280] mt-0.5">Explore collection</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* LIVE SEARCH RESULTS */}
          {query.trim() && (
            <div className="space-y-6">
              {/* Category Results */}
              {results.categories.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-2">Categories</span>
                  <div className="space-y-1">
                    {results.categories.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          onClose();
                          router.push(`/catalog?category=${c.slug}`);
                        }}
                        className="w-full p-2.5 hover:bg-[#FAFAF8] rounded-md flex items-center justify-between transition-colors text-left"
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
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-2">Matching Garments</span>
                  <div className="divide-y divide-[#E7E5E4] border border-[#E7E5E4] rounded-md overflow-hidden bg-white">
                    {results.products.map((p) => (
                      <Link
                        key={p.id}
                        href={`/product/${p.slug}`}
                        onClick={() => { saveRecentSearch(query); onClose(); }}
                        className="p-3 hover:bg-[#FAFAF8] flex items-center justify-between gap-4 transition-colors block"
                      >
                        <div className="flex items-center gap-3">
                          {p.images?.[0] && (
                            <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded bg-[#F4F4F0] border border-[#E7E5E4]" />
                          )}
                          <div>
                            <p className="font-bold text-[#111827]">{p.name}</p>
                            <p className="text-[10px] text-[#6B7280]">{p.category?.name || "Apparel"}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-[#111827]">₹{p.price}</span>
                          <span className="block text-[9px] font-semibold text-emerald-800">In Stock</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* NO RESULTS STATE */}
              {!loading && results.products.length === 0 && results.categories.length === 0 && (
                <div className="py-8 text-center space-y-3">
                  <Package className="w-8 h-8 text-[#9CA3AF] mx-auto" />
                  <div>
                    <p className="font-bold text-[#111827]">No products found for "{query}"</p>
                    <p className="text-[#6B7280] text-[11px] mt-0.5">Try searching with a different keyword or browse our full catalog.</p>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      router.push("/catalog");
                    }}
                    className="px-4 py-2 bg-[#111827] text-white rounded text-xs font-semibold uppercase tracking-wider"
                  >
                    Browse All Products
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#FAFAF8] border-t border-[#E7E5E4] flex items-center justify-between text-[10px] text-[#6B7280]">
          <span className="flex items-center gap-1">
            Press <kbd className="px-1 py-0.5 bg-white border border-[#E7E5E4] rounded font-mono">↵</kbd> to view full catalog results
          </span>
          <span className="flex items-center gap-1">
            <Command className="w-3 h-3" /> Cmd + K shortcut
          </span>
        </div>
      </div>
    </div>
  );
}
