"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Fuel, MapPin, Palette, Truck, User } from "lucide-react";
import { GVW_OPTIONS } from "@/lib/booking/constants";
import type { VehicleDetails } from "@/lib/booking/types";

interface VehicleFoundStepProps {
  vehicle: VehicleDetails;
  fullName: string;
  vehicleBrand: string;
  gvwCategory: string;
  vehicleLocation: string;
  onContinue: () => void;
}

export default function VehicleFoundStep({
  vehicle,
  fullName,
  vehicleBrand,
  gvwCategory,
  vehicleLocation,
  onContinue,
}: VehicleFoundStepProps) {
  useEffect(() => {
    const timer = setTimeout(onContinue, 2800);
    return () => clearTimeout(timer);
  }, [onContinue]);

  const gvwLabel = gvwCategory ? GVW_OPTIONS.find((option) => option.cat === gvwCategory) : null;

  const details = [
    ...(fullName ? [{ icon: User, label: "Name", value: fullName }] : []),
    ...(vehicleBrand ? [{ icon: Truck, label: "Brand", value: vehicleBrand }] : []),
    { icon: Truck, label: "RC Model", value: vehicle.model },
    { icon: Fuel, label: "Fuel Type", value: vehicle.fuelType },
    { icon: Palette, label: "Year", value: vehicle.year },
    ...(gvwCategory
      ? [{ icon: Truck, label: "GVW Category", value: gvwLabel ? `${gvwCategory} (${gvwLabel.range})` : gvwCategory }]
      : []),
    ...(vehicleLocation ? [{ icon: MapPin, label: "Location", value: vehicleLocation }] : []),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center py-6 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.1 }}
        className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100"
      >
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-navy"
      >
        Vehicle Found
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-1 text-sm text-gray-500"
      >
        {vehicle.registrationNumber}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 w-full rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {details.map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 text-left">
              <item.icon className="h-4 w-4 flex-shrink-0 text-cavalo-yellow" />
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">{item.label}</p>
                <p className="text-sm font-semibold text-navy">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-5 text-xs text-gray-400"
      >
        Taking you to {fullName ? "schedule inspection" : "complete your details"}...
      </motion.p>
    </motion.div>
  );
}
