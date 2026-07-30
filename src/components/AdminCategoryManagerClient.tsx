"use client";

import { useState } from "react";
import { createCategoryAction } from "@/app/actions/category";
import { updateCategoryAction } from "@/app/actions/category";
import { deleteCategoryAction } from "@/app/actions/admin-crud";
import { useRouter } from "next/navigation";
import { Plus, FolderPlus, Edit, Trash2, Search, Layers } from "lucide-react";

export default function AdminCategoryManagerClient({ categories }: { categories: any[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    parentId: "",
    attributes: "Size, Color, Fabric, Fit",
  });

  const filteredCategories = categories.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setForm({ name: "", slug: "", description: "", parentId: "", attributes: "Size, Color, Fabric, Fit" });
    setError(null);
    setOpenModal(true);
  };

  const handleOpenEdit = (cat: any) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      parentId: cat.parentId || "",
      attributes: Array.isArray(cat.attributes) ? (cat.attributes as string[]).join(", ") : "Size, Color",
    });
    setError(null);
    setOpenModal(true);
  };

  const handleDelete = async (id: string) => {
    setError(null);
    const res = await deleteCategoryAction(id);
    if (res.success) {
      setNotice("Category deleted successfully.");
      setDeleteConfirmId(null);
      router.refresh();
    } else {
      setError(res.error || "Failed to delete category.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const attrArray = form.attributes.split(",").map((a) => a.trim()).filter(Boolean);

    let res;
    if (editingCategory) {
      res = await updateCategoryAction({
        id: editingCategory.id,
        name: form.name,
        slug: form.slug,
        description: form.description,
        attributes: attrArray,
        parentId: form.parentId || undefined,
      });
    } else {
      res = await createCategoryAction({
        name: form.name,
        description: form.description,
        attributes: attrArray,
        parentId: form.parentId || undefined,
      });
    }

    if (res.success) {
      setOpenModal(false);
      setNotice(editingCategory ? "Category updated!" : "Category created!");
      router.refresh();
    } else {
      setError(res.error || "Category action failed.");
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {notice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-md flex justify-between items-center">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="font-bold">Dismiss</button>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-md">
          {error}
        </div>
      )}

      {/* Control Bar */}
      <div className="bg-white border border-[#E7E5E4] rounded-md p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search category name or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-1.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827] focus:outline-none focus:border-[#111827] w-full sm:w-64"
          />
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-[#111827] hover:bg-[#27272A] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center gap-2"
        >
          <Plus className="w-3.5 h-3.5" /> Add Category
        </button>
      </div>

      {/* Category List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCategories.map((c) => (
          <div key={c.id} className="bg-white border border-[#E7E5E4] rounded-md p-6 space-y-4 relative flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-3 mb-3">
                <div>
                  <h3 className="font-bold text-[#111827] text-sm">{c.name}</h3>
                  <span className="text-[10px] font-mono text-[#6B7280]">/{c.slug}</span>
                </div>
                <span className="px-2.5 py-0.5 bg-[#FAFAF8] text-[#111827] border border-[#E7E5E4] rounded-full text-[10px] font-bold">
                  {c.products?.length || 0} Products
                </span>
              </div>

              <p className="text-xs text-[#6B7280]">{c.description || "No description provided."}</p>

              <div className="pt-3 border-t border-[#E7E5E4] mt-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block mb-1.5">Dynamic Category Attributes</span>
                <div className="flex flex-wrap gap-1.5">
                  {Array.isArray(c.attributes) && (c.attributes as string[]).map((attr) => (
                    <span key={attr} className="px-2 py-0.5 bg-[#FAFAF8] border border-[#E7E5E4] text-[#111827] text-[10px] font-semibold rounded">
                      {attr}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E7E5E4] flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(c)}
                className="px-3 py-1 bg-[#FAFAF8] hover:bg-[#F4F4F0] text-[#111827] border border-[#E7E5E4] rounded text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1"
              >
                <Edit className="w-3 h-3" /> Edit
              </button>

              {deleteConfirmId === c.id ? (
                <div className="inline-flex items-center gap-1 bg-rose-50 border border-rose-200 p-1 rounded">
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="px-2 py-0.5 bg-rose-700 text-white rounded text-[10px] font-bold"
                  >
                    Confirm Delete
                  </button>
                  <button onClick={() => setDeleteConfirmId(null)} className="px-1.5 text-[10px] text-[#6B7280]">
                    X
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirmId(c.id)}
                  className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E5E4] rounded-md p-6 max-w-md w-full space-y-4 shadow-xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827] flex items-center gap-2">
              <FolderPlus className="w-4 h-4" /> {editingCategory ? "Edit Category & Attributes" : "Create Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Category Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
                />
              </div>

              {editingCategory && (
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Slug</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Dynamic Attributes (Comma Separated)</label>
                <input
                  type="text"
                  value={form.attributes}
                  onChange={(e) => setForm({ ...form, attributes: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 bg-[#FAFAF8] text-[#6B7280] text-xs font-bold rounded uppercase border border-[#E7E5E4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#111827] text-white text-xs font-bold rounded uppercase"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
