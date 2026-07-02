import { applyCoupon } from "@/lib/booking/services/coupon-service";
import { GVW_PRICING } from "@/lib/booking/constants";
import { saveBookingRecord, updateBookingRecord, getBookingRecord } from "@/lib/booking/services/booking-store";
import { syncBookingToCrm } from "@/lib/booking/services/crm-sync";
import { hasCalendarWriteConfig } from "@/lib/booking/services/google-calendar";
import type { BookingMode, BookingRecord, ReserveBookingResponse } from "@/lib/booking/types";

interface ReserveBookingInput {
  mode: BookingMode;
  date: string;
  hour: number;
  slot: string;
  registrationNumber: string;
  fullName: string;
  mobile: string;
  location: string;
  brand: string;
  model: string;
  gvwCategory: string;
}

function createIds(): { bookingId: string; crmLeadId: string } {
  const bookingId = `CV-${Math.floor(10000 + Math.random() * 90000)}`;
  const crmLeadId = `CRM-${Math.floor(100000 + Math.random() * 900000)}`;
  return { bookingId, crmLeadId };
}

async function reserveCalendarSlot(input: ReserveBookingInput): Promise<void> {
  if (!hasCalendarWriteConfig()) {
    return;
  }
  // Google Calendar slot block can be created here for pay_now bookings.
  void input;
}

export async function reserveBooking(input: ReserveBookingInput): Promise<ReserveBookingResponse> {
  const { bookingId, crmLeadId } = createIds();
  const now = new Date().toISOString();
  const isPayNow = input.mode === "pay_now";

  if (isPayNow) {
    await reserveCalendarSlot(input);
  }

  const record: BookingRecord = {
    bookingId,
    crmLeadId,
    fullName: input.fullName,
    mobile: input.mobile,
    registrationNumber: input.registrationNumber,
    brand: input.brand,
    model: input.model,
    gvwCategory: input.gvwCategory,
    date: input.date,
    hour: input.hour,
    slot: input.slot,
    location: input.location,
    bookingMode: input.mode,
    bookingStatus: isPayNow ? "pending_payment" : "crm_pending",
    slotReserved: isPayNow,
    amount: GVW_PRICING[input.gvwCategory] ?? 1599,
    originalAmount: GVW_PRICING[input.gvwCategory] ?? 1599,
    couponCode: "",
    discountPct: 0,
    paymentMethod: "",
    createdAt: now,
    updatedAt: now,
  };

  saveBookingRecord(record);
  await syncBookingToCrm(record);

  return {
    bookingId,
    crmLeadId,
    estimatedDuration: "1.5 - 2 hours",
    inspectorStatus: isPayNow
      ? "Inspector will be assigned after payment"
      : "CRM team will contact you within 2 hours",
    reserved: isPayNow,
    slotReserved: isPayNow,
    bookingMode: input.mode,
    bookingStatus: record.bookingStatus,
  };
}

export async function completeBookingPayment(
  bookingId: string,
  paymentMethod: string,
  couponCode?: string,
): Promise<BookingRecord | null> {
  const existing = getBookingRecord(bookingId);
  if (!existing) {
    return null;
  }

  const baseAmount = existing.originalAmount || existing.amount;
  let finalAmount = baseAmount;
  let appliedCoupon = "";
  let discountPct = 0;

  if (couponCode) {
    const couponResult = applyCoupon(couponCode, baseAmount);
    if (couponResult.valid && couponResult.finalAmount !== undefined) {
      finalAmount = couponResult.finalAmount;
      appliedCoupon = couponResult.code ?? "";
      discountPct = couponResult.discountPct ?? 0;
    }
  }

  const paid = updateBookingRecord(bookingId, {
    bookingStatus: "paid",
    paymentMethod,
    slotReserved: true,
    amount: finalAmount,
    originalAmount: baseAmount,
    couponCode: appliedCoupon,
    discountPct,
  });

  if (!paid) {
    return null;
  }

  await reserveCalendarSlot({
    mode: "pay_now",
    date: paid.date,
    hour: paid.hour,
    slot: paid.slot,
    registrationNumber: paid.registrationNumber,
    fullName: paid.fullName,
    mobile: paid.mobile,
    location: paid.location,
    brand: paid.brand,
    model: paid.model,
    gvwCategory: paid.gvwCategory,
  });

  const confirmed = updateBookingRecord(bookingId, {
    bookingStatus: "confirmed",
    slotReserved: true,
  });

  if (confirmed) {
    await syncBookingToCrm(confirmed);
  }

  return confirmed;
}
