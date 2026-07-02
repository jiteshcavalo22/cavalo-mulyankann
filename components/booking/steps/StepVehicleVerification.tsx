"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, MapPin, Truck } from "lucide-react";
import FormPartIndicator from "@/components/booking/shared/FormPartIndicator";
import GvwCategoryPicker from "@/components/booking/shared/GvwCategoryPicker";
import TrustBadges from "@/components/booking/shared/TrustBadges";
import VehicleBrandPicker from "@/components/booking/shared/VehicleBrandPicker";
import { Input } from "@/components/ui/input";
import { useGeolocation } from "@/hooks/booking/useGeolocation";
import { verifyOtpApi, verifyRcApi } from "@/lib/booking/services/booking-client";
import type { VehicleVerificationResult } from "@/lib/booking/types";
import { normalizeMobile, normalizeRegistration } from "@/lib/booking/utils/formatting";

interface StepVehicleVerificationProps {
  onVerified: (result: VehicleVerificationResult) => void;
}

type FormPart = "name" | "contact" | "otp" | "pricing" | "location" | "verifying";

const PART_LABELS: Record<Exclude<FormPart, "verifying">, string> = {
  name: "Your name",
  contact: "Verify contact",
  otp: "Confirm OTP",
  pricing: "Vehicle & pricing",
  location: "Inspection location",
};

const PART_ORDER: Exclude<FormPart, "verifying">[] = ["name", "contact", "otp", "pricing", "location"];

