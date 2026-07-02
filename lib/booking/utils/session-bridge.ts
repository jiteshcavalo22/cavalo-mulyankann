import type { BookingFlowStep, VehicleDetails } from "@/lib/booking/types";

const BRIDGE_KEY = "cavalo_booking_bootstrap";

export interface BookingBootstrap {
  fullName?: string;
  mobile: string;
  registrationNumber: string;
  vehicleBrand?: string;
  gvwCategory?: string;
  vehicleLocation?: string;
  vehicle: VehicleDetails;
  startStep: BookingFlowStep;
  collectedDetailsSeparately?: boolean;
}

export function saveBookingBootstrap(data: BookingBootstrap): void {
  if (typeof window === "undefined") {
    return;
  }
  sessionStorage.setItem(BRIDGE_KEY, JSON.stringify(data));
}

export function consumeBookingBootstrap(): BookingBootstrap | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = sessionStorage.getItem(BRIDGE_KEY);
  if (!raw) {
    return null;
  }

  sessionStorage.removeItem(BRIDGE_KEY);
  try {
    return JSON.parse(raw) as BookingBootstrap;
  } catch {
    return null;
  }
}
