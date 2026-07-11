"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, ShieldCheck, Loader2, AlertCircle } from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get("from") || "/admin";

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                router.push(from);
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || "Invalid password");
                setPassword("");
            }
        } catch {
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl" />
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-sm">
                {/* Card */}
                <div className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800/80 rounded-3xl p-8 shadow-2xl shadow-black/50">

                    {/* Logo / Icon */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-14 h-14 bg-primary-500/10 border border-primary-500/30 rounded-2xl flex items-center justify-center mb-4">
                            <ShieldCheck className="w-7 h-7 text-primary-400" />
                        </div>
                        <h1 className="text-lg font-black text-white tracking-tight">Admin Access</h1>
                        <p className="text-xs text-neutral-500 mt-1">Enter your password to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Password field */}
                        <div className="space-y-1.5">
                            <label htmlFor="admin-password" className="text-xs font-bold text-neutral-400 block">
                                Password
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-600">
                                    <Lock className="w-4 h-4" />
                                </span>
                                <input
                                    id="admin-password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    autoFocus
                                    placeholder="••••••••••••"
                                    className="w-full pl-10 pr-10 py-3 bg-neutral-800/60 border border-neutral-700/60 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500/50 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Error message */}
                        {error && (
                            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-xs font-bold text-red-400">
                                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading || !password}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-primary-500 hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all active:scale-95 cursor-pointer mt-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Verifying…
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="w-4 h-4" />
                                    Sign In
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-[10px] text-neutral-700 mt-6">
                        Protected area — unauthorized access is prohibited.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}
