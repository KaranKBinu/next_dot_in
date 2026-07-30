import { cache } from "react";
import { prisma } from "./prisma";

export const DEFAULT_SETTINGS: Record<string, string> = {
  wishlist_enabled: "true",
  reviews_enabled: "true",
  coupons_enabled: "true",
  featured_products_enabled: "true",
  ai_intake_enabled: "true",
};

export const getSystemSettings = cache(async (): Promise<Record<string, boolean>> => {
  try {
    const settings = await prisma.systemSetting.findMany();
    const result: Record<string, boolean> = {};

    for (const [key, defaultValue] of Object.entries(DEFAULT_SETTINGS)) {
      const found = settings.find((s) => s.key === key);
      result[key] = found ? found.value === "true" : defaultValue === "true";
    }

    return result;
  } catch (error) {
    console.error("Error loading system settings:", error);
    return {
      wishlist_enabled: true,
      reviews_enabled: true,
      coupons_enabled: true,
      featured_products_enabled: true,
      ai_intake_enabled: true,
    };
  }
});

export async function updateSystemSetting(key: string, enabled: boolean) {
  return await prisma.systemSetting.upsert({
    where: { key },
    update: { value: enabled ? "true" : "false" },
    create: { key, value: enabled ? "true" : "false" },
  });
}
