"use client";

import React, { useState, useEffect } from "react";
import { fetchPincodeDetails, PincodeData } from "@/lib/pincode";
import { MapPin, Loader2, CheckCircle2 } from "lucide-react";

export type AddressFormData = {
  fullName: string;
  phone: string;
  pincode: string;
  area: string;
  city: string;
  state: string;
  street: string;
  landmark: string;
  isDefault?: boolean;
};

interface AddressFormProps {
  initialValues?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => void;
  onCancel?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function AddressForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save & Use Address",
  isSubmitting = false,
}: AddressFormProps) {
  const [formData, setFormData] = useState<AddressFormData>({
    fullName: initialValues?.fullName || "",
    phone: initialValues?.phone || "",
    pincode: initialValues?.pincode || "",
    area: initialValues?.area || "",
    city: initialValues?.city || "",
    state: initialValues?.state || "",
    street: initialValues?.street || "",
    landmark: initialValues?.landmark || "",
    isDefault: initialValues?.isDefault || false,
  });

  const [availableAreas, setAvailableAreas] = useState<string[]>([]);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeSuccess, setPincodeSuccess] = useState(false);
  const [pincodeError, setPincodeError] = useState<string | null>(null);

  // Debounced 6-digit Pincode Auto-Fill
  useEffect(() => {
    const cleanPin = formData.pincode.trim();
    if (cleanPin.length !== 6 || !/^[1-9][0-9]{5}$/.test(cleanPin)) {
      setPincodeSuccess(false);
      setPincodeError(cleanPin.length === 6 ? "Invalid Indian Pincode format" : null);
      return;
    }

    let isMounted = true;
    const timer = setTimeout(async () => {
      setPincodeLoading(true);
      setPincodeError(null);

      const res: PincodeData | null = await fetchPincodeDetails(cleanPin);

      if (isMounted) {
        setPincodeLoading(false);
        if (res) {
          setPincodeSuccess(true);
          setAvailableAreas(res.areas);
          setFormData((prev) => ({
            ...prev,
            city: res.city,
            state: res.state,
            area: res.areas.length > 0 ? (res.areas.includes(prev.area) ? prev.area : res.areas[0]) : prev.area,
          }));
        } else {
          setPincodeSuccess(false);
          setPincodeError("Pincode lookup failed. Please enter city/state manually.");
        }
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [formData.pincode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Enter your full name"
            className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="10-digit mobile number"
            className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
          />
        </div>
      </div>

      {/* Pincode with Auto-fill indicator */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">
            Pincode *
          </label>
          {pincodeLoading && (
            <span className="text-[10px] text-[#6B7280] font-semibold flex items-center gap-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Fetching location...
            </span>
          )}
          {pincodeSuccess && (
            <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Auto-filled location
            </span>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            required
            maxLength={6}
            value={formData.pincode}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, "") })}
            placeholder="6-digit Pincode (e.g. 110001)"
            className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-xl text-xs text-[#111827] font-semibold focus:outline-none focus:border-[#111827]"
          />
          <MapPin className="w-4 h-4 text-[#9CA3AF] absolute right-3.5 top-2.5 pointer-events-none" />
        </div>
        {pincodeError && <p className="text-[10px] text-rose-600 font-semibold mt-1">{pincodeError}</p>}
      </div>

      {/* Area / Locality */}
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
          Area / Locality / Post Office
        </label>
        {availableAreas.length > 0 ? (
          <select
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
          >
            {availableAreas.map((areaName) => (
              <option key={areaName} value={areaName}>
                {areaName}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={formData.area}
            onChange={(e) => setFormData({ ...formData, area: e.target.value })}
            placeholder="Area or Locality name"
            className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
          />
        )}
      </div>

      {/* City & State */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
            City / District *
          </label>
          <input
            type="text"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="City"
            className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
            State *
          </label>
          <input
            type="text"
            required
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            placeholder="State"
            className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
          />
        </div>
      </div>

      {/* Street Address */}
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
          Street Address (Flat / House No. / Building) *
        </label>
        <input
          type="text"
          required
          value={formData.street}
          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          placeholder="House No., Building, Street Name"
          className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
        />
      </div>

      {/* Landmark */}
      <div>
        <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
          Landmark (Optional)
        </label>
        <input
          type="text"
          value={formData.landmark}
          onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
          placeholder="Nearby landmark (e.g. Near City Park)"
          className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
        />
      </div>

      {/* Default Checkbox */}
      <div className="flex items-center gap-2 pt-1">
        <input
          type="checkbox"
          id="isDefault"
          checked={formData.isDefault}
          onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
          className="w-4 h-4 rounded border-[#E7E5E4] text-[#111827] focus:ring-0 cursor-pointer"
        />
        <label htmlFor="isDefault" className="text-xs font-semibold text-[#111827] cursor-pointer">
          Make this my default address
        </label>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-[#FAFAF8] hover:bg-[#E7E5E4] border border-[#E7E5E4] rounded-xl text-xs font-bold text-[#111827] uppercase tracking-wider cursor-pointer"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 px-4 bg-[#111827] hover:bg-[#27272A] active:scale-[0.98] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-sm min-h-[44px] flex items-center justify-center gap-2"
        >
          {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          <span>{submitLabel}</span>
        </button>
      </div>
    </form>
  );
}
