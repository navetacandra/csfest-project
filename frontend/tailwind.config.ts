import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#60a5fa", // Based on the blue color in the wireframe
        "background-light": "#f3f4f6", // A light gray for light mode
        "background-dark": "#0d1117", // A very dark blue/black for dark mode
        "surface-light": "#ffffff",
        "surface-dark": "#161b22",
        "border-light": "#d1d5db",
        "border-dark": "#30363d",
        "button-bg-light": "#eab308", // Yellow-ish brown for button
        "button-bg-dark": "#4a2c0f", // Dark brown for button background
        "button-text-light": "#4a2c0f",
        "button-text-dark": "#eab308",
        "text-main-light": "#1f2937",
        "text-main-dark": "#e2e8f0",
        "text-secondary-light": "#6b7280",
        "text-secondary-dark": "#94a3b8",
      },
      fontFamily: {
        display: ["Comic Neue", "cursive"],
      },
      borderRadius: {
        DEFAULT: "1rem", // Rounded corners as seen in the design
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
