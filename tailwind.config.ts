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
        primary: {
          50: '#e6f7ff',
          100: '#b3e5fc',
          200: '#81d4fa',
          300: '#4fc3f7',
          400: '#29b6f6',
          500: '#03a9f4',
          600: '#039be5',
          700: '#0288d1',
          800: '#0277bd',
          900: '#01579b',
        },
        dark: {
          50: '#e3e8ef',
          100: '#b9c5d7',
          200: '#8d9fbc',
          300: '#6179a1',
          400: '#425d8c',
          500: '#234177',
          600: '#1e3b6f',
          700: '#183264',
          800: '#122a59',
          900: '#0a1929',
          950: '#060f1a',
        },
        accent: {
          cyan: '#4dd0e1',
          teal: '#26c6da',
          green: '#10b981',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(180deg, #0a1929 0%, #1a3a5c 50%, #2d5a7b 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'progress': 'progress 2s ease-in-out infinite',
      },
      keyframes: {
        progress: {
          '0%': { strokeDashoffset: '100' },
          '50%': { strokeDashoffset: '50' },
          '100%': { strokeDashoffset: '100' },
        }
      }
    },
  },
  plugins: [],
};
export default config;



