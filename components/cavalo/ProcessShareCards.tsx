"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { PROCESS_STEPS } from "@/lib/cavalo/process-content";

interface ProcessShareCardsProps {
  activeStep?: number;
  onStepSelect?: (index: number) => void;
}

export default function ProcessShareCards({ activeStep = 0, onStepSelect }: ProcessShareCardsProps) {
  const [api, setApi] = useState<CarouselApi>();

  const scrollToStep = useCallback(
    (index: number) => {
      api?.scrollTo(index);
      onStepSelect?.(index);
    },
    [api, onStepSelect],
  );

  useEffect(() => {
    if (!api || activeStep < 0) {
      return;
    }
    api.scrollTo(activeStep);
  }, [activeStep, api]);

  const handleShare = async (title: string, text: string): Promise<void> => {
    const shareData = {
      title: `Cavalo — ${title}`,
      text: `${text}\n\nBook your truck inspection at Cavalo Moolyankann.`,
      url: typeof window !== "undefined" ? window.location.origin : "",
    };

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // User cancelled or share failed — fall through to clipboard
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
    }
  };

  return (
    <div className="mt-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Share2 className="h-4 w-4 text-cavalo-yellow" />
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Share the process</span>
          </div>
          <h3 className="text-xl font-bold text-navy">Step cards for WhatsApp &amp; social</h3>
          <p className="mt-1 text-sm text-gray-500">Tap a card to jump to that step, or share with your team.</p>
        </div>
      </div>

      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: false }}
        className="w-full"
      >
        <CarouselContent className="-ml-3">
          {PROCESS_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;

            return (
              <CarouselItem key={step.id} className="basis-[78%] pl-3 sm:basis-[46%] lg:basis-[31%]">
                <div
                  className={`relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-sm transition ${
                    isActive
                      ? "border-cavalo-yellow shadow-md ring-2 ring-cavalo-yellow/30"
                      : "border-gray-200 hover:border-cavalo-yellow/40"
                  } ${step.accent} from-white to-gray-50`}
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-cavalo-yellow">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-4xl font-black leading-none text-navy/10">0{step.id}</span>
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-cavalo-yellow-dark">
                    Step {step.id} of {PROCESS_STEPS.length}
                  </p>
                  <h4 className="mt-1 text-lg font-bold text-navy">{step.title}</h4>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{step.shareLine}</p>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => scrollToStep(index)}
                      className="flex-1 rounded-lg border border-gray-200 bg-white py-2 text-xs font-semibold text-navy transition hover:border-cavalo-yellow"
                    >
                      View step
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleShare(step.title, step.shareLine)}
                      className="inline-flex items-center justify-center gap-1 rounded-lg bg-navy px-3 py-2 text-xs font-semibold text-white transition hover:bg-navy-light"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      Share
                    </button>
                  </div>

                  <div className="mt-3 border-t border-gray-200/80 pt-3 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Cavalo Moolyankann
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        <div className="mt-4 flex items-center justify-center gap-2">
          <CarouselPrevious className="static translate-y-0 border-gray-200" />
          <CarouselNext className="static translate-y-0 border-gray-200" />
        </div>
      </Carousel>

      <p className="mt-3 text-center text-xs text-gray-400">
        Swipe on mobile · Share cards work great on WhatsApp Status &amp; fleet group chats
      </p>
    </div>
  );
}
