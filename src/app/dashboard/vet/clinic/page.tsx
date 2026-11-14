"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClinicForm } from "@/components/clinic/ClinicForm";

export default function VetClinicPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/clinics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Error creating clinic");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/vet/availability");
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Crear Mi Clínica</h1>
      <p className="text-gray-600 mb-8">
        Completa los detalles de tu clínica veterinaria.
      </p>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 mb-6">
          ✅ ¡Clínica creada exitosamente! Redirigiendo...
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
          ❌ {error}
        </div>
      )}

      <ClinicForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
