"use client";

import { AnimatePresence, motion } from "framer-motion";
import BookingHeader from "@/components/booking/layout/BookingHeader";
import StepBookingConfirmation from "@/components/booking/steps/StepBookingConfirmation";
import StepInspectionBooking from "@/components/booking/steps/StepInspectionBooking";
import StepPayment from "@/components/booking/steps/StepPayment";
import StepSuccess from "@/components/booking/steps/StepSuccess";
import StepVehicleDetails from "@/components/booking/steps/StepVehicleDetails";
import StepVehicleVerification from "@/components/booking/steps/StepVehicleVerification";
import VehicleFoundStep from "@/components/booking/steps/VehicleFoundStep";
import { useBookingFlow } from "@/hooks/booking/useBookingFlow";
import { shouldShowHeader } from "@/lib/booking/utils/flow";

export default function BookingFlow() {
  const {
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
  } = useBookingFlow();

  if (isBootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="text-sm text-gray-500">Loading booking...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {shouldShowHeader(step) ? <BookingHeader step={step} onBack={handleBack} /> : null}

      <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <AnimatePresence mode="wait">
          {step === "verify" ? (
            <StepVehicleVerification key="verify" onVerified={handleVerified} />
          ) : null}

          {step === "vehicle-found" && session.vehicle ? (
            <VehicleFoundStep
              key="found"
              vehicle={session.vehicle}
              fullName={session.fullName}
              vehicleBrand={session.vehicleBrand}
              gvwCategory={session.gvwCategory}
              vehicleLocation={session.location}
              onContinue={handleScheduleContinue}
            />
          ) : null}

          {step === "vehicle-details" ? (
            <StepVehicleDetails
              key="details"
              initialFullName={session.fullName}
              onComplete={handleDetailsComplete}
            />
          ) : null}

          {step === "schedule" && session.vehicle ? (
            <StepInspectionBooking
              key="schedule"
              vehicle={session.vehicle}
              fullName={session.fullName}
              mobile={session.mobile}
              vehicleBrand={session.vehicleBrand}
              gvwCategory={session.gvwCategory}
              vehicleLocation={session.location}
              onConfirm={handleInspectionConfirmed}
            />
          ) : null}

          {step === "confirmed" ? (
            <StepBookingConfirmation
              key="confirmed"
              session={session}
              onContinueToPayment={goToPayment}
            />
          ) : null}

          {step === "payment" ? (
            <StepPayment
              key="payment"
              session={session}
              gvwCategory={session.gvwCategory || session.vehicle?.gvwCategory || "C2"}
              onPaid={handlePaymentComplete}
            />
          ) : null}

          {step === "success" ? <StepSuccess key="success" session={session} /> : null}
        </AnimatePresence>
      </div>

      {step === "verify" || step === "vehicle-details" ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pointer-events-none fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cavalo-yellow/5 to-transparent"
        />
      ) : null}
    </div>
  );
}
