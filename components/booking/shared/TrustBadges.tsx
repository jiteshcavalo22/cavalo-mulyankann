"use client";

import { ShieldCheck } from "lucide-react";

const BADGES = [
  "Secure OTP",
  "Govt RC Verified",
  "5000+ Trucks Inspected",
] as const;

export default function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
      {BADGES.map((badge) => (
        <span key={badge} className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          {badge}
        </span>
      ))}
    </div>
  );
}
