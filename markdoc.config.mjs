import {defineMarkdocConfig, nodes, component} from '@astrojs/markdoc/config'
import shiki from '@astrojs/markdoc/shiki'

export default defineMarkdocConfig({
	extends: [
		shiki({
			themes: {
				light: 'github-light',
				dark: 'github-dark',
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
		dateMathExamples: {
			render: component('./src/components/partials/DateMathExamples.astro'),
		},
		configOptions: {
			render: component('./src/components/partials/ConfigOptions.astro'),
		},
		cloudHostingAffiliate: {
			render: component('./src/components/partials/CloudHostingAffiliate.astro'),
		}
	},
	nodes: {
		heading: {
			...nodes.heading,
			render: component('./src/components/Heading.astro'),
		},
	},
})