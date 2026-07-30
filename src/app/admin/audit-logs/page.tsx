import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminAuditLogsClient from "@/components/AdminAuditLogsClient";

export default async function AdminAuditLogsPage() {
  const session = await getCurrentSession();
  if (!session || session.role !== "MASTER_ADMIN") {
    redirect("/admin/dashboard");
  }

  const logs = await prisma.auditLog.findMany({
    include: {
      actor: { select: { name: true, email: true, role: true } },
    },
    orderBy: { timestamp: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-[#111827]">
            System Audit Logs
          </h1>
          <p className="text-xs text-[#6B7280]">
            Master Admin audit trail for tracking administrative changes, role modifications, and system security actions.
          </p>
        </div>
      </div>

      <AdminAuditLogsClient initialLogs={logs} />
    </div>
  );
}
