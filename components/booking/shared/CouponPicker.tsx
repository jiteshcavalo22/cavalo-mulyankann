"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Tag, XCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { applyCouponApi, fetchCouponsApi } from "@/lib/booking/services/booking-client";
import type { ApplyCouponResult, CouponListItem } from "@/lib/booking/types";

interface CouponPickerProps {
  bookingId: string;
  amount: number;
  disabled?: boolean;
  onApplied: (result: ApplyCouponResult) => void;
}

export default function CouponPicker({ bookingId, amount, disabled = false, onApplied }: CouponPickerProps) {
  const [coupons, setCoupons] = useState<CouponListItem[]>([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(true);
  const [selectedCode, setSelectedCode] = useState("");
  const [manualCode, setManualCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState("");
  const [applied, setApplied] = useState<ApplyCouponResult | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadCoupons = async (): Promise<void> => {
      setIsLoadingCoupons(true);
      try {
        const list = await fetchCouponsApi(amount);
        if (!cancelled) {
          setCoupons(list);
        }
      } catch {
        if (!cancelled) {
          setCoupons([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingCoupons(false);
        }
      }
    };

    void loadCoupons();
    return () => {
      cancelled = true;
    };
  }, [amount]);

  const activeCoupons = coupons.filter((coupon) => coupon.eligible && !coupon.expired);

  const handleApply = async (code: string): Promise<void> => {
    const normalized = code.trim().toUpperCase();
    if (!normalized || applied) {
      return;
    }

    setIsApplying(true);
    setError("");

    try {
      const result = await applyCouponApi(normalized, bookingId, amount);
      if (result.valid) {
        setApplied(result);
        onApplied(result);
      } else {
        setError(result.message);
      }
    } catch (applyError) {
      setError(applyError instanceof Error ? applyError.message : "Unable to apply coupon");
    } finally {
      setIsApplying(false);
    }
  };

  const handleSelectCoupon = (code: string): void => {
    setSelectedCode(code);
    setManualCode(code);
    setError("");
  };

  if (applied?.valid) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
            <div>
              <p className="text-sm font-semibold text-emerald-800">
                {applied.code} applied — {applied.discountPct}% off
              </p>
              <p className="mt-0.5 text-xs text-emerald-700">
                You save ₹{applied.discountAmount}. Coupon locked for this payment.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <div className="mb-3 flex items-center gap-2">
        <Tag className="h-4 w-4 text-cavalo-yellow" />
        <h4 className="text-sm font-semibold text-navy">Coupon Code</h4>
      </div>

      {isLoadingCoupons ? (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading available coupons...
        </div>
      ) : activeCoupons.length > 0 ? (
        <div className="mb-3">
          <label className="mb-1.5 block text-xs font-medium text-gray-500">Available offers</label>
          <Select value={selectedCode} onValueChange={handleSelectCoupon} disabled={disabled || isApplying}>
            <SelectTrigger className="rounded-xl bg-white">
              <SelectValue placeholder="Select a coupon" />
            </SelectTrigger>
            <SelectContent>
              {activeCoupons.map((coupon) => (
                <SelectItem key={coupon.code} value={coupon.code}>
                  {coupon.code} — {coupon.discountPct}% off
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <p className="mb-3 text-xs text-gray-500">No active coupons right now. Enter a code below if you have one.</p>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={manualCode}
          onChange={(event) => {
            setManualCode(event.target.value.toUpperCase());
            setError("");
          }}
          placeholder="Enter coupon code"
          className="rounded-xl uppercase bg-white"
          disabled={disabled || isApplying}
        />
        <button
          type="button"
          onClick={() => void handleApply(manualCode)}
          disabled={disabled || isApplying || !manualCode.trim()}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-navy/20 bg-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isApplying ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Apply
        </button>
      </div>

      {error ? (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
          <XCircle className="h-3.5 w-3.5 flex-shrink-0" />
          {error}
        </div>
      ) : null}

      {coupons.some((coupon) => coupon.expired) ? (
        <p className="mt-2 text-[10px] text-gray-400">Expired coupons cannot be applied.</p>
      ) : null}
    </div>
  );
}
