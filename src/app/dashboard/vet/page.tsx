import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui";
import Link from "next/link";

export default async function VetDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user?.role !== "VETERINARIAN") {
    redirect("/dashboard/owner");
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Dashboard Veterinario</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">🏥 Mi Clínica</h2>
          <p className="text-gray-600 mb-4">
            Crea tu clínica y configura tu información.
          </p>
          <Link href="/dashboard/vet/clinic">
            <Button className="w-full">Ir a Clínica</Button>
          </Link>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">📅 Disponibilidad</h2>
          <p className="text-gray-600 mb-4">
            Configura tus horarios semanales y genera turnos.
          </p>
          <Link href="/dashboard/vet/availability">
            <Button className="w-full">Configurar Horarios</Button>
          </Link>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-4">📋 Mis Turnos</h2>
          <p className="text-gray-600 mb-4">
            Ve todas las citas reservadas en tu clínica.
          </p>
          <Link href="/dashboard/vet/appointments">
            <Button className="w-full">Ver Turnos</Button>
          </Link>
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
