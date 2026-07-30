import { getCurrentSession } from "@/lib/auth";
import { getSystemSettings } from "@/lib/settings";
import { redirect } from "next/navigation";
import AdminMasterDangerZoneClient from "@/components/AdminMasterDangerZoneClient";

export default async function MasterAdminDangerZonePage() {
  const session = await getCurrentSession();
  if (!session || session.role !== "MASTER_ADMIN") {
    redirect("/admin/dashboard");
  }

  const settings = await getSystemSettings();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-[#111827]">
            Master Danger Zone
          </h1>
          <p className="text-xs text-[#6B7280] font-medium">
            Destructive platform overrides, bulk unpublishing, and maintenance mode toggles. Proceed with extreme caution.
          </p>
        </div>
      </div>

      <AdminMasterDangerZoneClient isMaintenanceMode={!!settings.maintenance_mode} />
    </div>
  );
}

