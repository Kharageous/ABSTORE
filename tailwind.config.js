/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#000000", // Black
        secondary: "#ffffff", // White
        hover: "#1a1a1a", // Darker black for hover
        active: "#333333", // Even darker black for active
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // For form styling
  ],
};
