import { SessionProvider } from "next-auth/react";
import { Navbar } from "@/components/common/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container-app py-8">{children}</main>
      </div>
    </SessionProvider>
  );
}
