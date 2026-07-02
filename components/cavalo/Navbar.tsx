"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Menu, X, ChevronDown, Truck, Phone, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

const navLinks = [
  { label: "New Truck", hasDropdown: true },
  { label: "Used Truck", hasDropdown: true },
  { label: "Electric Vehicles", hasDropdown: false },
  { label: "3 Wheelers", hasDropdown: false },
  { label: "On Road Price", hasDropdown: false },
  { label: "Finance", hasDropdown: true },
  { label: "More", hasDropdown: true },
];

export default function Navbar() {
  const router = useRouter();
  const { isLoggedIn, user, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="w-full bg-white sticky top-0 z-50 shadow-sm">
      {/* Top bar — logo + search + actions */}
      <div className="border-b border-gray-100">
        <div className="cavalo-container py-3 flex items-center gap-4">
          {/* Logo */}
          <div className="flex flex-col cursor-pointer flex-shrink-0" onClick={() => router.push("/")}>
            <div className="flex items-center gap-1">
              {/* Cavalo-style logo: truck icon + CAVALO text */}
              <div className="relative">
                <span className="text-2xl font-black tracking-tight text-navy italic">CAVALO</span>
                <div className="absolute -top-1 -right-3 w-4 h-4">
                  <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-cavalo-yellow transform rotate-45" />
                </div>
              </div>
            </div>
            <span className="text-[9px] text-gray-400 font-medium -mt-0.5 leading-none">Moolyankann · The wheels of happiness</span>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-xl hidden sm:flex relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for Trucks.. e.g TATA"
              className="w-full border border-gray-300 rounded-l-md px-4 py-2 text-sm focus:outline-none focus:border-cavalo-yellow"
            />
            <button className="bg-cavalo-yellow hover:bg-cavalo-yellow-dark px-4 rounded-r-md flex items-center justify-center transition">
              <Search className="w-4 h-4 text-navy" />
            </button>
          </div>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-3">
            <a href="tel:+917021411346" className="hidden md:flex items-center gap-1.5 text-sm text-gray-600 hover:text-cavalo-yellow transition">
              <Phone className="w-4 h-4" />
              <span className="font-medium">+91 70214 11346</span>
            </a>
            {!isLoading && isLoggedIn ? (
              <button
                onClick={() => router.push("/dashboard")}
                className="hidden items-center gap-1.5 text-sm font-medium text-gray-700 transition hover:text-cavalo-yellow sm:inline-flex"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </button>
            ) : (
              <button
                onClick={() => router.push("/auth/login")}
                className="hidden text-sm font-medium text-gray-700 transition hover:text-cavalo-yellow sm:block"
              >
                Login
              </button>
            )}
            {isLoggedIn && user ? (
              <span className="hidden text-xs font-medium text-gray-500 md:inline">
                Hi, {user.name.split(" ")[0]}
              </span>
            ) : null}
            <button onClick={() => router.push("/book")} className="btn-cavalo text-sm px-4 py-2 hidden sm:block">
              Book Inspection
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="sm:hidden text-gray-600">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom nav row */}
      <div className="border-b border-gray-200 hidden sm:block">
        <div className="cavalo-container">
          <nav className="flex items-center gap-0">
            {navLinks.map((link) => (
              <button
                key={link.label}
                className="flex items-center gap-1 px-3 py-3 text-sm font-medium text-gray-700 hover:text-cavalo-yellow hover:border-b-2 hover:border-cavalo-yellow transition-all whitespace-nowrap"
              >
                {link.label}
                {link.hasDropdown && <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="p-4 border-b border-gray-100">
            <div className="flex">
              <input
                type="text"
                placeholder="Search for Trucks..."
                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm focus:outline-none"
              />
              <button className="bg-cavalo-yellow px-3 rounded-r-md"><Search className="w-4 h-4 text-navy" /></button>
            </div>
          </div>
          {navLinks.map((link) => (
            <button key={link.label} className="w-full text-left px-4 py-3 text-sm text-gray-700 border-b border-gray-50 hover:bg-cavalo-yellow-light hover:text-navy flex items-center justify-between">
              {link.label}
              {link.hasDropdown && <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
          ))}
          <div className="flex gap-3 p-4">
            {!isLoading && isLoggedIn ? (
              <button
                onClick={() => { router.push("/dashboard"); setMobileOpen(false); }}
                className="flex flex-1 items-center justify-center gap-1.5 rounded border border-gray-300 py-2 text-sm font-medium"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </button>
            ) : (
              <button
                onClick={() => { router.push("/auth/login"); setMobileOpen(false); }}
                className="flex-1 rounded border border-gray-300 py-2 text-sm font-medium"
              >
                Login
              </button>
            )}
            <button onClick={() => { router.push("/book"); setMobileOpen(false); }} className="btn-cavalo flex-1 py-2 text-sm">
              Book Inspection
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
