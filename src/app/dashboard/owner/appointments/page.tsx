"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui";
import Link from "next/link";

interface Appointment {
  id: string;
  slot: {
    startTime: string;
    endTime: string;
  };
  clinic: {
    name: string;
    address: string;
    phone: string;
  };
  status: string;
}

export default function OwnerAppointmentsPage() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!session?.user) return;

      try {
        const response = await fetch(
          `/api/appointments?ownerId=${session.user.id}`
        );
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [session]);

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mis Citas</h1>
        <Link href="/dashboard/owner/search">
          <Button>+ Nueva Cita</Button>
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Aún no tienes citas reservadas.</p>
          <Link href="/dashboard/owner/search">
            <Button>Buscar Clínicas</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="card">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">
                    {appointment.clinic.name}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {appointment.clinic.address}
                  </p>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {appointment.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Fecha</p>
                  <p className="font-semibold">
                    {new Date(appointment.slot.startTime).toLocaleDateString(
                      "es-AR"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Hora</p>
                  <p className="font-semibold">
                    {new Date(appointment.slot.startTime).toLocaleTimeString(
                      "es-AR",
                      { hour: "2-digit", minute: "2-digit" }
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Teléfono</p>
                  <p className="font-semibold">{appointment.clinic.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
