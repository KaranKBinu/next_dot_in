"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { formatINR } from "@/utils/i18n";
import Typography from "@/components/Typography";
import { 
    Settings, 
    Upload, 
    RefreshCw, 
    CheckCircle, 
    Clock, 
    DollarSign, 
    ShoppingBag, 
    User, 
    Calendar,
    ArrowLeft,
    Trash2,
    Check
} from "lucide-react";

interface Order {
    id: string;
    date: number;
    items: {
        sku: string;
        nameKey: string;
        brand: string;
        size: string;
        colorName: string;
        priceInRupees: number;
        imagePath: string;
    }[];
    total: number;
    customerInfo: {
        name: string;
        phone: string;
        address: string;
        pincode: string;
    };
    paymentStatus: "pending" | "verified";
    utr: string;
    reservationCode: string;
    directBuy: boolean;
}

export default function AdminPage() {
    // QR Code Config States
    const [qrImage, setQrImage] = useState("/qr_code.jpg");
    const [upiId, setUpiId] = useState("bothzmannhypo123@okicici");
    const [successMsg, setSuccessMsg] = useState("");

    // Orders State
    const [orders, setOrders] = useState<Order[]>([]);

    // Load configs and orders from localStorage on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedQR = localStorage.getItem("next_in_qr_code_image");
            const storedUPI = localStorage.getItem("next_in_qr_code_upi");
            if (storedQR) setQrImage(storedQR);
            if (storedUPI) setUpiId(storedUPI);

            const storedOrders = localStorage.getItem("next_in_orders");
            if (storedOrders) {
                try {
                    setOrders(JSON.parse(storedOrders));
                } catch (e) {
                    console.error("Error parsing orders", e);
                }
            }
        }
    }, []);

    // Handle UPI ID submit
    const handleUpdateUpi = (e: React.FormEvent) => {
        e.preventDefault();
        if (typeof window !== "undefined") {
            localStorage.setItem("next_in_qr_code_upi", upiId);
            showNotification("UPI ID updated successfully!");
        }
    };

    // Handle QR code image upload
    const handleQrUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Verify it is an image
        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Data = reader.result as string;
            setQrImage(base64Data);
            if (typeof window !== "undefined") {
                localStorage.setItem("next_in_qr_code_image", base64Data);
                showNotification("New QR Code uploaded successfully!");
            }
        };
        reader.readAsDataURL(file);
    };

    // Reset settings to default
    const handleResetSettings = () => {
        if (confirm("Are you sure you want to reset payment configurations to default?")) {
            setQrImage("/qr_code.jpg");
            setUpiId("bothzmannhypo123@okicici");
            if (typeof window !== "undefined") {
                localStorage.removeItem("next_in_qr_code_image");
                localStorage.setItem("next_in_qr_code_upi", "bothzmannhypo123@okicici");
                showNotification("Payment configurations reset to default.");
            }
        }
    };

    // Verify payment status toggle
    const handleToggleVerification = (orderId: string) => {
        const updatedOrders = orders.map((order) => {
            if (order.id === orderId) {
                const newStatus = order.paymentStatus === "verified" ? "pending" : "verified";
                return { ...order, paymentStatus: newStatus as "pending" | "verified" };
            }
            return order;
        });
        setOrders(updatedOrders);
        if (typeof window !== "undefined") {
            localStorage.setItem("next_in_orders", JSON.stringify(updatedOrders));
            showNotification(`Order ${orderId} verification status updated!`);
        }
    };

    // Clear order logs
    const handleClearOrders = () => {
        if (confirm("Are you sure you want to clear all order logs? This action cannot be undone.")) {
            setOrders([]);
            if (typeof window !== "undefined") {
                localStorage.removeItem("next_in_orders");
                showNotification("All order logs deleted.");
            }
        }
    };

    const showNotification = (msg: string) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(""), 3000);
    };

    // Stats calculations
    const stats = useMemo(() => {
        const totalOrders = orders.length;
        const verifiedOrders = orders.filter(o => o.paymentStatus === "verified");
        const pendingOrders = orders.filter(o => o.paymentStatus === "pending");
        const totalSales = verifiedOrders.reduce((sum, o) => sum + o.total, 0);

        return {
            totalOrders,
            pendingOrdersCount: pendingOrders.length,
            verifiedOrdersCount: verifiedOrders.length,
            totalSales
        };
    }, [orders]);

    return (
        <main className="flex-1 bg-white dark:bg-neutral-950 pb-24 pt-8 text-left">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-900 pb-6">
                    <div className="space-y-1">
                        <Link href="/catalog/all" className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-primary-500 transition-colors uppercase tracking-wider mb-2">
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back to Store
                        </Link>
                        <Typography variant="h1" className="text-neutral-950 dark:text-white font-black tracking-tight flex items-center gap-2">
                            <Settings className="w-8 h-8 text-primary-500 animate-spin" style={{ animationDuration: "12s" }} />
                            Admin Console
                        </Typography>
                        <p className="text-xs text-neutral-500">
                            Configure payment gateways, upload escrows, and audit store checkout logs.
                        </p>
                    </div>

                    {successMsg && (
                        <div className="px-4 py-2 text-xs font-bold bg-emerald-500 text-white rounded-xl shadow-md flex items-center gap-2 animate-scale-in self-start sm:self-center">
                            <CheckCircle className="w-4 h-4" />
                            {successMsg}
                        </div>
                    )}
                </div>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Stat 1: Total Sales */}
                    <div className="bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-150/40 dark:border-neutral-900 rounded-3xl p-6 flex items-center gap-4 shadow-xs">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block leading-none">
                                Verified Sales
                            </span>
                            <span className="text-xl font-black text-neutral-900 dark:text-white tracking-tight">
                                {formatINR(stats.totalSales)}
                            </span>
                        </div>
                    </div>

                    {/* Stat 2: Total Orders */}
                    <div className="bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-150/40 dark:border-neutral-900 rounded-3xl p-6 flex items-center gap-4 shadow-xs">
                        <div className="w-12 h-12 bg-primary-100 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block leading-none">
                                Total Orders
                            </span>
                            <span className="text-xl font-black text-neutral-900 dark:text-white tracking-tight">
                                {stats.totalOrders}
                            </span>
                        </div>
                    </div>

                    {/* Stat 3: Pending Audits */}
                    <div className="bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-150/40 dark:border-neutral-900 rounded-3xl p-6 flex items-center gap-4 shadow-xs">
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block leading-none">
                                Pending UTR Audits
                            </span>
                            <span className="text-xl font-black text-neutral-900 dark:text-white tracking-tight">
                                {stats.pendingOrdersCount}
                            </span>
                        </div>
                    </div>

                    {/* Stat 4: Verified Orders */}
                    <div className="bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-150/40 dark:border-neutral-900 rounded-3xl p-6 flex items-center gap-4 shadow-xs">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block leading-none">
                                Verified Claims
                            </span>
                            <span className="text-xl font-black text-neutral-900 dark:text-white tracking-tight">
                                {stats.verifiedOrdersCount}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: QR Code configuration settings (5 cols) */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-150/40 dark:border-neutral-900 rounded-3xl p-6 space-y-6 shadow-sm">
                            <div className="pb-3 border-b border-neutral-200/50 dark:border-neutral-800/60">
                                <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 dark:text-white">
                                    Payment Gateway Configuration
                                </h3>
                                <p className="text-[10px] text-neutral-400">
                                    Change the active UPI receipt configuration dynamically.
                                </p>
                            </div>

                            {/* Active Preview */}
                            <div className="p-4 bg-white dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl flex items-center gap-4">
                                <div className="w-20 h-20 border border-neutral-100 dark:border-neutral-900 rounded-lg flex items-center justify-center overflow-hidden bg-neutral-50/50 p-1 flex-shrink-0">
                                    <img src={qrImage} alt="Preview QR" className="w-full h-full object-contain" />
                                </div>
                                <div className="space-y-1.5 flex-1 min-w-0">
                                    <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block leading-none">
                                        Current UPI ID:
                                    </span>
                                    <p className="font-mono text-xs font-black text-neutral-800 dark:text-neutral-200 truncate select-all leading-none pb-1">
                                        {upiId}
                                    </p>
                                    <button 
                                        onClick={handleResetSettings}
                                        className="inline-flex items-center gap-1 text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors"
                                    >
                                        <RefreshCw className="w-3 h-3" />
                                        Reset to Default QR
                                    </button>
                                </div>
                            </div>

                            {/* Settings Forms */}
                            <div className="space-y-4">
                                {/* UPI ID edit */}
                                <form onSubmit={handleUpdateUpi} className="space-y-2">
                                    <label htmlFor="admin-upi-input" className="text-xs font-bold text-neutral-550 dark:text-neutral-400">
                                        Receiver UPI VPA ID
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            id="admin-upi-input"
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                            placeholder="e.g. merchant@bank"
                                            className="flex-1 px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500 transition-all font-mono"
                                        />
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                                        >
                                            Save ID
                                        </button>
                                    </div>
                                </form>

                                {/* File Upload */}
                                <div className="space-y-2">
                                    <span className="text-xs font-bold text-neutral-550 dark:text-neutral-400 block">
                                        Receiver UPI QR Code Graphic
                                    </span>
                                    <div className="relative border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-center hover:bg-neutral-100/30 dark:hover:bg-neutral-900/10 transition-colors cursor-pointer group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleQrUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <div className="space-y-2">
                                            <Upload className="w-6 h-6 text-neutral-400 mx-auto group-hover:text-primary-500 transition-colors" />
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
                                                    Click to upload QR image
                                                </p>
                                                <p className="text-[10px] text-neutral-400">
                                                    Supports PNG, JPG, or WEBP formats
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Orders audit list (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-150/40 dark:border-neutral-900 rounded-3xl p-6 shadow-sm space-y-6">
                            <div className="flex items-center justify-between pb-3 border-b border-neutral-200/50 dark:border-neutral-800/60">
                                <div className="space-y-0.5">
                                    <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900 dark:text-white">
                                        Checkout Order Audit Log
                                    </h3>
                                    <p className="text-[10px] text-neutral-400">
                                        Check transaction UTR reference codes and approve shipments.
                                    </p>
                                </div>

                                {orders.length > 0 && (
                                    <button
                                        onClick={handleClearOrders}
                                        className="p-2 rounded-xl text-neutral-450 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all border border-transparent hover:border-red-100 dark:hover:border-red-900/50 flex items-center gap-1 text-[10px] font-bold"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Clear Logs
                                    </button>
                                )}
                            </div>

                            {orders.length === 0 ? (
                                <div className="py-16 text-center space-y-3 bg-white dark:bg-neutral-950/20 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl">
                                    <ShoppingBag className="w-8 h-8 text-neutral-350 mx-auto" />
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
                                            No checkout claims logged yet
                                        </p>
                                        <p className="text-[10px] text-neutral-400">
                                            Simulate orders by checking out items from PDP or Cart.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                                    {orders.map((order) => {
                                        const isVerified = order.paymentStatus === "verified";
                                        return (
                                            <article
                                                key={order.id}
                                                className={`p-4 bg-white dark:bg-neutral-950 border rounded-2xl space-y-4 text-left transition-all ${
                                                    isVerified 
                                                        ? "border-emerald-100 dark:border-emerald-950 bg-emerald-500/[0.01]" 
                                                        : "border-neutral-200/80 dark:border-neutral-850 hover:border-neutral-300 dark:hover:border-neutral-750"
                                                }`}
                                            >
                                                {/* Card Header info */}
                                                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-neutral-100 dark:border-neutral-850 text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-extrabold text-neutral-850 dark:text-white bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 rounded text-[10px]">
                                                            {order.id}
                                                        </span>
                                                        <span className="text-[10px] text-neutral-450 font-bold flex items-center gap-1">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {new Date(order.date).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Status Badge */}
                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                                        isVerified
                                                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                                                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                                                    }`}>
                                                        {isVerified ? "✓ Payment Verified" : "⏳ Pending UTR Verification"}
                                                    </span>
                                                </div>

                                                {/* Customer and Order items split */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                                                    {/* Cust info */}
                                                    <div className="space-y-1 text-neutral-500 leading-normal">
                                                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-0.5">
                                                            Customer Details:
                                                        </span>
                                                        <p className="font-extrabold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                                                            <User className="w-3.5 h-3.5" />
                                                            {order.customerInfo.name}
                                                        </p>
                                                        <p className="text-[10px]">Phone: {order.customerInfo.phone}</p>
                                                        <p className="text-[10px] line-clamp-2">Address: {order.customerInfo.address}, {order.customerInfo.pincode}</p>
                                                    </div>

                                                    {/* Items list */}
                                                    <div className="space-y-1">
                                                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block mb-0.5">
                                                            Order Items:
                                                        </span>
                                                        <ul className="space-y-1 font-semibold text-neutral-800 dark:text-neutral-250">
                                                            {order.items.map((it) => (
                                                                <li key={it.sku} className="truncate flex justify-between gap-2">
                                                                    <span>• {it.brand} - {it.size}</span>
                                                                    <span>{formatINR(it.priceInRupees)}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        <div className="flex justify-between items-center pt-1.5 border-t border-neutral-100 dark:border-neutral-850 font-bold text-xs text-neutral-900 dark:text-white">
                                                            <span>Total Paid:</span>
                                                            <span className="text-primary-500 font-black">{formatINR(order.total)}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Escrow Claim Code & UTR audit bar */}
                                                <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-neutral-50 dark:bg-neutral-900/60 rounded-xl border border-neutral-100 dark:border-neutral-850">
                                                    <div className="space-y-0.5 text-xs text-left">
                                                        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block leading-none">
                                                            Escrow Code: <span className="lowercase text-emerald-600 dark:text-emerald-400 font-extrabold">{order.reservationCode}</span>
                                                        </span>
                                                        <span className="font-mono text-xs font-black text-neutral-800 dark:text-neutral-250">
                                                            UTR: {order.utr}
                                                        </span>
                                                    </div>

                                                    <button
                                                        onClick={() => handleToggleVerification(order.id)}
                                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-95 cursor-pointer border ${
                                                            isVerified
                                                                ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 border-emerald-250 hover:bg-neutral-100 dark:hover:bg-neutral-900"
                                                                : "bg-primary-500 hover:bg-primary-400 text-white border-primary-500 shadow-sm"
                                                        }`}
                                                    >
                                                        {isVerified ? "Revoke Verification" : "Mark as Verified"}
                                                    </button>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
