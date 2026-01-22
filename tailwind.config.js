/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#11D473",
        "background-light": "#FDFBF7",
        "background-dark": "#102219",
        "surface-dark": "#1c2620",
      },
      fontFamily: {
        display: ["Lexend", "sans-serif"],
        arabic: ["Amiri", "serif"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
}
