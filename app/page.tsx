"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import AtheenaHolographicFace from "@/components/AtheenaHolographicFace";
import HolographicPanels from "@/components/HolographicPanels";

const CallView = dynamic(() => import("@/components/CallView").then((m) => m.CallView), {
  ssr: false,
});

type Mode = "face" | "call";

export default function HomePage() {
  const [mode, setMode] = useState<Mode>("face");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    gsap.fromTo(el, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" });
  }, []);

  const handleBegin = useCallback(() => {
    const root = containerRef.current;
    if (!root) {
      setMode("call");
      return;
    }

    const tl = gsap.timeline({ defaults: { duration: 0.7, ease: "power3.inOut" }, onComplete: () => setMode("call") });
    tl.to(root, { scale: 0.98, opacity: 0, filter: "blur(6px)" });
  }, []);

  return (
    <main className="min-h-screen w-full overflow-hidden bg-black">
      {mode === "face" ? (
        <div ref={containerRef} className="relative mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-6 py-12">
          <div className="absolute inset-0 -z-10 bg-black/80" />

          <div className="pointer-events-none absolute inset-0 -z-20">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(2,6,23,0.18),transparent_40%)]" />
          </div>

          <div className="z-20 flex w-full flex-col items-center justify-center gap-8 md:flex-row">
            <div className="relative flex w-full max-w-3xl items-center justify-center px-4">
              <AtheenaHolographicFace onBegin={handleBegin} />
            </div>

            <HolographicPanels />
          </div>
        </div>
      ) : (
        <CallView onEnd={() => setMode("face")} />
      )}
    </main>
  );
}
