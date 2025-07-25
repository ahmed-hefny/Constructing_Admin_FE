/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  important: true,
  theme: {
    extend: {
      // Add RTL-specific utilities
      spacing: {
        'rtl': '0',
      },
    },
  },
  plugins: [],
}

