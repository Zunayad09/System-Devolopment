/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#185FA5",
        "primary-light": "#E6F1FB",
        "conf-high": "#1D9E75",
        "conf-high-bg": "#EAF3DE",
        "conf-med": "#EF9F27",
        "conf-med-bg": "#FAEEDA",
        "conf-low": "#E24B4A",
        "conf-low-bg": "#FCEBEB",
        "canvas-bg": "#0B0F14",
        surface: "#FFFFFF",
        surface2: "#F5F4F0",
        border: "#E2DFD5",
        border2: "#C8C5BB",
        muted: "#6B6960",
        hint: "#9B9890",
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
}
