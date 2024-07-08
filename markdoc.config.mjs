import {defineMarkdocConfig, nodes, component} from '@astrojs/markdoc/config'
import shiki from '@astrojs/markdoc/shiki'

export default defineMarkdocConfig({
	extends: [
		shiki({
			themes: {
				light: 'github-light',
				dark: 'min-dark',
			},

			colorReplacements: {
				'min-light': {
					'#c2c3c5': '#808080',
				},
			},
		}),
	],
	tags: {
		callout: {
			render: component('./src/components/Callout.astro'),
			attributes: {
				type: {type: String},
			},
		},
	},
	nodes: {
		heading: {
			...nodes.heading,
			render: component('./src/components/Heading.astro'),
		},
	},
})