"use client";

import { useState } from "react";

export function useGeolocation() {
  const [location, setLocation] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState("");

  const fetchLocation = (): void => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported.");
      return;
    }

    setIsLocating(true);
    setError("");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(`${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`);
        setIsLocating(false);
      },
      () => {
        setError("Could not fetch location. Please allow access.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return { location, isLocating, error, fetchLocation, setLocation };
}
