/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B1114',
        surface: '#111A1F',
        border: '#243742',
        emerald: {
          500: '#10B981',
          600: '#059669',
        },
      },
      animation: {
        'bounce-short': 'bounce 1s ease-in-out 2',
      }
    },
  },
  plugins: [],
};
