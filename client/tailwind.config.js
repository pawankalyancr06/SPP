/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Professional sports palette
        primary: '#FFD400', // vivid yellow for accents / CTAs
        secondary: '#071428', // deep navy background
        neutral: '#F8FAFC', // primary readable text (off-white)
        muted: '#94A3B8', // muted gray for secondary text
        danger: '#E53E3E', // cancelled / danger (red)
        accent2: '#FF6B35', // secondary accent (orange)
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FFD400, #FFC700)',
        'gradient-hero': 'linear-gradient(135deg, rgba(255,212,0,0.08), rgba(255,199,0,0.06))',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255,212,0,0.45)',
        'glow-soft': '0 0 14px rgba(255,199,0,0.35)',
        'neon': '0 0 10px rgba(255,212,0,0.9), 0 0 20px rgba(255,199,0,0.6)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

