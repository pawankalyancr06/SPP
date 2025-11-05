/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00FF87',
        secondary: '#111827',
        accent1: '#FF4B2B',
        accent2: '#1E90FF',
        neutral: '#F3F4F6',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #00FF87, #1E90FF)',
        'gradient-hero': 'linear-gradient(135deg, rgba(0,255,135,0.1), rgba(30,144,255,0.1))',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0,255,135,0.5)',
        'glow-blue': '0 0 20px rgba(30,144,255,0.5)',
        'glow-red': '0 0 20px rgba(255,75,43,0.5)',
        'neon': '0 0 10px rgba(0,255,135,0.8), 0 0 20px rgba(0,255,135,0.6)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

