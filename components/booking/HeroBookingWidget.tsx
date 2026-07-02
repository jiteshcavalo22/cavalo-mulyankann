"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import HeroBookingProgress from "@/components/booking/shared/HeroBookingProgress";
import HeroVehicleVerification from "@/components/booking/HeroVehicleVerification";
import type { HeroVerificationResult } from "@/lib/booking/types";
import { saveBookingBootstrap } from "@/lib/booking/utils/session-bridge";

type HeroPhase = "entry" | "handoff";

export default function HeroBookingWidget() {
  const router = useRouter();
  const [phase, setPhase] = useState<HeroPhase>("entry");

  const handleVerified = (result: HeroVerificationResult): void => {
    setPhase("handoff");
    saveBookingBootstrap({
      mobile: result.mobile,
      registrationNumber: result.registrationNumber,
      vehicle: result.vehicle,
      startStep: "vehicle-found",
      collectedDetailsSeparately: true,
    });

    window.setTimeout(() => {
      router.push("/book");
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mx-auto w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl lg:p-7"
    >
      <AnimatePresence mode="wait">
        {phase === "handoff" ? (
          <motion.div
            key="handoff"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center py-10 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 16 }}
              className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100"
            >
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </motion.div>
            <h3 className="text-lg font-bold text-navy">Vehicle Verified!</h3>
            <p className="mt-2 text-sm text-gray-500">Taking you to complete your details...</p>
            <motion.div className="mt-4 h-1 w-32 overflow-hidden rounded-full bg-gray-200">
              <motion.div
                className="h-full bg-cavalo-yellow"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.1, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        ) : (
          <motion.div key="entry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="mb-1 flex items-center justify-between">
              <h2 className="text-xl font-bold text-navy">Book Inspection Slot</h2>
              <span className="rounded-full bg-cavalo-yellow-light px-2.5 py-1 text-[10px] font-bold text-navy">
                Step 1 of 4
              </span>
            </div>
            <p className="mb-4 text-sm text-gray-500">
              Verify your truck with OTP — then pick a slot and pay.
            </p>

            <HeroBookingProgress activeIndex={0} />

            <div className="mt-2">
              <HeroVehicleVerification onVerified={handleVerified} />
            </div>

            <button
              type="button"
              onClick={() => router.push("/book")}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 text-xs font-semibold text-cavalo-yellow transition hover:text-cavalo-yellow-dark"
            >
              Continue on full booking page <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
