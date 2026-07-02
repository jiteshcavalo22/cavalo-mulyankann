import { NextResponse } from "next/server";
import { listAvailableCoupons } from "@/lib/booking/services/coupon-service";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const amount = Number(searchParams.get("amount") ?? "0");

  const coupons = listAvailableCoupons(Number.isFinite(amount) ? amount : 0);

  return NextResponse.json({ coupons });
}
