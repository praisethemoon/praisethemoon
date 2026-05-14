import type { Config } from "tailwindcss";
import daisyui from 'daisyui'
import { ThemeConfig } from "tailwindcss/types/config";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['VT323', 'ui-monospace', 'monospace'],
        pixelTitle: ['"Press Start 2P"', 'VT323', 'monospace'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        moon: {
          night: '#0a0e1f',
          deep: '#070912',
          dusk: '#1a1f3a',
          silver: '#e8e6d8',
          glow: '#fff8d6',
          mist: '#9aa7c7',
        },
      },
      typography: (_theme: ThemeConfig) => ({
        DEFAULT: {
          css: {
            maxWidth: '1000px',
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography"), daisyui],
  daisyui: {
    themes: [
      {
        moonnight: {
          "primary": "#e8e6d8",
          "primary-content": "#0a0e1f",
          "secondary": "#fff8d6",
          "secondary-content": "#0a0e1f",
          "accent": "#9aa7c7",
          "accent-content": "#0a0e1f",
          "neutral": "#1a1f3a",
          "neutral-content": "#e8e6d8",
          "base-100": "#0a0e1f",
          "base-200": "#070912",
          "base-300": "#1a1f3a",
          "base-content": "#e8e6d8",
          "info": "#9aa7c7",
          "success": "#a8d8b9",
          "warning": "#f6d186",
          "error": "#f08080",
        },
      },
    ],
  },
};
export default config;
