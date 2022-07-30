module.exports = {
  content: ["./public/**/*.{html,js}", "./src/js/*.{html,js}"],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      // padding: "1rem",
    },
    extend: {
      fontFamily: {
        // sans: ["Vazir"],
        Poppins: ["Poppins", "sans - serif"],
      },
      fontSize: {
        "2xs": [
          "10px",
          {
            lineHeight: "12px",
          },
        ],
      },
      screens: {
        "2xs": "375px",
        xs: "425px",
        "3xl": "1440px",
      },
    },
  },
  plugins: [],
};
