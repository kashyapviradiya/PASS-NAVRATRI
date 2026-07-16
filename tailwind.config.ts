import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navratri: {
          primary: "#090909",       // Primary Black
          secondary: "#121212",     // Soft Black
          accent: "#E53935",        // Premium Red
          darkAccent: "#B71C1C",    // Deep Red
          bg: "#F8F7F4",            // Warm White
          lightGrey: "#E8E8E8",     // Light Grey
          muted: "#A3A3A3",         // Muted Grey
          text: "#111111",          // Main text
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-jakarta)', 'sans-serif'],
      },
      borderRadius: {
        'card': '18px',
        'button': '14px',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
