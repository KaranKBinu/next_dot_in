"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    Check,
    PackagePlus,
    Package,
    X,
    Loader2,
    LogOut,
    Edit
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

interface DbProduct {
    id: string;
    parentProductId: string | null;
    sku: string;
    name: string;
    description: string;
    brand: string;
    year: string;
    category: string;
    material: string;
    size: string;
    colorName: string;
    colorHex: string;
    priceInRupees: number;
    imagePath: string;
    chestInch: string;
    lengthInch: string;
    shoulderInch: string;
    condition: string;
    hotness: number;
    stockQuantity: number;
    isActive: boolean;
    createdAt: string;
}

const EMPTY_FORM = {
    sku: "",
    parentProductId: "",
    name: "",
    description: "",
    brand: "",
    year: new Date().getFullYear().toString(),
    category: "tees",
    material: "",
    size: "",
    colorName: "",
    colorHex: "#000000",
    priceInRupees: "",
    imagePath: "",
    chestInch: "",
    lengthInch: "",
    shoulderInch: "",
    condition: "condVeryGood",
    hotness: "3",
    stockQuantity: "1",
};

export default function AdminPage() {
    const router = useRouter();
    const [successMsg, setSuccessMsg] = useState("");

    // Orders State
    const [orders, setOrders] = useState<Order[]>([]);

    // Product catalog states
    const [dbProducts, setDbProducts] = useState<DbProduct[]>([]);
    const [productForm, setProductForm] = useState({ ...EMPTY_FORM });
    const [uploadingProduct, setUploadingProduct] = useState(false);
    const [productTab, setProductTab] = useState<"upload" | "list">("list");
    const [editingSku, setEditingSku] = useState<string | null>(null);
    const [productFile, setProductFile] = useState<File | null>(null);

    // Search and filter states
    const [adminSearch, setAdminSearch] = useState("");
    const [adminCategoryFilter, setAdminCategoryFilter] = useState("all");

    // Filter and sort products (grouped by parentProductId, then SKU)
    const filteredProducts = useMemo(() => {
        let result = [...dbProducts];

        if (adminSearch.trim()) {
            const query = adminSearch.toLowerCase();
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(query) ||
                    p.sku.toLowerCase().includes(query) ||
                    p.brand.toLowerCase().includes(query) ||
                    (p.parentProductId && p.parentProductId.toLowerCase().includes(query))
            );
        }

        if (adminCategoryFilter !== "all") {
            result = result.filter((p) => p.category === adminCategoryFilter);
        }

        result.sort((a, b) => {
            const parentA = a.parentProductId || a.id;
            const parentB = b.parentProductId || b.id;
            if (parentA === parentB) {
                return a.sku.localeCompare(b.sku);
            }
            return parentA.localeCompare(parentB);
        });
        return result;
    }, [dbProducts, adminSearch, adminCategoryFilter]);

    // Get unique parent options for the form dropdown
    const parentOptions = useMemo(() => {
        const parents = new Map<string, { id: string; name: string }>();
        dbProducts.forEach(p => {
            if (p.parentProductId) {
                if (!parents.has(p.parentProductId)) {
                    parents.set(p.parentProductId, { id: p.parentProductId, name: p.name });
                }
            } else {
                if (!parents.has(p.id)) {
                    parents.set(p.id, { id: p.id, name: p.name });
                }
            }
        });
        return Array.from(parents.values());
    }, [dbProducts]);

    // Logout handler
    const handleLogout = async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.push("/admin/login");
    };

    // Load configs and orders from API on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const ordersRes = await fetch("/api/orders");
                if (ordersRes.ok) {
                    const data = await ordersRes.json();
                    setOrders(data);
                }

                const productsRes = await fetch("/api/products");
                if (productsRes.ok) {
                    const data = await productsRes.json();
                    setDbProducts(data);
                }
            } catch (err) {
                console.error("Failed to load admin data from API:", err);
            }
        };
        loadData();
    }, []);


    // Verify payment status toggle
    const handleToggleVerification = async (orderId: string) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;
        const newStatus = order.paymentStatus === "verified" ? "pending" : "verified";

        try {
            const res = await fetch("/api/orders", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: orderId, paymentStatus: newStatus })
            });
            if (res.ok) {
                const updatedOrders = orders.map((o) => {
                    if (o.id === orderId) {
                        return { ...o, paymentStatus: newStatus as "pending" | "verified" };
                    }
                    return o;
                });
                setOrders(updatedOrders);
                showNotification(`Order ${orderId} status verified in database!`);
            }
        } catch (err) {
            console.error("Failed to update verification status in database:", err);
        }
    };

    // Clear order logs (disabled in database mode to protect transaction records)
    const handleClearOrders = () => {
        alert("Clearing order logs is disabled in database mode to protect historical transaction logs.");
    };

    const showNotification = (msg: string) => {
        setSuccessMsg(msg);
        setTimeout(() => setSuccessMsg(""), 3000);
    };

    // ── Product upload handlers ──
    const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { alert("Please select a valid image file"); return; }
        setProductFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setProductForm((f) => ({ ...f, imagePath: reader.result as string }));
        reader.readAsDataURL(file);
    };

    const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProductForm((f) => ({ ...f, [name]: value }));
    };

    const handleProductSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productForm.imagePath && !productFile) { alert("Please upload a product image"); return; }
        setUploadingProduct(true);
        try {
            let finalImagePath = productForm.imagePath;

            if (productFile) {
                const formData = new FormData();
                formData.append("file", productFile);
                const uploadRes = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });
                if (!uploadRes.ok) {
                    const err = await uploadRes.json();
                    throw new Error(err.error || "Failed to upload image to blob storage");
                }
                const uploadData = await uploadRes.json();
                finalImagePath = uploadData.url;
            }

            if (editingSku) {
                // Update existing product
                const res = await fetch(`/api/products/${encodeURIComponent(editingSku)}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sku: productForm.sku,
                        parentProductId: productForm.parentProductId || null,
                        name: productForm.name,
                        description: productForm.description,
                        brand: productForm.brand,
                        year: productForm.year,
                        category: productForm.category,
                        material: productForm.material,
                        size: productForm.size,
                        colorName: productForm.colorName,
                        colorHex: productForm.colorHex,
                        priceInRupees: Number(productForm.priceInRupees),
                        imagePath: finalImagePath,
                        chestInch: productForm.chestInch,
                        lengthInch: productForm.lengthInch,
                        shoulderInch: productForm.shoulderInch,
                        condition: productForm.condition,
                        hotness: Number(productForm.hotness),
                        stockQuantity: Number(productForm.stockQuantity),
                    }),
                });
                if (res.ok) {
                    const updatedProduct = await res.json();
                    setDbProducts((prev) => prev.map((p) => p.sku === editingSku ? updatedProduct : p));
                    setProductForm({ ...EMPTY_FORM });
                    setProductFile(null);
                    setEditingSku(null);
                    setProductTab("list");
                    showNotification("Product updated successfully!");
                } else {
                    const err = await res.json();
                    alert(err.error || "Failed to update product");
                }
            } else {
                // Create new product
                const res = await fetch("/api/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...productForm,
                        imagePath: finalImagePath,
                        parentProductId: productForm.parentProductId || null,
                        priceInRupees: Number(productForm.priceInRupees),
                        hotness: Number(productForm.hotness),
                        stockQuantity: Number(productForm.stockQuantity),
                    }),
                });
                if (res.ok) {
                    const newProduct = await res.json();
                    setDbProducts((prev) => [newProduct, ...prev]);
                    setProductForm({ ...EMPTY_FORM });
                    setProductFile(null);
                    setProductTab("list");
                    showNotification("Product uploaded to catalog!");
                } else {
                    const err = await res.json();
                    alert(err.error || "Failed to upload product");
                }
            }
        } catch (err) {
            console.error("Failed to submit product:", err);
            alert(err instanceof Error ? err.message : "Failed to submit product");
        } finally {
            setUploadingProduct(false);
        }
    };

    const handleDeleteProduct = async (sku: string) => {
        if (!confirm(`Remove SKU "${sku}" from catalog?`)) return;
        try {
            const res = await fetch(`/api/products?sku=${encodeURIComponent(sku)}`, { method: "DELETE" });
            if (res.ok) {
                setDbProducts((prev) => prev.filter((p) => p.sku !== sku));
                showNotification(`SKU ${sku} removed from catalog.`);
            }
        } catch (err) {
            console.error("Failed to delete product:", err);
        }
    };

    const handleEditProductClick = (p: DbProduct) => {
        setProductForm({
            sku: p.sku,
            parentProductId: p.parentProductId || "",
            name: p.name,
            description: p.description || "",
            brand: p.brand,
            year: p.year || "",
            category: p.category,
            material: p.material || "",
            size: p.size || "",
            colorName: p.colorName || "",
            colorHex: p.colorHex || "#000000",
            priceInRupees: String(p.priceInRupees),
            imagePath: p.imagePath || "",
            chestInch: p.chestInch || "",
            lengthInch: p.lengthInch || "",
            shoulderInch: p.shoulderInch || "",
            condition: p.condition || "condVeryGood",
            hotness: String(p.hotness || 3),
            stockQuantity: String(p.stockQuantity !== undefined ? p.stockQuantity : 1),
        });
        setEditingSku(p.sku);
        setProductFile(null);
        setProductTab("upload");
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

                    <div className="flex items-center gap-3 self-start sm:self-center">
                        {successMsg && (
                            <div className="px-4 py-2 text-xs font-bold bg-emerald-500 text-white rounded-xl shadow-md flex items-center gap-2 animate-scale-in">
                                <CheckCircle className="w-4 h-4" />
                                {successMsg}
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-neutral-500 hover:text-red-500 border border-neutral-200 dark:border-neutral-800 hover:border-red-200 dark:hover:border-red-900 rounded-xl transition-all cursor-pointer"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Logout
                        </button>
                    </div>
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
                                Verified Orders
                            </span>
                            <span className="text-xl font-black text-neutral-900 dark:text-white tracking-tight">
                                {stats.verifiedOrdersCount}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 items-start">
                    
                    {/* Orders audit list */}
                    <div className="space-y-6">
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
                                            No orders yet
                                        </p>
                                        <p className="text-[10px] text-neutral-400">
                                            Orders placed by customers will appear here.
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

                                                {/* Order Reference & UTR audit bar */}
                                                <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-neutral-50 dark:bg-neutral-900/60 rounded-xl border border-neutral-100 dark:border-neutral-850">
                                                    <div className="space-y-0.5 text-xs text-left">
                                                        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block leading-none">
                                                            Order Ref: <span className="lowercase text-emerald-600 dark:text-emerald-400 font-extrabold">{order.reservationCode}</span>
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

                {/* ── Product Catalog Management ── */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
                                <Package className="w-4 h-4 text-primary-500" />
                                Product Catalog Management
                            </h2>
                            <p className="text-[10px] text-neutral-400 mt-0.5">
                                Upload new SKU items — they appear live in the store catalog.
                            </p>
                        </div>
                    </div>

                    {/* Catalog Metrics Dashboard Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-200/60 dark:border-neutral-800 rounded-2xl text-left">
                        <div>
                            <span className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-1">
                                Unique Products
                            </span>
                            <span className="text-xl font-black text-neutral-950 dark:text-white">
                                {new Set(dbProducts.map(p => p.parentProductId || p.id)).size}
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-1">
                                Total SKUs
                            </span>
                            <span className="text-xl font-black text-neutral-950 dark:text-white">
                                {dbProducts.length}
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-1">
                                Available in Stock
                            </span>
                            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                                {dbProducts.filter(p => !orders.some(o => o.items.some(i => i.sku === p.sku))).length}
                            </span>
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-1">
                                Sold & Reserved
                            </span>
                            <span className="text-xl font-black text-red-500 dark:text-red-450">
                                {dbProducts.filter(p => orders.some(o => o.items.some(i => i.sku === p.sku))).length}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setProductTab("list"); setProductForm({ ...EMPTY_FORM }); setEditingSku(null); }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                    productTab === "list"
                                        ? "bg-primary-500 text-white"
                                        : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                                }`}
                            >
                                {dbProducts.length > 0 ? `Products (${dbProducts.length})` : "Products"}
                            </button>
                            <button
                                onClick={() => { setProductTab("upload"); setProductForm({ ...EMPTY_FORM }); setEditingSku(null); }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                    productTab === "upload"
                                        ? "bg-primary-500 text-white"
                                        : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                                }`}
                            >
                                <PackagePlus className="w-3.5 h-3.5" />
                                {editingSku ? "Edit SKU" : "Upload SKU"}
                            </button>
                        </div>
                    </div>

                    {/* Upload Form */}
                    {productTab === "upload" && (
                        <div className="bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-150/40 dark:border-neutral-900 rounded-3xl p-6 shadow-sm">
                            <form onSubmit={handleProductSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* SKU */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">SKU *</label>
                                        <input
                                            name="sku"
                                            value={productForm.sku}
                                            onChange={handleProductFormChange}
                                            required
                                            placeholder="e.g. champ-tee-L-orange"
                                            className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                                        />
                                    </div>
                                    {/* Parent Product ID */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">Group With (Parent Product)</label>
                                        <select
                                            name="parentProductId"
                                            value={productForm.parentProductId}
                                            onChange={handleProductFormChange}
                                            className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
                                        >
                                            <option value="">None (This is a new product)</option>
                                            {parentOptions.map((opt) => (
                                                <option key={opt.id} value={opt.id}>
                                                    {opt.name} ({opt.id})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* Name */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">Product Name *</label>
                                        <input
                                            name="name"
                                            value={productForm.name}
                                            onChange={handleProductFormChange}
                                            required
                                            placeholder="e.g. Champion Reverse Weave Tee"
                                            className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                                        />
                                    </div>
                                    {/* Brand */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">Brand *</label>
                                        <input
                                            name="brand"
                                            value={productForm.brand}
                                            onChange={handleProductFormChange}
                                            required
                                            placeholder="e.g. Champion (Classic)"
                                            className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                                        />
                                    </div>
                                    {/* Year */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">Year</label>
                                        <input
                                            name="year"
                                            value={productForm.year}
                                            onChange={handleProductFormChange}
                                            placeholder="e.g. 1994"
                                            className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                                        />
                                    </div>
                                    {/* Category */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">Category *</label>
                                        <select
                                            name="category"
                                            value={productForm.category}
                                            onChange={handleProductFormChange}
                                            className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
                                        >
                                            <option value="tees">Tees</option>
                                            <option value="denim">Denim</option>
                                            <option value="knits">Knits</option>
                                            <option value="cargo">Cargo</option>
                                        </select>
                                    </div>
                                    {/* Price */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">Price (₹) *</label>
                                        <input
                                            name="priceInRupees"
                                            type="number"
                                            min="1"
                                            value={productForm.priceInRupees}
                                            onChange={handleProductFormChange}
                                            required
                                            placeholder="e.g. 2900"
                                            className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                                        />
                                    </div>
                                    {/* Stock Quantity */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">Stock Quantity *</label>
                                        <input
                                            name="stockQuantity"
                                            type="number"
                                            min="0"
                                            value={productForm.stockQuantity}
                                            onChange={handleProductFormChange}
                                            required
                                            placeholder="e.g. 5"
                                            className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                                        />
                                    </div>
                                    {/* Size */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">Size</label>
                                        <input
                                            name="size"
                                            value={productForm.size}
                                            onChange={handleProductFormChange}
                                            placeholder="e.g. L, XL, 32x30"
                                            className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                                        />
                                    </div>
                                    {/* Color Name */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">Color Name</label>
                                        <input
                                            name="colorName"
                                            value={productForm.colorName}
                                            onChange={handleProductFormChange}
                                            placeholder="e.g. Rust Orange"
                                            className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                                        />
                                    </div>
                                    {/* Color Hex */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">Color</label>
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="color"
                                                name="colorHex"
                                                value={productForm.colorHex}
                                                onChange={handleProductFormChange}
                                                className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer p-0.5 bg-white dark:bg-neutral-950"
                                            />
                                            <input
                                                name="colorHex"
                                                value={productForm.colorHex}
                                                onChange={handleProductFormChange}
                                                placeholder="#ff5722"
                                                className="flex-1 px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                                            />
                                        </div>
                                    </div>
                                    {/* Condition */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">Condition</label>
                                        <select
                                            name="condition"
                                            value={productForm.condition}
                                            onChange={handleProductFormChange}
                                            className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500 cursor-pointer"
                                        >
                                            <option value="condExcellent">Excellent</option>
                                            <option value="condVeryGood">Very Good</option>
                                            <option value="condGood">Good</option>
                                        </select>
                                    </div>
                                    {/* Hotness */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">Demand Hotness (1–5)</label>
                                        <input
                                            name="hotness"
                                            type="number"
                                            min="1"
                                            max="5"
                                            value={productForm.hotness}
                                            onChange={handleProductFormChange}
                                            className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                                        />
                                    </div>
                                </div>

                                {/* Measurements */}
                                <div className="space-y-2">
                                    <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">Measurements</span>
                                    <div className="grid grid-cols-3 gap-3">
                                        {(["chestInch", "lengthInch", "shoulderInch"] as const).map((field) => (
                                            <div key={field} className="space-y-1">
                                                <label className="text-[10px] font-bold text-neutral-400 capitalize">{field.replace("Inch", "")}</label>
                                                <input
                                                    name={field}
                                                    value={productForm[field]}
                                                    onChange={handleProductFormChange}
                                                    placeholder='e.g. 22"'
                                                    className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">Description</label>
                                    <textarea
                                        name="description"
                                        value={productForm.description}
                                        onChange={handleProductFormChange}
                                        rows={2}
                                        placeholder="Short product description…"
                                        className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
                                    />
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-2">
                                    <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 block">Product Image *</span>
                                    <div className="flex gap-4 items-start">
                                        <div className="relative border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 text-center hover:bg-neutral-100/30 dark:hover:bg-neutral-900/10 transition-colors cursor-pointer group flex-1">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleProductImageUpload}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="space-y-1.5">
                                                <Upload className="w-5 h-5 text-neutral-400 mx-auto group-hover:text-primary-500 transition-colors" />
                                                <p className="text-xs font-bold text-neutral-600 dark:text-neutral-300">Click to upload image</p>
                                                <p className="text-[10px] text-neutral-400">PNG, JPG, WEBP</p>
                                            </div>
                                        </div>
                                        {productForm.imagePath && (
                                            <div className="relative w-24 h-24 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden flex-shrink-0">
                                                <img src={productForm.imagePath} alt="Preview" className="w-full h-full object-contain p-1" />
                                                <button
                                                    type="button"
                                                    onClick={() => setProductForm((f) => ({ ...f, imagePath: "" }))}
                                                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={uploadingProduct}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-primary-500 hover:bg-primary-400 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-60 cursor-pointer"
                                    >
                                        {uploadingProduct ? <Loader2 className="w-4 h-4 animate-spin" /> : <PackagePlus className="w-4 h-4" />}
                                        {uploadingProduct ? "Saving…" : editingSku ? "Save Changes" : "Upload to Catalog"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setProductForm({ ...EMPTY_FORM }); setEditingSku(null); setProductTab("list"); }}
                                        className="px-4 py-2.5 text-xs font-bold text-neutral-500 hover:text-neutral-800 dark:hover:text-white border border-neutral-200 dark:border-neutral-800 rounded-xl transition-colors cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Products List */}
                    {productTab === "list" && (
                        <div className="bg-neutral-50 dark:bg-neutral-900/30 border border-neutral-150/40 dark:border-neutral-900 rounded-3xl shadow-sm overflow-hidden">
                            {dbProducts.length === 0 ? (
                                <div className="py-16 text-center space-y-3">
                                    <Package className="w-8 h-8 text-neutral-350 mx-auto" />
                                    <p className="text-xs font-bold text-neutral-500">No products uploaded yet</p>
                                    <button
                                        onClick={() => setProductTab("upload")}
                                        className="px-4 py-2 bg-primary-500 text-white text-xs font-bold rounded-xl cursor-pointer"
                                    >
                                        Upload first SKU
                                    </button>
                                </div>
                            ) : (
                                <div className="flex flex-col">
                                    {/* Search & Filter Bar */}
                                    <div className="p-4 border-b border-neutral-200/60 dark:border-neutral-800 flex flex-col sm:flex-row gap-3 bg-neutral-50/50 dark:bg-neutral-900/10">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="Search by SKU, name, brand, parent ID..."
                                                value={adminSearch}
                                                onChange={(e) => setAdminSearch(e.target.value)}
                                                className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500 font-medium"
                                            />
                                        </div>
                                        <div className="w-full sm:w-48">
                                            <select
                                                value={adminCategoryFilter}
                                                onChange={(e) => setAdminCategoryFilter(e.target.value)}
                                                className="w-full px-3.5 py-2.5 text-xs bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-primary-500 font-bold"
                                            >
                                                <option value="all">All Categories</option>
                                                <option value="tees">Tees</option>
                                                <option value="denim">Denim</option>
                                                <option value="knits">Knits</option>
                                                <option value="cargo">Cargo</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="border-b border-neutral-200/60 dark:border-neutral-800">
                                                    {["Image", "SKU", "Parent ID", "Name", "Brand", "Category", "Size", "Color", "Price", "Hotness", "Stock Status", ""].map((h) => (
                                                        <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-neutral-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredProducts.map((p) => (
                                                    <tr key={p.sku} className="border-b border-neutral-100 dark:border-neutral-900 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/20 transition-colors">
                                                    <td className="px-4 py-3">
                                                        <div className="w-10 h-10 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
                                                            <img src={p.imagePath} alt={p.name} className="w-full h-full object-contain p-0.5" />
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 font-mono text-neutral-500 dark:text-neutral-400 whitespace-nowrap">{p.sku}</td>
                                                    <td className="px-4 py-3 font-mono text-neutral-400 dark:text-neutral-500 whitespace-nowrap">{p.parentProductId || "—"}</td>
                                                    <td className="px-4 py-3 font-bold text-neutral-900 dark:text-white max-w-[140px] truncate">{p.name}</td>
                                                    <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400 whitespace-nowrap">{p.brand}</td>
                                                    <td className="px-4 py-3">
                                                        <span className="px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-950/30 text-primary-700 dark:text-primary-400 font-bold capitalize">{p.category}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{p.size || "—"}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="w-3 h-3 rounded-full border border-neutral-200" style={{ backgroundColor: p.colorHex }} />
                                                            <span className="text-neutral-600 dark:text-neutral-400 capitalize">{p.colorName || "—"}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 font-black text-neutral-900 dark:text-white whitespace-nowrap">{formatINR(p.priceInRupees)}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex">
                                                            {Array.from({ length: 5 }).map((_, i) => (
                                                                <span key={i} className={`text-[10px] ${i < p.hotness ? "text-orange-500" : "text-neutral-300 dark:text-neutral-700"}`}>●</span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        {(() => {
                                                            if (p.stockQuantity <= 0) {
                                                                return (
                                                                    <span className="px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400 font-extrabold text-[10px] whitespace-nowrap">
                                                                        Out of Stock (0 left)
                                                                    </span>
                                                                );
                                                            }
                                                            return (
                                                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-extrabold text-[10px] whitespace-nowrap">
                                                                    In Stock ({p.stockQuantity} left)
                                                                </span>
                                                            );
                                                        })()}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={() => handleEditProductClick(p)}
                                                                className="p-1.5 rounded-lg text-neutral-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/20 transition-all cursor-pointer"
                                                                title="Edit product"
                                                            >
                                                                <Edit className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteProduct(p.sku)}
                                                                className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                                                                title="Remove from catalog"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}
