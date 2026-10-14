/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0F2D4A',
          teal: '#0F8A83',
          gold: '#C7A55A',
          offwhite: '#FAFAF7',
          charcoal: '#2D3748',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['Cairo', 'Noto Sans Arabic', 'Tajawal', 'sans-serif'],
      },
      boxShadow: {
        'glow-teal': '0 0 25px -5px rgba(15, 138, 131, 0.45)',
        'glow-gold': '0 0 25px -5px rgba(199, 165, 90, 0.45)',
      },
    },
  },
  plugins: [],
};
