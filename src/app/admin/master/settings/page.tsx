import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSystemSettings } from "@/lib/settings";
import { redirect } from "next/navigation";
import AdminMasterSettingsClient from "@/components/AdminMasterSettingsClient";

export default async function MasterAdminSettingsPage() {
  const session = await getCurrentSession();
  if (!session || session.role !== "MASTER_ADMIN") {
    redirect("/admin/dashboard");
  }

  const settings = await getSystemSettings();

  // Fetch detailed settings metadata
  const featureAudits = await prisma.auditLog.findMany({
    where: { entityType: "SystemSetting" },
    include: { actor: { select: { name: true, email: true } } },
    orderBy: { timestamp: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-[#111827]">
            Structured System Settings & Feature Flags
          </h1>
          <p className="text-xs text-[#6B7280]">
            Categorized control over store behavior, checkout availability, storefront features, and admin toggles.
          </p>
        </div>
      </div>

      <AdminMasterSettingsClient settings={settings} featureAudits={featureAudits} />
    </div>
  );
}
