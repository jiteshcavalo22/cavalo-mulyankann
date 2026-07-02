import type { BookingFlowStep, BookingSession } from "@/lib/booking/types";

export const BOOKING_API = {
  slots: "/api/booking/slots",
  verifyOtp: "/api/booking/verify-otp",
  verifyRc: "/api/booking/verify-rc",
  reserve: "/api/booking/reserve",
  pay: "/api/booking/pay",
  coupons: "/api/booking/coupons",
  applyCoupon: "/api/booking/apply-coupon",
} as const;

export const FLOW_STEPS: { key: BookingFlowStep; label: string }[] = [
  { key: "verify", label: "Verify" },
  { key: "schedule", label: "Schedule" },
  { key: "confirmed", label: "Confirm" },
  { key: "payment", label: "Pay" },
  { key: "success", label: "Done" },
];

export const STEP_ORDER: BookingFlowStep[] = [
  "verify",
  "schedule",
  "confirmed",
  "payment",
  "success",
];

export const GVW_PRICING: Record<string, number> = {
  C1: 1299,
  C2: 1599,
  C3: 1899,
  C4: 2599,
};

export const GVW_OPTIONS = [
  { cat: "C1" as const, range: "Up to 7 ton", price: 1299 },
  { cat: "C2" as const, range: "7 to 15 ton", price: 1599 },
  { cat: "C3" as const, range: "15 to 20 ton", price: 1899 },
  { cat: "C4" as const, range: "20+ ton", price: 2599 },
];

export const VEHICLE_BRANDS = ["Tata", "Ashok Leyland", "Mahindra", "Other"] as const;

export const INSPECTION_HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17] as const;
export const BOOKING_WINDOW_DAYS = 7;
export const T_PLUS_OFFSET = 1;

export const INITIAL_SESSION: BookingSession = {
  fullName: "",
  mobile: "",
  registrationNumber: "",
  vehicleBrand: "",
  gvwCategory: "",
  vehicle: null,
  selectedDate: "",
  selectedSlot: "",
  selectedHour: 0,
  location: "",
  bookingId: "",
  estimatedDuration: "",
  inspectorStatus: "",
  paymentMethod: "",
  amount: 0,
  originalAmount: 0,
  couponCode: "",
  discountPct: 0,
  bookingMode: "pay_now",
  bookingStatus: "pending_payment",
  crmLeadId: "",
  collectedDetailsSeparately: false,
};
