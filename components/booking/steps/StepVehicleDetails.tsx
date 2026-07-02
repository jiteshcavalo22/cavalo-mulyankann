"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, MapPin } from "lucide-react";
import FormPartIndicator from "@/components/booking/shared/FormPartIndicator";
import GvwCategoryPicker from "@/components/booking/shared/GvwCategoryPicker";
import VehicleBrandPicker from "@/components/booking/shared/VehicleBrandPicker";
import { Input } from "@/components/ui/input";
import { useGeolocation } from "@/hooks/booking/useGeolocation";

export interface VehicleDetailsPayload {
  fullName: string;
  vehicleBrand: string;
  gvwCategory: string;
  vehicleLocation: string;
}

interface StepVehicleDetailsProps {
  initialFullName?: string;
  onComplete: (payload: VehicleDetailsPayload) => void;
}

type DetailsPart = "name" | "pricing" | "location";

export default function StepVehicleDetails({ initialFullName = "", onComplete }: StepVehicleDetailsProps) {
  const { location: geoLocation, isLocating, error: geoError, fetchLocation } = useGeolocation();

  const [part, setPart] = useState<DetailsPart>("name");
  const [fullName, setFullName] = useState(initialFullName);
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [gvwCategory, setGvwCategory] = useState("");
  const [vehicleLocation, setVehicleLocation] = useState("");

  useEffect(() => {
    if (geoLocation) {
      setVehicleLocation(geoLocation);
    }
  }, [geoLocation]);

  const partIndex = part === "name" ? 1 : part === "pricing" ? 2 : 3;

  const handleComplete = (): void => {
    onComplete({
      fullName: fullName.trim(),
      vehicleBrand,
      gvwCategory,
      vehicleLocation: vehicleLocation.trim(),
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-bold text-navy">Your Details</h2>
        <p className="mt-1 text-sm text-gray-500">A few more details to schedule your inspection.</p>

        <div className="mt-4">
          <FormPartIndicator current={partIndex} total={3} />
        </div>

        <AnimatePresence mode="wait">
          {part === "name" ? (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              className="space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">Full Name</label>
                <Input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Enter your full name"
                  className="rounded-xl"
                  autoFocus
                />
              </div>
              <button
                type="button"
                onClick={() => setPart("pricing")}
                disabled={fullName.trim().length < 2}
                className="btn-cavalo inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          ) : null}

          {part === "pricing" ? (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              className="space-y-4"
            >
              <VehicleBrandPicker value={vehicleBrand} onChange={setVehicleBrand} />
              <GvwCategoryPicker value={gvwCategory} onChange={setGvwCategory} />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPart("name")}
                  className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setPart("location")}
                  disabled={!vehicleBrand || !gvwCategory}
                  className="btn-cavalo inline-flex flex-[2] items-center justify-center gap-2 rounded-xl py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ) : null}

          {part === "location" ? (
            <motion.div
              key="location"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              className="space-y-4"
            >
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">Vehicle Location</label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    value={vehicleLocation}
                    onChange={(event) => setVehicleLocation(event.target.value)}
                    placeholder="City, area or full address for inspection"
                    className="rounded-xl"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={fetchLocation}
                    disabled={isLocating}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-navy/20 bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-light disabled:opacity-60"
                  >
                    {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                    Get Location
                  </button>
                </div>
                {geoError ? <p className="mt-1 text-xs text-red-500">{geoError}</p> : null}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPart("pricing")}
                  className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={handleComplete}
                  disabled={vehicleLocation.trim().length < 3}
                  className="btn-cavalo inline-flex flex-[2] items-center justify-center gap-2 rounded-xl py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue to Schedule <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
