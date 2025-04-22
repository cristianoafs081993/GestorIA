/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        border: '#e5e7eb', // Cor padrão do Tailwind para borda (gray-200)
        background: '#ffffff', // Cor padrão para background
        foreground: '#18181b', // Cor padrão para texto (cinza escuro)
      },
    },
  },
  plugins: [],
};
