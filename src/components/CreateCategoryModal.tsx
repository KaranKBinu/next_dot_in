"use client";

import { useState } from "react";
import { createCategoryAction } from "@/app/actions/account";
import { useRouter } from "next/navigation";
import { Plus, FolderPlus } from "lucide-react";

export default function CreateCategoryModal({ categories }: { categories: any[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState("Size, Color, Fabric, Fit");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const attrArray = attributes.split(",").map((a) => a.trim()).filter(Boolean);
    const res = await createCategoryAction({ name, description, attributes: attrArray });
    if (res.success) {
      setOpen(false);
      setName("");
      setDescription("");
      router.refresh();
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-[#111827] hover:bg-[#27272A] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors flex items-center gap-2"
      >
        <Plus className="w-3.5 h-3.5" /> Add Category
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E5E4] rounded-md p-6 max-w-md w-full space-y-4 shadow-xl">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827] flex items-center gap-2">
              <FolderPlus className="w-4 h-4" /> Create Category & Attributes
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Outerwear"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Description</label>
                <input
                  type="text"
                  placeholder="Category summary"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Dynamic Attributes (Comma Separated)</label>
                <input
                  type="text"
                  value={attributes}
                  onChange={(e) => setAttributes(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
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
    </>
  );
}
