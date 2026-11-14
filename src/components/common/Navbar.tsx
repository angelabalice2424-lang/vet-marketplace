"use client";

import { useAuthOptional } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui";

export function Navbar() {
  const { user } = useAuthOptional();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container-app py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-2xl">🐾</span>
          VetApp
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">
                {user.name} ({user.role === "VETERINARIAN" ? "Vet" : "Owner"})
              </span>
              <button
                onClick={() => signOut({ redirect: true })}
                className="text-sm text-primary hover:underline"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="secondary" size="sm">
                  Inicia sesión
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Crea una cuenta</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
