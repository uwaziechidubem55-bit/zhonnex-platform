import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}","./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: { obsidian: "#050508", charcoal: "#0F0F12", glass: "rgba(255,255,255,0.06)", borderGlass: "rgba(255,255,255,0.08)" },
      fontFamily: { sans: ["Inter","system-ui","sans-serif"], mono: ["JetBrains Mono","monospace"] },
      backgroundImage: { "radial-glow": "radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, transparent 70%)" }
    },
  },
  plugins: [],
};
export default config;