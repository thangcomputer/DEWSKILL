/** Bảng màu bám theo LMS: xanh ngọc (emerald) + vàng XP + cam streak. */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dew: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          200: '#A7F3D0',
          400: '#34D399',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        xp: '#F59E0B',
        streak: '#F97316',
        ink: '#0F172A',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        // Góc bo kiểu giọt nước: một góc nhọn, ba góc tròn.
        drop: '2rem 2rem 2rem 0.5rem',
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        floaty: 'floaty 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

