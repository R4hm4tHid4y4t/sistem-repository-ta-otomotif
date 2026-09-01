import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef2f7",
          100: "#dbe3ee",
          200: "#b7c7dd",
          300: "#8ea7c7",
          400: "#5c80a8",
          500: "#3a5f87",
          600: "#22406B",
          700: "#1E3A5F",
          800: "#17304d",
          900: "#10233a",
        },
        accent: {
          50: "#fff4ea",
          100: "#ffe3c7",
          200: "#ffc790",
          300: "#ffa855",
          400: "#f78d2e",
          500: "#F2790D",
          600: "#EA6A17",
          700: "#c2530f",
          800: "#8f3d0c",
          900: "#6b2e0a",
        },
        cream: {
          DEFAULT: "#FAF3EC",
          light: "#FDF8F3",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-plus-jakarta)", "var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;