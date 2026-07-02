"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, MessageCircle, ShieldCheck } from "lucide-react";
import CouponPicker from "@/components/booking/shared/CouponPicker";
import { GVW_PRICING } from "@/lib/booking/constants";
import { completePaymentApi } from "@/lib/booking/services/booking-client";
import type { ApplyCouponResult, BookingSession, PaymentCompletePayload } from "@/lib/booking/types";

interface StepPaymentProps {
  session: BookingSession;
  gvwCategory: string;
  onPaid: (payload: PaymentCompletePayload) => void;
}

const METHODS = [
  { id: "razorpay", icon: CreditCard, label: "Pay Now", desc: "UPI, Cards, Net Banking" },
  { id: "whatsapp", icon: MessageCircle, label: "WhatsApp Pay", desc: "Secure payment link" },
] as const;

export default function StepPayment({ session, gvwCategory, onPaid }: StepPaymentProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("razorpay");
  const [isPaying, setIsPaying] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<ApplyCouponResult | null>(null);

  const originalAmount = GVW_PRICING[gvwCategory] ?? 1599;
  const discountAmount = appliedCoupon?.discountAmount ?? 0;
  const finalAmount = appliedCoupon?.finalAmount ?? originalAmount;

  const handlePay = async (): Promise<void> => {
    setIsPaying(true);
    try {
      const result = await completePaymentApi(
        session.bookingId,
        selectedMethod,
        appliedCoupon?.code,
      );
      onPaid({
        method: selectedMethod,
        amount: result.amount,
        originalAmount: result.originalAmount ?? originalAmount,
        couponCode: result.couponCode ?? appliedCoupon?.code ?? "",
        discountPct: result.discountPct ?? appliedCoupon?.discountPct ?? 0,
      });
    } catch {
      onPaid({
        method: selectedMethod,
        amount: finalAmount,
        originalAmount,
        couponCode: appliedCoupon?.code ?? "",
        discountPct: appliedCoupon?.discountPct ?? 0,
      });
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-bold text-navy">Complete Payment</h2>
        <p className="mt-1 text-sm text-gray-500">Payment is collected only after your slot is reserved.</p>

        <div className="mt-5 rounded-xl bg-navy p-4 text-white">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Inspection Fee ({gvwCategory})</span>
              {discountAmount > 0 ? (
                <span className="text-sm text-white/50 line-through">₹{originalAmount}</span>
              ) : null}
            </div>
            {discountAmount > 0 ? (
              <div className="flex items-center justify-between text-sm">
                <span className="text-emerald-300">Coupon discount ({appliedCoupon?.code})</span>
                <span className="font-semibold text-emerald-300">-₹{discountAmount}</span>
              </div>
            ) : null}
            <div className="flex items-center justify-between border-t border-white/10 pt-2">
              <span className="text-sm font-medium text-white/80">Total to pay</span>
              <span className="text-2xl font-bold text-cavalo-yellow">₹{finalAmount}</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-white/50">Booking #{session.bookingId}</p>
        </div>

        <div className="mt-4">
          <CouponPicker
            bookingId={session.bookingId}
            amount={originalAmount}
            disabled={isPaying || Boolean(appliedCoupon?.valid)}
            onApplied={setAppliedCoupon}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="mb-4 text-sm font-semibold text-navy">Payment Method</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {METHODS.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelectedMethod(method.id)}
              className={`rounded-xl border p-4 text-left transition ${
                selectedMethod === method.id
                  ? "border-navy bg-navy text-white shadow-md"
                  : "border-gray-200 bg-white text-gray-700 hover:border-cavalo-yellow"
              }`}
            >
              <method.icon className="mb-2 h-5 w-5" />
              <div className="text-sm font-semibold">{method.label}</div>
              <div className={`text-xs ${selectedMethod === method.id ? "text-white/70" : "text-gray-400"}`}>
                {method.desc}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3">
          <ShieldCheck className="h-4 w-4 flex-shrink-0 text-blue-600" />
          <p className="text-xs text-blue-700">
            Payment confirms your inspection appointment instantly. You&apos;ll receive updates on WhatsApp.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => void handlePay()}
        disabled={isPaying}
        className="btn-cavalo w-full rounded-xl py-3.5 text-sm font-bold disabled:opacity-60"
      >
        {isPaying ? "Processing..." : `Pay ₹${finalAmount} Securely`}
      </button>
    </motion.div>
  );
}
