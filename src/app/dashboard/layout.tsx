import Link from 'next/link';

export const metadata = {
  title: 'Dashboard - VetApp',
  description: 'VetApp Dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
              VetApp
            </Link>
            <div className="flex gap-4">
              <Link
                href="/dashboard/owner"
                className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium"
              >
                Owner
              </Link>
              <Link
                href="/dashboard/vet"
                className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium"
              >
                Vet
              </Link>
              <Link
                href="/"
                className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
