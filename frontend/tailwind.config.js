/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        starwars: ['"Star Jedi"', 'sans-serif'], 
      },
    }
  },
  plugins: [],
}

