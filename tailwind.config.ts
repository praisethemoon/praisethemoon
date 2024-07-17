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
    typography: (theme: ThemeConfig) => ({
      DEFAULT: {
        css: {
          maxWidth: '1000px', // Remove the max-width or set a specific value
        },
      },
    }),
  },
  },
  plugins: [require("@tailwindcss/typography"), daisyui],
  daisyui: {
    themes: ["lofi"]
  },
};
export default config;
