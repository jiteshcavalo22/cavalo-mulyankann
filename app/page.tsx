"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Truck, Search, Play, Pause, Volume2, VolumeX, CheckCircle2,
  ArrowRight, Phone, MessageCircle, Bot, Send, User, CreditCard,
  Ticket, TrendingUp, Smartphone, Shield, FileText, Camera, Star,
  ChevronLeft, ChevronRight, ChevronDown, Bell, Award, Zap, X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/cavalo/Navbar";
import Footer from "@/components/cavalo/Footer";
import ProcessVideoSection from "@/components/cavalo/ProcessVideoSection";
import HeroProcessPreview from "@/components/cavalo/HeroProcessPreview";
import HeroBookingWidget from "@/components/booking/HeroBookingWidget";
import HowItWorksSection from "@/components/cavalo/HowItWorksSection";

const slides = [
  {
    video: "https://videos.pexels.com/video-files/4364226/4364226-uhd_2560_1440_30fps.mp4",
    heading: "Buy Your Next Truck",
    accent: "With Confidence",
    subtext: "150+ point inspection by certified engineers across 200+ Indian cities.",
  },
  {
    video: "https://videos.pexels.com/video-files/8154986/8154986-uhd_2560_1440_25fps.mp4",
    heading: "Certified Inspectors",
    accent: "Across 200+ Cities",
    subtext: "Trusted by NBFCs, commercial vehicle financiers and fleet owners nationwide.",
  },
  {
    video: "https://videos.pexels.com/video-files/3121422/3121422-uhd_2560_1440_30fps.mp4",
    heading: "Instant Reports",
    accent: "On WhatsApp",
    subtext: "Detailed inspection report delivered straight to your WhatsApp in 30 minutes.",
  },
  {
    video: "/videos/cavalo-process.mp4",
    fallback: "https://videos.pexels.com/video-files/4364226/4364226-uhd_2560_1440_30fps.mp4",
    heading: "Watch the Full",
    accent: "Booking Process",
    subtext: "See every step — verify, pay, inspector visit and WhatsApp report — in under 2 minutes.",
    isProcessSlide: true,
  },
];

const gvwPricing = [
  { cat: "C1", range: "Up to 7.5T", price: 1299 },
  { cat: "C2", range: "7.5T - 12T", price: 1599 },
  { cat: "C3", range: "12T - 25T", price: 1899 },
  { cat: "C4", range: "25T+", price: 2599 },
];


const usps = [
  { icon: TrendingUp, title: "GVW-Based Pricing", desc: "Pay only for your vehicle's weight category. Fair, transparent pricing with no hidden charges." },
  { icon: CreditCard, title: "Secure Payments", desc: "Razorpay, UPI, cards, WhatsApp payment link, or bank transfer." },
  { icon: Ticket, title: "Coupon Codes", desc: "Fleet discounts and first-time offers. Use FLEET20 for 20% off on multi-truck bookings." },
  { icon: Smartphone, title: "Partner Inspector App", desc: "Inspectors use our dedicated app for a consistent 150+ point checklist on every truck." },
  { icon: MessageCircle, title: "WhatsApp-First", desc: "Booking, alerts and reports powered by the official WhatsApp Business API." },
  { icon: Bot, title: "AI Assistant", desc: "24/7 AI chatbot to answer questions, explain pricing, and guide you through booking." },
];

