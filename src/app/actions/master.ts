"use server";

import { prisma } from "@/lib/prisma";
import { requireMasterAdmin, logAuditAction } from "@/lib/authorization";
import { updateSystemSetting } from "@/lib/settings";
import { revalidatePath } from "next/cache";

export async function masterGlobalSearchAction(query: string) {
  try {
    await requireMasterAdmin();
    const q = query.trim();
    if (!q || q.length < 2) return { success: true, results: { products: [], users: [], orders: [], reviews: [], auditLogs: [] } };

    const [products, users, orders, reviews, auditLogs] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { slug: { contains: q, mode: "insensitive" } },
            { barcode: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: { id: true, name: true, slug: true, price: true, isPublished: true },
      }),
      prisma.user.findMany({
        where: {
          OR: [
            { email: { contains: q, mode: "insensitive" } },
            { name: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: { id: true, name: true, email: true, role: true },
      }),
      prisma.order.findMany({
        where: {
          OR: [
            { orderNumber: { contains: q, mode: "insensitive" } },
            { guestEmail: { contains: q, mode: "insensitive" } },
            { guestName: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: { id: true, orderNumber: true, totalAmount: true, status: true },
      }),
      prisma.review.findMany({
        where: {
          OR: [
            { comment: { contains: q, mode: "insensitive" } },
            { title: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: { id: true, title: true, rating: true, status: true, productId: true },
      }),
      prisma.auditLog.findMany({
        where: {
          OR: [
            { action: { contains: q, mode: "insensitive" } },
            { entityType: { contains: q, mode: "insensitive" } },
            { entityId: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: { id: true, action: true, entityType: true, timestamp: true },
      }),
    ]);

    return {
      success: true,
      results: { products, users, orders, reviews, auditLogs },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function masterUpdateSettingAction(key: string, value: string) {
  try {
    const session = await requireMasterAdmin();
    await updateSystemSetting(key, value === "true");

    await logAuditAction(session.id, "MASTER_SETTING_UPDATED", "SystemSetting", key, { value });

    revalidatePath("/admin/master/settings");
    revalidatePath("/admin/settings");
    revalidatePath("/");

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function masterBulkUnpublishAction() {
  try {
    const session = await requireMasterAdmin();
    const result = await prisma.product.updateMany({
      data: { isPublished: false },
    });

    await logAuditAction(session.id, "BULK_UNPUBLISH_PRODUCTS", "Product", "ALL", { count: result.count });

    revalidatePath("/admin/products");
    revalidatePath("/admin/master");
    return { success: true, count: result.count };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function masterEnableMaintenanceModeAction(enabled: boolean) {
  try {
    const session = await requireMasterAdmin();
    await updateSystemSetting("maintenance_mode", enabled);

    await logAuditAction(session.id, "MAINTENANCE_MODE_TOGGLED", "SystemSetting", "maintenance_mode", { enabled });

    revalidatePath("/");
    revalidatePath("/admin/master");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
