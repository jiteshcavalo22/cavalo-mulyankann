"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Truck, ArrowLeft, ArrowRight, CheckCircle2, Plus, CreditCard,
  MessageCircle, Upload, ShieldCheck, Banknote, Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const brands = ["Tata", "Ashok Leyland", "Mahindra", "Eicher", "BharatBenz", "Force", "AMW", "MAN", "Volvo", "SML"];
const gvwOptions = [
  { cat: "C1", range: "Up to 7.5T", price: 1299 },
  { cat: "C2", range: "7.5T-12T", price: 1599 },
  { cat: "C3", range: "12T-25T", price: 1899 },
  { cat: "C4", range: "25T+", price: 2599 },
];
const timeSlots = [
  { label: "Morning", time: "9-11 AM" },
  { label: "Mid-Morning", time: "11 AM-1 PM" },
  { label: "Afternoon", time: "2-4 PM" },
  { label: "Evening", time: "4-6 PM" },
];
const banks = ["HDFC", "ICICI", "Axis", "SBI", "Kotak", "IDFC"];
const tenures = [3, 6, 9];
const validCoupons: Record<string, number> = { FLEET20: 20, CAVALO10: 10, FIRST15: 15 };

interface TruckEntry { id: number; brand: string; otherBrand: string; rto: string; gvw: string; }

