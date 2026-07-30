"use server";

import { updateSystemSetting } from "@/lib/settings";
import { requireAdmin, logAuditAction } from "@/lib/authorization";
import { revalidatePath } from "next/cache";

export async function toggleSettingAction(key: string, enabled: boolean) {
  try {
    const session = await requireAdmin();
    await updateSystemSetting(key, enabled);
    await logAuditAction(session.id, "SETTING_CHANGED", "SystemSetting", key, { enabled });

    revalidatePath("/admin/settings");
    revalidatePath("/");
    revalidatePath(`/product/[slug]`, "page");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

