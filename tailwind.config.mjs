const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'selector',
	theme: {
		extend: {
			colors: {
				primary: {
					lighter: '#3b7aec',
					DEFAULT: '#196aff',
					darker: '#0064ff',
				},
			},
			fontFamily: {
				display: ['Quicksand', ...defaultTheme.fontFamily.sans],
				sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
			},
			backgroundImage: {
				'hero-llama': "url('/images/bg-3.jpg')",
				'hero-llama-small': "url('/images/hero-llamas-small.jpg')",
				'hero-llama-2-small': "url('/images/hero-llamas-2-small.jpg')",
				'hero-llama-3-small': "url('/images/hero-llamas-3-small.jpg')",
			},
			typography: ({ theme }) => ({
				DEFAULT: {
					css: {
						code: {
							borderRadius: theme('borderRadius.sm'),
							paddingTop: theme('padding[0.5]'),
							paddingRight: theme('padding[1]'),
							paddingBottom: theme('padding[0.5]'),
							paddingLeft: theme('padding[1]'),
						},
						'code::before': {
							content: 'normal',
						},
						'code::after': {
							content: 'normal',
						},
						th: {
							textAlign: 'left',
						},
					},
				},
			}),

		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/aspect-ratio'),
	],
}
