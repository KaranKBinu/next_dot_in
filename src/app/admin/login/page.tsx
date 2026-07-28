"use client";

import { useState } from "react";
import { loginAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await loginAction(formData);

    if (res.success && (res.role === "ADMIN" || res.role === "MASTER_ADMIN")) {
      router.push("/admin/dashboard");
      router.refresh();
    } else if (res.success) {
      setError("This account does not have administrator permissions.");
      setLoading(false);
    } else {
      setError(res.error || "Admin authentication failed.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-[#E7E5E4] rounded-md p-8 shadow-sm">
        <div className="w-10 h-10 bg-[#111827] text-white rounded flex items-center justify-center mx-auto mb-4 text-sm font-bold">
          <Shield className="w-5 h-5" />
        </div>

        <h1 className="text-lg font-bold uppercase tracking-wider text-[#111827] text-center mb-1">Store Admin Operating System</h1>
        <p className="text-xs text-[#6B7280] text-center mb-6">Sign in with administrator credentials</p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-md text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Admin Email</label>
            <input
              type="email"
              name="email"
              defaultValue="admin@next.in"
              required
              className="w-full mt-1 px-3.5 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded-md text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Password</label>
            <input
              type="password"
              name="password"
              defaultValue="admin123"
              required
              className="w-full mt-1 px-3.5 py-2 bg-[#FAFAF8] border border-[#E7E5E4] rounded-md text-xs text-[#111827] focus:outline-none focus:border-[#111827]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#111827] hover:bg-[#27272A] text-white font-semibold text-xs uppercase tracking-wider rounded-md transition-colors disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In to System"}
          </button>
        </form>
      </div>
    </main>
  );
}