export default function StepVehicleVerification({ onVerified }: StepVehicleVerificationProps) {
  const { location: geoLocation, isLocating, error: geoError, fetchLocation } = useGeolocation();

  const [part, setPart] = useState<FormPart>("name");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [vehicleBrand, setVehicleBrand] = useState("");
  const [gvwCategory, setGvwCategory] = useState("");
  const [vehicleLocation, setVehicleLocation] = useState("");
  const [verifiedVehicle, setVerifiedVehicle] = useState<VehicleVerificationResult["vehicle"] | null>(null);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const partIndex = part === "verifying" ? 3 : PART_ORDER.indexOf(part as Exclude<FormPart, "verifying">) + 1;
  const isContactValid = mobile.length === 10 && registrationNumber.length >= 6;

  const handleSendOtp = (): void => {
    if (!isContactValid) {
      return;
    }
    setError("");
    setPart("otp");
  };

  const handleOtpChange = (index: number, value: string): void => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const nextOtp = [...otp];
    nextOtp[index] = digit;
    setOtp(nextOtp);
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyRc = async (): Promise<void> => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await verifyOtpApi(mobile, otpValue);
      setPart("verifying");
      const vehicle = await verifyRcApi(registrationNumber);
      setVerifiedVehicle(vehicle);
      setPart("pricing");
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : "Verification failed");
      setPart("otp");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = (): void => {
    if (!verifiedVehicle || vehicleLocation.trim().length < 3) {
      return;
    }

    onVerified({
      vehicle: verifiedVehicle,
      mobile,
      fullName: fullName.trim(),
      vehicleBrand,
      gvwCategory,
      vehicleLocation: vehicleLocation.trim(),
    });
  };

  useEffect(() => {
    if (geoLocation) {
      setVehicleLocation(geoLocation);
    }
  }, [geoLocation]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-cavalo-yellow-light/30 p-6 shadow-sm">
        <div className="mb-5 flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-cavalo-yellow">
            <Truck className="h-7 w-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-navy">Verify Your Vehicle</h2>
            <p className="mt-1 text-sm text-gray-500">
              Complete each step — we&apos;ll verify your RC and prepare your inspection.
            </p>
          </div>
        </div>

        {part !== "verifying" ? (
          <FormPartIndicator
            current={partIndex}
            total={PART_ORDER.length}
            label={PART_LABELS[part as Exclude<FormPart, "verifying">]}
          />
        ) : null}

        <AnimatePresence mode="wait">
          {part === "name" ? (
            <motion.div key="name" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
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
                onClick={() => setPart("contact")}
                disabled={fullName.trim().length < 2}
                className="btn-cavalo inline-flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          ) : null}

          {part === "contact" ? (
            <motion.div key="contact" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
              <p className="text-sm text-gray-500">We&apos;ll send an OTP to verify your mobile and fetch RC details.</p>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">Registration Number</label>
                <Input
                  value={registrationNumber}
                  onChange={(event) => setRegistrationNumber(normalizeRegistration(event.target.value))}
                  placeholder="MH12AB1234"
                  className="rounded-xl uppercase"
                  autoFocus
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-600">Mobile Number</label>
                <div className="flex gap-2">
                  <span className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-600">+91</span>
                  <Input
                    value={mobile}
                    onChange={(event) => setMobile(normalizeMobile(event.target.value))}
                    placeholder="9876543210"
                    inputMode="numeric"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setPart("name")} className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button type="button" onClick={handleSendOtp} disabled={!isContactValid} className="btn-cavalo inline-flex flex-[2] items-center justify-center gap-2 rounded-xl py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50">
                  Send OTP <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ) : null}

          {part === "otp" ? (
            <motion.div key="otp" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
              <p className="text-sm text-gray-600">
                Enter OTP sent to <span className="font-semibold text-navy">+91 {mobile}</span>
              </p>
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(element) => { otpRefs.current[index] = element; }}
                    value={digit}
                    onChange={(event) => handleOtpChange(index, event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Backspace" && !otp[index] && index > 0) {
                        otpRefs.current[index - 1]?.focus();
                      }
                    }}
                    inputMode="numeric"
                    maxLength={1}
                    className="h-12 w-11 rounded-xl text-center text-lg font-bold"
                  />
                ))}
              </div>
              {error ? <p className="text-center text-xs text-red-500">{error}</p> : null}
              <div className="flex gap-2">
                <button type="button" onClick={() => { setPart("contact"); setOtp(["", "", "", "", "", ""]); setError(""); }} className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button type="button" onClick={() => void handleVerifyRc()} disabled={otp.join("").length !== 6 || isLoading} className="btn-cavalo inline-flex flex-[2] items-center justify-center gap-2 rounded-xl py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Verify &amp; Fetch RC
                </button>
              </div>
            </motion.div>
          ) : null}

          {part === "verifying" ? (
            <motion.div key="verifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-8 text-center">
              <Loader2 className="h-10 w-10 animate-spin text-cavalo-yellow" />
              <p className="mt-4 text-sm font-semibold text-navy">Fetching vehicle details from RC records...</p>
            </motion.div>
          ) : null}

          {part === "pricing" ? (
            <motion.div key="pricing" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
              <VehicleBrandPicker value={vehicleBrand} onChange={setVehicleBrand} />
              <GvwCategoryPicker value={gvwCategory} onChange={setGvwCategory} />
              <div className="flex gap-2">
                <button type="button" onClick={() => setPart("otp")} className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button type="button" onClick={() => setPart("location")} disabled={!vehicleBrand || !gvwCategory} className="btn-cavalo inline-flex flex-[2] items-center justify-center gap-2 rounded-xl py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50">
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ) : null}

          {part === "location" ? (
            <motion.div key="location" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} className="space-y-4">
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
                  <button type="button" onClick={fetchLocation} disabled={isLocating} className="inline-flex items-center justify-center gap-2 rounded-xl border border-navy/20 bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-light disabled:opacity-60">
                    {isLocating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                    Get Location
                  </button>
                </div>
                {geoError ? <p className="mt-1 text-xs text-red-500">{geoError}</p> : null}
                {error ? <p className="mt-1 text-xs text-red-500">{error}</p> : null}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setPart("pricing")} className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button type="button" onClick={handleComplete} disabled={vehicleLocation.trim().length < 3} className="btn-cavalo inline-flex flex-[2] items-center justify-center gap-2 rounded-xl py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <TrustBadges />
    </motion.div>
  );
}
