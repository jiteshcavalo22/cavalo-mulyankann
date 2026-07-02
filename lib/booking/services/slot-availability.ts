import {
  BOOKING_WINDOW_DAYS,
  INSPECTION_HOURS,
  T_PLUS_OFFSET,
} from "@/lib/booking/constants";
import type { DayAvailability, DayStatus, HourlySlot, SlotStatus } from "@/lib/booking/types";
import { fetchCalendarEventsForDate } from "@/lib/booking/services/google-calendar";
import { formatHour, getDateWithOffset, toIsoDate } from "@/lib/booking/utils/formatting";

const WEEKDAY_SHORT = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const WEEKDAY_LONG = new Intl.DateTimeFormat("en-US", { weekday: "long" });
const MONTH_SHORT = new Intl.DateTimeFormat("en-US", { month: "short" });

interface CalendarEvent {
  start: string;
  end: string;
}

function intersects(eventStart: Date, eventEnd: Date, slotStart: Date, slotEnd: Date): boolean {
  return eventStart < slotEnd && eventEnd > slotStart;
}

function getDayLabel(offset: number, date: Date): string {
  if (offset === T_PLUS_OFFSET) {
    return "Tomorrow";
  }
  return WEEKDAY_LONG.format(date);
}

function getDayStatus(slots: HourlySlot[]): DayStatus {
  const availableCount = slots.filter((slot) => slot.status !== "full").length;
  if (availableCount === 0) {
    return "full";
  }
  if (availableCount <= 2) {
    return "few";
  }
  return "available";
}

function deterministicSlotStatus(date: Date, hour: number): SlotStatus {
  const seed = date.getDate() * 100 + hour;
  if (seed % 11 === 0) {
    return "full";
  }
  if (seed % 5 === 0) {
    return "limited";
  }
  return "available";
}

function mapEventsToHourlySlots(date: Date, events: CalendarEvent[]): HourlySlot[] {
  return INSPECTION_HOURS.map((hour) => {
    const slotStart = new Date(date);
    slotStart.setHours(hour, 0, 0, 0);
    const slotEnd = new Date(date);
    slotEnd.setHours(hour + 1, 0, 0, 0);

    const hasConflict = events.some((event) => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return intersects(eventStart, eventEnd, slotStart, slotEnd);
    });

    if (hasConflict) {
      return { time: formatHour(hour), hour, status: "full" as const };
    }

    return {
      time: formatHour(hour),
      hour,
      status: deterministicSlotStatus(date, hour),
    };
  });
}

function fallbackHourlySlots(date: Date): HourlySlot[] {
  return INSPECTION_HOURS.map((hour) => ({
    time: formatHour(hour),
    hour,
    status: deterministicSlotStatus(date, hour),
  }));
}

export async function getSevenDayAvailability(): Promise<DayAvailability[]> {
  const days: DayAvailability[] = [];

  for (let offset = T_PLUS_OFFSET; offset <= BOOKING_WINDOW_DAYS; offset += 1) {
    const date = getDateWithOffset(offset);
    const calendarEvents = await fetchCalendarEventsForDate(date);
    const slots = calendarEvents
      ? mapEventsToHourlySlots(date, calendarEvents)
      : fallbackHourlySlots(date);
    const dayStatus = getDayStatus(slots);

    days.push({
      date: toIsoDate(date),
      dayLabel: getDayLabel(offset, date),
      weekdayShort: WEEKDAY_SHORT.format(date).toUpperCase(),
      dayNumber: String(date.getDate()).padStart(2, "0"),
      monthShort: MONTH_SHORT.format(date).toUpperCase(),
      slots,
      dayStatus,
      isAvailable: dayStatus !== "full",
    });
  }

  return days;
}
