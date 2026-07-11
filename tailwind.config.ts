import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        minecraft: ["Minecraft", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
