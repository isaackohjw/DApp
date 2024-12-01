import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#1e1e1e",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        title: ["Montserrat", "sans-serif"],
        body: ["Barlow", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
