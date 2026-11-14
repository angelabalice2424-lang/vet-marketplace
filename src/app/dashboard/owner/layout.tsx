import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "PET_OWNER") {
    redirect("/dashboard/vet");
  }

  return <>{children}</>;
}
