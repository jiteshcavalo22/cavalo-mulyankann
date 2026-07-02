import type { DayAvailability, DayStatus, SlotStatus } from "@/lib/booking/types";

export function getDayStatusLabel(status: DayStatus): string {
  switch (status) {
    case "full":
      return "Full";
    case "few":
      return "Few Slots Left";
    default:
      return "Available";
  }
}

export function getSlotStatusColor(status: SlotStatus): string {
  switch (status) {
    case "full":
      return "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed";
    case "limited":
      return "border-amber-400 bg-amber-50 text-amber-800 hover:bg-amber-100";
    default:
      return "border-emerald-500 bg-emerald-50 text-emerald-800 hover:bg-emerald-100";
  }
}

export function getSelectedDayStatusClass(
  status: DayAvailability["dayStatus"],
  isSelected: boolean,
): string {
  if (isSelected) {
    return "border-cavalo-yellow bg-cavalo-yellow text-navy shadow-md";
  }
  if (status === "full") {
    return "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed";
  }
  return "border-gray-200 bg-white text-navy hover:border-cavalo-yellow/60";
}
