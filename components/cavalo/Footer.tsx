"use client";

import { Facebook, Instagram, Linkedin, Twitter, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t-4 border-cavalo-yellow">
      <div className="cavalo-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1 — Logo + description */}
          <div>
            <div className="mb-3">
              <span className="text-2xl font-black tracking-tight text-navy italic">CAVALO</span>
              <div className="text-xs text-gray-400 font-medium">Moolyankann · The wheels of happiness</div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Welcome to Cavalo Moolyankann, India&apos;s trusted truck inspection platform.
              Get certified 150+ point inspections across 200+ cities. Fast, transparent, and WhatsApp-first.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="w-8 h-8 bg-gray-100 hover:bg-cavalo-yellow rounded flex items-center justify-center transition group">
                <Facebook className="w-4 h-4 text-gray-500 group-hover:text-navy" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-100 hover:bg-cavalo-yellow rounded flex items-center justify-center transition group">
                <Instagram className="w-4 h-4 text-gray-500 group-hover:text-navy" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-100 hover:bg-cavalo-yellow rounded flex items-center justify-center transition group">
                <Linkedin className="w-4 h-4 text-gray-500 group-hover:text-navy" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-100 hover:bg-cavalo-yellow rounded flex items-center justify-center transition group">
                <Twitter className="w-4 h-4 text-gray-500 group-hover:text-navy" />
              </a>
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div>
            <h3 className="text-cavalo-yellow font-semibold text-sm uppercase tracking-wide mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {["All Brands", "New Inspection", "Used Truck Inspection", "Fleet Inspection", "Vehicle Requirement", "Compare"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-500 text-sm hover:text-cavalo-yellow transition">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — More Links */}
          <div>
            <h3 className="text-cavalo-yellow font-semibold text-sm uppercase tracking-wide mb-4">More Links</h3>
            <ul className="space-y-2.5">
              {["Inspection Loan", "On Road Price", "Become a Partner Inspector", "EMI Calculator", "About Us", "Contact Us"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-500 text-sm hover:text-cavalo-yellow transition">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Connect */}
          <div>
            <h3 className="text-cavalo-yellow font-semibold text-sm uppercase tracking-wide mb-4">Connect with Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-cavalo-yellow mt-0.5 flex-shrink-0" />
                <a href="tel:+917021411346" className="text-gray-500 text-sm hover:text-cavalo-yellow transition">+91 7021411346</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-cavalo-yellow mt-0.5 flex-shrink-0" />
                <a href="mailto:info@cavalo.in" className="text-gray-500 text-sm hover:text-cavalo-yellow transition">info@cavalo.in</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-cavalo-yellow mt-0.5 flex-shrink-0" />
                <span className="text-gray-500 text-sm">Palaspe Phata, Panvel, Navi Mumbai, Maharashtra 410221</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="cavalo-container py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-xs">© 2026, CAVALO Moolyankann. Design &amp; Developed by <a href="#" className="text-cavalo-yellow font-semibold">Cavalo</a></p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-500 text-xs hover:text-cavalo-yellow transition">Privacy Policy</a>
            <span className="text-gray-300">|</span>
            <a href="#" className="text-gray-500 text-xs hover:text-cavalo-yellow transition">Terms and Conditions</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
