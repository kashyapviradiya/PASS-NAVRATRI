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
          primary: "#7C3AED",       // Royal Purple
          secondary: "#FF4D6D",     // Premium Pink
          accent: "#00E5FF",        // Neon Cyan
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
          bg: "#F8FAFC",            // Light Background
          darkBg: "#0F172A",        // Dark Background
          lightGrey: "#E2E8F0",     // Slate 200
          muted: "#64748B",         // Slate 500
          text: "#0F172A",          // Slate 900
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-jakarta)', 'sans-serif'],
      },
      borderRadius: {
        'card': '24px',
        'button': '9999px', // Pill shape for premium buttons
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-premium": "linear-gradient(135deg, #7C3AED 0%, #FF4D6D 100%)",
        "gradient-cyan": "linear-gradient(135deg, #7C3AED 0%, #00E5FF 100%)",
        "gradient-dark": "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
        "gradient-dark-deep": "linear-gradient(180deg, #0F172A 0%, #1E1B4B 60%, #312E81 100%)",
        "shimmer-gradient": "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(124, 58, 237, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 6px 16px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 30px rgba(124, 58, 237, 0.12), 0 2px 8px rgba(0,0,0,0.04)',
        'float': '0 20px 60px -15px rgba(0,0,0,0.15)',
        'glow-purple': '0 0 40px rgba(124, 58, 237, 0.15)',
        'glow-cyan': '0 0 40px rgba(0, 229, 255, 0.15)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.1)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'scale-in': 'scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scan: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
