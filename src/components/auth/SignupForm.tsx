"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui";
import Link from "next/link";

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<"VETERINARIAN" | "PET_OWNER" | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!role) {
      setError("Please select a role");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Signup failed");
      }

      router.push("/login?signup=success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (!role) {
    return (
      <div className="max-w-md mx-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Crear Cuenta</h2>
        <p className="text-gray-600 mb-6">¿Qué tipo de cuenta deseas crear?</p>

        <div className="space-y-4">
          <button
            onClick={() => setRole("PET_OWNER")}
            className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="font-semibold text-lg">👤 Dueño de Mascota</div>
            <p className="text-sm text-gray-600 mt-1">
              Busca y reserva citas veterinarias
            </p>
          </button>

          <button
            onClick={() => setRole("VETERINARIAN")}
            className="w-full p-4 border-2 border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-all"
          >
            <div className="font-semibold text-lg">🏥 Veterinario</div>
            <p className="text-sm text-gray-600 mt-1">
              Crea tu clínica y gestiona turnos
            </p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <button
        onClick={() => setRole(null)}
        className="text-sm text-primary hover:underline mb-4"
      >
        ← Atrás
      </button>

      <h2 className="text-2xl font-bold mb-6">
        Crear Cuenta como {role === "PET_OWNER" ? "Dueño" : "Veterinario"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <Input
          label="Nombre Completo"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <Input
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <Input
          label="Contraseña"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Input
          label="Confirmar Contraseña"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <Button type="submit" isLoading={isLoading} className="w-full">
          Crear Cuenta
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
