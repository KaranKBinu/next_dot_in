import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import CustomerProfileCrmClient from "@/components/CustomerProfileCrmClient";

export default async function AdminCustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const customer = await prisma.user.findUnique({
    where: { id },
    include: {
      addresses: true,
      orders: {
        include: {
          items: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!customer) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <CustomerProfileCrmClient customer={customer} />
    </div>
  );
}
