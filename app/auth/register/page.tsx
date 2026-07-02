"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Truck, ArrowLeft, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const startTimer = () => {
    setTimer(30);
    const interval = setInterval(() => {
      setTimer((t) => { if (t <= 1) { clearInterval(interval); return 0; } return t - 1; });
    }, 1000);
  };

  const handleSendOtp = () => { if (name && mobile.length === 10) { setStep("otp"); startTimer(); } };

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otp]; newOtp[index] = digit; setOtp(newOtp);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) otpRefs.current[index - 1]?.focus();
  };

  const handleVerify = () => { if (otp.join("").length === 6) router.push("/dashboard"); };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button onClick={() => router.push("/")} className="text-gray-500 hover:text-navy mb-4 flex items-center gap-2 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </button>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="border-b-4 border-cavalo-yellow p-6 text-center">
            <div className="w-14 h-14 bg-cavalo-yellow rounded-lg flex items-center justify-center mx-auto mb-3">
              <Truck className="w-7 h-7 text-navy" />
            </div>
            <div className="text-2xl font-black tracking-tight text-navy italic">CAVALO</div>
            <div className="text-xs text-gray-400 font-medium">Moolyankann</div>
            <h1 className="text-navy text-xl font-bold mt-3">Create Account</h1>
            <p className="text-gray-500 text-sm mt-1">Join Cavalo Moolyankann today</p>
          </div>
          <div className="p-6">
            {step === "details" ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Rajesh Kumar" className="mt-1 focus-visible:ring-cavalo-yellow" autoFocus />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email (Optional)</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="rajesh@example.com" className="mt-1 focus-visible:ring-cavalo-yellow" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Mobile Number</label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-gray-100 border border-gray-200 rounded px-3 py-2.5 text-sm text-gray-600 font-medium">+91</span>
                    <Input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="9876543210" className="flex-1 focus-visible:ring-cavalo-yellow" />
                  </div>
                </div>
                <button onClick={handleSendOtp} disabled={!name || mobile.length !== 10} className="btn-cavalo w-full py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2">
                  Send OTP <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-center text-sm text-gray-500">
                  Already have an account?{" "}
                  <button onClick={() => router.push("/auth/login")} className="text-cavalo-yellow font-semibold hover:underline">Login</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">OTP sent to +91 {mobile.slice(0, 5)}XXXX</span>
                    <button onClick={() => setStep("details")} className="text-cavalo-yellow text-sm font-semibold hover:underline">Change number</button>
                  </div>
                  <div className="flex gap-2 justify-between">
                    {otp.map((digit, i) => (
                      <input key={i} ref={(el) => { otpRefs.current[i] = el; }} type="text" value={digit} onChange={(e) => handleOtpChange(i, e.target.value)} onKeyDown={(e) => handleOtpKeyDown(i, e)} maxLength={1} className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded focus:border-cavalo-yellow focus:outline-none" autoFocus={i === 0} />
                    ))}
                  </div>
                </div>
                <div className="text-center text-sm">
                  {timer > 0 ? <span className="text-gray-500">Resend OTP in {timer}s</span> : <button onClick={handleSendOtp} className="text-cavalo-yellow font-semibold hover:underline">Resend OTP</button>}
                </div>
                <button onClick={handleVerify} disabled={otp.join("").length !== 6} className="btn-cavalo w-full py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed">Create Account</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
