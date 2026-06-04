/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  // Добавьте эту строку:
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
};
