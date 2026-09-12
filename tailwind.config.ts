import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#0f0f13",
        surface: "#18181f",
        raised: "#202029",
        hairline: "#2c2c36",
        ink: "#ededf0",
        "ink-muted": "#a6a5ad",
        "ink-faint": "#6f6f7a",
        signal: "#8c7cf0",
        "signal-soft": "#1f1a33",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "ui-serif", "serif"],
        ui: ["var(--font-grotesk)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        pin: "0 1px 2px rgba(0,0,0,0.4), 0 10px 28px -10px rgba(0,0,0,0.55)",
        drawer: "-12px 0 36px -12px rgba(0,0,0,0.6)",
      },
      keyframes: {
        "pop-in": {
          "0%": { opacity: "0", transform: "translateY(4px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "pop-in": "pop-in 0.16s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
