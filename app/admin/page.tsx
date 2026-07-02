"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Truck, Search, Users, IndianRupee, FileText, Star,
  LogOut, LayoutDashboard, Ticket, ToggleLeft, ToggleRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const mockBookings = [
  { id: "CV-20491", brand: "Tata Prima", rto: "MH01", gvw: "C3", date: "Jan 15", city: "Mumbai", status: "ready", amount: 2241 },
  { id: "CV-20512", brand: "Ashok Leyland Dost", rto: "KA05", gvw: "C1", date: "Jan 18", city: "Bengaluru", status: "assigned", amount: 1533 },
  { id: "CV-20530", brand: "Eicher Pro 2049", rto: "DL01", gvw: "C2", date: "Jan 22", city: "Delhi", status: "confirmed", amount: 1887 },
  { id: "CV-20545", brand: "BharatBenz 1217R", rto: "TN01", gvw: "C4", date: "Jan 25", city: "Chennai", status: "pending", amount: 3068 },
  { id: "CV-20560", brand: "Mahindra Blazo", rto: "GJ01", gvw: "C3", date: "Jan 28", city: "Ahmedabad", status: "ready", amount: 2241 },
  { id: "CV-20571", brand: "Volvo FM", rto: "RJ01", gvw: "C4", date: "Jan 30", city: "Jaipur", status: "confirmed", amount: 3068 },
];

const inspectors = [
  { name: "Rajesh Kumar", rating: 4.8, assigned: 12, phone: "+91 98765 43210" },
  { name: "Suresh Patel", rating: 4.6, assigned: 8, phone: "+91 90000 12345" },
  { name: "Amit Singh", rating: 4.7, assigned: 10, phone: "+91 88000 56789" },
  { name: "Mohammed Khan", rating: 4.5, assigned: 6, phone: "+91 77000 98765" },
];

const revenueData = [
  { month: "Aug", revenue: 85000 }, { month: "Sep", revenue: 102000 },
  { month: "Oct", revenue: 128000 }, { month: "Nov", revenue: 145000 },
  { month: "Dec", revenue: 168000 }, { month: "Jan", revenue: 195000 },
];

const coupons = [
  { code: "FLEET20", discount: "20%", usage: 45, active: true },
  { code: "CAVALO10", discount: "10%", usage: 128, active: true },
  { code: "FIRST15", discount: "15%", usage: 87, active: true },
];

const statusConfig: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-700 border-blue-200",
  assigned: "bg-orange-100 text-orange-700 border-orange-200",
  ready: "bg-green-100 text-green-700 border-green-200",
};

