import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ShieldAlert, Users } from "lucide-react";

export default async function MasterAdminPage() {
  const session = await getCurrentSession();

  if (!session || session.role !== "MASTER_ADMIN") {
    redirect("/admin/dashboard");
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 rounded">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Master Admin System</h1>
          <p className="text-xs text-[#6B7280]">Role escalations & master overrides</p>
        </div>
      </div>

      <div className="bg-white border border-[#E7E5E4] rounded-md p-6 space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#111827] flex items-center gap-2">
          <Users className="w-4 h-4 text-[#111827]" /> Registered Users & Roles
        </h2>

        <div className="divide-y divide-[#E7E5E4]">
          {users.map((u) => (
            <div key={u.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-[#111827]">{u.name || u.email}</span>
                <p className="text-[11px] text-[#6B7280]">{u.email}</p>
              </div>
              <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded uppercase ${
                u.role === "MASTER_ADMIN" ? "bg-rose-50 text-rose-800 border border-rose-200" : u.role === "ADMIN" ? "bg-slate-100 text-slate-800 border border-slate-200" : "bg-[#FAFAF8] text-[#6B7280]"
              }`}>
                {u.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
