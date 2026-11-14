"use client";

import { useState, useEffect } from "react";
import { Button, Input } from "@/components/ui";
import { useAnalytics } from "@/hooks/useAnalytics";
import Link from "next/link";

interface Clinic {
  id: string;
  name: string;
  description?: string;
  city: string;
  address: string;
  phone: string;
  specialties: string[];
  vet: {
    name: string;
  };
}

export default function OwnerSearchPage() {
  const { trackEvent } = useAnalytics();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCity, setSearchCity] = useState("");
  const [searchSpecialty, setSearchSpecialty] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Track search event
    await trackEvent("search_clinics", {
      city: searchCity,
      specialty: searchSpecialty,
    });

    try {
      const params = new URLSearchParams();
      if (searchCity) params.append("city", searchCity);
      if (searchSpecialty) params.append("specialty", searchSpecialty);

      const response = await fetch(`/api/clinics?${params}`);
      const data = await response.json();
      setClinics(data);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load all clinics on mount
    handleSearch(new Event("submit") as any);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Buscar Clínicas</h1>

      <form onSubmit={handleSearch} className="mb-8 max-w-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Ciudad"
            placeholder="Ej: Buenos Aires"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
          />
          <Input
            label="Especialidad"
            placeholder="Ej: Cirugía"
            value={searchSpecialty}
            onChange={(e) => setSearchSpecialty(e.target.value)}
          />
        </div>
        <Button type="submit" isLoading={isLoading}>
          🔍 Buscar
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clinics.map((clinic) => (
          <div key={clinic.id} className="card">
            <h2 className="text-xl font-semibold mb-2">{clinic.name}</h2>
            <p className="text-gray-600 text-sm mb-3">{clinic.description}</p>

            <div className="space-y-1 text-sm mb-4">
              <p>
                <strong>Veterinario:</strong> {clinic.vet.name}
              </p>
              <p>
                <strong>Ciudad:</strong> {clinic.city}
              </p>
              <p>
                <strong>Dirección:</strong> {clinic.address}
              </p>
              <p>
                <strong>Teléfono:</strong> {clinic.phone}
              </p>
            </div>

            {clinic.specialties.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Especialidades:</p>
                <div className="flex flex-wrap gap-2">
                  {clinic.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="bg-primary/10 text-primary text-xs px-2 py-1 rounded"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <Link href={`/dashboard/owner/booking/${clinic.id}`}>
              <Button className="w-full">Reservar Cita</Button>
            </Link>
          </div>
        ))}
      </div>

      {clinics.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-600">No se encontraron clínicas.</p>
        </div>
      )}
    </div>
  );
}
