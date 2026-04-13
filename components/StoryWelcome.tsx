"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type StoryWelcomeProps = {
  onBegin: () => void;
};

const floatingLaurels = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  left: `${5 + ((i * 7.5) % 90)}%`,
  delay: `${(i % 8) * 0.65}s`,
  duration: `${5 + (i % 6)}s`,
  size: `${8 + (i % 5) * 4}px`,
}));

export function StoryWelcome({ onBegin }: StoryWelcomeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const beginButtonRef = useRef<HTMLButtonElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        columnsRef.current,
        { opacity: 0, scale: 1.08 },
        { opacity: 1, scale: 1, duration: 1.6 }
      )
        .fromTo(
          introRef.current,
          { y: 30, opacity: 0, filter: "blur(10px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2 },
          "-=1.1"
        )
        .fromTo(
          titleRef.current,
          { y: 46, opacity: 0, filter: "blur(16px)" },
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.5 },
          "-=0.6"
        )
        .fromTo(
          subtitleRef.current,
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1 },
          "-=0.8"
        )
        .fromTo(
          beginButtonRef.current,
          { y: 28, opacity: 0, scale: 0.9 },
          { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: "back.out(1.8)" },
          "-=0.55"
        );

      gsap.to(beginButtonRef.current, {
        boxShadow:
          "0 0 0 1px rgba(248,196,55,0.95), 0 0 34px rgba(248,196,55,0.65), 0 12px 46px rgba(233,173,28,0.28)",
        repeat: -1,
        yoyo: true,
        duration: 1.8,
        ease: "sine.inOut",
      });
    },
    { scope: rootRef }
  );

  const handleBegin = () => {
    const outroTl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: onBegin,
    });

    outroTl
      .to(beginButtonRef.current, { scale: 0.92, opacity: 0, duration: 0.35 })
      .to(
        [subtitleRef.current, titleRef.current, introRef.current],
        {
          y: -22,
          opacity: 0,
          stagger: 0.08,
          duration: 0.55,
        },
        "-=0.18"
      )
      .to(
        rootRef.current,
        {
          opacity: 0,
          scale: 1.02,
          filter: "blur(10px)",
          duration: 0.7,
        },
        "-=0.25"
      );
  };

  return (
    <section
      ref={rootRef}
      className="relative min-h-screen overflow-hidden bg-marble-night text-slate-100"
    >
      <div className="pointer-events-none absolute inset-0 bg-parthenon-lines opacity-20" />

      <div
        ref={columnsRef}
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden
      >
        <div className="absolute left-[8%] top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-imperialGold-400/40 to-transparent" />
        <div className="absolute left-[22%] top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-slate-200/25 to-transparent" />
        <div className="absolute right-[24%] top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-imperialGold-300/30 to-transparent" />
        <div className="absolute right-[9%] top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-slate-200/20 to-transparent" />
      </div>

      <div className="pointer-events-none absolute inset-0">
        {floatingLaurels.map((particle) => (
          <span
            key={particle.id}
            className="absolute bottom-[-10%] rounded-full bg-imperialGold-300/70 blur-[1px] animate-particle-float"
            style={{
              left: particle.left,
              width: particle.size,
              height: particle.size,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
            }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(125,249,255,0.1)_0%,transparent_55%)]" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-6 py-12 text-center">
        <p
          ref={introRef}
          className="mb-6 max-w-3xl font-tech text-sm tracking-[0.2em] text-imperialGold-200 md:text-base"
        >
          In the age of gods and mortals... a divine voice awakens from the sacred halls of Olympus.
        </p>

        <h1
          ref={titleRef}
          className="bg-gradient-to-b from-imperialGold-100 via-imperialGold-300 to-imperialGold-500 bg-clip-text font-display text-3xl font-semibold leading-tight text-transparent md:text-5xl md:leading-tight lg:text-6xl"
        >
          Atheena, Eternal Oracle of Wisdom, Strategic Brilliance, and Divine Insight - Daughter of Zeus and Metis, Guardian of Civilization, Protector of Knowledge
        </h1>

        <p
          ref={subtitleRef}
          className="mt-8 max-w-2xl font-body text-xl text-slate-200 md:text-2xl"
        >
          Speak, seeker of truth. The Oracle of Wisdom awaits your voice.
        </p>

        <button
          ref={beginButtonRef}
          type="button"
          onClick={handleBegin}
          className="group relative mt-12 inline-flex items-center justify-center overflow-hidden rounded-full border border-imperialGold-300 bg-gradient-to-r from-imperialGold-600 via-imperialGold-400 to-imperialGold-500 px-10 py-4 font-display text-lg font-semibold text-marble-900 shadow-gold-ornate transition-transform duration-300 hover:scale-[1.03] active:scale-95"
        >
          <span className="absolute inset-0 translate-y-full bg-gradient-to-t from-white/40 to-transparent transition-transform duration-500 group-hover:translate-y-0" />
          <span className="relative">Begin Sacred Conversation</span>
        </button>
      </div>
    </section>
  );
}