export default function BookPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [multiTruck, setMultiTruck] = useState(false);
  const [trucks, setTrucks] = useState<TruckEntry[]>([{ id: 1, brand: "", otherBrand: "", rto: "", gvw: "" }]);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [city, setCity] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(0);
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedTenure, setSelectedTenure] = useState<number | null>(null);
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState<{ code: string; pct: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingId, setBookingId] = useState("");

  const stepLabels = ["Truck Details", "Slot Booking", "Payment"];

  const addTruck = () => setTrucks([...trucks, { id: Date.now(), brand: "", otherBrand: "", rto: "", gvw: "" }]);
  const removeTruck = (id: number) => setTrucks(trucks.filter((t) => t.id !== id));
  const updateTruck = (id: number, field: keyof TruckEntry, value: string) => setTrucks(trucks.map((t) => (t.id === id ? { ...t, [field]: value } : t)));

  const trucksValid = trucks.every((t) => t.brand && (t.brand !== "Other" || t.otherBrand) && t.rto.length === 4 && t.gvw);
  const subtotal = trucks.reduce((sum, t) => sum + (gvwOptions.find((o) => o.cat === t.gvw)?.price || 0), 0);
  const discount = couponApplied ? Math.round((subtotal * couponApplied.pct) / 100) : 0;
  const gst = Math.round((subtotal - discount) * 0.18);
  const total = subtotal - discount + gst;

  const applyCoupon = () => {
    const code = coupon.toUpperCase().trim();
    if (validCoupons[code]) { setCouponApplied({ code, pct: validCoupons[code] }); setCouponError(""); }
    else { setCouponApplied(null); setCouponError("Invalid coupon code"); }
  };

  const handlePayment = () => {
    setBookingId("CV-" + Math.floor(10000 + Math.random() * 90000));
    setBookingConfirmed(true);
  };

  if (bookingConfirmed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center border border-gray-200">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-10 h-10 text-green-600" /></div>
          <h1 className="text-2xl font-bold text-navy mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500 mb-1">Your booking reference is</p>
          <p className="text-3xl font-bold text-cavalo-yellow mb-6">#{bookingId}</p>
          <p className="text-gray-600 text-sm mb-6">We have sent a confirmation to your WhatsApp. Your inspector will be assigned within 2 hours.</p>
          <div className="flex gap-3">
            <button onClick={() => router.push("/dashboard")} className="btn-cavalo flex-1 py-2.5 text-sm">Go to Dashboard</button>
            <button onClick={() => router.push("/")} className="flex-1 border-2 border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold rounded py-2.5 text-sm transition">Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header — Cavalo style */}
      <div className="bg-white border-b-4 border-cavalo-yellow py-4 px-4 sm:px-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button onClick={() => (step === 0 ? router.push("/") : setStep(step - 1))} className="text-gray-500 hover:text-navy"><ArrowLeft className="w-5 h-5" /></button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cavalo-yellow rounded flex items-center justify-center"><Truck className="w-5 h-5 text-navy" /></div>
            <h1 className="text-navy font-bold text-lg">Book Inspection</h1>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-4">
          <div className="flex items-center gap-2">
            {stepLabels.map((label, i) => (
              <div key={i} className="flex items-center gap-2 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${i < step ? "bg-green-500 text-white" : i === step ? "bg-cavalo-yellow text-navy" : "bg-gray-200 text-gray-400"}`}>
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:inline ${i <= step ? "text-navy" : "text-gray-400"}`}>{label}</span>
                {i < stepLabels.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? "bg-green-500" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* STEP 1 */}
        {step === 0 && (
          <div className="space-y-6">
            <div className="cavalo-card p-4 flex items-center justify-between">
              <div><Label className="text-navy font-semibold">Multiple Trucks?</Label><p className="text-gray-500 text-sm">Book inspections for a fleet of trucks</p></div>
              <Switch checked={multiTruck} onCheckedChange={setMultiTruck} />
            </div>
            {trucks.map((truck, idx) => (
              <div key={truck.id} className="cavalo-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-navy">Truck {idx + 1}</h3>
                  {multiTruck && trucks.length > 1 && <button onClick={() => removeTruck(truck.id)} className="text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 className="w-4 h-4" /></button>}
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">Brand</label>
                    <div className="flex flex-wrap gap-1.5">
                      {brands.map((b) => <button key={b} type="button" onClick={() => updateTruck(truck.id, "brand", b)} className={`text-xs px-3 py-1.5 rounded border transition ${truck.brand === b ? "bg-navy border-navy text-white" : "bg-white border-gray-200 text-gray-600 hover:border-cavalo-yellow"}`}>{b}</button>)}
                      <button type="button" onClick={() => updateTruck(truck.id, "brand", "Other")} className={`text-xs px-3 py-1.5 rounded border transition ${truck.brand === "Other" ? "bg-navy border-navy text-white" : "bg-white border-gray-200 text-gray-600 hover:border-cavalo-yellow"}`}>Other</button>
                    </div>
                    {truck.brand === "Other" && <Input value={truck.otherBrand} onChange={(e) => updateTruck(truck.id, "otherBrand", e.target.value)} placeholder="Enter brand name" className="mt-2" />}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className="text-xs font-medium text-gray-600 mb-1.5 block">RTO Number</label><Input value={truck.rto} onChange={(e) => updateTruck(truck.id, "rto", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4))} placeholder="MH01" maxLength={4} className="uppercase" /></div>
                    <div><label className="text-xs font-medium text-gray-600 mb-1.5 block">City</label><Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Mumbai" /></div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-600 mb-1.5 block">GVW Category</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {gvwOptions.map((g) => <button key={g.cat} type="button" onClick={() => updateTruck(truck.id, "gvw", g.cat)} className={`py-2 rounded border text-center transition ${truck.gvw === g.cat ? "bg-navy border-navy text-white" : "bg-white border-gray-200 text-gray-600 hover:border-cavalo-yellow"}`}><div className="font-bold text-sm">{g.cat}</div><div className="text-xs">{g.range}</div><div className="text-xs mt-1">₹{g.price}</div></button>)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {multiTruck && <button onClick={addTruck} className="w-full border-2 border-dashed border-gray-300 rounded py-4 text-gray-500 hover:border-cavalo-yellow hover:text-cavalo-yellow transition flex items-center justify-center gap-2 font-medium"><Plus className="w-4 h-4" /> Add Another Truck</button>}
            <button onClick={() => setStep(1)} disabled={!trucksValid || !city} className="btn-cavalo w-full py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2">Continue <ArrowRight className="w-4 h-4" /></button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="cavalo-card p-6">
              <label className="text-sm font-medium text-navy mb-2 block">Select Date</label>
              <Input type="date" value={date} min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="cavalo-card p-6">
              <label className="text-sm font-medium text-navy mb-3 block">Select Time Slot</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {timeSlots.map((s) => <button key={s.label} onClick={() => setSlot(s.time)} className={`py-3 rounded border text-center transition ${slot === s.time ? "bg-navy border-navy text-white" : "bg-white border-gray-200 text-gray-600 hover:border-cavalo-yellow"}`}><div className="font-semibold text-sm">{s.label}</div><div className="text-xs">{s.time}</div></button>)}
              </div>
            </div>
            <div className="bg-navy rounded-lg p-6 text-white">
              <h3 className="font-semibold mb-3">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-white/60">Trucks</span><span>{trucks.length}</span></div>
                <div className="flex justify-between"><span className="text-white/60">Date</span><span>{date || "Not selected"}</span></div>
                <div className="flex justify-between"><span className="text-white/60">Time Slot</span><span>{slot || "Not selected"}</span></div>
                <div className="flex justify-between"><span className="text-white/60">City</span><span>{city}</span></div>
                <div className="flex justify-between border-t border-white/10 pt-2 mt-2"><span className="text-white/60">Estimate</span><span className="text-cavalo-yellow font-bold">₹{subtotal}</span></div>
              </div>
            </div>
            <button onClick={() => setStep(2)} disabled={!date || !slot} className="btn-cavalo w-full py-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2">Continue to Payment <ArrowRight className="w-4 h-4" /></button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 2 && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="cavalo-card p-6">
                <h3 className="font-semibold text-navy mb-4">Order Summary</h3>
                <div className="space-y-3">
                  {trucks.map((t) => (
                    <div key={t.id} className="flex items-center justify-between text-sm border-b border-gray-100 pb-3">
                      <div><div className="font-medium text-navy">{t.brand === "Other" ? t.otherBrand : t.brand} ({t.rto})</div><div className="text-gray-500 text-xs">{gvwOptions.find((g) => g.cat === t.gvw)?.range}</div></div>
                      <div className="font-semibold text-cavalo-yellow">₹{gvwOptions.find((g) => g.cat === t.gvw)?.price}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="text-xs font-medium text-gray-600 mb-1.5 block">Coupon Code</label>
                  <div className="flex gap-2"><Input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="FLEET20" className="flex-1" /><button onClick={applyCoupon} className="btn-cavalo-outline px-4 text-sm">Apply</button></div>
                  {couponApplied && <p className="text-green-600 text-xs mt-2 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {couponApplied.code} applied - {couponApplied.pct}% off</p>}
                  {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span className="font-medium">₹{subtotal}</span></div>
                  {couponApplied && <div className="flex justify-between text-green-600"><span>Discount ({couponApplied.pct}%)</span><span>-₹{discount}</span></div>}
                  <div className="flex justify-between"><span className="text-gray-500">GST (18%)</span><span className="font-medium">₹{gst}</span></div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 mt-2"><span className="font-bold text-navy">Total</span><span className="font-bold text-cavalo-yellow text-lg">₹{total}</span></div>
                </div>
              </div>
            </div>
            <div className="cavalo-card p-6">
              <h3 className="font-semibold text-navy mb-4">Payment Method</h3>
              <div className="grid grid-cols-4 gap-1 mb-6">
                {[{ icon: CreditCard, label: "Pay Now" }, { icon: Banknote, label: "EMI" }, { icon: MessageCircle, label: "WhatsApp" }, { icon: Upload, label: "Manual" }].map((m, i) => (
                  <button key={i} onClick={() => setPaymentMethod(i)} className={`flex flex-col items-center gap-1 py-3 rounded border transition ${paymentMethod === i ? "bg-navy border-navy text-white" : "bg-white border-gray-200 text-gray-600 hover:border-cavalo-yellow"}`}><m.icon className="w-4 h-4" /><span className="text-xs">{m.label}</span></button>
                ))}
              </div>
              {paymentMethod === 0 && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded p-4 flex items-center gap-3"><ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" /><p className="text-blue-700 text-sm">Secured by Razorpay. Your payment is 100% safe and encrypted.</p></div>
                  <div className="flex gap-2 flex-wrap">{["UPI", "Visa", "Mastercard", "RuPay"].map((p) => <span key={p} className="bg-gray-100 border border-gray-200 rounded px-3 py-1.5 text-xs font-medium text-gray-600">{p}</span>)}</div>
                  <button onClick={handlePayment} className="btn-cavalo w-full py-2.5 text-sm">Pay ₹{total} Securely</button>
                </div>
              )}
              {paymentMethod === 1 && (
                <div className="space-y-4">
                  <div className="bg-cavalo-yellow-light border border-cavalo-yellow/30 rounded p-3"><p className="text-cavalo-yellow-dark text-sm font-medium">No-Cost EMI - 0% interest</p></div>
                  <div><label className="text-xs font-medium text-gray-600 mb-2 block">Select Bank</label><div className="grid grid-cols-3 gap-2">{banks.map((b) => <button key={b} onClick={() => setSelectedBank(b)} className={`py-2 rounded border text-xs font-medium transition ${selectedBank === b ? "bg-navy border-navy text-white" : "bg-white border-gray-200 text-gray-600 hover:border-cavalo-yellow"}`}>{b}</button>)}</div></div>
                  <div><label className="text-xs font-medium text-gray-600 mb-2 block">Tenure</label><div className="grid grid-cols-3 gap-2">{tenures.map((t) => <button key={t} onClick={() => setSelectedTenure(t)} disabled={!selectedBank} className={`py-2 rounded border text-center transition ${selectedTenure === t ? "bg-navy border-navy text-white" : "bg-white border-gray-200 text-gray-600 hover:border-cavalo-yellow disabled:opacity-40"}`}><div className="font-bold text-sm">{t} mo</div><div className="text-xs">₹{Math.round(total / t)}/mo</div></button>)}</div></div>
                  {selectedTenure && <div className="bg-gray-50 rounded p-3 text-sm"><div className="flex justify-between mb-1"><span className="text-gray-500">Monthly EMI</span><span className="font-medium">₹{Math.round(total / selectedTenure)}</span></div><div className="flex justify-between"><span className="text-gray-500">Total</span><span className="font-medium">₹{total}</span></div></div>}
                  <button onClick={handlePayment} disabled={!selectedBank || !selectedTenure} className="btn-cavalo w-full py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed">Pay ₹{Math.round(total / (selectedTenure || 3))}/mo x {selectedTenure || 3} months</button>
                </div>
              )}
              {paymentMethod === 2 && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded p-4"><MessageCircle className="w-6 h-6 text-green-600 mb-2" /><p className="text-green-700 text-sm font-medium">We will send a secure payment link to your WhatsApp. Click the link to pay via UPI, card or net banking.</p></div>
                  <button onClick={handlePayment} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold rounded py-2.5 text-sm transition">Request Payment Link</button>
                </div>
              )}
              {paymentMethod === 3 && (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded overflow-hidden">
                    <table className="w-full text-sm"><tbody>
                      <tr className="border-b border-gray-200"><td className="px-4 py-2.5 text-gray-500 font-medium">Account Name</td><td className="px-4 py-2.5 font-medium text-navy">Cavalo Moolyankann Pvt Ltd</td></tr>
                      <tr className="border-b border-gray-200"><td className="px-4 py-2.5 text-gray-500 font-medium">Account No.</td><td className="px-4 py-2.5 font-mono text-navy">501234567890</td></tr>
                      <tr className="border-b border-gray-200"><td className="px-4 py-2.5 text-gray-500 font-medium">IFSC</td><td className="px-4 py-2.5 font-mono text-navy">HDFC0001234</td></tr>
                      <tr><td className="px-4 py-2.5 text-gray-500 font-medium">UPI ID</td><td className="px-4 py-2.5 font-mono text-navy">cavalo@hdfcbank</td></tr>
                    </tbody></table>
                  </div>
                  <button onClick={() => setReceiptUploaded(true)} className={`w-full border-2 border-dashed rounded py-8 transition flex flex-col items-center gap-2 ${receiptUploaded ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-cavalo-yellow"}`}>
                    {receiptUploaded ? <><CheckCircle2 className="w-8 h-8 text-green-600" /><span className="text-green-700 font-medium text-sm">Receipt Uploaded</span></> : <><Upload className="w-8 h-8 text-gray-400" /><span className="text-gray-500 text-sm">Click to upload payment receipt</span></>}
                  </button>
                  <button onClick={handlePayment} disabled={!receiptUploaded} className="btn-cavalo w-full py-2.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed">Confirm Booking</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
