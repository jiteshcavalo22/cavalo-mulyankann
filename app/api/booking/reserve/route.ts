import { NextResponse } from "next/server";
import { reserveBooking } from "@/lib/booking/services/reserve-booking";
import type { BookingMode } from "@/lib/booking/types";

interface ReservePayload {
  mode?: BookingMode;
  date?: string;
  hour?: number;
  slot?: string;
  registrationNumber?: string;
  fullName?: string;
  mobile?: string;
  location?: string;
  brand?: string;
  model?: string;
  gvwCategory?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as ReservePayload;
    const mode: BookingMode = body.mode === "crm_lead" ? "crm_lead" : "pay_now";

    if (!body.date || body.hour === undefined || !body.registrationNumber || !body.mobile) {
      return NextResponse.json({ message: "Missing booking details" }, { status: 400 });
    }

    const result = await reserveBooking({
      mode,
      date: body.date,
      hour: body.hour,
      slot: body.slot ?? "",
      registrationNumber: body.registrationNumber,
      fullName: body.fullName ?? "",
      mobile: body.mobile,
      location: body.location ?? "",
      brand: body.brand ?? "",
      model: body.model ?? "",
      gvwCategory: body.gvwCategory ?? "C2",
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ message: "Unable to reserve slot" }, { status: 500 });
  }
}
