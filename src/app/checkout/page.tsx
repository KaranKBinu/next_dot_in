"use client";

import { useState, useEffect, useCallback } from "react";
import { useCart } from "@/components/CartContext";
import { createRazorpayOrderAction, completeOrderAction } from "@/app/actions/checkout";
import { validateCouponAction } from "@/app/actions/coupons";
import {
  getUserAddressesAction,
  createAddressAction,
  updateAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/app/actions/addresses";
import { SavedAddress } from "@/components/address/AddressCard";
import { AddressSelector } from "@/components/address/AddressSelector";
import { AddressForm, AddressFormData } from "@/components/address/AddressForm";
import { SaveAddressModal } from "@/components/address/SaveAddressModal";
import { CreditCard, Zap, ShoppingBag, ArrowLeft, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNowMode = searchParams.get("mode") === "buynow";

  const { items: cartItems, totalAmount: cartTotalAmount, clearCart, buyNowItem, clearBuyNow } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Address System State
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<SavedAddress | null>(null);
  const [isManualForm, setIsManualForm] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [manualAddressData, setManualAddressData] = useState<AddressFormData | null>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Coupon & Promo State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
    payableAmount: number;
    message: string;
  } | null>(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponMsg, setCouponMsg] = useState<{ success?: string; error?: string } | null>(null);

  // Active items and total calculation based on session mode & applied discount
  const activeItems = isBuyNowMode && buyNowItem ? [buyNowItem] : cartItems;
  const rawSubtotal = isBuyNowMode && buyNowItem
    ? buyNowItem.price * buyNowItem.quantity
    : cartTotalAmount;

  const activeTotalAmount = appliedCoupon ? appliedCoupon.payableAmount : rawSubtotal;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponMsg(null);

    const res = await validateCouponAction(couponCode, rawSubtotal, guestEmail);
    setCouponLoading(false);

    if (res.valid && res.discountAmount !== undefined && res.payableAmount !== undefined) {
      setAppliedCoupon({
        code: res.couponCode!,
        discountAmount: res.discountAmount,
        payableAmount: res.payableAmount,
        message: res.message,
      });
      setCouponMsg({ success: res.message });
    } else {
      setCouponMsg({ error: res.message });
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponMsg(null);
  };

  // Parallel loading of user addresses
  const loadAddresses = useCallback(async () => {
    const res = await getUserAddressesAction();
    if (res.success && res.addresses) {
      setIsLoggedIn(true);
      setSavedAddresses(res.addresses as SavedAddress[]);
      // Automatically select default address or first address
      const defaultAddr = res.addresses.find((a: any) => a.isDefault) || res.addresses[0];
      if (defaultAddr) {
        setSelectedAddress(defaultAddr as SavedAddress);
      } else {
        setIsManualForm(true);
      }
    } else {
      setIsLoggedIn(false);
      setIsManualForm(true);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const handleAddAddress = async (data: AddressFormData) => {
    const res = await createAddressAction(data);
    if (res.success && res.address) {
      await loadAddresses();
      setSelectedAddress(res.address as SavedAddress);
      setIsManualForm(false);
    } else {
      setError(res.error || "Failed to save address.");
    }
  };

  const handleEditAddress = async (id: string, data: AddressFormData) => {
    const res = await updateAddressAction(id, data);
    if (res.success && res.address) {
      await loadAddresses();
      if (selectedAddress?.id === id) {
        setSelectedAddress(res.address as SavedAddress);
      }
    } else {
      setError(res.error || "Failed to update address.");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    const res = await deleteAddressAction(id);
    if (res.success) {
      await loadAddresses();
    } else {
      setError(res.error || "Failed to delete address.");
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    const res = await setDefaultAddressAction(id);
    if (res.success) {
      await loadAddresses();
    } else {
      setError(res.error || "Failed to set default address.");
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Trigger payment with resolved address
  const executePayment = async (resolvedAddress: {
    fullName: string;
    phone: string;
    email: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    area?: string | null;
    landmark?: string | null;
  }) => {
    setLoading(true);
    setError(null);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError("Razorpay SDK failed to load. Check internet connection.");
      setLoading(false);
      return;
    }

    const orderRes = await createRazorpayOrderAction(rawSubtotal, appliedCoupon?.code);
    if (!orderRes.success || !orderRes.orderId) {
      setError(orderRes.error || "Failed to initialize payment.");
      setLoading(false);
      return;
    }

    const options = {
      key: orderRes.keyId,
      amount: orderRes.amount,
      currency: "INR",
      name: "NEXT.IN",
      description: isBuyNowMode ? "Instant Purchase Order" : "Order Payment",
      order_id: orderRes.orderId,
      handler: async function (response: any) {
        const completeRes = await completeOrderAction({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          items: activeItems,
          totalAmount: activeTotalAmount,
          couponCode: appliedCoupon?.code,
          shippingAddress: resolvedAddress,
        });

        if (completeRes.success) {
          if (isBuyNowMode) {
            clearBuyNow();
          } else {
            clearCart();
          }
          router.push(`/profile?orderSuccess=${completeRes.orderNumber}`);
        } else {
          setError(completeRes.error || "Order saving failed after payment.");
        }
      },
      prefill: {
        name: resolvedAddress.fullName,
        email: resolvedAddress.email,
        contact: resolvedAddress.phone,
      },
      theme: {
        color: "#111827",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setLoading(false);
  };

  const handleManualFormSubmit = (data: AddressFormData) => {
    setManualAddressData(data);
    if (isLoggedIn) {
      // Prompt logged in user if they want to save this address
      setShowSaveModal(true);
    } else {
      // Proceed directly for guest
      executePayment({
        fullName: data.fullName,
        phone: data.phone,
        email: guestEmail,
        street: data.street,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        area: data.area,
        landmark: data.landmark,
      });
    }
  };

  const handleConfirmSaveAddress = async (makeDefault: boolean) => {
    if (!manualAddressData) return;
    setLoading(true);
    await createAddressAction({ ...manualAddressData, isDefault: makeDefault });
    setShowSaveModal(false);
    await executePayment({
      fullName: manualAddressData.fullName,
      phone: manualAddressData.phone,
      email: guestEmail,
      street: manualAddressData.street,
      city: manualAddressData.city,
      state: manualAddressData.state,
      pincode: manualAddressData.pincode,
      area: manualAddressData.area,
      landmark: manualAddressData.landmark,
    });
  };

  const handleSavedAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddress) {
      setError("Please select or add a shipping address.");
      return;
    }
    executePayment({
      fullName: selectedAddress.fullName,
      phone: selectedAddress.phone,
      email: guestEmail,
      street: selectedAddress.street,
      city: selectedAddress.city,
      state: selectedAddress.state,
      pincode: selectedAddress.pincode,
      area: selectedAddress.area,
      landmark: selectedAddress.landmark,
    });
  };

  if (activeItems.length === 0) {
    return (
      <main className="max-w-xl mx-auto px-6 py-16 text-center flex-1 bg-[#FAFAF8]">
        <div className="bg-white border border-[#E7E5E4] rounded-xl p-8 space-y-4 shadow-xs">
          <ShoppingBag className="w-10 h-10 mx-auto text-[#9CA3AF]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#111827]">
            {isBuyNowMode ? "No Instant Purchase Item Found" : "Your Shopping Bag is Empty"}
          </h2>
          <p className="text-xs text-[#6B7280]">
            Please select a garment before checking out.
          </p>
          <Link
            href="/catalog"
            className="px-6 py-3 bg-[#111827] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#27272A] inline-flex items-center gap-2"
          >
            Explore Catalog
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-8 py-8 sm:py-12 flex-1 w-full bg-[#FAFAF8]">
      {/* Header Banner */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 border-b border-[#E7E5E4] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-[#111827]">
              {isBuyNowMode ? "Instant Direct Checkout" : "Checkout & Shipping"}
            </h1>
          </div>
          <p className="text-xs text-[#6B7280] font-semibold mt-1">
            {isBuyNowMode
              ? "Direct single-item checkout — Your main shopping bag remains intact."
              : "Complete your order details below."}
          </p>
        </div>

        {isBuyNowMode && cartItems.length > 0 && (
          <Link
            href="/cart"
            className="text-xs font-bold text-[#111827] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Bag ({cartItems.length})</span>
          </Link>
        )}
      </div>

      {/* Summary Box of Items Being Purchased */}
      <div className="mb-6 bg-white border border-[#E7E5E4] rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280]">Order Summary</h2>
        <div className="space-y-3">
          {activeItems.map((item) => (
            <div key={item.productId} className="flex items-center justify-between text-xs border-b border-[#F4F4F0] pb-2 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#F4F4F0] border border-[#E7E5E4] rounded-md flex items-center justify-center font-bold text-[#6B7280] overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{item.name?.[0]}</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-[#111827]">{item.name}</p>
                  <p className="text-[11px] text-[#6B7280]">Qty: {item.quantity} × ₹{item.price}</p>
                </div>
              </div>
              <span className="font-black text-[#111827]">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        {/* Collapsible Coupon Section */}
        <div className="pt-3 border-t border-[#E7E5E4] space-y-2">
          {appliedCoupon ? (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                  ✓ {appliedCoupon.code}
                </span>
                <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                  Saved ₹{appliedCoupon.discountAmount}
                </p>
              </div>
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="text-[10px] text-rose-600 hover:underline font-bold uppercase cursor-pointer"
              >
                Remove
              </button>
            </div>
          ) : (
            <details className="group text-xs">
              <summary className="font-bold text-[#6B7280] hover:text-[#111827] cursor-pointer flex items-center justify-between list-none py-1">
                <span>Have a promo code?</span>
                <span className="text-[10px] uppercase font-bold text-[#111827] group-open:hidden">+ Enter Code</span>
              </summary>
              <form onSubmit={handleApplyCoupon} className="mt-2.5 flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter Promo Code"
                  className="flex-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded-lg text-xs font-mono font-bold uppercase focus:outline-none focus:border-[#111827]"
                />
                <button
                  type="submit"
                  disabled={couponLoading || !couponCode.trim()}
                  className="px-4 py-2 bg-[#111827] hover:bg-[#27272A] text-white rounded-lg text-xs font-bold uppercase tracking-wider disabled:opacity-50 cursor-pointer"
                >
                  {couponLoading ? "Validating..." : "Apply"}
                </button>
              </form>
            </details>
          )}

          {couponMsg && (
            <p className={`text-[11px] font-semibold mt-1 ${couponMsg.success ? "text-emerald-700" : "text-rose-700"}`}>
              {couponMsg.success || couponMsg.error}
            </p>
          )}
        </div>

        {/* Pricing Subtotal & Discount Breakdown */}
        <div className="pt-3 border-t border-[#E7E5E4] space-y-1.5 text-xs font-semibold">
          <div className="flex justify-between text-[#6B7280]">
            <span>Subtotal</span>
            <span>₹{rawSubtotal}</span>
          </div>

          {appliedCoupon && (
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Promo Discount ({appliedCoupon.code})</span>
              <span>-₹{appliedCoupon.discountAmount}</span>
            </div>
          )}

          <div className="flex justify-between text-[#6B7280]">
            <span>Shipping</span>
            <span className="text-emerald-700 font-bold">FREE</span>
          </div>

          <div className="flex justify-between text-sm font-black text-[#111827] pt-2 border-t border-[#E7E5E4]">
            <span>Total Payable</span>
            <span>₹{activeTotalAmount}</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold">
          {error}
        </div>
      )}

      {/* Email Address Section */}
      <div className="mb-6 bg-white border border-[#E7E5E4] rounded-xl p-5 sm:p-6 shadow-xs">
        <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280] block mb-1">
          Contact Email Address *
        </label>
        <input
          type="email"
          required
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
          placeholder="For order receipts and tracking updates"
          className="w-full px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
        />
      </div>

      {/* Address Selector or Form */}
      {isLoggedIn && savedAddresses.length > 0 && !isManualForm ? (
        <form onSubmit={handleSavedAddressSubmit} className="space-y-6">
          <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
            <AddressSelector
              addresses={savedAddresses}
              selectedAddressId={selectedAddress?.id || null}
              onSelectAddress={(addr) => setSelectedAddress(addr)}
              onAddAddress={handleAddAddress}
              onEditAddress={handleEditAddress}
              onDeleteAddress={handleDeleteAddress}
              onSetDefaultAddress={handleSetDefaultAddress}
            />
          </div>

          <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#6B7280] font-bold">Total Payable</span>
              <p className="text-2xl font-black text-[#111827]">₹{activeTotalAmount}</p>
            </div>

            <button
              type="submit"
              disabled={loading || !selectedAddress}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#111827] hover:bg-[#27272A] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 min-h-[48px] shadow-md cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              {loading ? "Encrypting Order..." : isBuyNowMode ? "Complete Instant Purchase" : "Complete Order & Pay"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#111827]">
              Shipping Address & Details
            </h2>
            {isLoggedIn && savedAddresses.length > 0 && (
              <button
                type="button"
                onClick={() => setIsManualForm(false)}
                className="text-xs font-bold text-[#111827] hover:underline cursor-pointer"
              >
                Use Saved Addresses
              </button>
            )}
          </div>

          <AddressForm
            onSubmit={handleManualFormSubmit}
            isSubmitting={loading}
            submitLabel={isBuyNowMode ? "Proceed to Instant Checkout" : "Proceed to Payment"}
          />
        </div>
      )}

      {/* Modal Prompt to Save Address for Logged In User */}
      <SaveAddressModal
        isOpen={showSaveModal}
        onClose={() => {
          setShowSaveModal(false);
          if (manualAddressData) {
            executePayment({
              fullName: manualAddressData.fullName,
              phone: manualAddressData.phone,
              email: guestEmail,
              street: manualAddressData.street,
              city: manualAddressData.city,
              state: manualAddressData.state,
              pincode: manualAddressData.pincode,
              area: manualAddressData.area,
              landmark: manualAddressData.landmark,
            });
          }
        }}
        onConfirmSave={handleConfirmSaveAddress}
        isSubmitting={loading}
      />
    </main>
  );
}

