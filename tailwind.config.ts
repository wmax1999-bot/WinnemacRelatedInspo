import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem"
      },
      colors: {
        brand: {
          DEFAULT: "#4fb2ff",
          dark: "#1a73e8"
        }
      }
    }
  },
  plugins: [],
} satisfies Config;
