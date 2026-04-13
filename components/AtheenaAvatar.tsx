"use client";

import { useMemo, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type AtheenaAvatarProps = {
  speaking: boolean;
  connected: boolean;
};

export function AtheenaAvatar({ speaking, connected }: AtheenaAvatarProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const auraRef = useRef<HTMLDivElement>(null);
  const mouthRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLDivElement>(null);

  const particles = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => ({
        id: i,
        left: `${(i * 6.5 + 8) % 92}%`,
        delay: `${(i % 6) * 0.45}s`,
      })),
    []
  );

  useGSAP(
    () => {
      gsap.fromTo(
        rootRef.current,
        { opacity: 0, y: 22, scale: 0.94 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" }
      );

      gsap.to(rootRef.current, {
        y: 6,
        duration: 2.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      gsap.to(auraRef.current, {
        scale: 1.05,
        opacity: 0.92,
        repeat: -1,
        yoyo: true,
        duration: 2.1,
        ease: "sine.inOut",
      });

      gsap.to(eyesRef.current, {
        keyframes: [
          { scaleY: 1, duration: 1.6 },
          { scaleY: 0.1, duration: 0.08 },
          { scaleY: 1, duration: 0.14 },
        ],
        repeat: -1,
        repeatDelay: 2.7,
      });
    },
    { scope: rootRef }
  );

  useGSAP(
    () => {
      if (!mouthRef.current || !auraRef.current) {
        return;
      }

      if (speaking) {
        gsap.to(mouthRef.current, {
          scaleY: 1.8,
          scaleX: 1.14,
          transformOrigin: "center",
          duration: 0.18,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(auraRef.current, {
          filter: "drop-shadow(0 0 34px rgba(125,249,255,0.9))",
          duration: 0.22,
          repeat: -1,
          yoyo: true,
        });
      } else {
        gsap.killTweensOf([mouthRef.current, auraRef.current]);
        gsap.to(mouthRef.current, { scaleY: 1, scaleX: 1, duration: 0.25 });
        gsap.to(auraRef.current, {
          filter: "drop-shadow(0 0 16px rgba(125,249,255,0.45))",
          duration: 0.25,
        });
      }
    },
    { dependencies: [speaking], scope: rootRef }
  );

  return (
    <div ref={rootRef} className="relative mx-auto w-full max-w-[520px]">
      <div
        ref={auraRef}
        className="pointer-events-none absolute inset-0 rounded-[42px] bg-golden-halo opacity-80 blur-2xl"
      />

      <div className="gold-filigree greek-key-border relative overflow-hidden rounded-[42px] border border-imperialGold-300/70 bg-gradient-to-b from-slate-950/95 via-sapphire-900/60 to-marble-900/95 p-6 shadow-oracle-glow">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(248,196,55,0.14),transparent_40%)]" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative h-72 w-56 md:h-80 md:w-64">
            <div className="absolute inset-x-[18%] top-0 h-24 rounded-t-[44px] border border-imperialGold-200/70 bg-gradient-to-b from-imperialGold-200/80 to-imperialGold-500/60 shadow-[0_0_20px_rgba(248,196,55,0.35)]" />
            <div className="absolute left-1/2 top-2 h-10 w-10 -translate-x-1/2 rounded-full border border-imperialGold-100/70 bg-imperialGold-100/80" />

            <div className="absolute inset-x-[14%] top-14 h-56 rounded-[36px] border border-slate-200/40 bg-gradient-to-b from-slate-300/90 via-slate-200/85 to-slate-300/80">
              <div
                ref={eyesRef}
                className="absolute inset-x-0 top-[32%] mx-auto flex w-24 justify-between"
              >
                <span className="h-2 w-2 rounded-full bg-sapphire-900" />
                <span className="h-2 w-2 rounded-full bg-sapphire-900" />
              </div>
              <div
                ref={mouthRef}
                className="absolute left-1/2 top-[56%] h-2 w-6 -translate-x-1/2 rounded-full bg-sapphire-900"
              />
            </div>

            <div className="absolute -left-4 top-40 h-24 w-16 rounded-l-[20px] border border-imperialGold-200/70 bg-gradient-to-b from-imperialGold-200/80 to-imperialGold-500/60" />
            <div className="absolute -right-4 top-40 h-24 w-16 rounded-r-[20px] border border-imperialGold-200/70 bg-gradient-to-b from-imperialGold-200/80 to-imperialGold-500/60" />
          </div>

          <p className="mt-5 text-center font-display text-2xl text-imperialGold-200 md:text-3xl">
            Atheena
          </p>
          <p className="mt-1 text-center font-tech text-xs tracking-[0.22em] text-ethereal/85 md:text-sm">
            {connected ? "ORACLE CHANNEL OPEN" : "AWAITING INVOCATION"}
          </p>
        </div>

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <span
              key={particle.id}
              className="absolute bottom-[-5%] h-[7px] w-[7px] rounded-full bg-imperialGold-300/65 blur-[0.8px] animate-particle-float"
              style={{
                left: particle.left,
                animationDelay: particle.delay,
                animationDuration: "6.2s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
