"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Clock, MapPin, Truck, User } from "lucide-react";
import { GVW_OPTIONS } from "@/lib/booking/constants";
import type { BookingSession } from "@/lib/booking/types";

interface StepBookingConfirmationProps {
  session: BookingSession;
  onContinueToPayment: () => void;
}

export default function StepBookingConfirmation({
  session,
  onContinueToPayment,
}: StepBookingConfirmationProps) {
  const gvwOption = GVW_OPTIONS.find((option) => option.cat === session.gvwCategory);

  const rows = [
    { icon: User, label: "Full Name", value: session.fullName },
    { icon: Truck, label: "Vehicle Brand", value: session.vehicleBrand },
    { icon: Truck, label: "GVW Category", value: gvwOption ? `${session.gvwCategory} — ${gvwOption.range} (₹${gvwOption.price})` : session.gvwCategory },
    { icon: Calendar, label: "Preferred Date", value: session.selectedDate },
    { icon: Clock, label: "Preferred Slot", value: session.selectedSlot },
    { icon: MapPin, label: "Location", value: session.location },
    { icon: CheckCircle2, label: "Reference ID", value: session.bookingId },
    { icon: Clock, label: "Estimated Duration", value: session.estimatedDuration },
    { icon: User, label: "Status", value: session.inspectorStatus },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 text-center shadow-sm">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100"
        >
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </motion.div>

        <h2 className="text-2xl font-bold text-navy">Slot Reserved Successfully</h2>
        <p className="mt-2 text-sm text-gray-600">
          Your slot is reserved. Complete payment now to confirm your inspection appointment.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="mb-4 text-sm font-semibold text-navy">Booking Details</h3>
        <div className="space-y-3">
          {rows.map((row) => (
            <div key={row.label} className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
              <row.icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-cavalo-yellow" />
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">{row.label}</p>
                <p className="text-sm font-semibold text-navy">{row.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button type="button" onClick={onContinueToPayment} className="btn-cavalo w-full rounded-xl py-3.5 text-sm font-bold">
        Continue to Payment
      </button>
    </motion.div>
  );
}
