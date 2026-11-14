import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui";
import Link from "next/link";

export default async function OwnerDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role !== "PET_OWNER") {
    redirect("/dashboard/vet");
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Dashboard - Dueño de Mascota</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">🔍 Buscar Clínica</h2>
          <p className="text-gray-600 mb-4">
            Encuentra veterinarios disponibles en tu área.
          </p>
          <Link href="/dashboard/owner/search">
            <Button className="w-full">Buscar Clínicas</Button>
          </Link>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">📅 Mis Citas</h2>
          <p className="text-gray-600 mb-4">
            Ve todas tus citas veterinarias reservadas.
          </p>
          <Link href="/dashboard/owner/appointments">
            <Button className="w-full">Ver Mis Citas</Button>
          </Link>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">🐾 Mis Mascotas</h2>
          <p className="text-gray-600 mb-4">
            Gestiona la información de tus mascotas.
          </p>
          <Button variant="secondary" className="w-full" disabled>
            Próximamente
          </Button>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">👤 Mi Perfil</h2>
          <p className="text-gray-600 mb-4">
            Edita tu información personal.
          </p>
          <Button variant="secondary" className="w-full" disabled>
            Próximamente
          </Button>
        </div>
      </div>
    </div>
  );
}
