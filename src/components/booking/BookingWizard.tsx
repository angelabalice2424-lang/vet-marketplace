"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Modal } from "@/components/ui";
import { useAnalytics } from "@/hooks/useAnalytics";

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
}

interface BookingWizardProps {
  clinicId: string;
  clinicName: string;
}

export function BookingWizard({ clinicId, clinicName }: BookingWizardProps) {
  const router = useRouter();
  const { trackEvent } = useAnalytics();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCSAT, setShowCSAT] = useState(false);

  // Step 1: Date selection
  const handleDateSelect = async (date: string) => {
    setSelectedDate(date);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/slots?clinicId=${clinicId}&date=${date}`);
      const data = await response.json();
      setSlots(data);
      setStep(2);

      // Track event
      await trackEvent("booking_step_1_viewed", {
        clinicId,
        selectedDate: date,
      });
    } catch (err) {
      setError("Error loading available times");
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Time selection
  const handleSlotSelect = (slotId: string) => {
    setSelectedSlot(slotId);
    setStep(3);

    trackEvent("booking_step_2_viewed", {
      clinicId,
      slotId,
    });
  };

  // Step 3: Confirmation & Book
  const handleBooking = async () => {
    if (!selectedSlot) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicId,
          slotId: selectedSlot,
        }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error("Este turno ya fue reservado. Elige otro.");
        }
        throw new Error("Error al crear la reserva");
      }

      // Track success
      await trackEvent("appointment_created", {
        clinicId,
        slotId: selectedSlot,
      });

      // Show CSAT modal
      setShowCSAT(true);

      // Redirect after 3 seconds
      setTimeout(() => {
        router.push("/dashboard/owner/appointments");
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");

      // Track failure
      await trackEvent("appointment_failed", {
        clinicId,
        reason: "booking_error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];
  const maxDate = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const selectedSlotData = slots.find((s) => s.id === selectedSlot);

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Reservar Cita en {clinicName}</h1>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
          ❌ {error}
        </div>
      )}

      {/* Step 1: Date */}
      {step >= 1 && (
        <div className={`card mb-6 ${step > 1 ? "opacity-60" : ""}`}>
          <h2 className="text-lg font-semibold mb-4">
            Paso 1: Selecciona una Fecha
          </h2>
          <input
            type="date"
            min={minDate}
            max={maxDate}
            value={selectedDate}
            onChange={(e) => handleDateSelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      )}

      {/* Step 2: Time */}
      {step >= 2 && (
        <div className={`card mb-6 ${step > 2 ? "opacity-60" : ""}`}>
          <h2 className="text-lg font-semibold mb-4">
            Paso 2: Selecciona una Hora
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {slots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => handleSlotSelect(slot.id)}
                className={`p-3 border rounded-lg transition-all ${
                  selectedSlot === slot.id
                    ? "bg-primary text-white border-primary"
                    : "border-gray-300 hover:border-primary"
                }`}
              >
                {new Date(slot.startTime).toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Confirm */}
      {step >= 3 && (
        <div className="card mb-6">
          <h2 className="text-lg font-semibold mb-4">Paso 3: Confirmar</h2>
          <div className="space-y-2 mb-6 p-4 bg-gray-50 rounded-lg">
            <p>
              <strong>Clínica:</strong> {clinicName}
            </p>
            <p>
              <strong>Fecha:</strong>{" "}
              {new Date(selectedDate).toLocaleDateString("es-AR")}
            </p>
            <p>
              <strong>Hora:</strong>{" "}
              {selectedSlotData &&
                new Date(selectedSlotData.startTime).toLocaleTimeString(
                  "es-AR",
                  { hour: "2-digit", minute: "2-digit" }
                )}
            </p>
          </div>

          <Button
            onClick={handleBooking}
            isLoading={isLoading}
            className="w-full"
          >
            Confirmar Reserva
          </Button>
        </div>
      )}

      {/* CSAT Modal */}
      <Modal isOpen={showCSAT} onClose={() => setShowCSAT(false)} size="md">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">¡Cita Reservada!</h2>
          <p className="text-gray-600 mb-4">
            Gracias por reservar con nosotros. Redirigiendo a tus citas...
          </p>
          <div className="text-4xl mb-4">✅</div>
        </div>
      </Modal>
    </div>
  );
}
