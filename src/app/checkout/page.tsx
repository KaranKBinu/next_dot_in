"use client";

import React, { Suspense, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/components/Cart/CartContext";
import { useNavbar } from "@/components/Navbar/NavbarContext";
import { TRANSLATIONS, formatINR } from "@/utils/i18n";
import { PRODUCTS, Product, ProductVariant } from "@/utils/catalog";
import Typography from "@/components/Typography";
import { 
    CreditCard, 
    User, 
    Phone, 
    MapPin, 
    ArrowRight, 
    CheckCircle, 
    Sparkles, 
    ArrowLeft, 
    Info, 
    ShieldCheck,
    Check
} from "lucide-react";
import { useRazorpay } from "react-razorpay";

// Adjectives, Colors, and Nouns lists for dynamic reservation code generation
const ADJECTIVES = ["cool", "retro", "sweet", "happy", "fuzzy", "cozy", "bright", "golden", "funky", "classic", "vintage", "wild", "gentle", "fancy", "smart"];
const COLORS = ["blue", "green", "red", "yellow", "orange", "purple", "pink", "brown", "black", "white", "grey", "silver", "gold", "bronze", "indigo"];
const NOUNS = ["jacket", "denim", "shirt", "pants", "cargo", "tee", "sweater", "fleece", "knit", "boots", "cap", "socks", "scarf", "vest", "coat"];

function generateReservationCode(): string {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    return `${adj}-${color}-${noun}`;
}

interface OrderItem {
    sku: string;
    nameKey: string;
    brand: string;
    size: string;
    colorName: string;
    priceInRupees: number;
    imagePath: string;
}

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { locale } = useNavbar();
    const t = TRANSLATIONS[locale];
    const { cartItems, clearCart, reservationCode: cartResCode } = useCart();

    const directBuySku = searchParams.get("sku");

    // Checkout steps: "billing" | "payment" | "success"
    const [step, setStep] = useState<"billing" | "payment" | "success">("billing");

    // Form inputs
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [pincode, setPincode] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Payment inputs
    const [isVerifying, setIsVerifying] = useState(false);
    const { Razorpay } = useRazorpay();

    // Final order states
    const [generatedCode, setGeneratedCode] = useState("");
    


    const [dbProducts, setDbProducts] = useState<any[]>([]);

    useEffect(() => {
        if (directBuySku) {
            fetch("/api/products")
                .then((r) => r.json())
                .then((data) => setDbProducts(data))
                .catch((err) => console.error("Failed to load products for checkout:", err));
        }
    }, [directBuySku]);

    // Resolve items and pricing
    const checkoutItems = useMemo<OrderItem[]>(() => {
        if (directBuySku) {
            // Find specific variant in database products
            const matched = dbProducts.find(p => p.sku === directBuySku);
            if (matched) {
                return [{
                    sku: matched.sku,
                    nameKey: matched.name,
                    brand: matched.brand,
                    size: matched.size,
                    colorName: matched.colorName,
                    priceInRupees: matched.priceInRupees,
                    imagePath: matched.imagePath
                }];
            }
            return [];
        } else {
            // Use cart items
            return cartItems.map(item => ({
                sku: item.id,
                nameKey: item.nameKey,
                brand: item.brand,
                size: item.size,
                colorName: item.colorName || "",
                priceInRupees: item.priceInRupees,
                imagePath: item.imagePath
            }));
        }
    }, [directBuySku, cartItems, dbProducts]);

    const subtotal = useMemo(() => {
        return checkoutItems.reduce((acc, item) => acc + item.priceInRupees, 0);
    }, [checkoutItems]);

    const total = subtotal; // Free shipping

    // If no items, show empty checkout alert
    if (checkoutItems.length === 0 && step !== "success") {
        return (
            <main className="flex-1 bg-white dark:bg-neutral-950 py-24 text-center space-y-6">
                <div className="max-w-md mx-auto space-y-4">
                    <Typography variant="h2" className="text-neutral-900 dark:text-white font-black">
                        No Items to Check Out
                    </Typography>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Please add an item to your cart or select Buy Now on a product page.
                    </p>
                    <Link href="/catalog/all" className="inline-flex items-center gap-2 px-6 py-3.5 bg-primary-500 hover:bg-primary-400 text-white font-bold rounded-xl transition-all shadow-md">
                        Explore Catalog
                    </Link>
                </div>
            </main>
        );
    }

    // Billing Form validation
    const handleNextStep = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};

        if (!name.trim()) newErrors.name = "Full Name is required";
        if (!phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!/^\d{10}$/.test(phone.trim())) {
            newErrors.phone = "Enter a valid 10-digit phone number";
        }
        if (!address.trim()) newErrors.address = "Delivery address is required";
        if (!pincode.trim()) {
            newErrors.pincode = "Pin Code is required";
        } else if (!/^\d{6}$/.test(pincode.trim())) {
            newErrors.pincode = "Enter a valid 6-digit pin code";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setIsVerifying(true);

        const code = directBuySku ? generateReservationCode() : (cartResCode || generateReservationCode());
        const orderId = `ORD-${Date.now().toString().slice(-6)}`;

        try {
            const res = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: orderId,
                    name,
                    phone,
                    address,
                    pincode,
                    total,
                    reservationCode: code,
                    directBuy: !!directBuySku,
                    items: checkoutItems
                })
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || "Failed to create order");
            }
            
            const options: any = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
                amount: total * 100,
                currency: "INR",
                name: "next.in",
                description: "Vintage Clothing",
                order_id: data.razorpayOrderId,
                handler: async (response: any) => {
                    const verifyRes = await fetch("/api/verify-payment", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            dbOrderId: data.orderId
                        })
                    });
                    if (verifyRes.ok) {
                        setGeneratedCode(code);
                        if (!directBuySku) clearCart();
                        setStep("success");
                    } else {
                        alert("Payment verification failed.");
                    }
                },
                prefill: {
                    name,
                    contact: phone,
                },
                theme: {
                    color: "#000000",
                }
            };
            const rzp1 = new Razorpay(options);
            rzp1.on("payment.failed", function (response: any) {
                alert(response.error.description);
            });
            rzp1.open();
        } catch (err: any) {
            console.error("Failed to post order to database API:", err);
            alert(err.message || "Failed to process order.");
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <main className="flex-1 bg-white dark:bg-neutral-950 pb-24 pt-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                
                {/* Progress Indicators */}
                <div className="flex items-center justify-center gap-4 mb-10">
                    <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border ${
                            step === "billing" 
                                ? "bg-primary-500 border-primary-500 text-white shadow-md shadow-primary-500/25" 
                                : "bg-emerald-500 border-emerald-500 text-white"
                        }`}>
                            {step === "billing" ? "1" : <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </span>
                        <span className={`text-xs font-extrabold tracking-wider uppercase ${
                            step === "billing" ? "text-neutral-900 dark:text-white" : "text-neutral-450"
                        }`}>
                            Billing
                        </span>
                    </div>
                    <div className="w-12 h-px bg-neutral-200 dark:bg-neutral-800" />
                    <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border ${
                            step === "payment" 
                                ? "bg-primary-500 border-primary-500 text-white shadow-md shadow-primary-500/25" 
                                : step === "success" 
                                    ? "bg-emerald-500 border-emerald-500 text-white" 
                                    : "border-neutral-200 dark:border-neutral-800 text-neutral-400"
                        }`}>
                            {step === "success" ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "2"}
                        </span>
                        <span className={`text-xs font-extrabold tracking-wider uppercase ${
                            step === "payment" ? "text-neutral-900 dark:text-white" : "text-neutral-450"
                        }`}>
                            Payment
                        </span>
                    </div>
                    <div className="w-12 h-px bg-neutral-200 dark:bg-neutral-800" />
                    <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black border ${
                            step === "success" 
                                ? "bg-primary-500 border-primary-500 text-white shadow-md shadow-primary-500/25" 
                                : "border-neutral-200 dark:border-neutral-800 text-neutral-400"
                        }`}>
                            3
                        </span>
                        <span className={`text-xs font-extrabold tracking-wider uppercase ${
                            step === "success" ? "text-neutral-900 dark:text-white" : "text-neutral-450"
                        }`}>
                            Success
                        </span>
                    </div>
                </div>

                {/* ── STEP 1: BILLING INFORMATION ── */}
                {step === "billing" && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                        {/* Billing Form */}
                        <form onSubmit={handleNextStep} className="md:col-span-7 bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-100 dark:border-neutral-900 rounded-3xl p-6 md:p-8 space-y-6 text-left shadow-sm">
                            <div className="space-y-1.5 pb-4 border-b border-neutral-250/30 dark:border-neutral-800/40">
                                <Typography variant="h2" className="text-neutral-900 dark:text-white font-black">
                                    Delivery Details
                                </Typography>
                                <p className="text-xs text-neutral-400">
                                    Please fill out your billing and shipping information.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {/* Name Input */}
                                <div className="space-y-1.5">
                                    <label htmlFor="checkout-name" className="text-xs font-bold text-neutral-550 dark:text-neutral-400 flex items-center gap-1.5">
                                        <User className="w-3.5 h-3.5" />
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="checkout-name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Karan K Binu"
                                        className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-950 border text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-1 transition-all ${
                                            errors.name 
                                                ? "border-red-500 focus:ring-red-500" 
                                                : "border-neutral-200 dark:border-neutral-800 focus:ring-primary-500"
                                        }`}
                                    />
                                    {errors.name && <p className="text-[10px] text-red-500 font-bold">{errors.name}</p>}
                                </div>

                                {/* Phone Input */}
                                <div className="space-y-1.5">
                                    <label htmlFor="checkout-phone" className="text-xs font-bold text-neutral-550 dark:text-neutral-400 flex items-center gap-1.5">
                                        <Phone className="w-3.5 h-3.5" />
                                        Mobile Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="checkout-phone"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="10-digit mobile number"
                                        className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-950 border text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-1 transition-all ${
                                            errors.phone 
                                                ? "border-red-500 focus:ring-red-500" 
                                                : "border-neutral-200 dark:border-neutral-800 focus:ring-primary-500"
                                        }`}
                                    />
                                    {errors.phone && <p className="text-[10px] text-red-500 font-bold">{errors.phone}</p>}
                                </div>

                                {/* Address Input */}
                                <div className="space-y-1.5">
                                    <label htmlFor="checkout-address" className="text-xs font-bold text-neutral-550 dark:text-neutral-400 flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5" />
                                        Delivery Address
                                    </label>
                                    <textarea
                                        id="checkout-address"
                                        rows={3}
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="House No, Building, Street, Area"
                                        className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-950 border text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-1 transition-all ${
                                            errors.address 
                                                ? "border-red-500 focus:ring-red-500" 
                                                : "border-neutral-200 dark:border-neutral-800 focus:ring-primary-500"
                                        }`}
                                    />
                                    {errors.address && <p className="text-[10px] text-red-500 font-bold">{errors.address}</p>}
                                </div>

                                {/* Pin Code Input */}
                                <div className="space-y-1.5">
                                    <label htmlFor="checkout-pincode" className="text-xs font-bold text-neutral-550 dark:text-neutral-400 flex items-center gap-1.5">
                                        <MapPin className="w-3.5 h-3.5" />
                                        Pin Code
                                    </label>
                                    <input
                                        type="text"
                                        id="checkout-pincode"
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value)}
                                        placeholder="6-digit postal code"
                                        className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-950 border text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-1 transition-all ${
                                            errors.pincode 
                                                ? "border-red-500 focus:ring-red-500" 
                                                : "border-neutral-200 dark:border-neutral-800 focus:ring-primary-500"
                                        }`}
                                    />
                                    {errors.pincode && <p className="text-[10px] text-red-500 font-bold">{errors.pincode}</p>}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isVerifying}
                                className="w-full inline-flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 active:scale-95 text-white text-sm font-extrabold rounded-xl transition-all shadow-lg shadow-primary-500/20 cursor-pointer disabled:opacity-50"
                            >
                                {isVerifying ? "Processing..." : "Proceed to Pay"}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>

                        {/* Order Summary Sidebar */}
                        <div className="md:col-span-5 bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-100 dark:border-neutral-900 rounded-3xl p-6 space-y-5 text-left shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 dark:text-white pb-3 border-b border-neutral-200/60 dark:border-neutral-800/60">
                                Order Summary
                            </h3>
                            
                            <div className="space-y-4 divide-y divide-neutral-200/40 dark:divide-neutral-800/40">
                                {checkoutItems.map((item) => (
                                    <div key={item.sku} className="flex gap-4 pt-3 first:pt-0">
                                        <div className="w-14 h-14 bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                            <img src={item.imagePath} alt="" className="w-10 h-auto object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <h4 className="text-xs font-black text-neutral-900 dark:text-white truncate">
                                                {t[item.nameKey as keyof typeof t] || item.nameKey}
                                            </h4>
                                            <div className="flex items-center justify-between text-[10px] text-neutral-450 font-bold">
                                                <span>Size: {item.size} • {item.colorName}</span>
                                                <span className="text-neutral-800 dark:text-neutral-200 font-extrabold">{formatINR(item.priceInRupees)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-800/60 space-y-2 font-bold text-xs">
                                <div className="flex justify-between text-neutral-500">
                                    <span>Subtotal</span>
                                    <span>{formatINR(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-neutral-500">
                                    <span>Shipping</span>
                                    <span className="text-emerald-500 uppercase tracking-wider text-[10px]">Free</span>
                                </div>
                                <div className="flex justify-between items-end text-neutral-900 dark:text-white pt-2 text-sm border-t border-neutral-200/45 dark:border-neutral-800/45">
                                    <span>Total Amount</span>
                                    <span className="text-xl font-black text-primary-500">{formatINR(total)}</span>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="p-3 bg-neutral-100/50 dark:bg-neutral-900/50 border border-neutral-200/30 dark:border-neutral-800/30 rounded-2xl flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                <span className="text-[10px] font-extrabold text-neutral-500 tracking-wide uppercase">
                                    100% Secure Vintage Escrow
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── STEP 3: SUCCESS ── */}
                {step === "success" && (
                    <div className="max-w-xl mx-auto bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-100 dark:border-neutral-900 rounded-3xl p-8 space-y-6 text-center shadow-lg animate-scale-in">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 border border-emerald-100 dark:border-emerald-900/40">
                            <CheckCircle className="w-8 h-8 stroke-[2.5]" />
                        </div>
                        
                        <div className="space-y-2">
                            <Typography variant="h1" className="text-neutral-950 dark:text-white font-black tracking-tight leading-none">
                                Order Placed!
                            </Typography>
                            <p className="text-xs text-neutral-550 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
                                Your payment details have been submitted. An admin will physically verify the transaction UTR number against the escrow ledger to confirm shipment.
                            </p>
                        </div>

                        {/* Order code box */}
                        <div className="p-4 bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl flex flex-col items-center justify-center gap-2 shadow-xs">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-450 leading-none">
                                ORDER REFERENCE CODE:
                            </span>
                            <span className="font-mono text-base font-black text-emerald-600 dark:text-emerald-400 lowercase tracking-wider bg-emerald-50 dark:bg-emerald-950/30 px-3 py-1 rounded border border-emerald-100/50 dark:border-emerald-900/50 shadow-inner">
                                {generatedCode}
                            </span>
                            <p className="text-[9px] text-neutral-400 italic">
                                Save this code to track your order or enquire about shipping.
                            </p>
                        </div>

                        {/* Order Details Accordion */}
                        <div className="border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-4 space-y-3.5 text-left bg-white dark:bg-neutral-950/20">
                            <div className="flex justify-between items-center text-xs pb-2 border-b border-neutral-100 dark:border-neutral-850">
                                <span className="text-neutral-450 font-bold uppercase tracking-wider text-[9px]">Receipt Summary</span>
                                <span className="font-extrabold text-neutral-800 dark:text-neutral-200">Paid via Razorpay</span>
                            </div>
                            <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                                {checkoutItems.map((item) => (
                                    <div key={item.sku} className="flex justify-between text-xs font-semibold">
                                        <span className="text-neutral-600 dark:text-neutral-450 truncate max-w-[200px]">
                                            {t[item.nameKey as keyof typeof t] || item.nameKey} (Size {item.size})
                                        </span>
                                        <span className="text-neutral-800 dark:text-neutral-200 font-extrabold">{formatINR(item.priceInRupees)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-850 flex justify-between items-end">
                                <span className="text-xs text-neutral-400 font-black uppercase tracking-wider">Escrow Total Paid</span>
                                <span className="text-lg font-black text-primary-500 leading-none">{formatINR(total)}</span>
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col sm:flex-row gap-3">
                            <Link href="/" className="flex-1 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-bold rounded-xl transition-colors shadow-md text-center">
                                Continue Shopping
                            </Link>
                            <Link href="/catalog/all" className="flex-1 py-3.5 bg-primary-500 hover:bg-primary-400 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-primary-500/20 text-center">
                                Browse Catalog
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="text-center py-24 text-neutral-500 font-bold">Loading Checkout Details...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
