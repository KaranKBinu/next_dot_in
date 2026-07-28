import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProductDetailClient from "@/components/ProductDetailClient";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product) notFound();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
      <ProductDetailClient product={product} />
    </main>
  );
}
