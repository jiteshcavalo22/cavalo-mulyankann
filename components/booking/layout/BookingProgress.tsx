"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { FLOW_STEPS } from "@/lib/booking/constants";
import type { BookingFlowStep } from "@/lib/booking/types";
import { getStepIndex } from "@/lib/booking/utils/flow";

interface BookingProgressProps {
  currentStep: BookingFlowStep;
}

export default function BookingProgress({ currentStep }: BookingProgressProps) {
  const activeIndex = getStepIndex(currentStep);
  const progress = ((activeIndex + 1) / FLOW_STEPS.length) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
        {FLOW_STEPS.map((step, index) => (
          <div key={step.key} className="flex flex-col items-center gap-1">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[11px] transition ${
                index < activeIndex
                  ? "bg-emerald-500 text-white"
                  : index === activeIndex
                    ? "bg-cavalo-yellow text-navy"
                    : "bg-gray-200 text-gray-400"
              }`}
            >
              {index < activeIndex ? <CheckCircle2 className="h-3.5 w-3.5" /> : index + 1}
            </div>
            <span className={index <= activeIndex ? "text-navy" : "text-gray-400"}>{step.label}</span>
          </div>
        ))}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cavalo-yellow to-amber-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
