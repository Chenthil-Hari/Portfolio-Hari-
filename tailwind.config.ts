import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
        display: [
          'Syne',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },
      colors: {
        canvas: {
          DEFAULT: '#030305',
          surface: '#090a0d',
          raised: '#0f1015',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.05)',
          strong: 'rgba(255, 255, 255, 0.10)',
        },
        accent: {
          DEFAULT: '#3b82f6',
          hover: '#60a5fa',
          muted: 'rgba(59, 130, 246, 0.08)',
        },
      },
    },
  },
  plugins: [],
}

export default config
