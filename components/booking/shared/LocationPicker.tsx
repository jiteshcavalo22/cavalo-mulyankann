"use client";

import { MdLocationOn } from "react-icons/md";
import { Loader2, MapPin } from "lucide-react";

interface LocationPickerProps {
  location: string;
  isLocating: boolean;
  error: string;
  onFetch: () => void;
}

export default function LocationPicker({ location, isLocating, error, onFetch }: LocationPickerProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-3 flex items-center gap-2">
        <MapPin className="h-4 w-4 text-cavalo-yellow" />
        <h3 className="text-sm font-semibold text-navy">Inspection Location</h3>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={location}
          readOnly
          placeholder="Use current location for inspection"
          className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm"
        />
        <button
          type="button"
          onClick={onFetch}
          disabled={isLocating}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-navy/20 bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-light disabled:opacity-60"
        >
          {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MdLocationOn className="h-4 w-4" />}
          Get Location
        </button>
      </div>
      {error ? <p className="mt-2 text-xs text-red-500">{error}</p> : null}
    </div>
  );
}
