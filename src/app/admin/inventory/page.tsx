import { prisma } from "@/lib/prisma";
import AdminInventoryClient from "@/components/AdminInventoryClient";

export default async function AdminInventoryPage() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      stock: true,
      lowStockThreshold: true,
      isPublished: true,
      images: true,
      category: { select: { name: true } },
    },
    orderBy: { stock: "asc" },
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Inventory Management</h1>
        <p className="text-xs text-[#6B7280] mt-0.5">
          Monitor stock levels, identify low-stock items, and adjust quantities
        </p>
      </div>

      <AdminInventoryClient products={products} />
    </div>
  );
}

