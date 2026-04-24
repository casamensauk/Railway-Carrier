import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#1a1410',
          panel: '#231b16',
          border: '#3a2d24',
        },
        ink: {
          DEFAULT: '#f5ede4',
          muted: '#a99a8a',
          dim: '#7a6d61',
        },
        accent: {
          DEFAULT: '#d97706',
          soft: '#b45309',
          glow: 'rgba(217, 119, 6, 0.18)',
        },
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
