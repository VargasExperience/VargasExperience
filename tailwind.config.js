/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ff1a1a",
        dark: "#050505",
        premium: "#0f1218"
      },
      boxShadow: {
        glow: "0 0 25px rgba(255, 26, 26, 0.6)",
        'glow-subtle': "0 0 15px rgba(255, 26, 26, 0.2)",
        'glow-white': "0 0 15px rgba(255, 255, 255, 0.1)",
      }
    }
  },
  plugins: []
}
