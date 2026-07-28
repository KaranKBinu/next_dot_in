"use client";

import { useState } from "react";
import { updateProfileAction, addAddressAction } from "@/app/actions/account";
import LogoutButton from "@/components/LogoutButton";
import { User, MapPin, ShoppingBag, ShieldCheck, Bell, Plus, CheckCircle2 } from "lucide-react";

export default function ProfileClientTabs({
  user,
  orders,
  addresses,
}: {
  user: any;
  orders: any[];
  addresses: any[];
}) {
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses" | "security" | "preferences">("orders");
  const [profileForm, setProfileForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [addressForm, setAddressForm] = useState({ fullName: "", street: "", city: "", state: "", pincode: "", phone: "", isDefault: true });
  const [msg, setMsg] = useState<string | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateProfileAction(profileForm);
    if (res.success) setMsg("Profile updated successfully!");
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await addAddressAction(addressForm);
    if (res.success) {
      setMsg("Address added successfully!");
      setAddressForm({ fullName: "", street: "", city: "", state: "", pincode: "", phone: "", isDefault: false });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Sidebar Nav */}
      <div className="md:col-span-3 space-y-1">
        <button
          onClick={() => setActiveTab("orders")}
          className={`w-full text-left px-4 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2.5 ${
            activeTab === "orders" ? "bg-[#111827] text-white" : "bg-white text-[#6B7280] hover:text-[#111827] border border-[#E7E5E4]"
          }`}
        >
          <ShoppingBag className="w-4 h-4" /> Order History ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab("addresses")}
          className={`w-full text-left px-4 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2.5 ${
            activeTab === "addresses" ? "bg-[#111827] text-white" : "bg-white text-[#6B7280] hover:text-[#111827] border border-[#E7E5E4]"
          }`}
        >
          <MapPin className="w-4 h-4" /> Saved Addresses ({addresses.length})
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`w-full text-left px-4 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2.5 ${
            activeTab === "profile" ? "bg-[#111827] text-white" : "bg-white text-[#6B7280] hover:text-[#111827] border border-[#E7E5E4]"
          }`}
        >
          <User className="w-4 h-4" /> Personal Information
        </button>

        <button
          onClick={() => setActiveTab("security")}
          className={`w-full text-left px-4 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2.5 ${
            activeTab === "security" ? "bg-[#111827] text-white" : "bg-white text-[#6B7280] hover:text-[#111827] border border-[#E7E5E4]"
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Security & Password
        </button>

        <button
          onClick={() => setActiveTab("preferences")}
          className={`w-full text-left px-4 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2.5 ${
            activeTab === "preferences" ? "bg-[#111827] text-white" : "bg-white text-[#6B7280] hover:text-[#111827] border border-[#E7E5E4]"
          }`}
        >
          <Bell className="w-4 h-4" /> Preferences
        </button>

        <div className="pt-4">
          <LogoutButton />
        </div>
      </div>

      {/* Main Tab View */}
      <div className="md:col-span-9">
        {msg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> {msg}
          </div>
        )}

        {/* Tab: Order History */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Order History & Details</h2>
            {orders.length === 0 ? (
              <div className="bg-white border border-[#E7E5E4] rounded-md p-8 text-center text-xs text-[#6B7280]">
                No orders recorded under this customer account yet.
              </div>
            ) : (
              orders.map((o) => (
                <div key={o.id} className="bg-white border border-[#E7E5E4] rounded-md p-6">
                  <div className="flex justify-between border-b border-[#E7E5E4] pb-3 mb-3 text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#111827]">{o.orderNumber}</span>
                      <p className="text-[11px] text-[#6B7280]">{new Date(o.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[10px] font-bold uppercase">
                        {o.status}
                      </span>
                      <p className="font-bold text-[#111827] mt-1">₹{o.totalAmount}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    {o.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-[#111827]">
                        <span>{item.name} x {item.quantity}</span>
                        <span className="text-[#6B7280]">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab: Saved Addresses */}
        {activeTab === "addresses" && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Saved Shipping Addresses</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((a) => (
                <div key={a.id} className="bg-white border border-[#E7E5E4] rounded-md p-5 text-xs space-y-1">
                  {a.isDefault && (
                    <span className="px-2 py-0.5 bg-[#111827] text-white text-[10px] font-bold rounded uppercase inline-block mb-2">
                      Default Shipping Address
                    </span>
                  )}
                  <p className="font-bold text-[#111827]">{a.fullName}</p>
                  <p className="text-[#6B7280]">{a.street}</p>
                  <p className="text-[#6B7280]">{a.city}, {a.state} - {a.pincode}</p>
                  <p className="text-[#6B7280]">Phone: {a.phone}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleAddAddress} className="bg-white border border-[#E7E5E4] rounded-md p-6 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#111827] flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" /> Add New Shipping Address
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={addressForm.fullName}
                  onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                  className="px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  required
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  className="px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs"
                />
              </div>

              <input
                type="text"
                placeholder="Street Address"
                required
                value={addressForm.street}
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                className="w-full px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs"
              />

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  required
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  className="px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs"
                />
                <input
                  type="text"
                  placeholder="State"
                  required
                  value={addressForm.state}
                  onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                  className="px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs"
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  required
                  value={addressForm.pincode}
                  onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                  className="px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs"
                />
              </div>

              <button type="submit" className="px-4 py-2 bg-[#111827] text-white text-xs font-bold rounded uppercase">
                Save Address
              </button>
            </form>
          </div>
        )}

        {/* Tab: Personal Information */}
        {activeTab === "profile" && (
          <form onSubmit={handleUpdateProfile} className="bg-white border border-[#E7E5E4] rounded-md p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Personal Information</h2>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full mt-1 px-3.5 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Phone Number</label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full mt-1 px-3.5 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs"
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-[#111827] text-white text-xs font-bold rounded uppercase">
              Update Profile
            </button>
          </form>
        )}

        {/* Tab: Security */}
        {activeTab === "security" && (
          <div className="bg-white border border-[#E7E5E4] rounded-md p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Security & Password Recovery</h2>
            <p className="text-xs text-[#6B7280]">Request a password reset link sent directly to your registered email address ({user?.email}).</p>
            <button
              onClick={() => alert("Password reset token dispatched to " + user?.email)}
              className="px-4 py-2 bg-[#111827] text-white text-xs font-bold rounded uppercase"
            >
              Send Password Reset Link
            </button>
          </div>
        )}

        {/* Tab: Preferences */}
        {activeTab === "preferences" && (
          <div className="bg-white border border-[#E7E5E4] rounded-md p-6 space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827]">Communication Preferences</h2>
            <label className="flex items-center gap-3 text-xs text-[#111827] font-semibold">
              <input type="checkbox" defaultChecked className="accent-[#111827]" />
              Receive Order Tracking Updates & Delivery Notifications via SMS & Email
            </label>
            <label className="flex items-center gap-3 text-xs text-[#111827] font-semibold">
              <input type="checkbox" defaultChecked className="accent-[#111827]" />
              Receive Curated Seasonal Collection Drop Announcements
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
