import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateSlots } from "@/lib/slots";
import { z } from "zod";

const availabilitySchema = z.object({
  mondayStart: z.string().optional(),
  mondayEnd: z.string().optional(),
  tuesdayStart: z.string().optional(),
  tuesdayEnd: z.string().optional(),
  wednesdayStart: z.string().optional(),
  wednesdayEnd: z.string().optional(),
  thursdayStart: z.string().optional(),
  thursdayEnd: z.string().optional(),
  fridayStart: z.string().optional(),
  fridayEnd: z.string().optional(),
  saturdayStart: z.string().optional(),
  saturdayEnd: z.string().optional(),
  sundayStart: z.string().optional(),
  sundayEnd: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "VETERINARIAN") {
      return NextResponse.json(
        { message: "Only veterinarians can set availability" },
        { status: 403 }
      );
    }

    // Get vet's clinic
    const clinic = await prisma.clinic.findUnique({
      where: { vetId: session.user.id },
    });

    if (!clinic) {
      return NextResponse.json(
        { message: "You must create a clinic first" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const availabilityData = availabilitySchema.parse(body);

    // Create or update availability schedule
    let schedule = await prisma.availabilitySchedule.findUnique({
      where: { clinicId: clinic.id },
    });

    if (schedule) {
      // Update existing schedule
      schedule = await prisma.availabilitySchedule.update({
        where: { id: schedule.id },
        data: availabilityData,
      });
    } else {
      // Create new schedule
      schedule = await prisma.availabilitySchedule.create({
        data: {
          clinicId: clinic.id,
          ...availabilityData,
        },
      });
    }

    // Generate slots for next 28 days
    await generateSlots(schedule.id, 28);

    return NextResponse.json(
      {
        message: "Availability configured and slots generated",
        schedule,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Availability error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const clinicId = request.nextUrl.searchParams.get("clinicId");

    if (!clinicId) {
      return NextResponse.json(
        { message: "clinicId is required" },
        { status: 400 }
      );
    }

    const schedule = await prisma.availabilitySchedule.findUnique({
      where: { clinicId },
    });

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("Availability fetch error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
