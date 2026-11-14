import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Middleware should handle this redirect, but this is a safety net
  redirect(session.user?.role === "VETERINARIAN" ? "/dashboard/vet" : "/dashboard/owner");
}
