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
          bg: "#EFE9E9",            // Main Page Background
          card: "#FFFFFF",          // Card/Surface Background
          softBg: "#F6F1F2",        // Soft Section Background
          primary: "#5A2132",       // Primary Brand Maroon
          dark: "#5A2132",          // Headings / Dark / Footer
          text: "#5A2132",          // Primary Text
          muted: "#6F5A61",         // Secondary Text
          border: "#DED3D6",        // Borders and Dividers
          
          // Semantic statuses (Must be restrained)
          success: "#22C55E",
          warning: "#F59E0B",
          danger: "#EF4444",
          info: "#3B82F6",
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-jakarta)', 'sans-serif'],
      },
      borderRadius: {
        'card': '24px',
        'button': '9999px',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        'premium': '0 4px 14px 0 rgba(90, 33, 50, 0.2)', // Updated subtle maroon shadow
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 2px 8px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.03)',
        'float': '0 20px 60px -15px rgba(0,0,0,0.08)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
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
