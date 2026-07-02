interface CalendarEvent {
  start: string;
  end: string;
}

export async function fetchCalendarEventsForDate(date: Date): Promise<CalendarEvent[] | null> {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY;

  if (!calendarId || !apiKey) {
    return null;
  }

  const timeMin = new Date(date);
  timeMin.setHours(0, 0, 0, 0);
  const timeMax = new Date(date);
  timeMax.setHours(23, 59, 59, 999);

  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
  );
  url.searchParams.set("key", apiKey);
  url.searchParams.set("singleEvents", "true");
  url.searchParams.set("orderBy", "startTime");
  url.searchParams.set("timeMin", timeMin.toISOString());
  url.searchParams.set("timeMax", timeMax.toISOString());

  const response = await fetch(url.toString(), { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Google Calendar availability request failed");
  }

  const payload = (await response.json()) as {
    items?: Array<{ start?: { dateTime?: string }; end?: { dateTime?: string } }>;
  };

  return (
    payload.items
      ?.map((item) => ({
        start: item.start?.dateTime ?? "",
        end: item.end?.dateTime ?? "",
      }))
      .filter((event) => Boolean(event.start) && Boolean(event.end)) ?? []
  );
}

export function hasCalendarWriteConfig(): boolean {
  return Boolean(process.env.GOOGLE_CALENDAR_ID && process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
}
