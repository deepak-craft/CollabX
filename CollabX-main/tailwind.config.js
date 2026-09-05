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
        gov: {
          navy: '#0A2540',
          'navy-dark': '#061729',
          blue: '#1B365D',
          'blue-light': '#254E82',
          'blue-50': '#EFF6FF',
          saffron: '#E65100',
          'saffron-light': '#FFF3E0',
          'saffron-amber': '#FF9933',
          green: '#138808',
          'green-light': '#E8F5E9',
          'green-dark': '#0d5c05',
          gold: '#B8860B',
          gray: '#475569',
          border: '#CBD5E1',
          bg: '#F8FAFC',
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'gov': '0 1px 3px 0 rgba(10, 37, 64, 0.08), 0 1px 2px -1px rgba(10, 37, 64, 0.08)',
        'gov-md': '0 4px 6px -1px rgba(10, 37, 64, 0.1), 0 2px 4px -2px rgba(10, 37, 64, 0.08)',
        'gov-lg': '0 10px 15px -3px rgba(10, 37, 64, 0.12), 0 4px 6px -4px rgba(10, 37, 64, 0.08)',
      },
    },
  },
  plugins: [],
};
