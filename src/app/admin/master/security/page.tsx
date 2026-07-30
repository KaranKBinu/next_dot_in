import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminMasterSecurityClient from "@/components/AdminMasterSecurityClient";

export default async function MasterAdminSecurityPage() {
  const session = await getCurrentSession();
  if (!session || session.role !== "MASTER_ADMIN") {
    redirect("/admin/dashboard");
  }

  const [masterAdmins, admins, recentSecurityAudits] = await Promise.all([
    prisma.user.findMany({ where: { role: "MASTER_ADMIN" } }),
    prisma.user.findMany({ where: { role: "ADMIN" } }),
    prisma.auditLog.findMany({
      where: {
        action: {
          in: ["USER_ROLE_CHANGED", "USER_PASSWORD_RESET", "USER_DELETED", "USER_CREATED"],
        },
      },
      include: { actor: { select: { name: true, email: true } } },
      orderBy: { timestamp: "desc" },
      take: 50,
    }),
  ]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-[#111827]">
            Security Center & Session Management
          </h1>
          <p className="text-xs text-[#6B7280]">
            Review administrative privileges, force session revocations, and monitor security events.
          </p>
        </div>
      </div>

      <AdminMasterSecurityClient
        currentMaster={session}
        masterAdmins={masterAdmins}
        admins={admins}
        recentSecurityAudits={recentSecurityAudits}
      />
    </div>
  );
}
