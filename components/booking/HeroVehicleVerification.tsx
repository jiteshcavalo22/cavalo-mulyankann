"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import FormPartIndicator from "@/components/booking/shared/FormPartIndicator";
import { Input } from "@/components/ui/input";
import { verifyOtpApi, verifyRcApi } from "@/lib/booking/services/booking-client";
import type { HeroVerificationResult } from "@/lib/booking/types";
import { normalizeMobile, normalizeRegistration } from "@/lib/booking/utils/formatting";

interface HeroVehicleVerificationProps {
  onVerified: (result: HeroVerificationResult) => void;
}

type HeroPart = "contact" | "otp" | "verifying";

export default function HeroVehicleVerification({ onVerified }: HeroVehicleVerificationProps) {
  const [part, setPart] = useState<HeroPart>("contact");
  const [mobile, setMobile] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  const handleVerify = async (): Promise<void> => {
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
      onVerified({ vehicle, mobile, registrationNumber });
    } catch (verifyError) {
      setError(verifyError instanceof Error ? verifyError.message : "Verification failed");
      setPart("otp");
    } finally {
      setIsLoading(false);
    }
  };

  const partNumber = part === "contact" ? 1 : part === "otp" ? 2 : 2;

  return (
    <div className="rounded-xl border border-gray-100 bg-gradient-to-br from-white to-cavalo-yellow-light/20 p-4">
      {part !== "verifying" ? (
        <FormPartIndicator current={partNumber} total={2} label={part === "contact" ? "Verify your truck" : "Confirm OTP"} />
      ) : null}

      <AnimatePresence mode="wait">
        {part === "contact" ? (
          <motion.div
            key="contact"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="space-y-3"
          >
            <p className="text-xs text-gray-500">Enter registration &amp; mobile — we&apos;ll send an OTP to verify.</p>

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

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={!isContactValid}
              className="btn-cavalo inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send OTP <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        ) : null}

        {part === "otp" ? (
          <motion.div
            key="otp"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="space-y-4"
          >
            <p className="text-sm text-gray-600">
              OTP sent to <span className="font-semibold text-navy">+91 {mobile}</span> for{" "}
              <span className="font-semibold text-navy">{registrationNumber}</span>
            </p>

            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  ref={(element) => {
                    otpRefs.current[index] = element;
                  }}
                  value={digit}
                  onChange={(event) => handleOtpChange(index, event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Backspace" && !otp[index] && index > 0) {
                      otpRefs.current[index - 1]?.focus();
                    }
                  }}
                  inputMode="numeric"
                  maxLength={1}
                  className="h-10 w-9 rounded-xl text-center text-lg font-bold"
                />
              ))}
            </div>

            {error ? <p className="text-center text-xs text-red-500">{error}</p> : null}

            <button
              type="button"
              onClick={() => void handleVerify()}
              disabled={otp.join("").length !== 6 || isLoading}
              className="btn-cavalo inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Verify &amp; Fetch RC
            </button>

            <button
              type="button"
              onClick={() => {
                setPart("contact");
                setOtp(["", "", "", "", "", ""]);
                setError("");
              }}
              className="inline-flex w-full items-center justify-center gap-1 text-xs font-semibold text-gray-500 hover:text-navy"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Change number
            </button>
          </motion.div>
        ) : null}

        {part === "verifying" ? (
          <motion.div
            key="verifying"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center py-5 text-center"
          >
            <Loader2 className="h-8 w-8 animate-spin text-cavalo-yellow" />
            <p className="mt-4 text-sm font-semibold text-navy">Fetching vehicle details from RC records...</p>
            <p className="mt-1 text-xs text-gray-500">This usually takes a few seconds</p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
