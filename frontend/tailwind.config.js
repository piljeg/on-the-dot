/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "pure-white": "#ffffff",
        "light-slate": "#68778d",
        "dark-slate": "#1f314f",
        "pattens-blue": "#D5E1EF",
      },
    },
  },
  plugins: [],
};
