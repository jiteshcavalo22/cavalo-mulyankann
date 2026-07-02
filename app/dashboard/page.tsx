"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Truck, ArrowLeft, CheckCircle2, Clock, Circle, Star,
  MessageCircle, Plus, Settings, LogOut, FileText, Bell,
  User, Phone,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Booking {
  id: string; brand: string; model: string; rto: string; gvw: string;
  date: string; city: string; status: "pending" | "confirmed" | "assigned" | "ready";
  score?: number; inspector?: { name: string; phone: string; rating: number }; fee: number;
}

const mockBookings: Booking[] = [
  { id: "CV-20491", brand: "Tata", model: "Prima", rto: "MH01", gvw: "C3", date: "Jan 15, 2025", city: "Mumbai", status: "ready", score: 88, inspector: { name: "Rajesh Kumar", phone: "+91 98765 43210", rating: 4.8 }, fee: 1899 },
  { id: "CV-20512", brand: "Ashok Leyland", model: "Dost", rto: "KA05", gvw: "C1", date: "Jan 18, 2025", city: "Bengaluru", status: "assigned", inspector: { name: "Suresh Patel", phone: "+91 90000 12345", rating: 4.6 }, fee: 1299 },
  { id: "CV-20530", brand: "Eicher", model: "Pro 2049", rto: "DL01", gvw: "C2", date: "Jan 22, 2025", city: "Delhi", status: "confirmed", fee: 1599 },
  { id: "CV-20545", brand: "BharatBenz", model: "1217R", rto: "TN01", gvw: "C4", date: "Jan 25, 2025", city: "Chennai", status: "pending", fee: 2599 },
];

const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-700 border-yellow-200", label: "Pending Payment" },
  confirmed: { color: "bg-blue-100 text-blue-700 border-blue-200", label: "Confirmed" },
  assigned: { color: "bg-orange-100 text-orange-700 border-orange-200", label: "Inspector Assigned" },
  ready: { color: "bg-green-100 text-green-700 border-green-200", label: "Report Ready" },
};

const allAlerts = [
  { booking: "CV-20491", msg: "Your inspection is booked for Jan 15, 11 AM.", time: "Jan 14, 10:00 AM" },
  { booking: "CV-20491", msg: "Rajesh Kumar (4.8 star) assigned as inspector.", time: "Jan 14, 02:00 PM" },
  { booking: "CV-20491", msg: "Inspection completed. Score: 88/100.", time: "Jan 15, 01:30 PM" },
  { booking: "CV-20491", msg: "Report ready! Tap to view full PDF.", time: "Jan 15, 02:00 PM" },
  { booking: "CV-20512", msg: "Inspector Suresh Patel assigned for Jan 18.", time: "Jan 17, 09:00 AM" },
  { booking: "CV-20530", msg: "Booking confirmed for Jan 22, Delhi.", time: "Jan 20, 03:00 PM" },
];

