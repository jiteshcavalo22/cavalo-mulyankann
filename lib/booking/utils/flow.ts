import type { BookingFlowStep } from "@/lib/booking/types";
import { STEP_ORDER } from "@/lib/booking/constants";

export function getStepIndex(step: BookingFlowStep): number {
  if (step === "vehicle-found" || step === "vehicle-details") {
    return 0;
  }
  const index = STEP_ORDER.indexOf(step);
  return index === -1 ? 0 : index;
}

export function getPreviousStep(step: BookingFlowStep, collectedDetailsSeparately = false): BookingFlowStep | "home" {
  switch (step) {
    case "verify":
    case "success":
      return "home";
    case "vehicle-details":
      return "vehicle-found";
    case "schedule":
      return collectedDetailsSeparately ? "vehicle-details" : "verify";
    case "confirmed":
      return "schedule";
    case "payment":
      return "confirmed";
    default:
      return "home";
  }
}

export function shouldShowProgress(step: BookingFlowStep): boolean {
  return step !== "vehicle-found" && step !== "success";
}

export function shouldShowHeader(step: BookingFlowStep): boolean {
  return step !== "success";
}
