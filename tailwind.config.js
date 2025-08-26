/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          md: "4rem",
          lg: "5rem",
          xk: "5rem",
        },
      },
    },
  },
  plugins: [
    // require("@tailwindcss/line-clamp"),
    function ({ addComponents }) {
      // Create our own container component
      // and ask tailwind to take it into account.
      addComponents({
        ".container": {
          maxWidth: "94vw",
          marginLeft: "auto",
          marginRight: "auto",
          "@screen sm": {
            maxWidth: "75vw",
          },
          "@screen xl": {
            maxWidth: "1000px",
          },
        },
        ".container-other": {
          maxWidth: "90vw",
          marginLeft: "auto",
          marginRight: "auto",
          "@screen sm": {
            maxWidth: "85vw",
          },
          "@screen xl": {
            maxWidth: "1280px",
          },
        },
      });
    },
  ],
};
