"use client";

import { logoutAction } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push("/");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="px-3.5 py-1.5 bg-[#FAFAF8] hover:bg-[#F4F4F0] text-[#111827] text-xs font-semibold uppercase tracking-wider rounded border border-[#E7E5E4] transition-colors"
    >
      Sign Out
    </button>
  );
}
