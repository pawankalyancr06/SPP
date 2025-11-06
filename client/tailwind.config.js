/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Yellow and Black palette
        primary: '#FFD400', // vibrant yellow for accents / CTAs
        secondary: '#000000', // black background
        neutral: '#FFFFFF', // white text
        muted: '#9CA3AF', // muted gray for secondary text
        danger: '#FF4D4D', // danger red
        success: '#00C27A', // success green
        accent2: '#FFB800', // darker yellow/gold accent
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FFD400, #FFB800)',
        'gradient-hero': 'linear-gradient(135deg, rgba(255,212,0,0.08), rgba(255,184,0,0.06))',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(255,212,0,0.45)',
        'glow-soft': '0 0 14px rgba(255,184,0,0.35)',
        'neon': '0 0 10px rgba(255,212,0,0.9), 0 0 20px rgba(255,184,0,0.6)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

