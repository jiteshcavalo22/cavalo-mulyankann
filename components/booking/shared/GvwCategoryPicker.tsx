"use client";

import { GVW_OPTIONS } from "@/lib/booking/constants";

interface GvwCategoryPickerProps {
  value: string;
  onChange: (category: string) => void;
  compact?: boolean;
}

export default function GvwCategoryPicker({ value, onChange, compact = false }: GvwCategoryPickerProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-gray-600">GVW Category</label>
      <div className={`grid gap-2 ${compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"}`}>
        {GVW_OPTIONS.map((option) => (
          <button
            key={option.cat}
            type="button"
            onClick={() => onChange(option.cat)}
            className={`rounded-xl border p-3 text-left transition ${
              value === option.cat
                ? "border-navy bg-navy text-white shadow-md"
                : "border-gray-200 bg-white text-gray-700 hover:border-cavalo-yellow"
            }`}
          >
            <div className="text-sm font-bold">{option.cat}</div>
            <div className={`text-[10px] ${value === option.cat ? "text-white/80" : "text-gray-500"}`}>
              {option.range}
            </div>
            <div className={`mt-1 text-xs font-semibold ${value === option.cat ? "text-cavalo-yellow" : "text-navy"}`}>
              ₹{option.price}
            </div>
          </button>
        ))}
      </div>
      {value ? (
        <p className="mt-2 text-[11px] text-gray-500">
          Inspection fee included at payment based on your selected GVW category.
        </p>
      ) : null}
    </div>
  );
}
