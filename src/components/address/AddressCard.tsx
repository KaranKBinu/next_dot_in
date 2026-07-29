"use client";

import React from "react";
import { Check, Edit2, Trash2, Star, MapPin } from "lucide-react";

export type SavedAddress = {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  area?: string | null;
  city: string;
  state: string;
  pincode: string;
  landmark?: string | null;
  isDefault: boolean;
};

interface AddressCardProps {
  address: SavedAddress;
  isSelected: boolean;
  onSelect: (address: SavedAddress) => void;
  onEdit?: (address: SavedAddress) => void;
  onDelete?: (id: string) => void;
  onSetDefault?: (id: string) => void;
}

export function AddressCard({
  address,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  return (
    <div
      onClick={() => onSelect(address)}
      className={`relative p-4 sm:p-5 rounded-xl border transition-all duration-200 cursor-pointer select-none ${
        isSelected
          ? "bg-white border-[#111827] shadow-md ring-1 ring-[#111827]"
          : "bg-[#FAFAF8] border-[#E7E5E4] hover:border-[#9CA3AF]"
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div
            className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
              isSelected ? "border-[#111827] bg-[#111827]" : "border-[#9CA3AF] bg-white"
            }`}
          >
            {isSelected && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
          </div>

          <span className="font-bold text-xs sm:text-sm text-[#111827]">{address.fullName}</span>

          {address.isDefault && (
            <span className="px-2 py-0.5 rounded-md bg-[#111827] text-white text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1">
              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              Default
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {onEdit && (
            <button
              onClick={() => onEdit(address)}
              className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#F4F4F0] rounded-md transition-colors"
              title="Edit Address"
              aria-label="Edit Address"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && !address.isDefault && (
            <button
              onClick={() => onDelete(address.id)}
              className="p-1.5 text-[#9CA3AF] hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
              title="Delete Address"
              aria-label="Delete Address"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Address Details */}
      <div className="pl-6 space-y-0.5 text-xs text-[#6B7280]">
        <p className="font-semibold text-[#111827]">{address.street}</p>
        {(address.area || address.landmark) && (
          <p>
            {[address.area, address.landmark ? `(Near ${address.landmark})` : null]
              .filter(Boolean)
              .join(" ")}
          </p>
        )}
        <p>
          {address.city}, {address.state} — <span className="font-bold text-[#111827]">{address.pincode}</span>
        </p>
        <p className="pt-1 text-[11px] font-medium text-[#4B5563]">Ph: {address.phone}</p>
      </div>

      {/* Set as Default Link if not default */}
      {!address.isDefault && onSetDefault && (
        <div className="pl-6 mt-3 pt-2 border-t border-[#E7E5E4]" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => onSetDefault(address.id)}
            className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] hover:text-[#111827] hover:underline"
          >
            Set as default address
          </button>
        </div>
      )}
    </div>
  );
}
