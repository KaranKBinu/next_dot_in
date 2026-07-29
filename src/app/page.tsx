import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getSystemSettings } from "@/lib/settings";
import { ArrowRight } from "lucide-react";
import ProductGrid from "@/components/ProductGrid";

export default async function Home() {
  const settings = await getSystemSettings();

  const [featuredProducts, newArrivals, categories] = await Promise.all([
    settings.featured_products_enabled
      ? prisma.product.findMany({
          where: { isFeatured: true, isPublished: true },
          include: { category: true },
          take: 4,
        })
      : [],
    prisma.product.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.category.findMany({ take: 4 }),
  ]);

  return (
    <div className="flex-1 flex flex-col bg-[#FAFAF8] text-[#111827] animate-fade-in">
      {/* Editorial Storefront Hero Banner (Zara / COS Style) */}
      <section className="relative overflow-hidden border-b border-[#E7E5E4] py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">
              COLLECTION 2026
            </span>

            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#111827] leading-[1.05]">
              Architectural Clothing & Modern Staples
            </h1>

            <p className="text-sm text-[#6B7280] leading-relaxed">
              Refined silhouettes crafted from heavyweight natural fibers. Designed with clean geometry and subtle tactile details for timeless everyday living.
            </p>

            <div className="pt-4 flex items-center gap-4">
              <Link
                href="/catalog"
                className="px-8 py-4 bg-[#111827] hover:bg-[#27272A] active:scale-95 text-white font-semibold text-xs uppercase tracking-wider rounded transition-all flex items-center gap-3 shadow-md hover:shadow-lg"
              >
                Explore Collection <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 relative">
            <div className="aspect-[4/3] rounded-md overflow-hidden bg-[#F4F4F0] border border-[#E7E5E4] shadow-sm hover:shadow-md transition-shadow">
              <img
                src="/cos_style_editorial_hero_1785261534310.png"
                alt="Architectural Fashion Editorial"
                className="w-full h-full object-cover transform hover:scale-103 transition-transform duration-700 ease-out"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Highlights */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-20 w-full">
        <div className="flex items-center justify-between mb-10 border-b border-[#E7E5E4] pb-4">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wider text-[#111827]">Categories</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">Explore by garment type</p>
          </div>

          <Link href="/catalog" className="text-xs font-semibold uppercase tracking-wider text-[#111827] hover:underline flex items-center gap-1 group">
            All Categories <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/catalog?category=${c.slug}`}
              className="group p-6 bg-white border border-[#E7E5E4] rounded hover:border-[#111827] hover:shadow-md transform hover:-translate-y-1 transition-all duration-300"
            >
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#111827] group-hover:underline">
                {c.name}
              </h3>
              <p className="text-xs text-[#6B7280] mt-1 line-clamp-1">{c.description || "Explore wardrobe pieces"}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Editorial Product Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 py-12 pb-24 w-full">
        <div className="flex items-center justify-between mb-10 border-b border-[#E7E5E4] pb-4">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-wider text-[#111827]">New Arrivals</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">Curated seasonal releases</p>
          </div>

          <Link href="/catalog" className="text-xs font-semibold uppercase tracking-wider text-[#111827] hover:underline flex items-center gap-1 group">
            View All <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <ProductGrid products={newArrivals as any} />
      </section>
    </div>
  );
}
