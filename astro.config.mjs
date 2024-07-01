import {defineConfig, envField} from 'astro/config'
import tailwind from '@astrojs/tailwind'
import markdoc from '@astrojs/markdoc'

import node from '@astrojs/node'

// https://astro.build/config
export default defineConfig({
	site: 'https://vikunja.io',
	output: 'hybrid',
	integrations: [tailwind(), markdoc()],
	adapter: node({
		mode: 'standalone',
	}),
	experimental: {
		env: {
			schema: {
				TURNSTILE_SECRET: envField.string({context: 'server', access: 'secret'}),
			},
		},
	},
})