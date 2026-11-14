import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { trackEvent } from "@/lib/analytics";
import { z } from "zod";

const analyticsSchema = z.object({
  eventName: z.string(),
  eventProperties: z.record(z.any()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    const { eventName, eventProperties } = analyticsSchema.parse(body);

    // Track the event
    await trackEvent(
      eventName as any,
      session?.user?.id,
      eventProperties
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Analytics error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
