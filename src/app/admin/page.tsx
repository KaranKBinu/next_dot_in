import { getCurrentSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminIndexPage() {
  const session = await getCurrentSession();

  if (!session || (session.role !== "ADMIN" && session.role !== "MASTER_ADMIN")) {
    redirect("/admin/login");
  }

  if (session.role === "MASTER_ADMIN") {
    redirect("/admin/master");
  }

  redirect("/admin/dashboard");
}
