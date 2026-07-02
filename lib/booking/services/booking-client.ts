import { BOOKING_API } from "@/lib/booking/constants";
import type {
  ApplyCouponResult,
  BookingMode,
  CouponListItem,
  DayAvailability,
  InspectionConfirmPayload,
  ReserveBookingResponse,
  VehicleDetails,
} from "@/lib/booking/types";

async function parseError(response: Response, fallback: string): Promise<never> {
  const payload = (await response.json().catch(() => null)) as { message?: string } | null;
  throw new Error(payload?.message ?? fallback);
}

export async function fetchSlotAvailability(): Promise<DayAvailability[]> {
  const response = await fetch(BOOKING_API.slots, { cache: "no-store" });
  if (!response.ok) {
    await parseError(response, "Unable to load availability");
  }
  const data = (await response.json()) as { days: DayAvailability[] };
  return data.days;
}

export async function verifyOtpApi(mobile: string, otp: string): Promise<void> {
  const response = await fetch(BOOKING_API.verifyOtp, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mobile, otp }),
  });
  if (!response.ok) {
    await parseError(response, "Invalid OTP. Use any 6-digit code in demo mode.");
  }
}

export async function verifyRcApi(registrationNumber: string): Promise<VehicleDetails> {
  const response = await fetch(BOOKING_API.verifyRc, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ registrationNumber }),
  });
  if (!response.ok) {
    await parseError(response, "RC verification failed");
  }
  const data = (await response.json()) as { vehicle: VehicleDetails };
  return data.vehicle;
}

export async function reserveSlotApi(
  payload: Omit<InspectionConfirmPayload, "bookingId" | "estimatedDuration" | "inspectorStatus" | "bookingMode" | "bookingStatus" | "crmLeadId"> & {
    registrationNumber: string;
    fullName: string;
    mobile: string;
    brand: string;
    model: string;
    gvwCategory: string;
    mode: BookingMode;
  },
): Promise<ReserveBookingResponse> {
  const response = await fetch(BOOKING_API.reserve, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: payload.mode,
      date: payload.date,
      hour: payload.hour,
      slot: payload.slot,
      registrationNumber: payload.registrationNumber,
      fullName: payload.fullName,
      mobile: payload.mobile,
      location: payload.location,
      brand: payload.brand,
      model: payload.model,
      gvwCategory: payload.gvwCategory,
    }),
  });
  if (!response.ok) {
    await parseError(response, "Unable to reserve slot");
  }
  return (await response.json()) as ReserveBookingResponse;
}

export async function fetchCouponsApi(amount: number): Promise<CouponListItem[]> {
  const response = await fetch(`${BOOKING_API.coupons}?amount=${amount}`, { cache: "no-store" });
  if (!response.ok) {
    await parseError(response, "Unable to load coupons");
  }
  const data = (await response.json()) as { coupons: CouponListItem[] };
  return data.coupons;
}

export async function applyCouponApi(
  code: string,
  bookingId: string,
  amount: number,
): Promise<ApplyCouponResult> {
  const response = await fetch(BOOKING_API.applyCoupon, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, bookingId, amount }),
  });

  const data = (await response.json()) as ApplyCouponResult;
  if (!response.ok) {
    return data;
  }
  return data;
}

export async function completePaymentApi(
  bookingId: string,
  paymentMethod: string,
  couponCode?: string,
): Promise<{
  bookingId: string;
  bookingStatus: string;
  amount: number;
  originalAmount: number;
  couponCode: string;
  discountPct: number;
  slotReserved: boolean;
}> {
  const response = await fetch(BOOKING_API.pay, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingId, paymentMethod, couponCode }),
  });
  if (!response.ok) {
    await parseError(response, "Payment failed");
  }
  return (await response.json()) as {
    bookingId: string;
    bookingStatus: string;
    amount: number;
    originalAmount: number;
    couponCode: string;
    discountPct: number;
    slotReserved: boolean;
  };
}
