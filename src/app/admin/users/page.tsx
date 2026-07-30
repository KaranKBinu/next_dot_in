import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import AdminUsersClient from "@/components/AdminUsersClient";

export default async function AdminUsersPage() {
  const session = await getCurrentSession();
  if (!session || session.role !== "MASTER_ADMIN") {
    redirect("/admin/dashboard");
  }

  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { orders: true, reviews: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-[#111827]">
            User & Role Management
          </h1>
          <p className="text-xs text-[#6B7280]">
            Master Admin control panel for managing user accounts, permissions, and administrative access.
          </p>
        </div>
      </div>

      <AdminUsersClient initialUsers={users} currentUserId={session.id} />
    </div>
  );
}
