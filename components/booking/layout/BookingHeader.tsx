"use client";

import { ArrowLeft, Truck } from "lucide-react";
import BookingProgress from "@/components/booking/layout/BookingProgress";
import type { BookingFlowStep } from "@/lib/booking/types";
import { shouldShowProgress } from "@/lib/booking/utils/flow";

interface BookingHeaderProps {
  step: BookingFlowStep;
  onBack: () => void;
}

export default function BookingHeader({ step, onBack }: BookingHeaderProps) {
  return (
    <div className="sticky top-0 z-40 border-b-4 border-cavalo-yellow bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-4 px-4 py-4 sm:px-6">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-navy"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cavalo-yellow">
            <Truck className="h-5 w-5 text-navy" />
          </div>
          <div>
            <h1 className="text-base font-bold text-navy sm:text-lg">Book Inspection</h1>
            <p className="text-[11px] text-gray-500">One step closer to your truck valuation</p>
          </div>
        </div>
      </div>
      {shouldShowProgress(step) ? (
        <div className="mx-auto w-full max-w-3xl px-4 pb-4 sm:px-6">
          <BookingProgress currentStep={step} />
        </div>
      ) : null}
    </div>
  );
}
