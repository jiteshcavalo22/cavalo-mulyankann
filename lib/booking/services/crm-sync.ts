import type { BookingRecord } from "@/lib/booking/types";

interface CrmLeadPayload {
  leadId: string;
  bookingId: string;
  fullName: string;
  mobile: string;
  registrationNumber: string;
  brand: string;
  model: string;
  gvwCategory: string;
  preferredDate: string;
  preferredSlot: string;
  preferredHour: number;
  location: string;
  status: "new_lead" | "payment_received";
  slotReserved: boolean;
}

export async function pushLeadToCrm(payload: CrmLeadPayload): Promise<void> {
  const webhookUrl = process.env.CRM_WEBHOOK_URL;

  if (!webhookUrl) {
    console.info("[CRM Sync] Lead queued locally", payload);
    return;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("CRM sync failed");
  }
}

export async function syncBookingToCrm(record: BookingRecord): Promise<void> {
  await pushLeadToCrm({
    leadId: record.crmLeadId,
    bookingId: record.bookingId,
    fullName: record.fullName,
    mobile: record.mobile,
    registrationNumber: record.registrationNumber,
    brand: record.brand,
    model: record.model,
    gvwCategory: record.gvwCategory,
    preferredDate: record.date,
    preferredSlot: record.slot,
    preferredHour: record.hour,
    location: record.location,
    status: record.bookingStatus === "paid" || record.bookingStatus === "confirmed"
      ? "payment_received"
      : "new_lead",
    slotReserved: record.slotReserved,
  });
}
