"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function HolographicPanels() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    gsap.fromTo(
      el.querySelectorAll(".panel"),
      { y: 18, opacity: 0, scale: 0.98 },
      { y: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.08, ease: "power3.out" }
    );

    gsap.to(el, { y: 6, duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut" });
  }, []);

  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const [btc, setBtc] = useState(55900);
  const [eth, setEth] = useState(3300);
  useEffect(() => {
    const id = setInterval(() => {
      setBtc((v) => +(v + (Math.random() - 0.5) * 300).toFixed(2));
      setEth((v) => +(v + (Math.random() - 0.5) * 30).toFixed(2));
    }, 30 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div ref={rootRef} className="relative z-10 ml-6 flex w-full max-w-xl flex-col gap-6 px-2 md:ml-10 md:pl-8">
      <div className="panel glass-panel absolute left-6 top-6 hidden w-44 rounded-lg border border-teal-400/20 p-3 text-xs text-teal-200 md:block">
        <div className="font-tech text-xs text-teal-300">TIME</div>
        <div className="mt-2 font-mono text-lg text-white">{time.toLocaleTimeString()}</div>
      </div>

      <div className="panel glass-panel absolute right-6 top-6 hidden w-56 rounded-lg border border-sky-400/20 p-3 text-xs text-teal-200 md:block">
        <div className="font-tech text-xs text-teal-300">WEATHER</div>
        <div className="mt-2 text-white">
          <div className="text-sm">Colombo</div>
          <div className="mt-1 flex items-center gap-2 text-lg">
            <span>29°C</span>
            <span className="text-teal-300">•</span>
            <span className="text-sm text-sky-200">Partly Cloudy</span>
          </div>
        </div>
      </div>

      <div className="panel glass-panel bottom-left absolute left-6 bottom-6 hidden w-[34rem] rounded-lg border border-sky-400/16 p-3 text-xs text-teal-200 md:block">
        <div className="flex items-center justify-between">
          <div className="font-tech text-xs text-teal-300">NEWS</div>
          <div className="text-[11px] text-sky-200">Latest</div>
        </div>

        <div className="mt-2 flex gap-3 overflow-hidden">
          <div className="ticker flex animate-marquee whitespace-nowrap gap-6 text-sm text-white">
            <span>World leaders convene at the summit — placeholder headline A.</span>
            <span>Breakthrough in sustainable energy tech — placeholder headline B.</span>
            <span>Local markets steady as trading opens — placeholder headline C.</span>
          </div>
        </div>
      </div>

      <div className="panel glass-panel bottom-right absolute right-6 bottom-6 hidden w-44 rounded-lg border border-teal-400/18 p-3 text-xs text-teal-200 md:block">
        <div className="font-tech text-xs text-teal-300">MARKETS</div>
        <div className="mt-2 space-y-1 text-white">
          <div className="flex items-center justify-between text-sm">
            <span className="text-sky-200">BTC</span>
            <span>{btc.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-sky-200">ETH</span>
            <span>{eth.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-panel {
          backdrop-filter: blur(8px) saturate(120%);
          background: linear-gradient(135deg, rgba(10, 16, 30, 0.35), rgba(4, 8, 20, 0.25));
          box-shadow: 0 8px 30px rgba(4, 12, 24, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .animate-marquee { animation: marquee 14s linear infinite; }
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-40%); } }
      `}</style>
    </div>
  );
}
