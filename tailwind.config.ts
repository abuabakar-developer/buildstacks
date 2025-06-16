import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'plus-jakarta': ['var(--font-plus-jakarta)'],
        'syne': ['var(--font-syne)'],
        'inter': ['var(--font-inter)'],
        'space-grotesk': ['var(--font-space-grotesk)'],
        'outfit': ['var(--font-outfit)'],
      },
      animation: {
        'slow-spin': 'spin 20s linear infinite',
        'gradient': 'gradient 8s linear infinite',
        'progress': 'progress 2s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
      },
      backgroundSize: {
        'size-200': '200% 200%',
      },
    },
  },
  plugins: [],
};

export default config; 