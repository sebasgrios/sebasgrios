/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			backgroundColor: {
				'light': '#F9F9FB',
				'dark': '#060604',
			},
			colors: {
				'primary': '',
				'secondary': ''
			}
		},
	},
	plugins: [],
}
