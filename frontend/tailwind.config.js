/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'stellar-blue': '#7F8DFF',
        'stellar-teal': '#21D4FD',
        'stellar-purple': '#B721FF',
        'bg-deep': '#0D0F18',
        'bg-card': '#1A1D2E',
        'bg-light': '#F8FAFC',
        'text-star': '#FFFFFF',
        'text-muted': '#94A3B8',
        'text-dark': '#1E293B',
        'text-dark-muted': '#64748B',
      },
      boxShadow: {
        'orbit': '0 8px 32px rgba(33, 212, 253, 0.15)',
        'orbit-lg': '0 20px 50px rgba(33, 212, 253, 0.2)',
      },
    },
  },
  plugins: [],
}
