"use client";

import React, { useState } from "react";
import { X, BookmarkPlus } from "lucide-react";

interface SaveAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSave: (makeDefault: boolean) => Promise<void>;
  isSubmitting?: boolean;
}

export function SaveAddressModal({
  isOpen,
  onClose,
  onConfirmSave,
  isSubmitting = false,
}: SaveAddressModalProps) {
  const [makeDefault, setMakeDefault] = useState(true);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl border border-[#E7E5E4] shadow-2xl p-6 space-y-5 animate-slide-in-up sm:animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg">
              <BookmarkPlus className="w-4 h-4 text-[#111827]" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-[#111827]">
              Save Address to Profile?
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#F4F4F0] rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#6B7280] leading-relaxed">
          Would you like to save this delivery address to your account for faster, one-click checkout on future purchases?
        </p>

        <div className="flex items-center gap-2 bg-[#FAFAF8] p-3 rounded-xl border border-[#E7E5E4]">
          <input
            type="checkbox"
            id="makeDefaultModal"
            checked={makeDefault}
            onChange={(e) => setMakeDefault(e.target.checked)}
            className="w-4 h-4 rounded border-[#E7E5E4] text-[#111827] focus:ring-0 cursor-pointer"
          />
          <label htmlFor="makeDefaultModal" className="text-xs font-bold text-[#111827] cursor-pointer">
            Set as my primary default address
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-[#FAFAF8] hover:bg-[#E7E5E4] border border-[#E7E5E4] rounded-xl text-xs font-bold text-[#6B7280] uppercase tracking-wider cursor-pointer"
          >
            Use This Time Only
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onConfirmSave(makeDefault)}
            className="flex-1 py-3 px-4 bg-[#111827] hover:bg-[#27272A] active:scale-[0.98] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-md min-h-[44px] flex items-center justify-center"
          >
            {isSubmitting ? "Saving..." : "Save Address"}
          </button>
        </div>
      </div>
    </div>
  );
}
