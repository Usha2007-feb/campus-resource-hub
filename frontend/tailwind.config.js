/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#696FC7",
        secondary: "#A7AAE1",
        accent1: "#F5D3C4",
        accent2: "#F2AEBB",
      },
      fontFamily: {
        pop: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};
