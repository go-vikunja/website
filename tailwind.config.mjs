/** @type {import('tailwindcss').Config} */
export default {
	theme: {
		extend: {
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
}
