"use client";

import React, { useState } from "react";
import { AddressCard, SavedAddress } from "./AddressCard";
import { AddressForm, AddressFormData } from "./AddressForm";
import { Plus, MapPin } from "lucide-react";

interface AddressSelectorProps {
  addresses: SavedAddress[];
  selectedAddressId: string | null;
  onSelectAddress: (address: SavedAddress) => void;
  onAddAddress: (data: AddressFormData) => Promise<void>;
  onEditAddress: (id: string, data: AddressFormData) => Promise<void>;
  onDeleteAddress: (id: string) => Promise<void>;
  onSetDefaultAddress: (id: string) => Promise<void>;
}

export function AddressSelector({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddAddress,
  onEditAddress,
  onDeleteAddress,
  onSetDefaultAddress,
}: AddressSelectorProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = async (data: AddressFormData) => {
    setLoading(true);
    try {
      if (editingAddress) {
        await onEditAddress(editingAddress.id, data);
        setEditingAddress(null);
      } else {
        await onAddAddress(data);
        setShowForm(false);
      }
    } finally {
      setLoading(false);
    }
  };

  if (showForm || editingAddress) {
    return (
      <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 sm:p-6 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] mb-4">
          {editingAddress ? "Edit Shipping Address" : "Add New Shipping Address"}
        </h3>
        <AddressForm
          initialValues={
            editingAddress
              ? {
                  ...editingAddress,
                  area: editingAddress.area || "",
                  landmark: editingAddress.landmark || "",
                }
              : undefined
          }
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingAddress(null);
          }}
          isSubmitting={loading}
          submitLabel={editingAddress ? "Update Address" : "Save & Select Address"}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
          Select Delivery Address ({addresses.length})
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="text-xs font-bold text-[#111827] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Address</span>
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white border border-[#E7E5E4] rounded-xl p-8 text-center space-y-3">
          <MapPin className="w-8 h-8 text-[#9CA3AF] mx-auto" />
          <p className="text-xs font-bold uppercase tracking-wider text-[#111827]">No saved addresses yet</p>
          <p className="text-xs text-[#6B7280]">Add a delivery address to complete your order seamlessly.</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-[#111827] hover:bg-[#27272A] text-white rounded-xl text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add New Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              isSelected={selectedAddressId === addr.id}
              onSelect={onSelectAddress}
              onEdit={(a) => setEditingAddress(a)}
              onDelete={onDeleteAddress}
              onSetDefault={onSetDefaultAddress}
            />
          ))}
        </div>
      )}
    </div>
  );
}
