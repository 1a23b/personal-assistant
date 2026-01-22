/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          DEFAULT: '#1890FF',
          hover: '#40A9FF',
          active: '#096DD9',
        },
        // Functional colors
        success: '#52C41A',
        warning: '#FAAD14',
        error: '#F5222D',
        info: '#1890FF',
        // Neutral colors
        text: {
          primary: '#262626',
          secondary: '#595959',
          tertiary: '#8C8C8C',
        },
        border: '#D9D9D9',
        background: '#FFFFFF',
        fill: '#F5F5F5',
        // Special colors
        gold: '#FFD700',
        silver: '#C0C0C0',
        bronze: '#CD7F32',
        highlight: '#E6F7FF',
      },
      borderRadius: {
        'card': '12px',
        'login': '16px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.12)',
        'login': '0 8px 32px rgba(0,0,0,0.1)',
        'header': '0 2px 8px rgba(0,0,0,0.08)',
        'dropdown': '0 4px 16px rgba(0,0,0,0.12)',
        'button': '0 2px 4px rgba(0,0,0,0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 1000ms ease-in-out',
        'flip': 'flip 600ms ease-in-out',
        'slide-down': 'slideDown 300ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '1000': '1000ms',
      },
    },
  },
  plugins: [],
}
