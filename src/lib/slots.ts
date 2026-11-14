import { prisma } from "./db";
import { SLOT_DURATION_MINUTES, GENERATE_SLOTS_DAYS, DAYS_OF_WEEK } from "./constants";

interface TimeSlot {
  startTime: Date;
  endTime: Date;
}

function parseTimeString(timeStr: string): Date {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function generateTimeSlotsForDay(
  dayStart: string,
  dayEnd: string,
  targetDate: Date
): TimeSlot[] {
  const startTime = parseTimeString(dayStart);
  const endTime = parseTimeString(dayEnd);

  const slots: TimeSlot[] = [];
  let currentStart = new Date(targetDate);
  currentStart.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

  let currentEnd = new Date(currentStart);
  currentEnd.setMinutes(currentEnd.getMinutes() + SLOT_DURATION_MINUTES);

  const dayEndDate = new Date(targetDate);
  dayEndDate.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

  while (currentEnd <= dayEndDate) {
    slots.push({
      startTime: new Date(currentStart),
      endTime: new Date(currentEnd),
    });

    currentStart = new Date(currentEnd);
    currentEnd = new Date(currentStart);
    currentEnd.setMinutes(currentEnd.getMinutes() + SLOT_DURATION_MINUTES);
  }

  return slots;
}

export async function generateSlots(
  scheduleId: string,
  days: number = GENERATE_SLOTS_DAYS
): Promise<void> {
  const schedule = await prisma.availabilitySchedule.findUnique({
    where: { id: scheduleId },
  });

  if (!schedule) {
    throw new Error("Schedule not found");
  }

  const slots: Array<{
    scheduleId: string;
    startTime: Date;
    endTime: Date;
  }> = [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < days; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + i);

    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const dayName = DAYS_OF_WEEK[(dayOfWeek + 6) % 7]; // Adjust for 0=Monday format

    // Get the corresponding schedule times
    const startKey = `${dayName}Start` as keyof typeof schedule;
    const endKey = `${dayName}End` as keyof typeof schedule;

    const dayStart = schedule[startKey] as string | undefined;
    const dayEnd = schedule[endKey] as string | undefined;

    if (dayStart && dayEnd) {
      const daySlots = generateTimeSlotsForDay(dayStart, dayEnd, currentDate);

      for (const slot of daySlots) {
        slots.push({
          scheduleId,
          startTime: slot.startTime,
          endTime: slot.endTime,
        });
      }
    }
  }

  // Insert slots with skipDuplicates to avoid conflicts
  await prisma.availabilitySlot.createMany({
    data: slots,
    skipDuplicates: true,
  });
}
