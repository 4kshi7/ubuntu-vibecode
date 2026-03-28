/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ubuntu: {
          orange: '#e95420',
          dark: '#1e1e1e',
          light: '#f5f5f5',
          panel: 'rgba(45, 45, 45, 0.85)',
          window: '#252525'
        }
      },
      fontFamily: {
        ubuntu: ['Ubuntu', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
