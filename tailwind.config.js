/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF4500",
        "accent-orange": "#FF4500",
        "neon-purple": "#8B008B",
        "vibrant-purple": "#D12D6F",
        "reddish-purple": "#C026D3",
        "background-black": "#000000",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        robot: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
