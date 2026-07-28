"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";
import { createRazorpayOrderAction, completeOrderAction } from "@/app/actions/checkout";
import { CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    const orderRes = await createRazorpayOrderAction(totalAmount);
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
      description: "Order Payment",
      order_id: orderRes.orderId,
      handler: async function (response: any) {
        const completeRes = await completeOrderAction({
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          items,
          totalAmount,
          shippingAddress: formData,
        });

        if (completeRes.success) {
          clearCart();
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

  if (items.length === 0) {
    return (
      <main className="max-w-xl mx-auto px-6 py-16 text-center flex-1 bg-[#FAFAF8]">
        <div className="bg-white border border-[#E7E5E4] rounded-md p-8 text-[#6B7280] text-xs uppercase tracking-wider font-semibold">
          Your shopping bag is empty. Please add items before checking out.
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 sm:px-8 py-12 flex-1 w-full bg-[#FAFAF8]">
      <h1 className="text-2xl font-bold uppercase tracking-wider text-[#111827] mb-8 border-b border-[#E7E5E4] pb-4">Checkout & Shipping</h1>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-md text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleCheckout} className="space-y-6">
        <div className="bg-white border border-[#E7E5E4] rounded-md p-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#111827] mb-4">Contact Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full mt-1 px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-md text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Phone Number</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full mt-1 px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-md text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
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
              className="w-full mt-1 px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-md text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
            />
          </div>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-md p-6 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#111827] mb-4">Shipping Address</h2>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Street Address</label>
            <input
              type="text"
              required
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              className="w-full mt-1 px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-md text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
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
                className="w-full mt-1 px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-md text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">State</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full mt-1 px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-md text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Pincode</label>
              <input
                type="text"
                required
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full mt-1 px-3.5 py-2.5 bg-[#FAFAF8] border border-[#E7E5E4] rounded-md text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#E7E5E4] rounded-md p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#6B7280] font-bold">Total Payable</span>
            <p className="text-2xl font-bold text-[#111827]">₹{totalAmount}</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#111827] hover:bg-[#27272A] text-white font-semibold text-xs uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <CreditCard className="w-4 h-4" />
            {loading ? "Processing..." : "Pay via Razorpay"}
          </button>
        </div>
      </form>
    </main>
  );
}
