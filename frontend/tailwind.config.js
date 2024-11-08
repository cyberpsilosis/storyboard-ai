/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        surface: 'hsl(var(--surface))',
        text: 'hsl(var(--text))',
        'terminal-bg': 'hsl(var(--terminal-bg))',
        'terminal-border': 'hsl(var(--terminal-border))',
        'terminal-text': 'hsl(var(--terminal-text))',
        'input-bg': 'hsl(var(--input-bg))',
        'input-border': 'hsl(var(--input-border))',
        'secondary-text': 'hsl(var(--secondary-text))',
      },
      fontFamily: {
        mono: ['Space Mono', 'monospace'],
      },
      boxShadow: {
        'input': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}

