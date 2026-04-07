/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#e6e8f0',
          100: '#cdd1e1',
          200: '#9ba3c3',
          300: '#6975a5',
          400: '#374787',
          500: '#051969',
          600: '#041454',
          700: '#030f3f',
          800: '#020a2a',
          900: '#010515',
          950: '#00030a',
        },
        gold: {
          50: '#fff9e6',
          100: '#fff3cd',
          200: '#ffe79b',
          300: '#ffdb69',
          400: '#ffcf37',
          500: '#ffc305',
          600: '#cc9c04',
          700: '#997503',
          800: '#664e02',
          900: '#332701',
          950: '#1a1301',
        },
      },
    },
  },
  plugins: [],
};
