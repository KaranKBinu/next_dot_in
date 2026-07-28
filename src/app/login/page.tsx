"use client";

import { useState } from "react";
import { loginAction, signupAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = isSignup ? await signupAction(formData) : await loginAction(formData);

    if (res.success) {
      if (res.role === "ADMIN" || res.role === "MASTER_ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/profile");
      }
      router.refresh();
    } else {
      setError(res.error || "Authentication failed.");
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-6 py-20 flex-1 w-full bg-[#FAFAF8]">
      <div className="bg-white border border-[#E7E5E4] rounded-md p-8 shadow-sm">
        <h1 className="text-xl font-bold uppercase tracking-wider text-[#111827] text-center mb-1">
          {isSignup ? "Create Client Account" : "Sign In to NEXT.IN"}
        </h1>
        <p className="text-xs text-[#6B7280] text-center mb-6">
          {isSignup ? "Enter your information to register" : "Enter your email & password to sign in"}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-md text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Full Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full mt-1 px-3.5 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded-md text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
              />
            </div>
          )}

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Email Address</label>
            <input
              type="email"
              name="email"
              required
              className="w-full mt-1 px-3.5 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded-md text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full mt-1 px-3.5 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded-md text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#111827] hover:bg-[#27272A] text-white font-semibold text-xs uppercase tracking-wider rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? "Processing..." : isSignup ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-xs text-[#6B7280] hover:text-[#111827] font-semibold uppercase tracking-wider"
          >
            {isSignup ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </main>
  );
}
