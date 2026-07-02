"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle2, CreditCard, Shield } from "lucide-react";

const STEPS = [
  { icon: Shield, label: "Verify" },
  { icon: Calendar, label: "Schedule" },
  { icon: CheckCircle2, label: "Confirm" },
  { icon: CreditCard, label: "Pay" },
] as const;

interface HeroBookingProgressProps {
  activeIndex?: number;
}

export default function HeroBookingProgress({ activeIndex = 0 }: HeroBookingProgressProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-1">
      {STEPS.map((step, index) => (
        <div key={step.label} className="flex flex-1 flex-col items-center gap-1">
          <motion.div
            initial={{ scale: 0.9, opacity: 0.6 }}
            animate={{
              scale: index === activeIndex ? 1.05 : 1,
              opacity: index <= activeIndex ? 1 : 0.45,
            }}
            transition={{ duration: 0.3 }}
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              index < activeIndex
                ? "bg-emerald-500 text-white"
                : index === activeIndex
                  ? "bg-cavalo-yellow text-navy shadow-md"
                  : "bg-gray-100 text-gray-400"
            }`}
          >
            <step.icon className="h-3.5 w-3.5" />
          </motion.div>
          <span className={`text-[10px] font-semibold ${index <= activeIndex ? "text-navy" : "text-gray-400"}`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  );
}
