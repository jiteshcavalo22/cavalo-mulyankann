"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { DayAvailability, HourlySlot } from "@/lib/booking/types";
import { getDayStatusLabel, getSelectedDayStatusClass, getSlotStatusColor } from "@/lib/booking/utils/slot-styles";

interface SlotPickerProps {
  days: DayAvailability[];
  selectedDate: string;
  selectedHour: number | null;
  isLoading: boolean;
  error: string;
  onDateSelect: (date: string) => void;
  onSlotSelect: (slot: HourlySlot) => void;
}

export default function SlotPicker({
  days,
  selectedDate,
  selectedHour,
  isLoading,
  error,
  onDateSelect,
  onSlotSelect,
}: SlotPickerProps) {
  const selectedDay = days.find((day) => day.date === selectedDate);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="h-24 w-20 flex-shrink-0 animate-pulse rounded-xl bg-gray-100" />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {Array.from({ length: 9 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded-lg bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-navy">Select Date</h3>
          <div className="flex items-center gap-3 text-[10px] font-medium text-gray-500">
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Available</span>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" /> Limited</span>
            <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-gray-300" /> Full</span>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {days.map((day) => {
            const isSelected = selectedDate === day.date;
            return (
              <button
                key={day.date}
                type="button"
                disabled={!day.isAvailable}
                onClick={() => onDateSelect(day.date)}
                className={`min-w-[88px] flex-shrink-0 rounded-xl border px-3 py-3 text-center transition ${getSelectedDayStatusClass(day.dayStatus, isSelected)}`}
              >
                <div className="text-[10px] font-bold tracking-wide">{day.weekdayShort}</div>
                <div className="text-lg font-black leading-tight">{day.dayNumber}</div>
                <div className="text-[10px] font-semibold">{day.monthShort}</div>
                <div className={`mt-1 text-[9px] font-medium ${isSelected ? "text-navy/70" : "text-gray-400"}`}>
                  {getDayStatusLabel(day.dayStatus)}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedDay ? (
          <motion.div
            key={selectedDay.date}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h3 className="mb-3 text-sm font-semibold text-navy">
              {selectedDay.dayLabel} — Available Slots
            </h3>

            {selectedDay.slots.every((slot) => slot.status === "full") ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                All slots are full for this day. Please choose another date.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {selectedDay.slots.map((slot) => {
                  const isSelected = selectedHour === slot.hour;
                  const isDisabled = slot.status === "full";

                  return (
                    <button
                      key={slot.hour}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => onSlotSelect(slot)}
                      className={`rounded-lg border px-2 py-2.5 text-center text-xs font-semibold transition ${
                        isSelected
                          ? "border-navy bg-navy text-white shadow-md"
                          : getSlotStatusColor(slot.status)
                      }`}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
