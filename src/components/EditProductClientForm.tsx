"use client";

import { useState } from "react";
import { updateProductAction } from "@/app/actions/update-product";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowLeft, UploadCloud, X } from "lucide-react";

export default function EditProductClientForm({ product, categories }: { product: any; categories: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [images, setImages] = useState<string[]>(product.images || []);
  const [form, setForm] = useState({
    name: product.name || "",
    brand: product.brand || "",
    categoryId: product.categoryId || categories[0]?.id || "",
    description: product.description || "",
    price: product.price || 0,
    compareAtPrice: product.compareAtPrice || "",
    stock: product.stock || 0,
    lowStockThreshold: product.lowStockThreshold || 5,
    isFeatured: product.isFeatured ?? false,
    isPublished: product.isPublished ?? true,
    attributes: (product.attributes as Record<string, string>) || {},
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removePhoto = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await updateProductAction({
      id: product.id,
      name: form.name,
      brand: form.brand,
      description: form.description,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : undefined,
      stock: Number(form.stock),
      lowStockThreshold: Number(form.lowStockThreshold),
      categoryId: form.categoryId,
      images,
      attributes: form.attributes,
      isFeatured: form.isFeatured,
      isPublished: form.isPublished,
    });

    if (res.success) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setError(res.error || "Failed to update product.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-md text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Timestamps Card */}
      <div className="bg-white border border-[#E7E5E4] rounded-md p-4 flex items-center justify-between text-xs text-[#6B7280]">
        <div>
          Created: <span className="font-bold text-[#111827]">{new Date(product.createdAt).toLocaleString()}</span>
        </div>
        <div>
          Last Updated: <span className="font-bold text-[#111827]">{new Date(product.updatedAt).toLocaleString()}</span>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="bg-white border border-[#E7E5E4] rounded-md p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Product Gallery</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative aspect-square bg-[#F4F4F0] border border-[#E7E5E4] rounded overflow-hidden group">
              <img src={img} alt="Gallery item" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(idx)}
                className="absolute top-2 right-2 p-1 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {images.length < 6 && (
            <label className="aspect-square bg-[#FAFAF8] border-2 border-dashed border-[#E7E5E4] hover:border-[#111827] rounded flex flex-col items-center justify-center cursor-pointer transition-colors p-4 text-center">
              <UploadCloud className="w-5 h-5 text-[#9CA3AF] mb-1" />
              <span className="text-[11px] font-bold text-[#111827]">Add Photo</span>
              <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
            </label>
          )}
        </div>
      </div>

      {/* Primary Info */}
      <div className="bg-white border border-[#E7E5E4] rounded-md p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Primary Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Product Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Brand</label>
            <input
              type="text"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
            />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Description</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
          />
        </div>
      </div>

      {/* Pricing & Stock */}
      <div className="bg-white border border-[#E7E5E4] rounded-md p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Pricing & Stock</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Selling Price (₹)</label>
            <input
              type="number"
              required
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827] font-bold"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Compare Price (₹)</label>
            <input
              type="number"
              value={form.compareAtPrice}
              onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
              className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Current Stock</label>
            <input
              type="number"
              required
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
              className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Low Stock Threshold</label>
            <input
              type="number"
              value={form.lowStockThreshold}
              onChange={(e) => setForm({ ...form, lowStockThreshold: Number(e.target.value) })}
              className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-white border border-[#E7E5E4] rounded-md p-6 flex items-center justify-between">
        <Link
          href="/admin/products"
          className="px-4 py-2 bg-[#FAFAF8] text-[#6B7280] border border-[#E7E5E4] rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Cancel
        </Link>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-[#111827] hover:bg-[#27272A] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4" /> {loading ? "Saving Changes..." : "Save Product Changes"}
        </button>
      </div>
    </form>
  );
}
