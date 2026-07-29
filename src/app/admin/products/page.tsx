import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus } from "lucide-react";
import AdminProductsTableClient from "@/components/AdminProductsTableClient";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; status?: string; sort?: string }>;
}) {
  const params = await searchParams;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Products Management</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">Manage, edit, publish, duplicate, and delete store products</p>
        </div>

        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-[#111827] hover:bg-[#27272A] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" /> Add Product
        </Link>
      </div>

      <AdminProductsTableClient products={products} categories={categories} initialParams={params} />
    </div>
  );
}
