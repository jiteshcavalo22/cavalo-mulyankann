import { NextResponse } from "next/server";
import { applyCoupon } from "@/lib/booking/services/coupon-service";
import { getBookingRecord } from "@/lib/booking/services/booking-store";

interface ApplyCouponPayload {
  code?: string;
  bookingId?: string;
  amount?: number;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as ApplyCouponPayload;

    if (!body.code?.trim()) {
      return NextResponse.json({ valid: false, message: "Enter a coupon code" }, { status: 400 });
    }

    let amount = body.amount ?? 0;

    if (body.bookingId) {
      const booking = getBookingRecord(body.bookingId);
      if (booking) {
        amount = booking.amount;
      }
    }

    if (amount <= 0) {
      return NextResponse.json({ valid: false, message: "Invalid booking amount" }, { status: 400 });
    }

    const result = applyCoupon(body.code, amount);
    const status = result.valid ? 200 : result.expired ? 410 : 400;

    return NextResponse.json(result, { status });
  } catch {
    return NextResponse.json({ valid: false, message: "Unable to apply coupon" }, { status: 500 });
  }
}
