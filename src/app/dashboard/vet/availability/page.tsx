"use client";

import { useState } from "react";
import { AvailabilityScheduleForm } from "@/components/availability/AvailabilityScheduleForm";

export default function VetAvailabilityPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Error saving availability");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-2">Configurar Disponibilidad</h1>
      <p className="text-gray-600 mb-8">
        Define tus horarios de atención. Los turnos se generarán automáticamente para los próximos 28 días.
      </p>

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 mb-6">
          ✅ ¡Disponibilidad guardada! Turnos generados para 28 días.
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
          ❌ {error}
        </div>
      )}

      <AvailabilityScheduleForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
