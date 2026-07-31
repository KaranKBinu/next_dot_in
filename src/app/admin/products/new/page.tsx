"use client";

import { useState } from "react";
import { createProductAction } from "@/app/actions/product";
import { processAiProductIntakeAction } from "@/app/actions/ai-intake";
import { useRouter } from "next/navigation";
import { Camera, Sparkles, UploadCloud, CheckCircle2, ArrowRight, X, PenTool, Sparkle } from "lucide-react";

const CATEGORY_MAP: Record<string, { attributes: string[]; subcategories: string[] }> = {
  Clothing: {
    subcategories: ["T-Shirts", "Shirts", "Jeans", "Hoodies"],
    attributes: ["Size", "Color", "Fabric", "Fit", "Sleeve Length"],
  },
  Footwear: {
    subcategories: ["Sneakers", "Sandals", "Boots"],
    attributes: ["Size", "Color", "Material"],
  },
  Accessories: {
    subcategories: ["Bags", "Caps & Hats", "Jewelry"],
    attributes: ["Color", "Material"],
  },
};

import { useEffect } from "react";
import { getCategoriesAction } from "@/app/actions/product";

export default function GuidedProductCreationPage() {
  const router = useRouter();
  const [creationMode, setCreationMode] = useState<"ai" | "manual">("manual");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbCategories, setDbCategories] = useState<any[]>([]);

  // Photo state
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    async function loadCategories() {
      const res = await getCategoriesAction();
      if (res.success && res.categories && res.categories.length > 0) {
        setDbCategories(res.categories);
        setForm((prev) => ({ ...prev, categoryId: res.categories[0].id }));
      }
    }
    loadCategories();
  }, []);

  // Form state
  const [form, setForm] = useState({
    name: "",
    brand: "NEXT.IN",
    category: "Clothing",
    categoryId: "",
    subcategory: "T-Shirts",
    description: "",
    price: 1499,
    compareAtPrice: 1999,
    stock: 20,
    lowStockThreshold: 5,
    isFeatured: true,
    isPublished: true,
    attributes: {
      Size: "L",
      Color: "Black",
      Fabric: "Cotton",
      Fit: "Regular",
      "Sleeve Length": "Half Sleeve",
    } as Record<string, string>,
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAnalyzePhotos = async () => {
    setAiAnalyzing(true);
    setError(null);

    const res = await processAiProductIntakeAction(images);
    if (res.success) {
      setForm((prev) => ({
        ...prev,
        name: res.suggestedName || prev.name,
        brand: res.suggestedBrand || prev.brand,
        category: res.suggestedCategory || prev.category,
        subcategory: res.suggestedSubcategory || prev.subcategory,
        description: res.suggestedDescription || prev.description,
        price: res.suggestedPrice || prev.price,
        compareAtPrice: res.suggestedCompareAtPrice || prev.compareAtPrice,
        attributes: res.suggestedAttributes || prev.attributes,
      }));
      setImages(res.processedImages || []);
      setStep(3);
    } else {
      setError(res.error || "AI intake processing failed.");
    }
    setAiAnalyzing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const selectedCatId = form.categoryId || (dbCategories.length > 0 ? dbCategories[0].id : "");

    const res = await createProductAction({
      name: form.name,
      brand: form.brand,
      description: form.description,
      price: form.price,
      compareAtPrice: form.compareAtPrice,
      stock: form.stock,
      lowStockThreshold: form.lowStockThreshold,
      categoryId: selectedCatId,
      images: images.length > 0 ? images : ["/tshirt_product_sample_1785257457017.png"],
      attributes: form.attributes,
      isFeatured: form.isFeatured,
      isPublished: form.isPublished,
    });

    if (res.success) {
      router.push("/admin/products");
      router.refresh();
    } else {
      setError(res.error || "Failed to save product.");
      setLoading(false);
    }
  };

  const currentCategoryConfig = CATEGORY_MAP[form.category] || CATEGORY_MAP["Clothing"];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Creation Mode Switcher */}
      <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Add Product</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">Choose between Manual entry or AI Photo Intake</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setCreationMode("manual"); setStep(3); }}
            className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition-colors ${
              creationMode === "manual" ? "bg-[#111827] text-white border-[#111827]" : "bg-white text-[#6B7280] border-[#E7E5E4]"
            }`}
          >
            <PenTool className="w-3.5 h-3.5" /> Manual Creation
          </button>

          <button
            type="button"
            onClick={() => { setCreationMode("ai"); setStep(1); }}
            className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition-colors ${
              creationMode === "ai" ? "bg-[#111827] text-white border-[#111827]" : "bg-white text-[#6B7280] border-[#E7E5E4]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> AI Photo Intake
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-md text-xs font-semibold">
          {error}
        </div>
      )}

      {/* MANUAL MODE or STEP 3 */}
      {(creationMode === "manual" || step === 3) && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photos Upload Section */}
          <div className="bg-white border border-[#E7E5E4] rounded-md p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Product Gallery</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square bg-[#F4F4F0] border border-[#E7E5E4] rounded overflow-hidden group">
                  <img src={img} alt="Product image" className="w-full h-full object-cover" />
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
                  <UploadCloud className="w-6 h-6 text-[#9CA3AF] mb-2" />
                  <span className="text-xs font-semibold text-[#111827]">Upload Photo</span>
                  <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>

          {/* Primary Details */}
          <div className="bg-white border border-[#E7E5E4] rounded-md p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Primary Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Minimalist Linen Shirt"
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
                placeholder="Product description and features..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
              />
            </div>
          </div>

          {/* Category & Dynamic Attributes */}
          <div className="bg-white border border-[#E7E5E4] rounded-md p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Category & Dynamic Attributes</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Category</label>
                <select
                  value={form.categoryId || ""}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
                >
                  {dbCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Subcategory</label>
                <select
                  value={form.subcategory}
                  onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
                >
                  {currentCategoryConfig.subcategories.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dynamic Attributes Grid */}
            <div className="pt-2 border-t border-[#E7E5E4] grid grid-cols-2 sm:grid-cols-3 gap-4">
              {currentCategoryConfig.attributes.map((attr) => (
                <div key={attr}>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">{attr}</label>
                  <input
                    type="text"
                    value={form.attributes[attr] || ""}
                    onChange={(e) => setForm({ ...form, attributes: { ...form.attributes, [attr]: e.target.value } })}
                    className="w-full mt-1 px-3 py-1.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
                  />
                </div>
              ))}
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
                  onChange={(e) => setForm({ ...form, compareAtPrice: Number(e.target.value) })}
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
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Low Stock Warning</label>
                <input
                  type="number"
                  value={form.lowStockThreshold}
                  onChange={(e) => setForm({ ...form, lowStockThreshold: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E7E5E4] rounded-md p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#111827]">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="rounded accent-[#111827]"
                />
                Featured Item
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-[#111827]">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="rounded accent-[#111827]"
                />
                Publish Immediately
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-[#111827] hover:bg-[#27272A] text-white font-semibold text-xs uppercase tracking-wider rounded transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" /> {loading ? "Saving Product..." : "Save Product"}
            </button>
          </div>
        </form>
      )}

      {/* AI MODE STEPS 1 & 2 */}
      {creationMode === "ai" && step === 1 && (
        <div className="bg-white border border-[#E7E5E4] rounded-md p-8 space-y-6">
          <div className="text-center max-w-md mx-auto space-y-2">
            <div className="w-12 h-12 bg-[#FAFAF8] border border-[#E7E5E4] text-[#111827] rounded flex items-center justify-center mx-auto">
              <Camera className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-[#111827]">Upload Product Photos for AI Analysis</h2>
            <p className="text-xs text-[#6B7280]">Upload photos to automatically generate title, attributes & backdrop.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square bg-[#F4F4F0] border border-[#E7E5E4] rounded overflow-hidden group">
                <img src={img} alt="Product upload" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute top-2 right-2 p-1 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {images.length < 4 && (
              <label className="aspect-square bg-[#FAFAF8] border-2 border-dashed border-[#E7E5E4] hover:border-[#111827] rounded flex flex-col items-center justify-center cursor-pointer transition-colors p-4 text-center">
                <UploadCloud className="w-6 h-6 text-[#9CA3AF] mb-2" />
                <span className="text-xs font-semibold text-[#111827]">Add Photo</span>
                <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
              </label>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={images.length === 0}
              className="px-6 py-2.5 bg-[#111827] hover:bg-[#27272A] text-white font-semibold rounded text-xs uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50"
            >
              Continue to AI Processing <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {creationMode === "ai" && step === 2 && (
        <div className="bg-white border border-[#E7E5E4] rounded-md p-8 text-center space-y-6">
          <div className="w-14 h-14 bg-[#FAFAF8] border border-[#E7E5E4] rounded flex items-center justify-center mx-auto text-[#111827]">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#111827]">AI Vision Analysis & Enhancement</h2>
            <p className="text-xs text-[#6B7280] max-w-md mx-auto mt-1">
              Isolating studio backdrops, recognizing apparel attributes, and generating optimal retail pricing.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAnalyzePhotos}
            disabled={aiAnalyzing}
            className="px-8 py-3.5 bg-[#111827] hover:bg-[#27272A] text-white font-semibold rounded text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 disabled:opacity-50"
          >
            {aiAnalyzing ? "Processing..." : "Generate Details"}
          </button>
        </div>
      )}
    </div>
  );
}
