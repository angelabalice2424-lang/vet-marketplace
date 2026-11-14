import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function VetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "VETERINARIAN") {
    redirect("/dashboard/owner");
  }

  return <>{children}</>;
}
