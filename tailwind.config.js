/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFF8EC',
        foam: '#FFFFFF',
        brown: '#2B211C',
        cocoa: '#6B5348',
        terracotta: '#6F3E22',
        clay: '#4A2817',
        leaf: '#5E7C4A',
        mist: '#E9DCCB',
        saffron: '#D98A32'
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'Segoe UI', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'Segoe UI', 'sans-serif']
      },
      boxShadow: {
        card: '0 8px 24px rgba(74, 40, 23, 0.06)',
        soft: '0 4px 14px rgba(74, 40, 23, 0.05)'
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        pop: {
          '0%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)' }
        },
        check: {
          from: { transform: 'scale(0.7)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        rise: 'rise 0.35s ease both',
        pop: 'pop 0.22s ease',
        check: 'check 0.35s ease both'
      }
    }
  },
  plugins: []
}
