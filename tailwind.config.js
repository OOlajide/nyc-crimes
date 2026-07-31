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
        background: '#050811',
        tactical: {
          dark: '#080d1a',
          surface: '#0d1527',
          border: '#1b2a47',
          amber: '#ffaa00',
          cyan: '#00f0ff',
          crimson: '#ff2e5b',
          emerald: '#10b981',
        }
      },
      fontFamily: {
        display: ['Chakra Petch', 'sans-serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'hud-amber': '0 0 15px -2px rgba(255, 170, 0, 0.35)',
        'hud-cyan': '0 0 15px -2px rgba(0, 240, 255, 0.35)',
        'hud-crimson': '0 0 15px -2px rgba(255, 46, 91, 0.35)',
      }
    },
  },
  plugins: [],
}
