// /** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

const config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blackgray: "#919191",
        primary: "#3498db",
        secondary: "#72c02c",
        gray: "#f5f5f5",
        lightgray: "#929292",
        darkgray: "#051a23",
      },
      fontSize: {
        xs: ".75rem",
        sm: ".875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "4rem",
        "9xl": "6.25rem",
      },
      height: {
        110: "28.5rem",
      },
    },
  },
  plugins: [],
};

module.exports = withMT(config);
