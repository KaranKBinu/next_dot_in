"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { createRazorpayOrderAction, completeOrderAction } from "@/app/actions/checkout";
import { CreditCard, Zap, ShoppingBag, ArrowLeft } from "lucide-react";
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

  // Active items and total calculation based on session mode
  const activeItems = isBuyNowMode && buyNowItem ? [buyNowItem] : cartItems;
  const activeTotalAmount = isBuyNowMode && buyNowItem
    ? buyNowItem.price * buyNowItem.quantity
    : cartTotalAmount;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

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

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setError("Razorpay SDK failed to load. Check internet connection.");
      setLoading(false);
      return;
    }

    const orderRes = await createRazorpayOrderAction(activeTotalAmount);
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
          shippingAddress: formData,
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
        name: formData.fullName,
        email: formData.email,
        contact: formData.phone,
      },
      theme: {
        color: "#111827",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
    setLoading(false);
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
            {isBuyNowMode && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#111827] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                Buy Now
              </span>
            )}
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
      <div className="mb-6 bg-white border border-[#E7E5E4] rounded-xl p-4 sm:p-5 shadow-xs">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#6B7280] mb-3">Order Summary</h2>
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
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleCheckout} className="space-y-6">
        <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 sm:p-6 space-y-4 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#111827] mb-4">Contact Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full mt-1 px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full mt-1 px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full mt-1 px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
            />
          </div>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 sm:p-6 space-y-4 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#111827] mb-4">Shipping Address</h2>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Street Address</label>
            <input
              type="text"
              required
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              className="w-full mt-1 px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full mt-1 px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">State</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full mt-1 px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Pincode</label>
              <input
                type="text"
                required
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full mt-1 px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xs">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#6B7280] font-bold">Total Payable</span>
            <p className="text-2xl font-black text-[#111827]">₹{activeTotalAmount}</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#111827] hover:bg-[#27272A] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 min-h-[48px] shadow-md cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            {loading ? "Encrypting Order..." : isBuyNowMode ? "Complete Instant Purchase" : "Complete Order & Pay"}
          </button>
        </div>
      </form>
    </main>
  );
}
