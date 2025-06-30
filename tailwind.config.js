/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5B4FE8',
          50: '#F3F2FF',
          100: '#E8E5FF',
          200: '#D4CCFF',
          300: '#B5A3FF',
          400: '#9775FF',
          500: '#5B4FE8',
          600: '#4C3FD4',
          700: '#3D32A8',
          800: '#2F2580',
          900: '#1F1A5C'
        },
        secondary: {
          DEFAULT: '#8B85F0',
          50: '#F7F6FF',
          100: '#EFEDFF',
          200: '#E2DDFF',
          300: '#CFC7FF',
          400: '#B8ADFF',
          500: '#8B85F0',
          600: '#7B73E8',
          700: '#6B61E0',
          800: '#5B4FD8',
          900: '#4B3DC0'
        },
        accent: {
          DEFAULT: '#F59E0B',
          50: '#FEF7E6',
          100: '#FDEFC0',
          200: '#FCE797',
          300: '#FBDF6E',
          400: '#F9D745',
          500: '#F59E0B',
          600: '#E88B08',
          700: '#DB7805',
          800: '#CE6502',
          900: '#B85500'
        },
        surface: {
          DEFAULT: '#F8F7FF',
          50: '#FDFDFF',
          100: '#F8F7FF',
          200: '#F2F1FC',
          300: '#EEECF9',
          400: '#E8E6F6',
          500: '#E2E0F3',
          600: '#DCDAF0',
          700: '#D6D4ED',
          800: '#D0CEEA',
          900: '#CAC8E7'
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717'
        },
        success: {
          DEFAULT: '#10B981',
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          300: '#6EE7B7',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B'
        },
        warning: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F'
        },
        error: {
          DEFAULT: '#EF4444',
          50: '#FEF2F2',
          100: '#FEE2E2',
          200: '#FECACA',
          300: '#FCA5A5',
          400: '#F87171',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
          800: '#991B1B',
          900: '#7F1D1D'
        },
        info: {
          DEFAULT: '#3B82F6',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A'
        }
      },
      fontFamily: { 
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        display: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui']
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem'
      },
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.05)',
        'soft-md': '0 4px 12px 0 rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 8px 24px 0 rgba(0, 0, 0, 0.12)',
        'soft-xl': '0 12px 32px 0 rgba(0, 0, 0, 0.15)',
        'primary': '0 4px 16px 0 rgba(91, 79, 232, 0.2)',
        'primary-lg': '0 8px 24px 0 rgba(91, 79, 232, 0.25)'
      },
      backgroundImage: {
        'gradient-violet': 'linear-gradient(135deg, #5B4FE8 0%, #8B85F0 100%)',
        'gradient-surface': 'linear-gradient(135deg, #F8F7FF 0%, #FFFFFF 100%)',
        'gradient-accent': 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
        'gradient-soft': 'linear-gradient(135deg, #FAFAFA 0%, #FFFFFF 100%)'
      }
    },
  },
  plugins: [],
}