const faqs = [
  { q: "How does the inspection work?", a: "Our certified inspector visits the truck location and conducts a 150+ point checklist covering engine, chassis, tyres, electricals, body and documents. The full report with photos is delivered via WhatsApp within 30 minutes of completion." },
  { q: "What is GVW-based pricing?", a: "GVW (Gross Vehicle Weight) determines inspection complexity. C1 covers up to 7.5T, C2 covers 7.5-12T, C3 covers 12-25T, and C4 covers 25T+. Heavier vehicles require more detailed checks, hence tiered pricing." },
  { q: "What payment methods do you accept?", a: "We accept UPI, debit/credit cards, and net banking via Razorpay. You can also pay through a secure WhatsApp payment link or bank transfer. Apply coupon codes like FLEET20 at checkout." },
  { q: "How long does the report take?", a: "The on-site inspection takes 1-2 hours depending on vehicle category. The full report is compiled and delivered to your WhatsApp within 30 minutes of inspection completion." },
  { q: "Are reports accepted by banks?", a: "Yes. Our reports are accepted by leading NBFCs and commercial vehicle financiers across India for loan assessment, vehicle valuation and pre-purchase due diligence." },
  { q: "Do you offer a quality guarantee?", a: "100% guarantee. If any major issue is missed in the report, we offer a free re-inspection within 24 hours of the original report delivery." },
  { q: "Can I book for a fleet of trucks?", a: "Absolutely. Use the multiple trucks toggle on the booking page to add as many trucks as needed. Fleet owners get special coupon codes like FLEET20 for 20% off." },
  { q: "How do WhatsApp updates work?", a: "We use the official WhatsApp Business API via Interakt. You receive booking confirmation, inspector assignment, live status updates and the final report as WhatsApp messages from our verified business account." },
];

