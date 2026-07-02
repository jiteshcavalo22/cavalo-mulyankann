"use client";

import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import type { BookingSession } from "@/lib/booking/types";

interface StepSuccessProps {
  session: BookingSession;
}

export default function StepSuccess({ session }: StepSuccessProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center py-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14 }}
        className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"
      >
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
      </motion.div>

      <h2 className="text-2xl font-bold text-navy">Inspection Confirmed!</h2>
      <p className="mt-2 max-w-sm text-sm text-gray-600">
        Payment received. Your appointment is confirmed. Details sent to WhatsApp.
      </p>

      <div className="mt-6 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Booking Reference</p>
        <p className="text-2xl font-black text-cavalo-yellow">{session.bookingId}</p>
        <div className="mt-4 space-y-2 text-sm text-gray-600">
          <p><span className="font-semibold text-navy">Name:</span> {session.fullName}</p>
          <p><span className="font-semibold text-navy">Brand:</span> {session.vehicleBrand}</p>
          <p><span className="font-semibold text-navy">GVW:</span> {session.gvwCategory}</p>
          <p><span className="font-semibold text-navy">Location:</span> {session.location}</p>
          <p><span className="font-semibold text-navy">Date:</span> {session.selectedDate}</p>
          <p><span className="font-semibold text-navy">Time:</span> {session.selectedSlot}</p>
          {session.couponCode ? (
            <p>
              <span className="font-semibold text-navy">Coupon:</span> {session.couponCode} ({session.discountPct}% off)
            </p>
          ) : null}
          <p>
            <span className="font-semibold text-navy">Paid:</span> ₹{session.amount}
            {session.originalAmount > session.amount ? (
              <span className="ml-1 text-xs text-gray-400 line-through">₹{session.originalAmount}</span>
            ) : null}
          </p>
          <p><span className="font-semibold text-navy">Slot:</span> Confirmed &amp; reserved</p>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs text-gray-500">
        <MessageCircle className="h-3.5 w-3.5 text-green-600" />
        Updates sent to +91 {session.mobile}
      </div>

      <div className="mt-6 flex w-full max-w-md gap-3">
        <button type="button" onClick={() => router.push("/dashboard")} className="btn-cavalo flex-1 rounded-xl py-3 text-sm">
          Go to Dashboard
        </button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
        >
          Home
        </button>
      </div>
    </motion.div>
  );
}
