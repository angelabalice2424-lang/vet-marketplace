import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VetApp - Reserva de Citas Veterinarias",
  description: "Plataforma de reserva de citas veterinarias conectando propietarios con veterinarios",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
