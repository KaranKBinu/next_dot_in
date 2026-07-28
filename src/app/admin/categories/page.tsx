import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FolderPlus, Layers } from "lucide-react";
import CreateCategoryModal from "@/components/CreateCategoryModal";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: { children: true, products: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Category & Attribute Management</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">Configure product categories, subcategories, and dynamic attributes</p>
        </div>

        <CreateCategoryModal categories={categories} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((c) => (
          <div key={c.id} className="bg-white border border-[#E7E5E4] rounded-md p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-3">
              <div>
                <h3 className="font-bold text-[#111827] text-sm">{c.name}</h3>
                <span className="text-[10px] font-mono text-[#6B7280]">{c.slug}</span>
              </div>
              <span className="px-2.5 py-0.5 bg-[#FAFAF8] text-[#111827] border border-[#E7E5E4] rounded-full text-[10px] font-bold">
                {c.products.length} Products
              </span>
            </div>

            <p className="text-xs text-[#6B7280]">{c.description || "No description assigned."}</p>

            <div className="pt-2 border-t border-[#E7E5E4]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block mb-1">Assigned Attributes</span>
              <div className="flex flex-wrap gap-1.5">
                {Array.isArray(c.attributes) && (c.attributes as string[]).map((attr) => (
                  <span key={attr} className="px-2 py-0.5 bg-white border border-[#E7E5E4] text-[#111827] text-[10px] font-semibold rounded">
                    {attr}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
