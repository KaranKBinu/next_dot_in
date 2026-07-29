"use client";

import { useState } from "react";
import { loginAction, signupAction } from "@/app/actions/auth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ShieldCheck, ArrowRight, Lock, User, Mail, Phone, MapPin } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/catalog";

  const [isSignup, setIsSignup] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // Step 1: Personal & Security, Step 2: Shipping Address
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { text: "", color: "" };
    if (pass.length < 6) return { text: "Weak", color: "text-rose-600" };
    if (pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass)) {
      return { text: "Strong", color: "text-emerald-700" };
    }
    return { text: "Medium", color: "text-amber-700" };
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("email", form.email);
    formData.append("password", form.password);

    const res = await loginAction(formData);
    if (res.success) {
      if (res.role === "ADMIN" || res.role === "MASTER_ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push(redirectUrl);
      }
      router.refresh();
    } else {
      setError(res.error || "Invalid email or password.");
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("password", form.password);
    formData.append("street", form.street);
    formData.append("city", form.city);
    formData.append("state", form.state);
    formData.append("pincode", form.pincode);

    const res = await signupAction(formData);
    if (res.success) {
      setSuccessMsg("Welcome to NEXT.IN! Your account has been created successfully.");
      setTimeout(() => {
        router.push(redirectUrl);
        router.refresh();
      }, 1000);
    } else {
      setError(res.error || "Account registration failed.");
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(form.password);

  return (
    <main className="max-w-xl mx-auto px-6 py-16 flex-1 w-full bg-[#FAFAF8] animate-fade-in">
      <div className="bg-white border border-[#E7E5E4] rounded-md p-8 shadow-sm">
        {/* Header Title */}
        <h1 className="text-xl font-bold uppercase tracking-wider text-[#111827] text-center mb-1">
          {isSignup ? "Create Client Account" : "Sign In to NEXT.IN"}
        </h1>
        <p className="text-xs text-[#6B7280] text-center mb-6">
          {isSignup
            ? "Complete your profile & shipping setup to start shopping"
            : "Enter your registered credentials to access your bag & orders"}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-md text-xs font-semibold">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            {successMsg}
          </div>
        )}

        {/* SIGN IN FORM */}
        {!isSignup && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full mt-1 px-3.5 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full mt-1 px-3.5 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#111827] hover:bg-[#27272A] active:scale-95 text-white font-semibold text-xs uppercase tracking-wider rounded transition-all disabled:opacity-50 shadow-sm"
            >
              {loading ? "Authenticating..." : "Sign In & Continue Shopping"}
            </button>
          </form>
        )}

        {/* MULTI-STEP SIGNUP FORM */}
        {isSignup && (
          <form onSubmit={handleSignupSubmit} className="space-y-4 text-xs">
            {/* Step Indicators */}
            <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-3 mb-4">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${step === 1 ? "text-[#111827]" : "text-[#9CA3AF]"}`}>
                1. Personal Details
              </span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${step === 2 ? "text-[#111827]" : "text-[#9CA3AF]"}`}>
                2. Shipping Address
              </span>
            </div>

            {/* STEP 1: Personal & Security */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karan Binu"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="karan@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Mobile Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 9876543210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Password *</label>
                    <input
                      type="password"
                      required
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
                    />
                    {strength.text && (
                      <span className={`text-[9px] font-bold uppercase tracking-wider mt-1 block ${strength.color}`}>
                        Strength: {strength.text}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!form.name || !form.email || !form.password) {
                      setError("Please fill out all required personal details.");
                      return;
                    }
                    if (form.password !== form.confirmPassword) {
                      setError("Passwords do not match.");
                      return;
                    }
                    setError(null);
                    setStep(2);
                  }}
                  className="w-full py-3 bg-[#111827] hover:bg-[#27272A] text-white font-semibold text-xs uppercase tracking-wider rounded transition-all flex items-center justify-center gap-2"
                >
                  Continue to Shipping Setup <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* STEP 2: Default Shipping Address */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Street Address / House No.</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 102 Park Avenue"
                    value={form.street}
                    onChange={(e) => setForm({ ...form, street: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">City</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kochi"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">State</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kerala"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Pincode / Postal Code</label>
                  <input
                    type="text"
                    required
                    placeholder="682001"
                    value={form.pincode}
                    onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                    className="w-full mt-1 px-3.5 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded text-xs text-[#111827]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-3 bg-[#FAFAF8] text-[#6B7280] border border-[#E7E5E4] font-semibold text-xs uppercase tracking-wider rounded"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 py-3 bg-[#111827] hover:bg-[#27272A] text-white font-semibold text-xs uppercase tracking-wider rounded transition-all disabled:opacity-50"
                  >
                    {loading ? "Registering..." : "Complete & Start Shopping"}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}

        <div className="mt-6 text-center border-t border-[#E7E5E4] pt-4">
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setStep(1);
              setError(null);
            }}
            className="text-xs text-[#6B7280] hover:text-[#111827] font-semibold uppercase tracking-wider"
          >
            {isSignup ? "Already have an account? Sign In" : "Don't have an account? Create One"}
          </button>
        </div>
      </div>
    </main>
  );
}
