import { NextResponse } from "next/server";
import { verifyRc } from "@/lib/booking/services/vehicle-verification";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as { registrationNumber?: string };
    const registrationNumber = body.registrationNumber?.toUpperCase().replace(/[^A-Z0-9]/g, "") ?? "";

    if (registrationNumber.length < 6) {
      return NextResponse.json({ message: "Invalid registration number" }, { status: 400 });
    }

    const vehicle = await verifyRc(registrationNumber);
    return NextResponse.json({ vehicle });
  } catch (error) {
    const message = error instanceof Error ? error.message : "RC verification failed";
    return NextResponse.json({ message }, { status: 400 });
  }
}
