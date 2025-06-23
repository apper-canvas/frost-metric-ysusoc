/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B4FE8',
        secondary: '#8B85F0',
        accent: '#F59E0B',
        surface: '#F8F7FF',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6'
      },
      fontFamily: { 
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui']
      },
      backgroundImage: {
        'gradient-violet': 'linear-gradient(135deg, #5B4FE8 0%, #8B85F0 100%)',
        'gradient-surface': 'linear-gradient(135deg, #F8F7FF 0%, #FFFFFF 100%)'
      }
    },
  },
  plugins: [],
}