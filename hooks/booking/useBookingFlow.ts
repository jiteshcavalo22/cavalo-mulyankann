"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { INITIAL_SESSION } from "@/lib/booking/constants";
import type {
  BookingFlowStep,
  BookingSession,
  InspectionConfirmPayload,
  PaymentCompletePayload,
  VehicleVerificationResult,
} from "@/lib/booking/types";
import { getPreviousStep } from "@/lib/booking/utils/flow";
import { consumeBookingBootstrap } from "@/lib/booking/utils/session-bridge";
import type { VehicleDetailsPayload } from "@/components/booking/steps/StepVehicleDetails";

function needsVehicleDetails(session: BookingSession): boolean {
  return (
    session.collectedDetailsSeparately &&
    (!session.fullName || !session.vehicleBrand || !session.gvwCategory || !session.location)
  );
}

export function useBookingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<BookingFlowStep>("verify");
  const [session, setSession] = useState<BookingSession>(INITIAL_SESSION);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const bootstrap = consumeBookingBootstrap();
    if (bootstrap) {
      setSession((prev) => ({
        ...prev,
        fullName: bootstrap.fullName ?? "",
        mobile: bootstrap.mobile,
        registrationNumber: bootstrap.registrationNumber,
        vehicleBrand: bootstrap.vehicleBrand ?? "",
        gvwCategory: bootstrap.gvwCategory ?? "",
        location: bootstrap.vehicleLocation ?? "",
        vehicle: bootstrap.vehicle,
        collectedDetailsSeparately: bootstrap.collectedDetailsSeparately ?? false,
      }));
      setStep(bootstrap.startStep);
    }
    setIsBootstrapping(false);
  }, []);

  const handleVerified = useCallback((result: VehicleVerificationResult) => {
    setSession((prev) => ({
      ...prev,
      fullName: result.fullName,
      mobile: result.mobile,
      registrationNumber: result.vehicle.registrationNumber,
      vehicleBrand: result.vehicleBrand,
      gvwCategory: result.gvwCategory,
      location: result.vehicleLocation,
      vehicle: result.vehicle,
      collectedDetailsSeparately: false,
    }));
    setStep("vehicle-found");
  }, []);

  const handleScheduleContinue = useCallback(() => {
    setSession((prev) => {
      setStep(needsVehicleDetails(prev) ? "vehicle-details" : "schedule");
      return prev;
    });
  }, []);

  const handleDetailsComplete = useCallback((payload: VehicleDetailsPayload) => {
    setSession((prev) => ({
      ...prev,
      fullName: payload.fullName,
      vehicleBrand: payload.vehicleBrand,
      gvwCategory: payload.gvwCategory,
      location: payload.vehicleLocation,
    }));
    setStep("schedule");
  }, []);

  const handleInspectionConfirmed = useCallback((payload: InspectionConfirmPayload) => {
    setSession((prev) => ({
      ...prev,
      selectedDate: payload.date,
      selectedSlot: payload.slot,
      selectedHour: payload.hour,
      location: payload.location,
      bookingId: payload.bookingId,
      estimatedDuration: payload.estimatedDuration,
      inspectorStatus: payload.inspectorStatus,
      bookingStatus: payload.bookingStatus,
    }));
    setStep("confirmed");
  }, []);

  const handlePaymentComplete = useCallback((payload: PaymentCompletePayload) => {
    setSession((prev) => ({
      ...prev,
      paymentMethod: payload.method,
      amount: payload.amount,
      originalAmount: payload.originalAmount,
      couponCode: payload.couponCode,
      discountPct: payload.discountPct,
      bookingStatus: "confirmed",
    }));
    setStep("success");
  }, []);

  const goToPayment = useCallback(() => {
    setStep("payment");
  }, []);

  const handleBack = useCallback(() => {
    const previous = getPreviousStep(step, session.collectedDetailsSeparately);
    if (previous === "home") {
      router.push("/");
      return;
    }
    setStep(previous);
  }, [router, session.collectedDetailsSeparately, step]);

  return {
    step,
    session,
    isBootstrapping,
    handleVerified,
    handleScheduleContinue,
    handleDetailsComplete,
    handleInspectionConfirmed,
    handlePaymentComplete,
    goToPayment,
    handleBack,
  };
}
