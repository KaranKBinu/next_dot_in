"use client";

import { useState } from "react";
import {
  updateCustomerProfileAction,
  resetCustomerPasswordAction,
  addCustomerAddressAction,
  deleteCustomerAddressAction
} from "@/app/actions/customer-management";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  MapPin,
  KeyRound,
  Edit,
  Plus,
  Trash2,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck
} from "lucide-react";

export default function CustomerProfileCrmClient({ customer }: { customer: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"info" | "addresses" | "orders">("info");
  const [notice, setNotice] = useState<string | null>(null);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [infoForm, setInfoForm] = useState({
    name: customer.name || "",
    email: customer.email || "",
    phone: customer.phone || "",
  });

  const [addressForm, setAddressForm] = useState({
    name: customer.name || "",
    phone: customer.phone || "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    isDefault: true,
  });
  const [showAddressModal, setShowAddressModal] = useState(false);

  const totalSpent = customer.orders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await updateCustomerProfileAction({
      userId: customer.id,
      name: infoForm.name,
      email: infoForm.email,
      phone: infoForm.phone,
    });
    if (res.success) {
      setNotice("Customer details updated successfully.");
      router.refresh();
    } else {
      setError(res.error || "Update failed.");
    }
  };

  const handleResetPassword = async () => {
    setError(null);
    const res = await resetCustomerPasswordAction(customer.id);
    if (res.success) {
      setTempPassword(res.temporaryPassword || null);
    } else {
      setError(res.error || "Reset failed.");
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await addCustomerAddressAction({
      userId: customer.id,
      ...addressForm,
    });
    if (res.success) {
      setShowAddressModal(false);
      setNotice("New address added successfully.");
      router.refresh();
    } else {
      setError(res.error || "Address creation failed.");
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    const res = await deleteCustomerAddressAction(addressId, customer.id);
    if (res.success) {
      setNotice("Address removed.");
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/customers" className="p-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded hover:bg-[#F4F4F0] text-[#111827]">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#111827] flex items-center gap-2">
              {customer.name || "Customer Account"}
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full uppercase border border-emerald-200">
                Active Customer
              </span>
            </h1>
            <p className="text-xs text-[#6B7280]">Customer ID: {customer.id}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleResetPassword}
            className="px-3.5 py-1.5 bg-[#FAFAF8] hover:bg-[#F4F4F0] text-[#111827] border border-[#E7E5E4] rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
          >
            <KeyRound className="w-3.5 h-3.5" /> Reset Password
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded flex justify-between items-center">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="font-bold">Dismiss</button>
        </div>
      )}

      {tempPassword && (
        <div className="p-4 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-md space-y-1">
          <p className="font-bold uppercase tracking-wider">Temporary Password Generated</p>
          <p className="font-mono text-sm font-bold">{tempPassword}</p>
          <p className="text-[11px] text-amber-800">Provide this temporary password to the customer to log into their profile.</p>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded">
          {error}
        </div>
      )}

      {/* Profile Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E7E5E4] rounded-md p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Total Orders</span>
          <p className="text-xl font-bold text-[#111827]">{customer.orders.length}</p>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-md p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Total Lifetime Value</span>
          <p className="text-xl font-bold text-[#111827]">₹{totalSpent}</p>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-md p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Saved Addresses</span>
          <p className="text-xl font-bold text-[#111827]">{customer.addresses.length}</p>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-md p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Registration Date</span>
          <p className="text-sm font-bold text-[#111827]">{new Date(customer.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-[#E7E5E4] flex gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("info")}
          className={`pb-2 border-b-2 transition-colors ${activeTab === "info" ? "border-[#111827] text-[#111827]" : "border-transparent text-[#6B7280]"}`}
        >
          Personal Information
        </button>

        <button
          onClick={() => setActiveTab("addresses")}
          className={`pb-2 border-b-2 transition-colors ${activeTab === "addresses" ? "border-[#111827] text-[#111827]" : "border-transparent text-[#6B7280]"}`}
        >
          Saved Addresses ({customer.addresses.length})
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-2 border-b-2 transition-colors ${activeTab === "orders" ? "border-[#111827] text-[#111827]" : "border-transparent text-[#6B7280]"}`}
        >
          Order History ({customer.orders.length})
        </button>
      </div>

      {/* TAB 1: Personal Info Form */}
      {activeTab === "info" && (
        <form onSubmit={handleUpdateInfo} className="bg-white border border-[#E7E5E4] rounded-md p-6 space-y-4 max-w-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Edit Personal Details</h3>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Full Name</label>
            <input
              type="text"
              required
              value={infoForm.name}
              onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
              className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Email Address</label>
            <input
              type="email"
              required
              value={infoForm.email}
              onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
              className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Phone Number</label>
            <input
              type="text"
              placeholder="+91..."
              value={infoForm.phone}
              onChange={(e) => setInfoForm({ ...infoForm, phone: e.target.value })}
              className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#111827] hover:bg-[#27272A] text-white font-semibold rounded text-xs uppercase tracking-wider"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Addresses Management */}
      {activeTab === "addresses" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827]">Customer Address Book</h3>
            <button
              onClick={() => setShowAddressModal(true)}
              className="px-3.5 py-1.5 bg-[#111827] hover:bg-[#27272A] text-white rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Address
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customer.addresses.map((addr: any) => (
              <div key={addr.id} className="bg-white border border-[#E7E5E4] rounded-md p-4 space-y-2 relative text-xs">
                {addr.isDefault && (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-bold rounded uppercase">
                    Default Address
                  </span>
                )}
                <p className="font-bold text-[#111827]">{addr.name}</p>
                <p className="text-[#6B7280]">{addr.street}</p>
                <p className="text-[#6B7280]">{addr.city}, {addr.state} {addr.pincode}</p>
                <p className="text-[#6B7280]">Phone: {addr.phone}</p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleDeleteAddress(addr.id)}
                    className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded border border-rose-200"
                    title="Remove Address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Order History */}
      {activeTab === "orders" && (
        <div className="bg-white border border-[#E7E5E4] rounded-md overflow-hidden text-xs">
          {customer.orders.length === 0 ? (
            <div className="p-12 text-center text-[#6B7280]">No orders placed by this customer yet.</div>
          ) : (
            <table className="w-full text-left text-xs text-[#111827]">
              <thead className="bg-[#FAFAF8] text-[10px] uppercase font-bold text-[#6B7280] border-b border-[#E7E5E4] tracking-wider">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Items</th>
                  <th className="px-6 py-3">Total Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5E4]">
                {customer.orders.map((o: any) => (
                  <tr key={o.id} className="hover:bg-[#FAFAF8]">
                    <td className="px-6 py-3.5 font-mono font-bold">{o.orderNumber}</td>
                    <td className="px-6 py-3.5 text-[#6B7280]">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3.5">{o.items?.length || 0} item(s)</td>
                    <td className="px-6 py-3.5 font-bold">₹{o.totalAmount}</td>
                    <td className="px-6 py-3.5 uppercase font-bold text-[10px]">{o.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E7E5E4] rounded-md p-6 max-w-md w-full space-y-4 shadow-xl text-xs">
            <h3 className="font-bold text-[#111827] text-sm uppercase">Add New Customer Address</h3>
            <form onSubmit={handleAddAddress} className="space-y-3">
              <input
                type="text"
                placeholder="Recipient Full Name"
                required
                value={addressForm.name}
                onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded"
              />
              <input
                type="text"
                placeholder="Phone Number"
                required
                value={addressForm.phone}
                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded"
              />
              <input
                type="text"
                placeholder="Street Address / House No."
                required
                value={addressForm.street}
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded"
                />
                <input
                  type="text"
                  placeholder="State"
                  required
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded"
                />
              </div>
              <input
                type="text"
                placeholder="Pincode / Postal Code"
                required
                value={addressForm.pincode}
                onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 bg-[#FAFAF8] text-[#6B7280] font-bold rounded border border-[#E7E5E4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#111827] text-white font-bold rounded"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
