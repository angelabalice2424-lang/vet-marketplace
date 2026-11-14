import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const clinicSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  city: z.string().min(2),
  address: z.string().min(5),
  phone: z.string().min(7),
  specialties: z.array(z.string()).default([]),
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
        { message: "Only veterinarians can create clinics" },
        { status: 403 }
      );
    }

    // Check if vet already has a clinic
    const existingClinic = await prisma.clinic.findUnique({
      where: { vetId: session.user.id },
    });

    if (existingClinic) {
      return NextResponse.json(
        { message: "You already have a clinic" },
        { status: 409 }
      );
    }

    const body = await request.json();
    const { name, description, city, address, phone, specialties } =
      clinicSchema.parse(body);

    const clinic = await prisma.clinic.create({
      data: {
        name,
        description,
        city,
        address,
        phone,
        specialties,
        vetId: session.user.id,
      },
    });

    return NextResponse.json(clinic, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Clinic creation error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const city = request.nextUrl.searchParams.get("city");
    const specialty = request.nextUrl.searchParams.get("specialty");

    const where: any = {};
    if (city) where.city = { contains: city, mode: "insensitive" };
    if (specialty) {
      where.specialties = { hasSome: [specialty] };
    }

    const clinics = await prisma.clinic.findMany({
      where,
      select: {
        id: true,
        name: true,
        description: true,
        city: true,
        address: true,
        phone: true,
        specialties: true,
        vet: {
          select: {
            name: true,
          },
        },
      },
      take: 20,
    });

    return NextResponse.json(clinics);
  } catch (error) {
    console.error("Clinic search error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
