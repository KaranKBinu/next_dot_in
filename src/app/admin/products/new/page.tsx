"use client";

import { useState } from "react";
import { createProductAction } from "@/app/actions/product";
import { processAiProductIntakeAction } from "@/app/actions/ai-intake";
import { useRouter } from "next/navigation";
import { Camera, Sparkles, UploadCloud, CheckCircle2, ArrowRight, X, Image as ImageIcon } from "lucide-react";

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

export default function GuidedProductCreationPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Photo state
  const [images, setImages] = useState<string[]>([]);
  
  // Product state
  const [form, setForm] = useState({
    name: "",
    brand: "",
    category: "Clothing",
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
      Color: "Washed Black",
      Fabric: "100% Combed Cotton",
      Fit: "Oversized Relaxed",
      "Sleeve Length": "Half Sleeve",
    } as Record<string, string>,
  });

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removePhoto = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Step 2: Trigger AI Intake
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

  // Step 3: Save Product
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await createProductAction({
      name: form.name,
      brand: form.brand,
      description: form.description,
      price: form.price,
      compareAtPrice: form.compareAtPrice,
      stock: form.stock,
      lowStockThreshold: form.lowStockThreshold,
      categoryId: form.category,
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Wizard Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Guided Product Creation</h1>
          <p className="text-sm text-slate-400 mt-1">Capture photos, enhance with AI, review & publish</p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className={`px-3 py-1.5 rounded-full ${step === 1 ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"}`}>
            1. Photos
          </span>
          <span className={`px-3 py-1.5 rounded-full ${step === 2 ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"}`}>
            2. AI Enhance
          </span>
          <span className={`px-3 py-1.5 rounded-full ${step === 3 ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"}`}>
            3. Review & Save
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl text-sm font-semibold">
          {error}
        </div>
      )}

      {/* STEP 1: Multi-Photo Intake */}
      {step === 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
          <div className="text-center max-w-md mx-auto space-y-2">
            <div className="w-12 h-12 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
              <Camera className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white">Upload Product Photos</h2>
            <p className="text-xs text-slate-400">Take or upload 1 to 4 photos. Backgrounds will be isolated automatically.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative aspect-square bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden group">
                <img src={img} alt="Product upload" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {images.length < 4 && (
              <label className="aspect-square bg-slate-950 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors p-4 text-center">
                <UploadCloud className="w-6 h-6 text-slate-500 mb-2" />
                <span className="text-xs font-semibold text-slate-300">Add Photo</span>
                <span className="text-[10px] text-slate-500">Camera / Files</span>
                <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
              </label>
            )}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={images.length === 0}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all flex items-center gap-2 disabled:opacity-50"
            >
              Continue to AI Processing <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: AI Background Removal & Attribute Enhancement */}
      {step === 2 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-white">AI Vision Analysis & Enhancement</h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">
              Isolating studio backdrops, recognizing apparel attributes, and generating optimal retail pricing.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAnalyzePhotos}
            disabled={aiAnalyzing}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-2xl text-base shadow-xl shadow-indigo-600/30 transition-all inline-flex items-center gap-3 disabled:opacity-50"
          >
            {aiAnalyzing ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing & Enhancing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" /> Generate Product Details
              </>
            )}
          </button>
        </div>
      )}

      {/* STEP 3: Review & Publish Form (Minimal Typing Needed) */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photos Overview */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Enhanced Product Gallery</h3>
            <div className="flex gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="w-20 h-20 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                  <img src={img} alt="Enhanced gallery" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Primary Details */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Primary Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">Product Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">Brand (Optional)</label>
                <input
                  type="text"
                  value={form.brand}
                  onChange={(e) => setForm({ ...form, brand: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full mt-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Categories & Dynamic Attributes */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Category & Dynamic Attributes</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value, subcategory: CATEGORY_MAP[e.target.value]?.subcategories[0] || "" })}
                  className="w-full mt-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {Object.keys(CATEGORY_MAP).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">Subcategory</label>
                <select
                  value={form.subcategory}
                  onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                  className="w-full mt-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                >
                  {currentCategoryConfig.subcategories.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dynamic Attributes Grid */}
            <div className="pt-2 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {currentCategoryConfig.attributes.map((attr) => (
                <div key={attr}>
                  <label className="text-xs font-semibold text-slate-400 uppercase">{attr}</label>
                  <input
                    type="text"
                    value={form.attributes[attr] || ""}
                    onChange={(e) => setForm({ ...form, attributes: { ...form.attributes, [attr]: e.target.value } })}
                    className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Simplified Stock */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Pricing & Stock</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">Selling Price (₹)</label>
                <input
                  type="number"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                  className="w-full mt-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">Compare Price (₹)</label>
                <input
                  type="number"
                  value={form.compareAtPrice}
                  onChange={(e) => setForm({ ...form, compareAtPrice: Number(e.target.value) })}
                  className="w-full mt-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">Current Stock</label>
                <input
                  type="number"
                  required
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                  className="w-full mt-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase">Low Stock Warning</label>
                <input
                  type="number"
                  value={form.lowStockThreshold}
                  onChange={(e) => setForm({ ...form, lowStockThreshold: Number(e.target.value) })}
                  className="w-full mt-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="rounded accent-indigo-600"
                />
                Featured Item
              </label>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="rounded accent-indigo-600"
                />
                Publish Immediately
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              {loading ? "Saving Product..." : "Save Product"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
