/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Paleta principal — cálida y amigable para niños
        primary: {
          50: '#FFF5E6',
          100: '#FFE4B8',
          200: '#FFD080',
          300: '#FFBB4D',
          400: '#FFA726',
          500: '#FF9800', // naranja principal
          600: '#FB8C00',
          700: '#F57C00',
          800: '#EF6C00',
          900: '#E65100',
        },
        secondary: {
          50: '#E8F5E9',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#4CAF50', // verde mascota
          600: '#43A047',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
        },
        accent: {
          50: '#F3E5F5',
          100: '#E1BEE7',
          200: '#CE93D8',
          300: '#BA68C8',
          400: '#AB47BC',
          500: '#9C27B0', // violeta gemas
          600: '#8E24AA',
          700: '#7B1FA2',
          800: '#6A1B9A',
          900: '#4A148C',
        },
        // Emociones — para visualizaciones en dashboard parental
        emotion: {
          joy: '#FFD700',
          sadness: '#5B9BD5',
          anger: '#E74C3C',
          fear: '#8E44AD',
          calm: '#2ECC71',
          frustration: '#E67E22',
        },
        // Rareza del marketplace
        rarity: {
          common: '#9E9E9E',
          rare: '#2196F3',
          epic: '#9C27B0',
          legendary: '#FF9800',
        },
      },
      fontFamily: {
        // Se agregarán custom fonts en Fase 3
        kid: ['SpaceMono'],
        parent: ['SpaceMono'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [],
};
