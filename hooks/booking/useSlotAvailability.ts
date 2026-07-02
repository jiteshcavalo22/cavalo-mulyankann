"use client";

import { useEffect, useState } from "react";
import { fetchSlotAvailability } from "@/lib/booking/services/booking-client";
import type { DayAvailability } from "@/lib/booking/types";

export function useSlotAvailability() {
  const [days, setDays] = useState<DayAvailability[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async (): Promise<void> => {
      setIsLoading(true);
      setError("");
      try {
        const availability = await fetchSlotAvailability();
        setDays(availability);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load slots");
      } finally {
        setIsLoading(false);
      }
    };

    void load();
  }, []);

  const firstAvailableDate = days.find((day) => day.isAvailable)?.date ?? "";

  return { days, isLoading, error, firstAvailableDate };
}
