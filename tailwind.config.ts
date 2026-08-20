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
          bg: "#FAF8F6",
          card: "#FFFFFF",
          softBg: "#F5F0ED",
          primary: "#6B1D32",
          dark: "#1A1A1A",
          text: "#2D2024",
          muted: "#8C7A80",
          border: "#E8E0DD",
          lightGrey: "#E8E0DD",
          accent: "#E53935",
          gold: "#C9A84C",
          darkAccent: "#B71C1C",
          success: "#16A34A",
          warning: "#F59E0B",
          danger: "#DC2626",
          info: "#2563EB",
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-lg': ['2.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-md': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-sm': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
      },
      borderRadius: {
        'card': '20px',
        'button': '12px',
        'pill': '9999px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        'section-sm': '3rem',
        'section-md': '5rem',
        'section-lg': '7rem',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-premium": "linear-gradient(135deg, #6B1D32 0%, #8B2A45 100%)",
        "gradient-dark": "linear-gradient(135deg, #1A1A1A 0%, #2D2024 100%)",
        "gradient-warm": "linear-gradient(180deg, #FAF8F6 0%, #F5F0ED 100%)",
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0,0,0,0.04)',
        'card': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        'card-hover': '0 10px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
        'elevated': '0 12px 40px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05)',
        'premium': '0 4px 14px 0 rgba(107, 29, 50, 0.15)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
        'float': '0 20px 60px -15px rgba(0,0,0,0.08)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.1)',
      },
      transitionDuration: {
        'smooth': '200ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scan: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(100%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
