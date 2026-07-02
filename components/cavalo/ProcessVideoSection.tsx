"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Play, Pause, CheckCircle2, ArrowRight,
  UserCheck, CreditCard, Truck, Bell, FileText,
  PhoneCall, Shield,
} from "lucide-react";

/* ── Process steps: each maps to a video timestamp ──────────────── */
interface Step {
  id: number;
  icon: React.ElementType;
  title: string;
  caption: string;           // shown as video subtitle
  description: string;       // shown in left panel
  timestamp: number;         // seconds into video when this step is "active"
}

const steps: Step[] = [
  {
    id: 1,
    icon: UserCheck,
    title: "Register & Book",
    caption: "Sign up with mobile OTP and select your truck details in under 60 seconds.",
    description: "Create your account with just your mobile number. Choose your truck brand, GVW category, preferred date, city, and time slot — all in one quick form.",
    timestamp: 0,
  },
  {
    id: 2,
    icon: CreditCard,
    title: "Secure Payment",
    caption: "Pay via UPI, card, EMI or WhatsApp link — 100% secured by Razorpay.",
    description: "Multiple payment options: Razorpay, no-cost EMI on major bank cards (HDFC, ICICI, SBI, Axis), WhatsApp payment link, or manual bank transfer.",
    timestamp: 12,
  },
  {
    id: 3,
    icon: Bell,
    title: "Booking Confirmed on WhatsApp",
    caption: "Instant WhatsApp confirmation with your booking reference number.",
    description: "You receive an immediate WhatsApp message from our official Business Account with your booking reference, inspection date, city, and time slot details.",
    timestamp: 24,
  },
  {
    id: 4,
    icon: Shield,
    title: "Certified Inspector Assigned",
    caption: "Nearest certified engineer dispatched to your truck's location.",
    description: "Our system automatically matches the closest certified inspector to your location. You get their name, photo, rating, and direct phone number on WhatsApp.",
    timestamp: 36,
  },
  {
    id: 5,
    icon: Truck,
    title: "150+ Point Inspection",
    caption: "Thorough check of engine, chassis, tyres, electricals, cabin & documents.",
    description: "The inspector arrives and conducts a comprehensive 150+ point inspection covering all critical systems. Photos are captured at every checkpoint using our partner app.",
    timestamp: 48,
  },
  {
    id: 6,
    icon: FileText,
    title: "Report on WhatsApp",
    caption: "Detailed PDF report with score, photos and recommendations — in 30 minutes.",
    description: "Within 30 minutes of completing the inspection, you receive a full report on WhatsApp: overall score, per-category breakdown, photo gallery, and pass/fail checklist.",
    timestamp: 60,
  },
];

/* ── Video segments: Pexels videos for each process phase ───────── */
const processVideos = [
  "https://videos.pexels.com/video-files/4364226/4364226-uhd_2560_1440_30fps.mp4",
  "https://videos.pexels.com/video-files/8154986/8154986-uhd_2560_1440_25fps.mp4",
  "https://videos.pexels.com/video-files/3121422/3121422-uhd_2560_1440_30fps.mp4",
];

const STEP_DURATION = 4000; // ms per step auto-advance