export default function Home() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progressKey, setProgressKey] = useState(0);
  const [heroVideoFallback, setHeroVideoFallback] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([{ role: "bot", text: "Hi! I am Cavalo AI. How can I help you with your truck inspection today?" }]);
  const [aiInput, setAiInput] = useState("");

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % slides.length);
      setProgressKey((k) => k + 1);
    }, 7000);
    return () => clearInterval(timer);
  }, [isPlaying, currentSlide]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      if (isPlaying) videoRef.current.play().catch(() => {});
      else videoRef.current.pause();
    }
  }, [isPlaying, isMuted, currentSlide]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) videoRef.current.muted = !isMuted;
  };

  const sendAiMessage = () => {
    if (!aiInput.trim()) return;
    setAiMessages([...aiMessages, { role: "user", text: aiInput }, { role: "bot", text: "I can help you book a truck inspection, explain GVW pricing, or answer questions about our 150+ point checklist. Would you like to book now or learn more?" }]);
    setAiInput("");
  };

  const currentHeroSlide = slides[currentSlide];
  const heroVideoSrc =
    currentHeroSlide.isProcessSlide && heroVideoFallback && "fallback" in currentHeroSlide
      ? currentHeroSlide.fallback
      : currentHeroSlide.video;

  useEffect(() => {
    setHeroVideoFallback(false);
  }, [currentSlide]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO VIDEO CAROUSEL */}
      <section className="relative min-h-[600px] lg:min-h-screen flex items-center overflow-hidden bg-navy">
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            key={`${currentSlide}-${heroVideoSrc}`}
            src={heroVideoSrc}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
            onError={() => {
              if (currentHeroSlide.isProcessSlide) {
                setHeroVideoFallback(true);
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/80 to-navy/30" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10 z-20">
          <div key={progressKey} className={`h-full bg-cavalo-yellow ${isPlaying ? "animate-progress" : ""}`} />
        </div>

        <div className="relative z-10 cavalo-container py-12 lg:py-0 w-full">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left column */}
            <div className="text-white space-y-6">
              <div className="inline-flex items-center gap-2 bg-cavalo-yellow/20 border border-cavalo-yellow/40 rounded-full px-4 py-1.5">
                <Star className="w-4 h-4 text-cavalo-yellow fill-cavalo-yellow" />
                <span className="text-sm font-medium">India&apos;s #1 Truck Inspection Platform</span>
              </div>
              <div key={`heading-${currentSlide}`} className="animate-fade-up">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  {currentHeroSlide.heading}{" "}
                  <span className="text-cavalo-yellow">{currentHeroSlide.accent}</span>
                </h1>
                <p className="text-white/70 text-lg mt-4 max-w-md">{currentHeroSlide.subtext}</p>
              </div>

              <HeroProcessPreview />

              <div className="flex gap-6 flex-wrap">
                {[{ v: "5000+", l: "Inspected" }, { v: "200+", l: "Cities" }, { v: "98%", l: "Satisfaction" }].map((s, i) => (
                  <div key={i}>
                    <div className="text-3xl font-bold text-cavalo-yellow">{s.v}</div>
                    <div className="text-sm text-white/60">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                {gvwPricing.map((g) => (
                  <div key={g.cat} className="bg-white/10 backdrop-blur border border-white/20 rounded-full px-3 py-1.5">
                    <span className="text-cavalo-yellow font-bold text-sm">{g.cat}</span>
                    <span className="text-white/80 text-sm ml-1">₹{g.price}</span>
                  </div>
                ))}
                <div className="bg-cavalo-yellow rounded-full px-3 py-1.5"><span className="text-navy text-sm font-bold">Secure Pay</span></div>
              </div>
              <div className="flex gap-3 flex-wrap pt-2">
                <button onClick={() => router.push("/book")} className="btn-cavalo inline-flex items-center gap-2 px-6 py-3 text-base">
                  Book Inspection <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => document.getElementById("process-video")?.scrollIntoView({ behavior: "smooth" })} className="border-2 border-white/40 text-white hover:bg-white/10 rounded px-6 py-3 text-base font-semibold transition">
                  Watch Process
                </button>
              </div>
            </div>

            {/* Right — Booking flow entry */}
            <HeroBookingWidget />
          </div>
        </div>

        {/* Carousel controls */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-center gap-4">
          <button onClick={() => { setCurrentSlide((p) => (p - 1 + slides.length) % slides.length); setProgressKey((k) => k + 1); }} className="text-white/60 hover:text-white"><ChevronLeft className="w-6 h-6" /></button>
          <div className="flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentSlide(i);
                  setProgressKey((k) => k + 1);
                }}
                className={`h-2 rounded-full transition-all ${i === currentSlide ? "w-8 bg-cavalo-yellow" : "w-2 bg-white/40"}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
          <button onClick={() => { setIsPlaying(!isPlaying); setProgressKey((k) => k + 1); }} className="text-white/60 hover:text-white">{isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}</button>
          <button onClick={toggleMute} className="text-white/60 hover:text-white">{isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}</button>
          <button onClick={() => { setCurrentSlide((p) => (p + 1) % slides.length); setProgressKey((k) => k + 1); }} className="text-white/60 hover:text-white"><ChevronRight className="w-6 h-6" /></button>
        </div>
      </section>

      {/* PROCESS VIDEO — See How It Works (Tesla-style) */}
      <ProcessVideoSection />

      {/* STATS BAND */}
      <section className="bg-navy py-6 border-b-4 border-cavalo-yellow">
        <div className="cavalo-container">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {[{ v: "₹2L-₹40L", l: "Price Range" }, { v: "5000+", l: "Vehicles Inspected" }, { v: "Pan-India", l: "Coverage" }, { v: "24-48hrs", l: "Report Delivery" }, { v: "150+ Point", l: "Checklist" }].map((s, i) => (
              <div key={i}>
                <div className="text-cavalo-yellow text-xl md:text-2xl font-bold">{s.v}</div>
                <div className="text-white/70 text-xs md:text-sm">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <HowItWorksSection />

      {/* GVW PRICING */}
      <section id="pricing" className="py-20 bg-white">
        <div className="cavalo-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy">GVW-Based Pricing</h2>
            <div className="w-16 h-1 bg-cavalo-yellow mx-auto mt-3 rounded" />
            <p className="text-gray-500 mt-3">Transparent pricing based on your truck&apos;s gross vehicle weight</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {gvwPricing.map((g) => (
              <div key={g.cat} className={`cavalo-card p-6 ${g.cat === "C2" ? "border-2 border-cavalo-yellow" : ""}`}>
                {g.cat === "C2" && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cavalo-yellow text-navy text-xs font-bold px-3 py-1 rounded">Popular</div>}
                <div className="text-center">
                  <div className="text-3xl font-bold text-navy">{g.cat}</div>
                  <div className="text-gray-500 text-sm mt-1">{g.range}</div>
                  <div className="mt-4"><span className="text-4xl font-bold text-cavalo-yellow">₹{g.price}</span></div>
                  <div className="text-gray-400 text-xs mt-1">One-time inspection fee</div>
                </div>
                <div className="mt-6 space-y-2">
                  {["150+ Point Checklist", "Certified Inspector", "Photo Documentation", "WhatsApp Report", "PDF Certificate"].map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-cavalo-yellow flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{f}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => router.push("/book")} className="btn-cavalo w-full mt-6 py-2.5 text-sm">Book {g.cat} Inspection</button>
              </div>
            ))}
          </div>
          <div className="mt-10 bg-navy rounded-lg p-6 flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cavalo-yellow rounded-lg flex items-center justify-center flex-shrink-0"><CreditCard className="w-6 h-6 text-navy" /></div>
              <div>
                <h3 className="text-white font-semibold text-lg">Secure Online Payment</h3>
                <p className="text-white/60 text-sm">Pay via Razorpay — UPI, cards, net banking, or WhatsApp payment link</p>
              </div>
            </div>
            <button onClick={() => router.push("/book")} className="btn-cavalo px-6 py-2.5 text-sm">Book &amp; Pay Now</button>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section id="why-us" className="py-20 bg-gray-50">
        <div className="cavalo-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy">Why Choose Cavalo Moolyankann</h2>
            <div className="w-16 h-1 bg-cavalo-yellow mx-auto mt-3 rounded" />
            <p className="text-gray-500 mt-3">Built for India&apos;s commercial vehicle ecosystem</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {usps.map((usp, i) => (
              <div key={i} className="cavalo-card p-6">
                <div className="w-12 h-12 bg-cavalo-yellow-light rounded-lg flex items-center justify-center mb-4"><usp.icon className="w-6 h-6 text-cavalo-yellow" /></div>
                <h3 className="text-navy font-semibold text-lg mb-2">{usp.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{usp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHATSAPP PREVIEW */}
      <section className="py-20 bg-navy">
        <div className="cavalo-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Stay Updated on WhatsApp</h2>
              <div className="w-16 h-1 bg-cavalo-yellow mb-6 rounded" />
              <div className="space-y-4">
                {[
                  { title: "Booking Confirmed", msg: "Your inspection is booked for Jan 15, 11 AM. Ref: CV-20491" },
                  { title: "Inspector Assigned", msg: "Rajesh Kumar (4.8 star) has been assigned. Contact: +91 98765 43210" },
                  { title: "Report Ready", msg: "Your report is ready! Score: 88/100. Tap to view full PDF." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-cavalo-yellow rounded-full mt-1.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="text-white font-medium text-sm mb-1">{item.title}</div>
                      <div className="whatsapp-bubble p-3 text-sm text-gray-800 max-w-sm">{item.msg}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="max-w-xs mx-auto">
              <div className="bg-gray-900 rounded-[2rem] p-2 shadow-2xl">
                <div className="bg-green-600 rounded-t-[1.5rem] px-4 py-3 flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"><Truck className="w-4 h-4 text-white" /></div>
                  <div>
                    <div className="text-white text-sm font-semibold">Cavalo Moolyankann</div>
                    <div className="text-white/70 text-xs">Official Business Account</div>
                  </div>
                </div>
                <div className="bg-[#e5ddd5] rounded-b-[1.5rem] p-3 space-y-3 min-h-[300px]">
                  {["Your inspection is booked for Jan 15, 11 AM. Ref: CV-20491", "Rajesh Kumar (4.8 star) assigned. Contact: +91 98765 43210", "Report ready! Score: 88/100. Tap to view full PDF."].map((msg, i) => (
                    <div key={i} className="whatsapp-bubble p-3 text-sm text-gray-800">
                      {msg}
                      <div className="text-gray-400 text-xs text-right mt-1">10:3{i} AM checkmark</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="cavalo-container max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy">Frequently Asked Questions</h2>
            <div className="w-16 h-1 bg-cavalo-yellow mx-auto mt-3 rounded" />
            <p className="text-gray-500 mt-3">Everything you need to know about truck inspection</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className={`cavalo-card cursor-pointer ${activeFaq === i ? "border-2 border-cavalo-yellow" : ""}`} onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                <div className="flex items-center justify-between p-4">
                  <span className={`font-medium text-sm ${activeFaq === i ? "text-cavalo-yellow" : "text-navy"}`}>{faq.q}</span>
                  <button className={`flex-shrink-0 ml-2 ${activeFaq === i ? "text-cavalo-yellow" : "text-gray-400"}`}>
                    <ChevronDown className={`w-5 h-5 transition-transform ${activeFaq === i ? "rotate-180" : ""}`} />
                  </button>
                </div>
                {activeFaq === i && <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">{faq.a}</div>}
              </div>
            ))}
          </div>
          <div className="cavalo-card mt-8 p-6 text-center">
            <h3 className="text-navy font-semibold text-lg mb-4">Still have questions?</h3>
            <div className="flex gap-3 justify-center">
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded px-5 py-2.5 text-sm inline-flex items-center gap-2 transition"><MessageCircle className="w-4 h-4" /> WhatsApp Us</a>
              <a href="tel:+917021411346" className="btn-cavalo-outline inline-flex items-center gap-2 text-sm"><Phone className="w-4 h-4" /> Call Us</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section id="contact" className="bg-cavalo-yellow py-16">
        <div className="cavalo-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Ready to Inspect Your Truck?</h2>
          <p className="text-navy/70 mb-8">Join 5000+ satisfied customers who inspected with Cavalo Moolyankann</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => router.push("/book")} className="bg-navy hover:bg-navy-light text-white font-bold rounded px-8 py-3 transition inline-flex items-center gap-2">Book Inspection Now <ArrowRight className="w-4 h-4" /></button>
            <a href="tel:+917021411346" className="border-2 border-navy text-navy hover:bg-navy hover:text-white font-semibold rounded px-8 py-3 transition inline-flex items-center gap-2"><Phone className="w-4 h-4" /> Call Us</a>
          </div>
        </div>
      </section>

      <Footer />

      {/* FLOATING BUTTONS */}
      <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="fixed bottom-24 right-6 z-40 w-12 h-12 bg-green-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition">
        <MessageCircle className="w-6 h-6 text-white" />
      </a>
      <div className="fixed bottom-6 right-6 z-40">
        {aiChatOpen && (
          <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
            <div className="bg-navy px-4 py-3 flex items-center gap-2">
              <Bot className="w-5 h-5 text-cavalo-yellow" />
              <div><div className="text-white text-sm font-semibold">Cavalo AI</div><div className="text-white/60 text-xs">Always online</div></div>
              <button onClick={() => setAiChatOpen(false)} className="ml-auto text-white/60 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="bg-gray-50 p-4 h-64 overflow-y-auto space-y-3">
              {aiMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] p-2.5 rounded text-sm ${msg.role === "user" ? "bg-cavalo-yellow text-navy" : "bg-white border border-gray-200 text-gray-800"}`}>{msg.text}</div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 p-3 flex gap-2">
              <Input value={aiInput} onChange={(e) => setAiInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendAiMessage()} placeholder="Ask anything..." className="flex-1" />
              <button onClick={sendAiMessage} className="bg-cavalo-yellow hover:bg-cavalo-yellow-dark w-9 h-9 rounded flex items-center justify-center transition"><Send className="w-4 h-4 text-navy" /></button>
            </div>
          </div>
        )}
        <button onClick={() => setAiChatOpen(!aiChatOpen)} className="w-12 h-12 bg-navy rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition">
          <Bot className="w-6 h-6 text-cavalo-yellow" />
        </button>
      </div>
    </div>
  );
}
