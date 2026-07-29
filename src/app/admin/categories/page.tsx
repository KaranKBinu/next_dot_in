import { prisma } from "@/lib/prisma";
import AdminCategoryManagerClient from "@/components/AdminCategoryManagerClient";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { children: true, products: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-[#111827]">Category & Dynamic Attribute Management</h1>
        <p className="text-xs text-[#6B7280] mt-0.5">Manage store categories, hierarchy, and dynamic product attributes</p>
      </div>

      <AdminCategoryManagerClient categories={categories} />
    </div>
  );
}
