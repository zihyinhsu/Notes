/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './docs/.vitepress/**/*.{js,ts,vue}',
		'./docs/**/*.md',
  ],
  options: {
    safelist: ["html", "body"],
  },
};