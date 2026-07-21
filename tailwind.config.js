/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: '#08080B',
        foreground: '#EAEAE6',
        primary: '#FF6200',
        card: '#131318',
        'card-border': '#1C1C23',
        input: '#0B0B0F',
        'input-border': '#1C1C23',
        'text-secondary': '#9A9AA2',
        'text-tertiary': '#76767E',
        success: '#FF8C00',
        destructive: '#FF3D3D',
      },
      fontFamily: {
        display: ['Bebas Neue', 'system-ui', 'sans-serif'],
        sans: ['Syne', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
