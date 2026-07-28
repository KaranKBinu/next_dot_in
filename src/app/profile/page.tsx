import { getCurrentSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileClientTabs from "@/components/ProfileClientTabs";

export default async function ProfilePage() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");

  const [user, orders, addresses] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.id },
    }),
    prisma.order.findMany({
      where: { userId: session.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.address.findMany({
      where: { userId: session.id },
      orderBy: { isDefault: "desc" },
    }),
  ]);

  return (
    <main className="max-w-5xl mx-auto px-6 sm:px-8 py-12 flex-1 w-full bg-[#FAFAF8] text-[#111827]">
      <div className="mb-8 border-b border-[#E7E5E4] pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-[#111827]">Customer Account Portal</h1>
          <p className="text-xs text-[#6B7280] mt-0.5">{user?.email} • Account Role: <span className="uppercase font-bold text-[#111827]">{user?.role}</span></p>
        </div>
      </div>

      <ProfileClientTabs user={user} orders={orders} addresses={addresses} />
    </main>
  );
}
