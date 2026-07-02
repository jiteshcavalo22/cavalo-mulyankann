"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  CreditCard,
  FileText,
  Shield,
  Sparkles,
  Truck,
  User,
  type LucideIcon,
} from "lucide-react";

interface HowItWorksStep {
  step: number;
  icon: LucideIcon;
  title: string;
  desc: string;
  phase: string;
}

const STEPS: HowItWorksStep[] = [
  { step: 1, icon: User, title: "Register", desc: "Sign up with mobile OTP in seconds.", phase: "Book" },
  { step: 2, icon: Truck, title: "Browse & Select", desc: "Pick truck brand, GVW category and inspection location.", phase: "Book" },
  { step: 3, icon: CreditCard, title: "Pay Securely", desc: "Razorpay, UPI, cards or WhatsApp payment link.", phase: "Pay" },
  { step: 4, icon: CheckCircle2, title: "Booking Confirmed", desc: "Instant confirmation on WhatsApp with your reference ID.", phase: "Pay" },
  { step: 5, icon: Shield, title: "Inspector Assigned", desc: "Nearest certified inspector dispatched to your truck.", phase: "Inspect" },
  { step: 6, icon: Bell, title: "Cavalo Alerts You", desc: "Real-time WhatsApp updates at every stage.", phase: "Inspect" },
  { step: 7, icon: FileText, title: "Get Report", desc: "Full PDF report + photo gallery on WhatsApp within 30 minutes.", phase: "Report" },
];

const PHASES = ["Book", "Pay", "Inspect", "Report"] as const;

const phaseColors: Record<(typeof PHASES)[number], string> = {
  Book: "from-amber-400/20 to-orange-500/10",
  Pay: "from-emerald-400/20 to-teal-500/10",
  Inspect: "from-blue-400/20 to-indigo-500/10",
  Report: "from-violet-400/20 to-purple-500/10",
};

export default function HowItWorksSection() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const current = STEPS[activeStep];
  const CurrentIcon = current.icon;

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 py-20 lg:py-24">
      <div className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-cavalo-yellow/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-navy/5 blur-3xl" />

      <div className="cavalo-container relative">
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cavalo-yellow/30 bg-cavalo-yellow-light px-4 py-1.5">
            <Sparkles className="h-3.5 w-3.5 text-cavalo-yellow" />
            <span className="text-xs font-bold uppercase tracking-widest text-navy">Simple 7-step journey</span>
          </div>
          <h2 className="text-3xl font-bold text-navy md:text-4xl lg:text-[2.75rem]">How It Works</h2>
          <p className="mt-4 text-base text-gray-500 md:text-lg">
            From registration to inspection report — a clear, WhatsApp-first flow built for truck buyers and fleet owners.
          </p>
        </div>

        {/* Phase pills */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {PHASES.map((phase) => {
            const phaseSteps = STEPS.filter((s) => s.phase === phase);
            const isActive = current.phase === phase;
            return (
              <button
                key={phase}
                type="button"
                onClick={() => setActiveStep(phaseSteps[0].step - 1)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-navy text-white shadow-md"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-cavalo-yellow hover:text-navy"
                }`}
              >
                {phase}
                <span className={`ml-1.5 text-xs ${isActive ? "text-cavalo-yellow" : "text-gray-400"}`}>
                  {phaseSteps.length} step{phaseSteps.length > 1 ? "s" : ""}
                </span>
              </button>
            );
          })}
        </div>

        {/* Featured step — desktop highlight */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className={`mb-10 overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br ${phaseColors[current.phase as keyof typeof phaseColors]} to-white p-6 shadow-sm md:p-8`}
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-navy text-cavalo-yellow shadow-lg">
                  <CurrentIcon className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-cavalo-yellow-dark">
                    Step {current.step} · {current.phase}
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-navy md:text-3xl">{current.title}</h3>
                  <p className="mt-2 max-w-xl text-gray-600">{current.desc}</p>
                </div>
              </div>
              <div className="flex flex-shrink-0 items-center gap-3">
                <button
                  type="button"
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((s) => Math.max(0, s - 1))}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-navy disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={activeStep === STEPS.length - 1}
                  onClick={() => setActiveStep((s) => Math.min(STEPS.length - 1, s + 1))}
                  className="btn-cavalo px-4 py-2.5 text-sm"
                >
                  Next step
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Timeline — desktop */}
        <div className="relative hidden lg:block">
          <div className="absolute left-0 right-0 top-8 h-0.5 bg-gradient-to-r from-transparent via-cavalo-yellow/60 to-transparent" />
          <div className="grid grid-cols-7 gap-3">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === activeStep;
              const isDone = index < activeStep;

              return (
                <button
                  key={step.step}
                  type="button"
                  onClick={() => setActiveStep(index)}
                  className="group relative flex flex-col items-center text-center"
                >
                  <div
                    className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border-2 transition-all duration-300 ${
                      isActive
                        ? "scale-110 border-cavalo-yellow bg-navy text-cavalo-yellow shadow-lg shadow-cavalo-yellow/20"
                        : isDone
                          ? "border-emerald-400 bg-emerald-50 text-emerald-600"
                          : "border-gray-200 bg-white text-gray-400 group-hover:border-cavalo-yellow/50 group-hover:text-navy"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="h-6 w-6" /> : <StepIcon className="h-6 w-6" />}
                    <span
                      className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                        isActive ? "bg-cavalo-yellow text-navy" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {step.step}
                    </span>
                  </div>
                  <p className={`mt-3 text-sm font-semibold ${isActive ? "text-navy" : "text-gray-500"}`}>
                    {step.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-gray-400">{step.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Cards — mobile & tablet */}
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === activeStep;

            return (
              <button
                key={step.step}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`w-[260px] flex-shrink-0 snap-center rounded-2xl border p-5 text-left transition-all ${
                  isActive
                    ? "border-cavalo-yellow bg-white shadow-lg ring-2 ring-cavalo-yellow/20"
                    : "border-gray-200 bg-white/80 hover:border-gray-300"
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      isActive ? "bg-navy text-cavalo-yellow" : "bg-cavalo-yellow-light text-cavalo-yellow"
                    }`}
                  >
                    <StepIcon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-navy">
                    {step.step}/7
                  </span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wide text-cavalo-yellow-dark">{step.phase}</p>
                <h4 className="mt-1 font-bold text-navy">{step.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{step.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-navy p-6 sm:flex-row sm:p-8">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold text-white md:text-xl">Ready to start step 1?</h3>
            <p className="mt-1 text-sm text-white/60">Book your inspection in under 2 minutes.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={() => router.push("/book")}
              className="btn-cavalo inline-flex items-center justify-center gap-2 px-6 py-3 text-sm"
            >
              Book Inspection <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => document.getElementById("process-video")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Watch process video
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