export default function ProcessVideoSection() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [captionVisible, setCaptionVisible] = useState(true);
  const [barWidth, setBarWidth] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const barRef = useRef<NodeJS.Timeout | null>(null);

  /* Auto-advance steps */
  useEffect(() => {
    if (!isPlaying) return;
    startProgressBar();
    intervalRef.current = setInterval(() => {
      setActiveStep((prev) => {
        const next = (prev + 1) % steps.length;
        return next;
      });
    }, STEP_DURATION);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, activeStep]);

  /* Caption fade-in on step change */
  useEffect(() => {
    setCaptionVisible(false);
    const t = setTimeout(() => setCaptionVisible(true), 200);
    return () => clearTimeout(t);
  }, [activeStep]);

  const startProgressBar = () => {
    setBarWidth(0);
    if (barRef.current) clearInterval(barRef.current);
    const increment = 100 / (STEP_DURATION / 50);
    barRef.current = setInterval(() => {
      setBarWidth((w) => {
        if (w >= 100) { if (barRef.current) clearInterval(barRef.current); return 100; }
        return w + increment;
      });
    }, 50);
  };

  const goToStep = (i: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setActiveStep(i);
    setIsPlaying(true);
    startProgressBar();
  };

  const togglePlay = () => {
    setIsPlaying((p) => !p);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (barRef.current) clearInterval(barRef.current);
  };

  const videoSrc = processVideos[activeStep % processVideos.length];
  const currentStep = steps[activeStep];

  return (
    <section className="bg-white py-0 overflow-hidden">
      {/* ── Top label ── */}
      <div className="bg-gray-50 border-t border-b border-gray-100 py-3">
        <div className="cavalo-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cavalo-yellow rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">See How Cavalo Moolyankann Works</span>
          </div>
          <span className="text-xs text-gray-400">Step {activeStep + 1} of {steps.length}</span>
        </div>
      </div>

      {/* ── Main two-col layout ── */}
      <div className="cavalo-container py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* LEFT — text panel */}
          <div className="order-2 lg:order-1">
            {/* Active step heading */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-cavalo-yellow-light border border-cavalo-yellow/30 rounded-full px-3 py-1 mb-4">
                <currentStep.icon className="w-3.5 h-3.5 text-cavalo-yellow" />
                <span className="text-xs font-semibold text-cavalo-yellow-dark">Step {currentStep.id}</span>
              </div>
              <h2
                key={`title-${activeStep}`}
                className="text-3xl md:text-4xl font-bold text-navy leading-tight"
                style={{ animation: "fade-up 0.4s ease-out" }}
              >
                {currentStep.title}
              </h2>
              <p
                key={`desc-${activeStep}`}
                className="text-gray-500 text-base mt-4 leading-relaxed"
                style={{ animation: "fade-up 0.5s ease-out" }}
              >
                {currentStep.description}
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-navy rounded-lg p-4">
                <div className="text-2xl font-bold text-cavalo-yellow">150+</div>
                <div className="text-white/70 text-xs mt-1">Point Checklist</div>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-navy">30 min</div>
                <div className="text-gray-500 text-xs mt-1">Report Delivery</div>
              </div>
            </div>

            {/* Step list navigation */}
            <div className="space-y-1">
              {steps.map((step, i) => (
                <button
                  key={step.id}
                  onClick={() => goToStep(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all group ${
                    i === activeStep
                      ? "bg-cavalo-yellow-light border border-cavalo-yellow/30"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    i < activeStep ? "bg-green-500" : i === activeStep ? "bg-cavalo-yellow" : "bg-gray-100"
                  }`}>
                    {i < activeStep
                      ? <CheckCircle2 className="w-4 h-4 text-white" />
                      : <step.icon className={`w-3.5 h-3.5 ${i === activeStep ? "text-navy" : "text-gray-400 group-hover:text-navy"}`} />
                    }
                  </div>
                  <span className={`text-sm font-medium flex-1 ${i === activeStep ? "text-navy" : "text-gray-500 group-hover:text-navy"}`}>
                    {step.title}
                  </span>
                  {i === activeStep && (
                    <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                      <div
                        className="h-full bg-cavalo-yellow rounded-full transition-none"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 flex gap-3">
              <button onClick={() => router.push("/book")} className="btn-cavalo px-6 py-3 text-sm inline-flex items-center gap-2">
                Book Inspection <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={togglePlay}
                className="border-2 border-gray-200 hover:border-cavalo-yellow text-navy rounded px-4 py-3 text-sm font-semibold transition inline-flex items-center gap-2"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? "Pause" : "Play"}
              </button>
            </div>
          </div>

          {/* RIGHT — video + caption overlay */}
          <div className="order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-navy group aspect-video">
              {/* Video */}
              <video
                ref={videoRef}
                key={videoSrc}
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />

              {/* Dark overlay at bottom for caption readability */}
              <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

              {/* Step badge — top-left */}
              <div className="absolute top-4 left-4 bg-cavalo-yellow text-navy text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                <currentStep.icon className="w-3.5 h-3.5" />
                Step {currentStep.id} / {steps.length}
              </div>

              {/* Play/Pause overlay — center (shows on hover) */}
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/40">
                  {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white ml-0.5" />}
                </div>
              </button>

              {/* Caption — Tesla-style bottom bar */}
              <div
                className={`absolute bottom-0 inset-x-0 px-5 pb-5 transition-all duration-300 ${captionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
              >
                {/* Progress dots */}
                <div className="flex gap-1 mb-3">
                  {steps.map((_, i) => (
                    <button key={i} onClick={() => goToStep(i)} className="flex-1 h-0.5 rounded-full overflow-hidden bg-white/20">
                      {i < activeStep && <div className="h-full bg-white w-full" />}
                      {i === activeStep && <div className="h-full bg-cavalo-yellow" style={{ width: `${barWidth}%` }} />}
                    </button>
                  ))}
                </div>
                {/* Caption text */}
                <p
                  key={`caption-${activeStep}`}
                  className="text-white text-sm md:text-base font-medium leading-snug"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)", animation: "fade-up 0.35s ease-out" }}
                >
                  {currentStep.caption}
                </p>
              </div>

              {/* Step number watermark */}
              <div className="absolute top-4 right-4 text-white/20 text-6xl font-black leading-none select-none">
                0{currentStep.id}
              </div>
            </div>

            {/* Below video: quick trust signals */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { v: "5000+", l: "Inspections Done" },
                { v: "200+", l: "Cities Covered" },
                { v: "98%", l: "Customer Satisfaction" },
              ].map((s, i) => (
                <div key={i} className="bg-gray-50 border border-gray-100 rounded-lg py-3 text-center">
                  <div className="text-lg font-bold text-navy">{s.v}</div>
                  <div className="text-gray-500 text-xs">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
