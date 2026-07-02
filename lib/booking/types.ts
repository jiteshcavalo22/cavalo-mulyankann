export type BookingFlowStep =
  | "verify"
  | "vehicle-found"
  | "vehicle-details"
  | "schedule"
  | "confirmed"
  | "payment"
  | "success";

export type BookingStatus = "pending_payment" | "confirmed" | "paid";

export type SlotStatus = "available" | "limited" | "full";
export type DayStatus = "available" | "few" | "full";

export interface HourlySlot {
  time: string;
  hour: number;
  status: SlotStatus;
}

export interface DayAvailability {
  date: string;
  dayLabel: string;
  weekdayShort: string;
  dayNumber: string;
  monthShort: string;
  slots: HourlySlot[];
  dayStatus: DayStatus;
  isAvailable: boolean;
}

export interface VehicleDetails {
  registrationNumber: string;
  brand: string;
  model: string;
  fuelType: string;
  year: string;
  owner: string;
  gvwCategory: string;
  color: string;
}

export interface BookingSession {
  fullName: string;
  mobile: string;
  registrationNumber: string;
  vehicleBrand: string;
  gvwCategory: string;
  vehicle: VehicleDetails | null;
  selectedDate: string;
  selectedSlot: string;
  selectedHour: number;
  location: string;
  bookingId: string;
  estimatedDuration: string;
  inspectorStatus: string;
  paymentMethod: string;
  amount: number;
  originalAmount: number;
  couponCode: string;
  discountPct: number;
  bookingStatus: BookingStatus;
  collectedDetailsSeparately: boolean;
}

export interface HeroVerificationResult {
  vehicle: VehicleDetails;
  mobile: string;
  registrationNumber: string;
}

export interface VehicleVerificationResult {
  vehicle: VehicleDetails;
  mobile: string;
  fullName: string;
  vehicleBrand: string;
  gvwCategory: string;
  vehicleLocation: string;
}

export interface InspectionConfirmPayload {
  date: string;
  slot: string;
  hour: number;
  location: string;
  bookingId: string;
  estimatedDuration: string;
  inspectorStatus: string;
  bookingStatus: BookingStatus;
}

export interface ReserveBookingResponse {
  bookingId: string;
  estimatedDuration: string;
  inspectorStatus: string;
  reserved: boolean;
  bookingStatus: BookingStatus;
  slotReserved: boolean;
}

export interface BookingRecord {
  bookingId: string;
  crmLeadId: string;
  fullName: string;
  mobile: string;
  registrationNumber: string;
  brand: string;
  model: string;
  gvwCategory: string;
  date: string;
  hour: number;
  slot: string;
  location: string;
  bookingStatus: BookingStatus;
  slotReserved: boolean;
  amount: number;
  originalAmount: number;
  couponCode: string;
  discountPct: number;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface CouponListItem {
  code: string;
  description: string;
  discountPct: number;
  expiresAt: string;
  expired: boolean;
  eligible: boolean;
}

export interface ApplyCouponResult {
  valid: boolean;
  message: string;
  code?: string;
  discountPct?: number;
  discountAmount?: number;
  originalAmount?: number;
  finalAmount?: number;
  expired?: boolean;
}

export interface PaymentCompletePayload {
  method: string;
  amount: number;
  originalAmount: number;
  couponCode: string;
  discountPct: number;
}
