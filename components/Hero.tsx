"use client";

import { useEffect, useRef, useState } from "react";
import SearchBar from "@/components/SearchBar";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Ensure autoplay-friendly settings before attempting play
    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;

    const tryPlay = async () => {
      try {
        await v.play();
        setNeedsTap(false);
      } catch {
        const onCanPlay = async () => {
          try {
            await v.play();
            setNeedsTap(false);
          } catch {
            setNeedsTap(true);
          } finally {
            v.removeEventListener("canplay", onCanPlay);
          }
        };
        v.addEventListener("canplay", onCanPlay);
        setNeedsTap(true);
      }
    };

    tryPlay();

    // Fallback: start on first user gesture (iOS Low Power Mode, etc.)
    const onUserGesture = () => {
      if (v.paused) v.play().catch(() => {});
      window.removeEventListener("touchstart", onUserGesture);
      window.removeEventListener("click", onUserGesture);
    };
    window.addEventListener("touchstart", onUserGesture, { once: true });
    window.addEventListener("click", onUserGesture, { once: true });

    return () => {
      window.removeEventListener("touchstart", onUserGesture);
      window.removeEventListener("click", onUserGesture);
    };
  }, []);

  return (
    <section className="relative h-[64vh] min-h-[560px] w-full overflow-hidden">
      {/* Background video from /public/images */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        playsInline
        loop
        preload="metadata"
        poster="/images/chicago-hero.jpg"
        controls={false}
        controlsList="nodownload nofullscreen noplaybackrate"
        aria-hidden="true"
      >
        {/* Include this only if the file exists */}
        <source src="/images/hero.webm" type="video/webm" />
        {/* MP4 fallback (ensure exact filename + case in /public/images) */}
        <source src="/images/chicago_drone_shot.mp4.mp4" type="video/mp4" />
      </video>

      {/* stronger gradient for nav contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/35 to-transparent" />

      {/* Content */}
      <div className="relative container h-full flex items-end pb-12">
        <div className="text-white">
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight drop-shadow">
            Chicago Residences
          </h1>
          <p className="mt-2 text-white/90 max-w-xl">
            Modern apartments in Rogers Park, and Edgewater, and beyond.
          </p>
          <div className="mt-6">
            <SearchBar />
          </div>

          {needsTap && (
            <button
              onClick={() => videoRef.current?.play().catch(() => {})}
              className="mt-4 px-4 py-2 rounded-xl bg-white/90 text-gray-900"
            >
              Tap to Play
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
