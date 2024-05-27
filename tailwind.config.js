/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{
      catppuccin: {
        "primary": "#b4befe",
        "primary-content": "#1e1e2e",
        "secondary": "#74c7ec",
        "secondary-content": "#1e1e2e",
        "accent": "#f5c2e7",
        "accent-content": "#1e1e2e",
        "neutral": "#313244",
        "base-100": "#1e1e2e",
      }
    }],
    base: true,
  }
}