export default function AdminPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [couponStates, setCouponStates] = useState(coupons.map((c) => c.active));

  const filteredBookings = mockBookings.filter((b) => {
    const matchesSearch = b.id.toLowerCase().includes(search.toLowerCase()) || b.brand.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar — Cavalo style: white bg */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-30">
        <div className="p-4 border-b border-gray-200 flex items-center gap-2">
          <div className="w-8 h-8 bg-cavalo-yellow rounded flex items-center justify-center"><Truck className="w-5 h-5 text-navy" /></div>
          <div><div className="text-navy font-bold text-sm">CAVALO Moolyankann</div><div className="text-gray-400 text-xs">Admin Panel</div></div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium bg-cavalo-yellow text-navy"><LayoutDashboard className="w-4 h-4" /> Dashboard</button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-gray-600 hover:bg-gray-100 transition"><FileText className="w-4 h-4" /> Bookings</button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-gray-600 hover:bg-gray-100 transition"><Users className="w-4 h-4" /> Inspectors</button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-gray-600 hover:bg-gray-100 transition"><Ticket className="w-4 h-4" /> Coupons</button>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button onClick={() => router.push("/")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm text-gray-600 hover:bg-gray-100 transition"><LogOut className="w-4 h-4" /> Exit Admin</button>
        </div>
      </aside>

      <div className="flex-1 md:ml-60">
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-20">
          <h1 className="text-xl font-bold text-navy">Admin Dashboard</h1>
        </header>
        <div className="p-4 sm:px-6 lg:px-8 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: FileText, label: "Total Bookings", value: "6", color: "text-navy", bg: "bg-gray-50" },
              { icon: IndianRupee, label: "Revenue", value: "₹2.1L", color: "text-cavalo-yellow", bg: "bg-cavalo-yellow-light" },
              { icon: Users, label: "Inspectors Active", value: "4", color: "text-blue-600", bg: "bg-blue-50" },
              { icon: FileText, label: "Reports Delivered", value: "2", color: "text-green-600", bg: "bg-green-50" },
            ].map((s, i) => (
              <div key={i} className={`cavalo-card p-4 ${s.bg}`}><s.icon className={`w-6 h-6 ${s.color} mb-2`} /><div className={`text-2xl font-bold ${s.color}`}>{s.value}</div><div className="text-gray-500 text-sm">{s.label}</div></div>
            ))}
          </div>

          {/* Revenue Chart */}
          <div className="cavalo-card p-6">
            <h2 className="font-semibold text-navy mb-4">Revenue (Last 6 Months)</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#666" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#666" }} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, "Revenue"]} contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                  <Bar dataKey="revenue" fill="#F5A623" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bookings table */}
          <div className="cavalo-card p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <h2 className="font-semibold text-navy">Bookings</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="pl-9 w-full sm:w-48" /></div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-200 rounded text-sm px-3 py-2 bg-white">
                  <option value="all">All</option><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="assigned">Assigned</option><option value="ready">Ready</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-200 text-left text-gray-500">
                  <th className="pb-3 font-medium">Ref</th><th className="pb-3 font-medium hidden sm:table-cell">Vehicle</th><th className="pb-3 font-medium hidden md:table-cell">RTO</th><th className="pb-3 font-medium hidden md:table-cell">Date</th><th className="pb-3 font-medium hidden lg:table-cell">City</th><th className="pb-3 font-medium">Amount</th><th className="pb-3 font-medium">Status</th>
                </tr></thead>
                <tbody>
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 font-medium text-navy">{b.id}</td><td className="py-3 hidden sm:table-cell text-gray-600">{b.brand}</td><td className="py-3 hidden md:table-cell text-gray-600">{b.rto}</td><td className="py-3 hidden md:table-cell text-gray-600">{b.date}</td><td className="py-3 hidden lg:table-cell text-gray-600">{b.city}</td><td className="py-3 font-medium text-cavalo-yellow">₹{b.amount}</td><td className="py-3"><Badge className={statusConfig[b.status] + " border capitalize text-xs"}>{b.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inspectors */}
          <div className="cavalo-card p-6">
            <h2 className="font-semibold text-navy mb-4">Inspector Management</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {inspectors.map((ins, i) => (
                <div key={i} className="flex items-center gap-3 border border-gray-200 rounded p-3">
                  <div className="w-10 h-10 bg-cavalo-yellow-light rounded-full flex items-center justify-center"><Users className="w-5 h-5 text-cavalo-yellow" /></div>
                  <div className="flex-1"><div className="font-medium text-navy text-sm">{ins.name}</div><div className="flex items-center gap-1 text-xs text-gray-500"><Star className="w-3 h-3 text-cavalo-yellow fill-cavalo-yellow" /> {ins.rating} - {ins.assigned} bookings</div></div>
                  <div className="text-xs text-gray-500 font-mono">{ins.phone}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Coupons */}
          <div className="cavalo-card p-6">
            <h2 className="font-semibold text-navy mb-4">Coupon Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-200 text-left text-gray-500"><th className="pb-3 font-medium">Code</th><th className="pb-3 font-medium">Discount</th><th className="pb-3 font-medium">Usage Count</th><th className="pb-3 font-medium">Status</th></tr></thead>
                <tbody>
                  {coupons.map((c, i) => (
                    <tr key={c.code} className="border-b border-gray-100">
                      <td className="py-3 font-mono font-medium text-cavalo-yellow">{c.code}</td><td className="py-3 text-gray-600">{c.discount}</td><td className="py-3 text-gray-600">{c.usage}</td>
                      <td className="py-3"><button onClick={() => setCouponStates((prev) => prev.map((s, idx) => (idx === i ? !s : s)))} className="flex items-center gap-2">{couponStates[i] ? <ToggleRight className="w-6 h-6 text-green-600" /> : <ToggleLeft className="w-6 h-6 text-gray-400" />}<span className={couponStates[i] ? "text-green-600 text-xs font-medium" : "text-gray-400 text-xs"}>{couponStates[i] ? "Active" : "Inactive"}</span></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