const timeline = [
  { label: "Booking Placed", time: "Jan 14, 10:00 AM" },
  { label: "Payment Confirmed", time: "Jan 14, 10:05 AM" },
  { label: "Inspector Assigned", time: "Jan 14, 02:00 PM" },
  { label: "Inspection Completed", time: "Jan 15, 01:30 PM" },
  { label: "Report Delivered", time: "Jan 15, 02:00 PM" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"bookings" | "alerts">("bookings");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  if (selectedBooking) {
    const b = selectedBooking;
    const statusIdx = { pending: 1, confirmed: 2, assigned: 3, ready: 5 }[b.status];
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b-4 border-cavalo-yellow py-4 px-4 sm:px-6 sticky top-0 z-40 shadow-sm">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <button onClick={() => setSelectedBooking(null)} className="text-gray-500 hover:text-navy"><ArrowLeft className="w-5 h-5" /></button>
            <h1 className="text-navy font-bold text-lg flex-1">{b.id}</h1>
            <Badge className={statusConfig[b.status].color + " border"}>{statusConfig[b.status].label}</Badge>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
          <div className="cavalo-card p-6">
            <h2 className="font-semibold text-navy mb-6">Booking Timeline</h2>
            <div className="space-y-0">
              {timeline.map((t, i) => {
                const state = i < statusIdx ? "done" : i === statusIdx ? "active" : "future";
                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {state === "done" && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                      {state === "active" && <Clock className="w-6 h-6 text-cavalo-yellow" />}
                      {state === "future" && <Circle className="w-6 h-6 text-gray-300" />}
                      {i < timeline.length - 1 && <div className={`w-0.5 h-12 ${i < statusIdx ? "bg-green-500" : "bg-gray-200"}`} />}
                    </div>
                    <div className="pt-0.5 pb-12">
                      <div className={`font-medium text-sm ${state === "future" ? "text-gray-400" : "text-navy"}`}>{t.label}</div>
                      <div className="text-gray-500 text-xs">{t.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="cavalo-card p-6">
            <h2 className="font-semibold text-navy mb-4">Truck Details</h2>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              {[{ label: "Brand & Model", value: `${b.brand} ${b.model}` }, { label: "RTO Number", value: b.rto }, { label: "GVW Category", value: b.gvw }, { label: "Inspection Date", value: b.date }, { label: "Time Slot", value: "11 AM - 1 PM" }, { label: "City", value: b.city }, { label: "Inspection Fee", value: `₹${b.fee}` }].map((d) => (
                <div key={d.label} className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">{d.label}</span><span className="font-medium text-navy">{d.value}</span></div>
              ))}
            </div>
          </div>
          {b.inspector && (
            <div className="cavalo-card p-6">
              <h2 className="font-semibold text-navy mb-4">Assigned Inspector</h2>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-cavalo-yellow-light rounded-full flex items-center justify-center"><User className="w-6 h-6 text-cavalo-yellow" /></div>
                <div className="flex-1"><div className="font-semibold text-navy">{b.inspector.name}</div><div className="flex items-center gap-1 text-sm"><Star className="w-4 h-4 text-cavalo-yellow fill-cavalo-yellow" /><span className="text-gray-600">{b.inspector.rating} rating</span></div></div>
                <a href={`tel:${b.inspector.phone.replace(/\s/g, "")}`} className="text-cavalo-yellow hover:text-cavalo-yellow-dark"><Phone className="w-5 h-5" /></a>
              </div>
            </div>
          )}
          {b.score && (
            <div className="cavalo-card p-6">
              <h2 className="font-semibold text-navy mb-4">Inspection Score</h2>
              <div className="flex items-center gap-6">
                <div className="text-center"><div className="text-5xl font-bold text-green-600">{b.score}</div><div className="text-gray-500 text-sm">out of 100</div></div>
                <div className="flex-1"><Badge className="bg-green-100 text-green-700 border border-green-200">Recommended</Badge><button onClick={() => router.push(`/report/${b.id}`)} className="btn-cavalo block mt-3 py-2 px-4 text-sm">View Full Report</button></div>
              </div>
            </div>
          )}
          <div className="cavalo-card p-6">
            <h2 className="font-semibold text-navy mb-4">WhatsApp Alert History</h2>
            <div className="space-y-3">
              {allAlerts.filter((a) => a.booking === b.id).map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                  <div className="flex-1"><div className="whatsapp-bubble p-3 text-sm text-gray-800 max-w-md">{a.msg}</div><div className="text-gray-400 text-xs mt-1">{a.time}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-30">
        <div className="p-4 border-b border-gray-200 flex items-center gap-2">
          <div className="w-8 h-8 bg-cavalo-yellow rounded flex items-center justify-center"><Truck className="w-5 h-5 text-navy" /></div>
          <span className="text-navy font-bold text-sm">CAVALO Moolyankann</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { icon: FileText, label: "My Bookings", active: true },
            { icon: Plus, label: "New Booking", onClick: () => router.push("/book") },
            { icon: CheckCircle2, label: "Reports" },
            { icon: Bell, label: "Alerts" },
          ].map((item, i) => (
            <button key={i} onClick={item.onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition ${item.active ? "bg-cavalo-yellow text-navy" : "text-gray-600 hover:bg-gray-100"}`}>
              <item.icon className="w-4 h-4" /> {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-gray-600 hover:bg-gray-100 transition"><Settings className="w-4 h-4" /> Settings</button>
          <button onClick={() => router.push("/")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-gray-600 hover:bg-gray-100 transition"><LogOut className="w-4 h-4" /> Logout</button>
        </div>
      </aside>

      <div className="flex-1 md:ml-60">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div><h1 className="text-xl font-bold text-navy">My Bookings</h1><p className="text-gray-500 text-sm">Welcome back, Rajesh</p></div>
          <button onClick={() => router.push("/book")} className="btn-cavalo text-sm px-4 py-2 inline-flex items-center gap-1"><Plus className="w-4 h-4" /> New Booking</button>
        </header>
        <div className="p-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Bookings", value: mockBookings.length, color: "text-navy", bg: "bg-gray-50" },
              { label: "Reports Ready", value: mockBookings.filter((b) => b.status === "ready").length, color: "text-green-600", bg: "bg-green-50" },
              { label: "In Progress", value: mockBookings.filter((b) => b.status === "assigned" || b.status === "confirmed").length, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Pending Payment", value: mockBookings.filter((b) => b.status === "pending").length, color: "text-yellow-600", bg: "bg-yellow-50" },
            ].map((c, i) => (
              <div key={i} className={`cavalo-card p-4 ${c.bg}`}><div className={`text-2xl font-bold ${c.color}`}>{c.value}</div><div className="text-gray-500 text-sm">{c.label}</div></div>
            ))}
          </div>
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button onClick={() => setActiveTab("bookings")} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${activeTab === "bookings" ? "border-cavalo-yellow text-navy" : "border-transparent text-gray-500 hover:text-navy"}`}>All Bookings</button>
            <button onClick={() => setActiveTab("alerts")} className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${activeTab === "alerts" ? "border-cavalo-yellow text-navy" : "border-transparent text-gray-500 hover:text-navy"}`}>WhatsApp Alerts</button>
          </div>
          {activeTab === "bookings" && (
            <div className="space-y-3">
              {mockBookings.map((b) => (
                <button key={b.id} onClick={() => setSelectedBooking(b)} className="w-full cavalo-card p-4 flex items-center gap-4 text-left">
                  <div className="w-12 h-12 bg-cavalo-yellow-light rounded-lg flex items-center justify-center flex-shrink-0"><Truck className="w-6 h-6 text-cavalo-yellow" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="font-semibold text-navy text-sm">{b.brand} {b.model}</span><Badge className={statusConfig[b.status].color + " border text-xs"}>{statusConfig[b.status].label}</Badge></div>
                    <div className="text-gray-500 text-xs mt-1 flex items-center gap-3 flex-wrap"><span>{b.id}</span><span>{b.rto}</span><span>{b.gvw}</span><span>{b.date}</span><span>{b.city}</span></div>
                  </div>
                  {b.score && <div className="text-right flex-shrink-0"><div className="text-2xl font-bold text-green-600">{b.score}</div><div className="text-gray-400 text-xs">score</div></div>}
                </button>
              ))}
            </div>
          )}
          {activeTab === "alerts" && (
            <div className="cavalo-card p-6">
              <div className="space-y-3">
                {allAlerts.map((a, i) => (
                  <div key={i} className="flex items-start gap-3 border-b border-gray-100 pb-3 last:border-0">
                    <MessageCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2"><span className="font-medium text-navy text-sm">{a.booking}</span><span className="text-gray-400 text-xs">{a.time}</span></div>
                      <div className="whatsapp-bubble p-3 text-sm text-gray-800 max-w-md mt-1">{a.msg}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
