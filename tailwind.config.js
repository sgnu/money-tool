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
        "success": "#a6e3a1",
        "warning": "#f9e2af",
        "error": "#f38ba8",
        "neutral": "#313244",
        "base-100": "#1e1e2e",
        "base-200": "#181825",
        "base-300": "#11111b"
      }
    }],
    base: true,
  }
}

