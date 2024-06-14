/ @type {import('tailwindcss').Config} */;
const plugin = require('tailwindcss/plugin');

module.exports = {
  // mode: "jit",
  content: ['./docs/.vitepress/**/*.{js,ts,vue}', './docs/**/*.md'],
  theme: {
    extend: {
      // colors: {
      //   primary: "#bf9b46",
      //   "primary-200": "#f5dfa9",
      // },
    },
    textShadow: {
      sm: '1px 1px 2px rgba(0, 0, 0, .5)',
      DEFAULT: '2px 2px 4px rgba(0, 0, 0, .5)',
      lg: '4px 4px 8px rgba(0, 0, 0, .5)',
      xl: '4px 4px 16px rgba(0, 0, 0, .5)',
    },
  },
  important: true,
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') },
      );
    }),
  ],
};
