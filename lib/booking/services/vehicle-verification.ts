import type { VehicleDetails } from "@/lib/booking/types";

const MOCK_VEHICLES: Record<string, Omit<VehicleDetails, "registrationNumber">> = {
  MH12AB1234: {
    brand: "Tata",
    model: "Prima 5530.S",
    fuelType: "Diesel",
    year: "2021",
    owner: "Rajesh Kumar",
    gvwCategory: "C3",
    color: "White",
  },
  KA05CD5678: {
    brand: "Ashok Leyland",
    model: "Boss 1415",
    fuelType: "Diesel",
    year: "2020",
    owner: "Suresh Patel",
    gvwCategory: "C2",
    color: "Blue",
  },
  DL01EF9012: {
    brand: "Mahindra",
    model: "Blazo X 28",
    fuelType: "Diesel",
    year: "2022",
    owner: "Amit Singh",
    gvwCategory: "C3",
    color: "Red",
  },
};

function deriveFromRegistration(registrationNumber: string): VehicleDetails {
  const brands = ["Tata", "Ashok Leyland", "Mahindra", "Eicher", "BharatBenz"];
  const models = ["Prima 5530.S", "Boss 1415", "Blazo X 28", "Pro 2049", "1217R"];
  const hash = registrationNumber.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return {
    registrationNumber,
    brand: brands[hash % brands.length],
    model: models[hash % models.length],
    fuelType: "Diesel",
    year: String(2018 + (hash % 7)),
    owner: "Registered Owner",
    gvwCategory: ["C1", "C2", "C3", "C4"][hash % 4],
    color: ["White", "Blue", "Red", "Silver"][hash % 4],
  };
}

export function verifyOtp(mobile: string, otp: string): boolean {
  return mobile.length === 10 && otp.length === 6;
}

export async function verifyRc(registrationNumber: string): Promise<VehicleDetails> {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const normalized = registrationNumber.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const mock = MOCK_VEHICLES[normalized];

  if (mock) {
    return { ...mock, registrationNumber: normalized };
  }

  if (normalized.length < 6) {
    throw new Error("Invalid registration number format");
  }

  return deriveFromRegistration(normalized);
}
