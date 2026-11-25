/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        lemana: {
          yellow: '#FFCC00',
          yellowHover: '#F2BE00',
          yellowSoft: '#FFF8D6',
          black: '#141414',
          charcoal: '#242424',
          promoRed: '#D9232E',
        },
        studio: {
          cream: '#F7F5F0',
          sand: '#EFECE6',
          stone: '#E4DFD7',
          taupe: '#8C857B',
          ink: '#181818',
        },
      },
      fontFamily: {
        sans: ['"Manrope"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      boxShadow: {
        editorial: '0 20px 50px -15px rgba(20, 20, 20, 0.08)',
        card: '0 8px 30px rgba(20, 20, 20, 0.05)',
      },
    },
  },
  plugins: [],
};
