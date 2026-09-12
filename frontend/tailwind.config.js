/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ember: {
          50: '#fff8f0',
          100: '#ffeedb',
          200: '#ffd6b3',
          300: '#ffb380',
          400: '#ff8547',
          500: '#ff5c1c',
          600: '#e63e05',
          700: '#b82a00',
          800: '#8c2204',
          900: '#4a1200',
          950: '#290900',
        },
        forest: {
          950: '#070d0b',
          900: '#0e1815',
          800: '#142420',
          700: '#1e342f',
          600: '#2b4942',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 15px rgba(255, 92, 28, 0.6))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 30px rgba(255, 140, 0, 0.9))' },
        }
      }
    },
  },
  plugins: [],
}
