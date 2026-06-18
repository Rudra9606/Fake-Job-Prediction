/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep modern slate and indigo colors for premium dark/glassmorphic theme
        brand: {
          dark: '#030712',      // rich dark gray-black
          card: 'rgba(17, 24, 39, 0.7)', // semi-trans gray
          border: 'rgba(255, 255, 255, 0.08)',
          glow: 'rgba(99, 102, 241, 0.15)',  // indigo glow
          accent: '#6366f1',    // indigo-500
          success: '#10b981',   // emerald-500
          warning: '#f59e0b',   // amber-500
          danger: '#ef4444',    // red-500
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
