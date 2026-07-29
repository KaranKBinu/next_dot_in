import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditProductClientForm from "@/components/EditProductClientForm";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { category: true },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Edit Garment Details</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Modify product information, attributes, gallery, and stock
          </p>
        </div>
      </div>

      <EditProductClientForm product={product} categories={categories} />
    </div>
  );
}
