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
      window.re
