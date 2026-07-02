"use client";

import { VEHICLE_BRANDS } from "@/lib/booking/constants";

interface VehicleBrandPickerProps {
  value: string;
  onChange: (brand: string) => void;
  compact?: boolean;
}

export default function VehicleBrandPicker({ value, onChange, compact = false }: VehicleBrandPickerProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-gray-600">Vehicle Brand</label>
      <div className={`grid gap-2 ${compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}>
        {VEHICLE_BRANDS.map((brand) => (
          <button
            key={brand}
            type="button"
            onClick={() => onChange(brand)}
            className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
              value === brand
                ? "border-navy bg-navy text-white shadow-md"
                : "border-gray-200 bg-white text-gray-700 hover:border-cavalo-yellow"
            }`}
          >
            {brand}
          </button>
        ))}
      </div>
    </div>
  );
}
