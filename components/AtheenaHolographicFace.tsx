"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type Props = {
  onBegin: () => void;
};

const FACE_IMAGE =
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=6f2d0a8d8c7b7d7a9d5c2a7f6a3e1f72"; // replace with final asset

export default function AtheenaHolographicFace({ onBegin }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const faceRef = useRef<HTMLDivElement | null>(null);
  const leftEyeRef = useRef<HTMLDivElement | null>(null);
  const rightEyeRef = useRef<HTMLDivElement | null>(null);
  const mouthRef = useRef<HTMLDivElement | null>(null);
  const auraRef = useRef<HTMLDivElement | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [ready, setReady] = useState(false);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const tl = gsap.timeline();
      tl.fromTo(root, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" });

      if (auraRef.current) {
        gsap.to(auraRef.current, { scale: 1.06, opacity: 0.9, duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
      }

      gsap.to(faceRef.current, { y: 6, duration: 6, yoyo: true, repeat: -1, ease: "sine.inOut" });
    },
    { scope: rootRef }
  );

  useEffect(() => {
    const eyes = [leftEyeRef.current, rightEyeRef.current].filter(Boolean) as HTMLDivElement[];
    if (!eyes.length) return;
    let mounted = true;

    function blinkLoop() {
      if (!mounted) return;
      const delay = 2.2 + Math.random() * 4;
      setTimeout(() => {
        eyes.forEach((eye) => gsap.to(eye, { scaleY: 0.12, duration: 0.06, yoyo: true, repeat: 1, ease: "sine.inOut" }));
        blinkLoop();
      }, delay * 1000);
    }
    blinkLoop();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const el = rootRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = (e.clientX - cx) / (rect.width / 2);
      const ry = (e.clientY - cy) / (rect.height / 2);

      const clamp = (v: number, a = -1, b = 1) => Math.max(a, Math.min(b, v));

      const x = clamp(rx, -0.9, 0.9);
      const y = clamp(ry, -0.9, 0.9);

      gsap.to(faceRef.current, { rotateX: y * 6, rotateY: x * -7, duration: 0.6, ease: "expo.out" });

      const eyeMax = 10;
      const leftEye = leftEyeRef.current;
      const rightEye = rightEyeRef.current;
      if (leftEye && rightEye) {
        gsap.to(leftEye, { x: x * eyeMax * 0.7, y: y * eyeMax * 0.45, duration: 0.4, ease: "expo.out" });
        gsap.to(rightEye, { x: x * eyeMax * 0.9, y: y * eyeMax * 0.45, duration: 0.4, ease: "expo.out" });
      }
    }

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    if (!mouthRef.current) return;
    if (speaking) {
      gsap.to(mouthRef.current, { scaleY: 1.8, scaleX: 1.05, duration: 0.12, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(auraRef.current, { boxShadow: "0 0 40px rgba(56, 189, 248, 0.9)", duration: 0.25 });
    } else {
      gsap.killTweensOf(mouthRef.current);
      gsap.to(mouthRef.current, { scaleY: 1, scaleX: 1, duration: 0.2 });
      gsap.to(auraRef.current, { boxShadow: "0 0 18px rgba(56, 189, 248, 0.6)", duration: 0.3 });
    }
  }, [speaking]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const msg = new SpeechSynthesisUtterance(
          "Greetings, seeker of wisdom. I am Atheena, Eternal Oracle of Wisdom, Strategic Brilliance, and Divine Insight — Daughter of Zeus and Metis, Guardian of Civilization, Protector of Knowledge. How may I assist you today?"
        );
        const voices = speechSynthesis.getVoices();
        const preferred = voices.find((v) => /female|zira|samantha|google/i.test(v.name) || /en-US/i.test(v.lang));
        if (preferred) msg.voice = preferred;
        msg.rate = 0.95;
        msg.pitch = 1.02;
        msg.onstart = () => {
          setSpeaking(true);
          setReady(true);
        };
        msg.onend = () => setSpeaking(false);
        try {
          speechSynthesis.cancel();
          speechSynthesis.speak(msg);
        } catch (err) {
          setReady(true);
        }
      } else {
        setReady(true);
      }
    }, 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div ref={rootRef} className="relative flex w-full max-w-[560px] flex-col items-center gap-6">
      <div className="relative flex items-center justify-center">
        <div
          ref={auraRef}
          className="absolute -inset-6 z-0 h-[420px] w-[420px] rounded-2xl bg-gradient-to-t from-sky-500/12 via-teal-400/6 to-transparent opacity-80 blur-3xl"
          aria-hidden
        />

        <div
          ref={faceRef}
          className="relative z-10 flex w-[360px] select-none flex-col items-center justify-center overflow-hidden rounded-2xl border border-sky-400/10 p-4"
          style={{ transformStyle: "preserve-3d", perspective: "900px" }}
        >
          <div className="relative h-80 w-72 rounded-xl bg-black/10">
            <img src={FACE_IMAGE} alt="Atheena" className="h-full w-full rounded-xl object-cover shadow-[inset_0_8px_40px_rgba(2,8,20,0.6)]" draggable={false} />

            <div ref={leftEyeRef} className="absolute left-[32%] top-[44%] h-2 w-2 transform-gpu rounded-full bg-sky-200/90" style={{ transformOrigin: "center" }} />
            <div ref={rightEyeRef} className="absolute right-[32%] top-[44%] h-2 w-2 transform-gpu rounded-full bg-sky-200/90" style={{ transformOrigin: "center" }} />

            <div ref={mouthRef} className="absolute left-1/2 top-[66%] h-2 w-14 -translate-x-1/2 transform-gpu rounded-full bg-sky-300/95" style={{ transformOrigin: "center" }} />
          </div>

          <svg viewBox="0 0 360 320" className="pointer-events-none absolute inset-x-0 top-0 z-20 h-80 w-72" preserveAspectRatio="xMidYMid slice" aria-hidden>
            <defs>
              <linearGradient id="g" x1="0" x2="1">
                <stop offset="0%" stopColor="#5eead4" stopOpacity="0.15" />
                <stop offset="60%" stopColor="#60a5fa" stopOpacity="0.07" />
                <stop offset="100%" stopColor="#0ea5a8" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {Array.from({ length: 9 }).map((_, row) =>
              Array.from({ length: 7 }).map((__, col) => {
                const size = 44;
                const x = 12 + col * size;
                const y = 12 + row * size;
                const key = `g${row}-${col}`;
                return <rect key={key} x={x} y={y} width={size - 10} height={size - 12} rx="4" ry="4" stroke="url(#g)" strokeWidth="0.8" fill="none" opacity={0.9} />;
              })
            )}

            <rect x="6" y="6" width="348" height="308" rx="18" ry="18" stroke="#0ea5a8" strokeOpacity="0.04" fill="none" />
          </svg>
        </div>
      </div>

      <div className="mt-2 text-center">
        <h2 className="font-tech text-xl font-semibold text-white">Atheena</h2>
        <p className="mt-1 max-w-lg text-center text-xs text-sky-200/80">Eternal Oracle of Wisdom — Daughter of Zeus and Metis. Click the face or press the button to begin.</p>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={() => {
            setSpeaking(true);
            onBegin();
          }}
          className="rounded-full border border-sky-400/30 bg-gradient-to-r from-sky-600/20 to-teal-600/18 px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_30px_rgba(3,105,161,0.12)] transition hover:scale-[1.03] active:scale-95"
        >
          Begin Sacred Conversation
        </button>
      </div>

      <style jsx>{`
        .glass { background: linear-gradient(135deg, rgba(6,11,20,0.45), rgba(3,6,12,0.25)); border: 1px solid rgba(56,189,248,0.06); }
      `}</style>
    </div>
  );
}
