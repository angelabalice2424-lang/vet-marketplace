import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createAppointmentAtomic, AppointmentError } from "@/lib/api-utils";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { trackEvent } from "@/lib/analytics";

const appointmentSchema = z.object({
  clinicId: z.string().cuid(),
  slotId: z.string().cuid(),
  petId: z.string().cuid().optional(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const ownerId = request.nextUrl.searchParams.get("ownerId");

    if (!ownerId) {
      return NextResponse.json(
        { message: "ownerId is required" },
        { status: 400 }
      );
    }

    const appointments = await prisma.appointment.findMany({
      where: { ownerId },
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
      orderBy: { slot: { startTime: "asc" } },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Appointments fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "PET_OWNER") {
      return NextResponse.json(
        { message: "Only pet owners can book appointments" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { clinicId, slotId, petId, notes } = appointmentSchema.parse(body);

    // Create appointment atomically
    const appointment = await createAppointmentAtomic(
      session.user.id,
      clinicId,
      slotId,
      petId,
      notes
    );

    // Track event
    await trackEvent("appointment_created", session.user.id, {
      clinicId,
      slotId,
      petId: petId || null,
    });

    return NextResponse.json(appointment, { status: 201 });
  } catch (error) {
    if (error instanceof AppointmentError) {
      if (error.message === "Slot already booked") {
        // Track failed booking due to conflict
        const session = await auth();
        if (session?.user) {
          await trackEvent("appointment_failed", session.user.id, {
            reason: "slot_booked",
          });
        }
        return NextResponse.json(
          { message: error.message },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Appointment creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
