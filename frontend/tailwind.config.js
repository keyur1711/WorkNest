/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f3f7ff',
          100: '#e6efff',
          200: '#c5d7ff',
          300: '#9fbaff',
          400: '#6d92ff',
          500: '#3b6bff',
          600: '#184dff',
          700: '#0e3fe0',
          800: '#0e33b3',
          900: '#102c8c'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif']
      },
      boxShadow: {
        card: '0 10px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.06)'
      },
      writingMode: {
        'vertical': 'vertical-rl'
      }
    }
  },
  plugins: []
};


