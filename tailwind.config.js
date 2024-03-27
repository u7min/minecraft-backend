/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {},
  },
  darkMode: 'class', // or 'media' mode is available
  plugins: [require('@tailwindcss/forms')],
};
