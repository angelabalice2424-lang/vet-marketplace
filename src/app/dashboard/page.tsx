import Link from 'next/link';

export const metadata = {
  title: 'Dashboard - VetApp',
  description: 'Dashboard home',
};

export default function Dashboard() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Select Your Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <Link
          href="/dashboard/owner"
          className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition"
        >
          <div className="text-5xl mb-4">🐾</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pet Owner</h2>
          <p className="text-gray-600 mb-4">Manage your pets and book appointments</p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Go to Owner Dashboard
          </button>
        </Link>

        <Link
          href="/dashboard/vet"
          className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition"
        >
          <div className="text-5xl mb-4">🏥</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Veterinarian</h2>
          <p className="text-gray-600 mb-4">Manage your schedule and appointments</p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Go to Vet Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
