"use client";

import { useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";
import {
  PROCESS_ANIMATION_FALLBACK,
  PROCESS_ANIMATION_VIDEO,
} from "@/lib/cavalo/process-content";

interface HeroProcessPreviewProps {
  onWatchFull?: () => void;
}

export default function HeroProcessPreview({ onWatchFull }: HeroProcessPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [useFallback, setUseFallback] = useState(false);

  const videoSrc = useFallback ? PROCESS_ANIMATION_FALLBACK : PROCESS_ANIMATION_VIDEO;

  const scrollToFull = (): void => {
    if (onWatchFull) {
      onWatchFull();
      return;
    }
    document.getElementById("process-video")?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleMute = (): void => {
    setIsMuted((prev) => !prev);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  return (
    <button
      type="button"
      onClick={scrollToFull}
      className="group relative w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white/5 text-left shadow-xl backdrop-blur transition hover:border-cavalo-yellow/50 hover:shadow-cavalo-yellow/10"
    >
      <div className="relative aspect-[16/9] w-full">
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="h-full w-full object-cover"
          onError={() => setUseFallback(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent" />

        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-full bg-cavalo-yellow px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-navy">
            Process Video
          </span>
          <span className="rounded-full bg-black/40 px-2 py-0.5 text-[10px] font-medium text-white/90">
            2 min watch
          </span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/40 bg-white/15 backdrop-blur transition group-hover:scale-110 group-hover:bg-cavalo-yellow group-hover:border-cavalo-yellow">
            <Play className="ml-0.5 h-5 w-5 text-white group-hover:text-navy" />
          </div>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            toggleMute();
          }}
          className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white/80 transition hover:bg-black/60 hover:text-white"
          aria-label={isMuted ? "Unmute preview" : "Mute preview"}
        >
          {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>

        <div className="absolute bottom-0 inset-x-0 p-3">
          <p className="text-sm font-semibold text-white">See the full booking process</p>
          <p className="text-xs text-white/70">Verify → Pay → Inspect → Report on WhatsApp</p>
        </div>
      </div>
    </button>
  );
}
