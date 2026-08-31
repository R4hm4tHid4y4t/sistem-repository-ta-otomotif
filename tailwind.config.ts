import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eef2f9",
          100: "#d7e0f0",
          200: "#b0c2e0",
          300: "#7f9cc9",
          400: "#4f72a8",
          500: "#325487",
          600: "#22406d",
          700: "#1c3559",
          800: "#172b48",
          900: "#13223a",
        },
        accent: {
          50: "#fff4ec",
          100: "#ffe4cc",
          200: "#ffc699",
          300: "#ffa666",
          400: "#ff8c3d",
          500: "#f5730f",
          600: "#d75e08",
          700: "#b34a06",
          800: "#8f3a08",
          900: "#742f08",
        },
      },
    },
  },
  plugins: [],
};
export default config;