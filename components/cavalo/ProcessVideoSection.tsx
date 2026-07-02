"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Play, Pause, CheckCircle2, ArrowRight, Volume2, VolumeX,
} from "lucide-react";
import ProcessShareCards from "@/components/cavalo/ProcessShareCards";
import {
  PROCESS_ANIMATION_FALLBACK,
  PROCESS_ANIMATION_VIDEO,
  PROCESS_STEPS,
  STEP_DURATION_MS,
} from "@/lib/cavalo/process-content";

export default function ProcessVideoSection() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [captionVisible, setCaptionVisible] = useState(true);
  const [barWidth, setBarWidth] = useState(0);
  const [useFallbackVideo, setUseFallbackVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const barRef = useRef<NodeJS.Timeout | null>(null);

  const videoSrc = useFallbackVideo ? PROCESS_ANIMATION_FALLBACK : PROCESS_ANIMATION_VIDEO;
  const currentStep = PROCESS_STEPS[activeStep];

  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    startProgressBar();
    intervalRef.current = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % PROCESS_STEPS.length);
    }, STEP_DURATION_MS);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, activeStep]);

  useEffect(() => {
    setCaptionVisible(false);
    const timer = setTimeout(() => setCaptionVisible(true), 200);
    return () => clearTimeout(timer);
  }, [activeStep]);

  const startProgressBar = (): void => {
    setBarWidth(0);
    if (barRef.current) {
      clearInterval(barRef.current);
    }
    const increment = 100 / (STEP_DURATION_MS / 50);
    barRef.current = setInterval(() => {
      setBarWidth((width) => {
        if (width >= 100) {
          if (barRef.current) {
            clearInterval(barRef.current);
          }
          return 100;
        }
        return width + increment;
      });
    }, 50);
  };

  const goToStep = (index: number): void => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setActiveStep(index);
    setIsPlaying(true);
    startProgressBar();
  };

  const togglePlay = (): void => {
    setIsPlaying((playing) => !playing);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (barRef.current) {
      clearInterval(barRef.current);
    }
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        void videoRef.current.play();
      }
    }
  };

  return (
    <section id="process-video" className="scroll-mt-20 overflow-hidden bg-white">
      <div className="border-y border-gray-100 bg-gradient-to-r from-navy via-navy-light to-navy py-4">
        <div className="cavalo-container flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 animate-pulse rounded-full bg-cavalo-yellow" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/80">
              Full process animation
            </span>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
            Step {activeStep + 1} of {PROCESS_STEPS.length}
          </span>
        </div>
      </div>

      <div className="cavalo-container py-12 lg:py-16">
        <div className="mb-10 text-center lg:text-left">
          <h2 className="text-3xl font-bold text-navy md:text-4xl">How Cavalo Works — End to End</h2>
          <p className="mx-auto mt-3 max-w-2xl text-gray-500 lg:mx-0">
            Watch the full booking journey: verify your truck, pay securely, get inspector updates, and receive your report on WhatsApp.
          </p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="order-2 lg:order-1">
            <div className="mb-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cavalo-yellow/30 bg-cavalo-yellow-light px-3 py-1">
                <currentStep.icon className="h-3.5 w-3.5 text-cavalo-yellow" />
                <span className="text-xs font-semibold text-cavalo-yellow-dark">Step {currentStep.id}</span>
              </div>
              <h3
                key={`title-${activeStep}`}
                className="animate-fade-up text-2xl font-bold text-navy md:text-3xl"
              >
                {currentStep.title}
              </h3>
              <p
                key={`desc-${activeStep}`}
                className="animate-fade-up mt-4 text-base leading-relaxed text-gray-500"
              >
                {currentStep.description}
              </p>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-navy p-4">
                <div className="text-2xl font-bold text-cavalo-yellow">150+</div>
                <div className="mt-1 text-xs text-white/70">Point checklist</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div className="text-2xl font-bold text-navy">30 min</div>
                <div className="mt-1 text-xs text-gray-500">Report on WhatsApp</div>
              </div>
            </div>

            <div className="space-y-1">
              {PROCESS_STEPS.map((step, index) => {
                const StepIcon = step.icon;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => goToStep(index)}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all ${
                      index === activeStep
                        ? "border border-cavalo-yellow/30 bg-cavalo-yellow-light"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all ${
                        index < activeStep ? "bg-emerald-500" : index === activeStep ? "bg-cavalo-yellow" : "bg-gray-100"
                      }`}
                    >
                      {index < activeStep ? (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      ) : (
                        <StepIcon
                          className={`h-3.5 w-3.5 ${
                            index === activeStep ? "text-navy" : "text-gray-400 group-hover:text-navy"
                          }`}
                        />
                      )}
                    </div>
                    <span
                      className={`flex-1 text-sm font-medium ${
                        index === activeStep ? "text-navy" : "text-gray-500 group-hover:text-navy"
                      }`}
                    >
                      {step.title}
                    </span>
                    {index === activeStep ? (
                      <div className="h-1 w-16 flex-shrink-0 overflow-hidden rounded-full bg-gray-200">
                        <div className="h-full rounded-full bg-cavalo-yellow" style={{ width: `${barWidth}%` }} />
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => router.push("/book")}
                className="btn-cavalo inline-flex items-center gap-2 px-6 py-3 text-sm"
              >
                Book Inspection <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={togglePlay}
                className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-semibold text-navy transition hover:border-cavalo-yellow"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? "Pause tour" : "Play tour"}
              </button>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="group relative aspect-video overflow-hidden rounded-2xl bg-navy shadow-2xl ring-1 ring-black/5">
              <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
                onError={() => setUseFallbackVideo(true)}
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

              <div className="absolute left-4 top-4 flex items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-full bg-cavalo-yellow px-3 py-1.5 text-xs font-bold text-navy shadow-lg">
                  <currentStep.icon className="h-3.5 w-3.5" />
                  Step {currentStep.id} / {PROCESS_STEPS.length}
                </span>
              </div>

              <button
                type="button"
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-white/20 backdrop-blur">
                  {isPlaying ? <Pause className="h-6 w-6 text-white" /> : <Play className="ml-0.5 h-6 w-6 text-white" />}
                </div>
              </button>

              <div
                className={`absolute inset-x-0 bottom-0 px-5 pb-5 transition-all duration-300 ${
                  captionVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                }`}
              >
                <div className="mb-3 flex gap-1">
                  {PROCESS_STEPS.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => goToStep(index)}
                      className="h-1 flex-1 overflow-hidden rounded-full bg-white/25"
                    >
                      {index < activeStep ? <div className="h-full w-full bg-white" /> : null}
                      {index === activeStep ? (
                        <div className="h-full bg-cavalo-yellow" style={{ width: `${barWidth}%` }} />
                      ) : null}
                    </button>
                  ))}
                </div>
                <p
                  key={`caption-${activeStep}`}
                  className="animate-fade-up text-sm font-medium leading-snug text-white md:text-base"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
                >
                  {currentStep.caption}
                </p>
              </div>

              <div className="absolute right-4 top-4 select-none text-6xl font-black leading-none text-white/15">
                0{currentStep.id}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { v: "5000+", l: "Inspections" },
                { v: "200+", l: "Cities" },
                { v: "98%", l: "Satisfaction" },
              ].map((stat) => (
                <div key={stat.l} className="rounded-xl border border-gray-100 bg-gray-50 py-3 text-center">
                  <div className="text-lg font-bold text-navy">{stat.v}</div>
                  <div className="text-xs text-gray-500">{stat.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ProcessShareCards activeStep={activeStep} onStepSelect={goToStep} />
      </div>
    </section>
  );
}
