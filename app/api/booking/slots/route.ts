import { NextResponse } from "next/server";
import { getSevenDayAvailability } from "@/lib/booking/services/slot-availability";

export async function GET(): Promise<NextResponse> {
  try {
    const days = await getSevenDayAvailability();
    return NextResponse.json({ days });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch slot availability";
    return NextResponse.json({ message }, { status: 500 });
  }
}
