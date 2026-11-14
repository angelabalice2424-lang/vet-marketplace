"use client";

import { useState } from "react";
import { Button, Input, Modal } from "@/components/ui";
import { SPECIALTIES } from "@/lib/constants";

interface ClinicFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export function ClinicForm({ onSubmit, isLoading = false }: ClinicFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    city: "",
    address: "",
    phone: "",
    specialties: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleSpecialty = (specialty: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.includes(specialty)
        ? formData.specialties.filter((s) => s !== specialty)
        : [...formData.specialties, specialty],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <Input
        label="Nombre de la Clínica"
        name="name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          rows={3}
          placeholder="Describe tu clínica..."
        />
      </div>

      <Input
        label="Ciudad"
        name="city"
        value={formData.city}
        onChange={handleChange}
        required
      />

      <Input
        label="Dirección"
        name="address"
        value={formData.address}
        onChange={handleChange}
        required
      />

      <Input
        label="Teléfono"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Especialidades
        </label>
        <div className="grid grid-cols-2 gap-2">
          {SPECIALTIES.map((specialty) => (
            <label key={specialty} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.specialties.includes(specialty)}
                onChange={() => toggleSpecialty(specialty)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm">{specialty}</span>
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" isLoading={isLoading} className="w-full">
        Crear Clínica
      </Button>
    </form>
  );
}
