import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const clinicId = request.nextUrl.searchParams.get("clinicId");
    const date = request.nextUrl.searchParams.get("date");

    if (!clinicId || !date) {
      return NextResponse.json(
        { message: "clinicId and date are required" },
        { status: 400 }
      );
    }

    // Parse the date (format: YYYY-MM-DD)
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Get clinic's schedule
    const clinic = await prisma.clinic.findUnique({
      where: { id: clinicId },
      include: { availabilitySchedule: true },
    });

    if (!clinic || !clinic.availabilitySchedule) {
      return NextResponse.json(
        { message: "Clinic or availability schedule not found" },
        { status: 404 }
      );
    }

    // Get available slots for this date that are not booked
    const slots = await prisma.availabilitySlot.findMany({
      where: {
        scheduleId: clinic.availabilitySchedule.id,
        startTime: {
          gte: startDate,
          lte: endDate,
        },
        isBooked: false,
      },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json(slots);
  } catch (error) {
    console.error("Slots fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
