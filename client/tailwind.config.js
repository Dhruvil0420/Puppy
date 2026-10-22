/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#fffdf8',
        honey: '#fce3b4',
        'honey-light': '#fef7e9',
        cocoa: '#2a170e',
        'cocoa-light': '#543d31',
        apricot: '#b8582b',
        'apricot-dark': '#8c3d18',
        'apricot-light': '#faeee6',
        gold: '#e4a352',
        sand: '#f5edd8',
        milk: '#ffffff',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        scrawl: ['Caveat', 'cursive'],
        plush: ['Fraunces', 'serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(42, 23, 14, 0.06)',
        card: '0 10px 30px -10px rgba(42, 23, 14, 0.08), 0 4px 12px -2px rgba(42, 23, 14, 0.04)',
        float: '0 20px 40px -15px rgba(42, 23, 14, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
