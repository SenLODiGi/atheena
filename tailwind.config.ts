import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sapphire: {
          50: "#eef2ff",
          100: "#d8e4ff",
          200: "#b8ceff",
          300: "#8eaeff",
          400: "#5f85ff",
          500: "#365ef4",
          600: "#2647cf",
          700: "#1f3ca8",
          800: "#1d3688",
          900: "#1c316f",
        },
        imperialGold: {
          50: "#fff9e7",
          100: "#ffefbf",
          200: "#ffe28a",
          300: "#ffd45a",
          400: "#f8c437",
          500: "#e9ad1c",
          600: "#c98611",
          700: "#a16112",
          800: "#844c16",
          900: "#6f4016",
        },
        nebula: {
          500: "#8c6dff",
          600: "#7653e6",
        },
        marble: {
          900: "#0b0f1e",
          800: "#131a2f",
          700: "#1c243c",
        },
        ethereal: "#7df9ff",
      },
      fontFamily: {
        display: ["Cinzel", "Trajan Pro", "serif"],
        body: ["Cormorant Garamond", "serif"],
        tech: ["Orbitron", "sans-serif"],
      },
      backgroundImage: {
        "marble-night":
          "radial-gradient(circle at 20% 10%, rgba(125,249,255,0.08), transparent 30%), radial-gradient(circle at 80% 20%, rgba(140,109,255,0.15), transparent 35%), linear-gradient(145deg, #090d1a 0%, #111938 45%, #0b0f1e 100%)",
        "golden-halo":
          "radial-gradient(circle, rgba(248,196,55,0.45) 0%, rgba(248,196,55,0.12) 35%, rgba(248,196,55,0) 70%)",
        "parthenon-lines":
          "repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 120px)",
      },
      boxShadow: {
        "oracle-glow":
          "0 0 20px rgba(125,249,255,0.35), 0 0 60px rgba(140,109,255,0.25)",
        "gold-ornate":
          "0 0 0 1px rgba(248,196,55,0.7), 0 10px 30px rgba(233,173,28,0.28)",
      },
      keyframes: {
        "aura-pulse": {
          "0%, 100%": { transform: "scale(0.96)", opacity: "0.6" },
          "50%": { transform: "scale(1.04)", opacity: "1" },
        },
        "particle-float": {
          "0%": { transform: "translateY(0px) translateX(0px)", opacity: "0" },
          "20%": { opacity: "0.9" },
          "100%": {
            transform: "translateY(-120px) translateX(24px)",
            opacity: "0",
          },
        },
      },
      animation: {
        "aura-pulse": "aura-pulse 3.2s ease-in-out infinite",
        "particle-float": "particle-float 6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
