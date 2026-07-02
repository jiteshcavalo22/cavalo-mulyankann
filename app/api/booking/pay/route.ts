import { NextResponse } from "next/server";
import { completeBookingPayment } from "@/lib/booking/services/reserve-booking";

interface PayPayload {
  bookingId?: string;
  paymentMethod?: string;
  couponCode?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as PayPayload;

    if (!body.bookingId || !body.paymentMethod) {
      return NextResponse.json({ message: "Missing payment details" }, { status: 400 });
    }

    const updated = await completeBookingPayment(
      body.bookingId,
      body.paymentMethod,
      body.couponCode,
    );
    if (!updated) {
      return NextResponse.json({ message: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({
      bookingId: updated.bookingId,
      bookingStatus: updated.bookingStatus,
      amount: updated.amount,
      originalAmount: updated.originalAmount,
      couponCode: updated.couponCode,
      discountPct: updated.discountPct,
      slotReserved: updated.slotReserved,
      syncedToCrm: true,
    });
  } catch {
    return NextResponse.json({ message: "Payment processing failed" }, { status: 500 });
  }
}
