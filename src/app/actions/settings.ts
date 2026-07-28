"use server";

import { updateSystemSetting } from "@/lib/settings";
import { getCurrentSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function toggleSettingAction(key: string, enabled: boolean) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "MASTER_ADMIN")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await updateSystemSetting(key, enabled);
    revalidatePath("/admin/settings");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
