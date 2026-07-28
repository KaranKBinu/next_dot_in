import Link from "next/link";
import { prisma } from "@/lib/prisma";
import ProductGrid from "@/components/ProductGrid";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const categories = await prisma.category.findMany();

  const whereClause: any = { isPublished: true };
  if (params.category) {
    whereClause.category = { slug: params.category };
  }
  if (params.search) {
    whereClause.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  const products = await prisma.product.findMany({
    where: whereClause,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="max-w-7xl mx-auto px-6 sm:px-8 py-12 flex-1 w-full bg-[#FAFAF8] text-[#111827]">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-[#E7E5E4] pb-6">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-[#111827]">Collection Catalog</h1>
          <p className="text-xs text-[#6B7280] mt-1">Browse minimalist garments & essentials</p>
        </div>

        <form action="/catalog" method="GET" className="flex gap-2">
          <input
            type="text"
            name="search"
            defaultValue={params.search || ""}
            placeholder="Search catalog..."
            className="px-4 py-2 bg-white border border-[#E7E5E4] rounded-md text-xs text-[#111827] placeholder-[#9CA3AF] focus:outline-none focus:border-[#111827]"
          />
          <button type="submit" className="px-4 py-2 bg-[#111827] text-white rounded-md text-xs font-semibold uppercase tracking-wider hover:bg-[#27272A] transition-colors">
            Search
          </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/catalog"
          className={`px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider border transition-all ${
            !params.category ? "bg-[#111827] border-[#111827] text-white" : "bg-white border-[#E7E5E4] text-[#6B7280] hover:text-[#111827]"
          }`}
        >
          All Items
        </Link>

        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/catalog?category=${c.slug}`}
            className={`px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider border transition-all ${
              params.category === c.slug ? "bg-[#111827] border-[#111827] text-white" : "bg-white border-[#E7E5E4] text-[#6B7280] hover:text-[#111827]"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      <ProductGrid products={products} />
    </main>
  );
}
