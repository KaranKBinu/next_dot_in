import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import FavoritesClientView from "@/components/FavoritesClientView";

export default async function FavoritesPage() {
  const session = await getCurrentSession();

  let initialFavorites: any[] = [];
  if (session) {
    const wishlists = await prisma.wishlist.findMany({
      where: { userId: session.id },
      include: {
        product: {
          include: { category: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    initialFavorites = wishlists.map((w) => w.product);
  }

  return (
    <main className="max-w-7xl mx-auto px-6 sm:px-8 py-12 flex-1 w-full bg-[#FAFAF8] text-[#111827]">
      <div className="mb-8 border-b border-[#E7E5E4] pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-[#111827]">Saved Favorites</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">Pieces you love saved for later</p>
        </div>

        <Link
          href="/catalog"
          className="text-xs font-semibold uppercase tracking-wider text-[#111827] hover:underline"
        >
          Back to Catalog
        </Link>
      </div>

      <FavoritesClientView initialFavorites={initialFavorites} />
    </main>
  );
}
