import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "dream-black": "#050510",
        "dream-emerald": "#3CE4A4",
        "dream-magenta": "#E14AF5",
        "dream-cyan": "#52E2FF",
      },
      fontFamily: {
        sans: ["'Space Grotesk'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      boxShadow: {
        mesh: "0 0 30px rgba(82, 226, 255, 0.25)",
      },
      backgroundImage: {
        "mesh-grid":
          "radial-gradient(circle at 20% 20%, rgba(82, 226, 255, 0.15) 0, rgba(10, 10, 30, 0) 60%), radial-gradient(circle at 80% 20%, rgba(225, 74, 245, 0.2) 0, rgba(10, 10, 30, 0) 55%), radial-gradient(circle at 50% 80%, rgba(60, 228, 164, 0.2) 0, rgba(10, 10, 30, 0) 55%)",
      },
    },
  },
  plugins: [],
} satisfies Config;

