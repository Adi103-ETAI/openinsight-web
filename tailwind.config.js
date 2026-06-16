/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design system colors
        'bg': '#FAFAF8',
        'surface': '#FFFFFF',
        'surface-2': '#F5F0E8',
        'dark': '#1C1B1A',
        'dark-2': '#2B2B29',
        'text': '#1C1B1A',
        'text-2': '#5A5955',
        'text-3': '#8A8884',
        'accent': '#C56B4A',
        'accent-2': '#A3522F',
        'accent-pale': '#F4E6DF',
        'border': '#E8E4DC',
        'border-dark': '#2F2E2C',
      },
      fontFamily: {
        'serif': ['\'DM Serif Display\'', 'Georgia', 'serif'],
        'sans': ['\'DM Sans\'', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '1.5' }],
        'sm': ['14px', { lineHeight: '1.6' }],
        'base': ['16px', { lineHeight: '1.7' }],
        'lg': ['18px', { lineHeight: '1.6' }],
        'xl': ['22px', { lineHeight: '1.5' }],
        '2xl': ['28px', { lineHeight: '1.3' }],
        '3xl': ['36px', { lineHeight: '1.2' }],
        '4xl': ['48px', { lineHeight: '1.15' }],
        '5xl': ['64px', { lineHeight: '1.1' }],
      },
      spacing: {
        '8': '8px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
        '64': '64px',
        '96': '96px',
        '128': '128px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
        'pill': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 16px rgba(0, 0, 0, 0.07)',
        'lg': '0 8px 32px rgba(0, 0, 0, 0.09)',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        chevronBounce: {
          '0%, 100%': {
            opacity: '0.5',
            transform: 'translateY(0)',
          },
          '50%': {
            opacity: '1',
            transform: 'translateY(8px)',
          },
        },
        pulse: {
          '0%, 100%': {
            opacity: '1',
          },
          '50%': {
            opacity: '0.5',
          },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 500ms ease-out forwards',
        typewriter: 'typewriter 2s steps(40, end)',
        chevronBounce: 'chevronBounce 2s infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      transitionDuration: {
        '150': '150ms',
        '300': '300ms',
        '500': '500ms',
        '800': '800ms',
      },
      maxWidth: {
        '7xl': '80rem',
      },
    },
  },
  plugins: [],
};
