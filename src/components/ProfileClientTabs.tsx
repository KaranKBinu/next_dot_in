"use client";

import { useState } from "react";
import { updateProfileAction } from "@/app/actions/account";
import {
  createAddressAction,
  updateAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/app/actions/addresses";
import { deleteReviewAction } from "@/app/actions/reviews";
import { AddressSelector } from "@/components/address/AddressSelector";
import { AddressFormData } from "@/components/address/AddressForm";
import LogoutButton from "@/components/LogoutButton";
import { User, MapPin, ShoppingBag, ShieldCheck, Bell, Plus, CheckCircle2, Star, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function ProfileClientTabs({
  user,
  orders,
  addresses,
  reviews = [],
}: {
  user: any;
  orders: any[];
  addresses: any[];
  reviews?: any[];
}) {
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "addresses" | "reviews" | "security">("orders");
  const [profileForm, setProfileForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [msg, setMsg] = useState<string | null>(null);
  const [savedAddresses, setSavedAddresses] = useState(addresses);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || null
  );

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    const res = await deleteReviewAction(reviewId);
    if (res.success) {
      setMsg("Review deleted successfully.");
    }
  };


  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await updateProfileAction(profileForm);
    if (res.success) setMsg("Profile updated successfully!");
  };

  const handleAddAddress = async (data: AddressFormData) => {
    const res = await createAddressAction(data);
    if (res.success && res.address) {
      setMsg("New address added successfully!");
      setSavedAddresses((prev) => [res.address, ...prev]);
      setSelectedAddressId(res.address.id);
    }
  };

  const handleEditAddress = async (id: string, data: AddressFormData) => {
    const res = await updateAddressAction(id, data);
    if (res.success && res.address) {
      setMsg("Address updated successfully!");
      setSavedAddresses((prev) => prev.map((a) => (a.id === id ? res.address : a)));
    }
  };

  const handleDeleteAddress = async (id: string) => {
    const res = await deleteAddressAction(id);
    if (res.success) {
      setMsg("Address deleted successfully.");
      setSavedAddresses((prev) => prev.filter((a) => a.id !== id));
      if (selectedAddressId === id) {
        const remaining = savedAddresses.filter((a) => a.id !== id);
        setSelectedAddressId(remaining[0]?.id || null);
      }
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    const res = await setDefaultAddressAction(id);
    if (res.success) {
      setMsg("Default address updated!");
      setSavedAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }))
      );
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
          onClick={() => setActiveTab("reviews")}
          className={`w-full text-left px-4 py-2.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-2.5 ${
            activeTab === "reviews" ? "bg-[#111827] text-white" : "bg-white text-[#6B7280] hover:text-[#111827] border border-[#E7E5E4]"
          }`}
        >
          <MessageSquare className="w-4 h-4" /> My Reviews ({reviews.length})
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

                  <div className="space-y-3 text-xs">
                    {o.items.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between text-[#111827] pt-2 border-t border-[#FAFAF8] first:border-0 first:pt-0">
                        <div>
                          <span className="font-semibold">{item.name} x {item.quantity}</span>
                          <span className="text-[#6B7280] block text-[11px]">₹{item.price * item.quantity}</span>
                        </div>

                        {o.status === "DELIVERED" && item.product?.slug && (
                          <Link
                            href={`/product/${item.product.slug}#reviews`}
                            className="px-3 py-1 bg-[#111827] hover:bg-[#27272A] text-white rounded text-[10px] font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1"
                          >
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Write Review
                          </Link>
                        )}
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
            <AddressSelector
              addresses={savedAddresses}
              selectedAddressId={selectedAddressId}
              onSelectAddress={(addr) => setSelectedAddressId(addr.id)}
              onAddAddress={handleAddAddress}
              onEditAddress={handleEditAddress}
              onDeleteAddress={handleDeleteAddress}
              onSetDefaultAddress={handleSetDefaultAddress}
            />
          </div>
        )}

        {/* Tab: My Reviews */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827]">My Submitted Product Reviews</h2>
            {reviews.length === 0 ? (
              <div className="bg-white border border-[#E7E5E4] rounded-md p-8 text-center text-xs text-[#9CA3AF] uppercase tracking-wider">
                You have not submitted any product reviews yet.
              </div>
            ) : (
              reviews.map((rev: any) => (
                <div key={rev.id} className="bg-white border border-[#E7E5E4] rounded-lg p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link href={`/product/${rev.product.slug}`} className="font-bold text-xs text-[#111827] hover:underline">
                        {rev.product.name}
                      </Link>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          rev.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : rev.status === "REJECTED"
                            ? "bg-rose-50 text-rose-800 border border-rose-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {rev.status === "PENDING" ? "Awaiting Approval" : rev.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${star <= rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>

                  {rev.title && <p className="text-xs font-bold text-[#111827]">{rev.title}</p>}
                  <p className="text-xs text-[#6B7280] leading-relaxed">{rev.comment}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#FAFAF8]">
                    <span className="text-[10px] text-[#9CA3AF]">
                      Submitted on {new Date(rev.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="text-[10px] text-rose-600 hover:underline font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Delete Review
                    </button>
                  </div>
                </div>
              ))
            )}
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
