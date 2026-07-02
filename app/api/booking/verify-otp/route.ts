import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/booking/services/vehicle-verification";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { mobile?: string; otp?: string };
    const mobile = body.mobile?.replace(/\D/g, "") ?? "";
    const otp = body.otp?.replace(/\D/g, "") ?? "";

    if (mobile.length !== 10) {
      return NextResponse.json({ message: "Invalid mobile number" }, { status: 400 });
    }

    if (!verifyOtp(mobile, otp)) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    return NextResponse.json({ verified: true });
  } catch {
    return NextResponse.json({ message: "OTP verification failed" }, { status: 500 });
  }
}
