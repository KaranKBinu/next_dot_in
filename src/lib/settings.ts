import { cache } from "react";
import { prisma } from "./prisma";
import { logger } from "./logger";

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
    const map: Record<string, boolean> = Object.entries(DEFAULT_SETTINGS).reduce(
      (acc, [key, val]) => ({ ...acc, [key]: val === "true" }),
      {}
    );

    for (const s of settings) {
      map[s.key] = s.value === "true";
    }

    return map;
  } catch (error) {
    logger.error(
      {
        operation: "SYSTEM_SETTINGS_LOAD_FAILED",
        error: (error as any)?.message,
      },
      "Error loading system settings"
    );
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
