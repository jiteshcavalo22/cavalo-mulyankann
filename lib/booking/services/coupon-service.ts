export interface CouponDefinition {
  code: string;
  description: string;
  discountPct: number;
  expiresAt: string;
  active: boolean;
}

export interface CouponListItem {
  code: string;
  description: string;
  discountPct: number;
  expiresAt: string;
  expired: boolean;
  eligible: boolean;
}

export interface ApplyCouponResult {
  valid: boolean;
  message: string;
  code?: string;
  discountPct?: number;
  discountAmount?: number;
  originalAmount?: number;
  finalAmount?: number;
  expired?: boolean;
}

const COUPONS: CouponDefinition[] = [
  {
    code: "FLEET20",
    description: "20% off fleet bookings",
    discountPct: 20,
    expiresAt: "2026-12-31",
    active: true,
  },
  {
    code: "CAVALO10",
    description: "10% off inspection fee",
    discountPct: 10,
    expiresAt: "2026-12-31",
    active: true,
  },
  {
    code: "FIRST15",
    description: "15% off for first-time customers",
    discountPct: 15,
    expiresAt: "2026-09-30",
    active: true,
  },
  {
    code: "SUMMER25",
    description: "Summer special — 25% off",
    discountPct: 25,
    expiresAt: "2025-08-31",
    active: true,
  },
];

function isExpired(expiresAt: string): boolean {
  const end = new Date(`${expiresAt}T23:59:59`);
  return Number.isNaN(end.getTime()) || end.getTime() < Date.now();
}

function findCoupon(code: string): CouponDefinition | undefined {
  return COUPONS.find((coupon) => coupon.code === code.trim().toUpperCase());
}

export function calculateDiscount(amount: number, discountPct: number): number {
  return Math.round((amount * discountPct) / 100);
}

export function listAvailableCoupons(amount: number): CouponListItem[] {
  return COUPONS.filter((coupon) => coupon.active).map((coupon) => {
    const expired = isExpired(coupon.expiresAt);
    return {
      code: coupon.code,
      description: coupon.description,
      discountPct: coupon.discountPct,
      expiresAt: coupon.expiresAt,
      expired,
      eligible: !expired && amount > 0,
    };
  });
}

export function applyCoupon(code: string, amount: number): ApplyCouponResult {
  const normalized = code.trim().toUpperCase();

  if (!normalized) {
    return { valid: false, message: "Enter a coupon code" };
  }

  const coupon = findCoupon(normalized);
  if (!coupon) {
    return { valid: false, message: "Invalid coupon code" };
  }

  if (!coupon.active) {
    return { valid: false, message: "This coupon is no longer active" };
  }

  const expired = isExpired(coupon.expiresAt);
  if (expired) {
    return {
      valid: false,
      message: "This coupon has expired",
      expired: true,
      code: coupon.code,
    };
  }

  const discountAmount = calculateDiscount(amount, coupon.discountPct);
  const finalAmount = Math.max(amount - discountAmount, 0);

  return {
    valid: true,
    message: `${coupon.discountPct}% discount applied`,
    code: coupon.code,
    discountPct: coupon.discountPct,
    discountAmount,
    originalAmount: amount,
    finalAmount,
    expired: false,
  };
}
