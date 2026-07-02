"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CreditCard, Loader2, MapPin } from "lucide-react";
import SlotPicker from "@/components/booking/shared/SlotPicker";
import { useSlotAvailability } from "@/hooks/booking/useSlotAvailability";
import { GVW_OPTIONS } from "@/lib/booking/constants";
import { reserveSlotApi } from "@/lib/booking/services/booking-client";
import type { HourlySlot, InspectionConfirmPayload, VehicleDetails } from "@/lib/booking/types";

interface StepInspectionBookingProps {
  vehicle: VehicleDetails;
  fullName: string;
  mobile: string;
  vehicleBrand: string;
  gvwCategory: string;
  vehicleLocation: string;
  onConfirm: (payload: InspectionConfirmPayload) => void;
}

export default function StepInspectionBooking({
  vehicle,
  fullName,
  mobile,
  vehicleBrand,
  gvwCategory,
  vehicleLocation,
  onConfirm,
}: StepInspectionBookingProps) {
  const { days, isLoading, error: slotLoadError, firstAvailableDate } = useSlotAvailability();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHour, setSelectedHour] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [reserveError, setReserveError] = useState("");
  const [isReserving, setIsReserving] = useState(false);

  useEffect(() => {
    if (firstAvailableDate && !selectedDate) {
      setSelectedDate(firstAvailableDate);
    }
  }, [firstAvailableDate, selectedDate]);

  const handleSlotSelect = (slot: HourlySlot): void => {
    if (slot.status === "full") {
      return;
    }
    setSelectedHour(slot.hour);
    setSelectedSlot(slot.time);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!selectedDate || selectedHour === null || !vehicleLocation) {
      return;
    }

    setIsReserving(true);
    setReserveError("");

    try {
      const result = await reserveSlotApi({
        date: selectedDate,
        hour: selectedHour,
        slot: selectedSlot,
        registrationNumber: vehicle.registrationNumber,
        fullName,
        mobile,
        location: vehicleLocation,
        brand: vehicleBrand,
        model: vehicle.model,
        gvwCategory,
      });

      onConfirm({
        date: selectedDate,
        slot: selectedSlot,
        hour: selectedHour,
        location: vehicleLocation,
        bookingId: result.bookingId,
        estimatedDuration: result.estimatedDuration,
        inspectorStatus: result.inspectorStatus,
        bookingStatus: result.bookingStatus,
      });
    } catch (error) {
      setReserveError(error instanceof Error ? error.message : "Booking failed");
    } finally {
      setIsReserving(false);
    }
  };

  const displayError = reserveError || slotLoadError;
  const canSubmit = Boolean(selectedDate && selectedHour !== null && vehicleLocation);
  const gvwOption = GVW_OPTIONS.find((option) => option.cat === gvwCategory);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-bold text-navy">Schedule Your Inspection</h2>
        <p className="mt-1 text-sm text-gray-500">
          Pick a convenient slot. Earliest booking is <span className="font-semibold text-navy">tomorrow (T+1)</span>.
        </p>

        <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
          <div className="grid gap-2 text-sm sm:grid-cols-2">
            <p><span className="text-gray-500">Name:</span> <span className="font-semibold text-navy">{fullName}</span></p>
            <p><span className="text-gray-500">Brand:</span> <span className="font-semibold text-navy">{vehicleBrand}</span></p>
            <p>
              <span className="text-gray-500">GVW:</span>{" "}
              <span className="font-semibold text-navy">
                {gvwCategory} {gvwOption ? `— ₹${gvwOption.price}` : ""}
              </span>
            </p>
            <p className="flex items-start gap-1 sm:col-span-2">
              <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-cavalo-yellow" />
              <span><span className="text-gray-500">Location:</span> <span className="font-semibold text-navy">{vehicleLocation}</span></span>
            </p>
          </div>
        </div>

        <div className="mt-5">
          <SlotPicker
            days={days}
            selectedDate={selectedDate}
            selectedHour={selectedHour}
            isLoading={isLoading}
            error={displayError}
            onDateSelect={(date) => {
              setSelectedDate(date);
              setSelectedHour(null);
              setSelectedSlot("");
              setReserveError("");
            }}
            onSlotSelect={handleSlotSelect}
          />
        </div>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={!canSubmit || isReserving}
          className="btn-cavalo inline-flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isReserving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
          Reserve Slot &amp; Continue {gvwOption ? `(₹${gvwOption.price})` : ""}
          <ArrowRight className="h-4 w-4" />
        </button>

        <p className="text-center text-xs text-gray-500">
          Your slot is reserved after confirmation. Complete payment on the next step to confirm your inspection.
        </p>
      </div>
    </motion.div>
  );
}
