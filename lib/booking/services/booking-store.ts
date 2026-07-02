import type { BookingRecord } from "@/lib/booking/types";

const bookings = new Map<string, BookingRecord>();

export function saveBookingRecord(record: BookingRecord): void {
  bookings.set(record.bookingId, record);
}

export function getBookingRecord(bookingId: string): BookingRecord | null {
  return bookings.get(bookingId) ?? null;
}

export function updateBookingRecord(
  bookingId: string,
  updates: Partial<BookingRecord>,
): BookingRecord | null {
  const existing = bookings.get(bookingId);
  if (!existing) {
    return null;
  }

  const updated: BookingRecord = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  bookings.set(bookingId, updated);
  return updated;
}

export function listBookingRecords(): BookingRecord[] {
  return Array.from(bookings.values());
}
