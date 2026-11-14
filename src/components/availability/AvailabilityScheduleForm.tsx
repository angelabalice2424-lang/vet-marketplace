"use client";

import { useState } from "react";
import { Button, Input } from "@/components/ui";
import { DAY_LABELS } from "@/lib/constants";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;

interface AvailabilityFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function AvailabilityScheduleForm({
  onSubmit,
  isLoading = false,
}: AvailabilityFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleTimeChange = (day: string, type: "Start" | "End", value: string) => {
    setFormData({
      ...formData,
      [`${day}${type}`]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
        <p className="text-sm text-blue-800">
          💡 Configura tus horarios semanales. Los turnos se generarán automáticamente para los próximos 28 días.
        </p>
      </div>

      {DAYS.map((day) => (
        <div key={day} className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">{DAY_LABELS[day]}</h3>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Hora Inicio"
              type="time"
              value={formData[`${day}Start`] || ""}
              onChange={(e) => handleTimeChange(day, "Start", e.target.value)}
              placeholder="09:00"
            />
            <Input
              label="Hora Fin"
              type="time"
              value={formData[`${day}End`] || ""}
              onChange={(e) => handleTimeChange(day, "End", e.target.value)}
              placeholder="17:00"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Deja en blanco si no trabajas este día
          </p>
        </div>
      ))}

      <Button type="submit" isLoading={isLoading} className="w-full">
        Guardar Disponibilidad (Generar Turnos)
      </Button>
    </form>
  );
}
