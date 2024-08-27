/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#9A3B3B",

        secondary: {
          100: "#C08261",
          300: "#E2C799",
          400: "#F2ECBE",
          200: "#734e3a",
          500: "#662727",
        },
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
