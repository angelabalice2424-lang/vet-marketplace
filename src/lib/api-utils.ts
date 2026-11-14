import { prisma } from "./db";

export async function createAppointmentAtomic(
  ownerId: string,
  clinicId: string,
  slotId: string,
  petId?: string | null,
  notes?: string | null
) {
  // Start a transaction
  const appointment = await prisma.$transaction(async (tx) => {
    // Verify slot exists and is not booked
    const slot = await tx.availabilitySlot.findUnique({
      where: { id: slotId },
    });

    if (!slot) {
      throw new Error("Slot not found");
    }

    if (slot.isBooked) {
      throw new Error("Slot already booked");
    }

    // Mark slot as booked
    await tx.availabilitySlot.update({
      where: { id: slotId },
      data: { isBooked: true },
    });

    // Create the appointment
    const newAppointment = await tx.appointment.create({
      data: {
        ownerId,
        clinicId,
        slotId,
        petId: petId || null,
        notes: notes || null,
        status: "CONFIRMED",
      },
      include: {
        slot: true,
        clinic: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
          },
        },
        pet: true,
      },
    });

    return newAppointment;
  });

  return appointment;
}

export class AppointmentError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = "AppointmentError";
  }
}
