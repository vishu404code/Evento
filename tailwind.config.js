/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: {
          DEFAULT: '#F5EFE6',
          sand: '#EDE3D3',
          dark: '#E2D5C3',
          light: '#FAF6F0',
        },
        cream: {
          DEFAULT: '#FBF8F3',
          pure: '#FFFFFF',
        },
        charcoal: {
          DEFAULT: '#2B2118',
          deep: '#1C150F',
          muted: '#4A3B2F',
        },
        mutedbrown: {
          DEFAULT: '#6B5D4F',
          light: '#8F7E6F',
        },
        terracotta: {
          DEFAULT: '#C4623A',
          dark: '#A54E2A',
          light: '#DC7953',
          soft: '#F6E5DC',
          hover: '#B35530',
        },
        cat: {
          ru: '#B9382C',
          'ru-bg': '#FDECEB',
          newton: '#2563A6',
          'newton-bg': '#E8F1FC',
          club: '#2E7D52',
          'club-bg': '#E9F5EE',
          personal: '#615C57',
          'personal-bg': '#EEECE9',
        }
      },
      fontFamily: {
        serif: ['Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 2px 6px -1px rgba(43, 33, 24, 0.05), 0 1px 3px -1px rgba(43, 33, 24, 0.03)',
        'warm': '0 8px 24px -4px rgba(43, 33, 24, 0.07), 0 2px 8px -2px rgba(43, 33, 24, 0.04)',
        'warm-lg': '0 16px 36px -6px rgba(43, 33, 24, 0.1), 0 6px 16px -4px rgba(43, 33, 24, 0.06)',
        'warm-xl': '0 24px 50px -10px rgba(43, 33, 24, 0.14), 0 10px 24px -5px rgba(43, 33, 24, 0.08)',
        'warm-inner': 'inset 0 2px 4px 0 rgba(43, 33, 24, 0.05)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}

