/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#FAF6F1',
        'paper-warm': '#F5EFE7',
        red: '#D4443D',
        maroon: '#8B3A36',
        terracotta: '#C85A3A',
        saffron: '#F4A460',
        blush: '#F5DCD0',
        muted: '#E8DDD3',
        ink: '#2C2C2C',
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        serif: ['Crimson Text', 'serif'],
        body: ['Inter', 'sans-serif'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      }
    },
  },
  plugins: [],
}
