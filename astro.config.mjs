import {defineConfig, envField} from 'astro/config'
import tailwind from '@astrojs/tailwind'
import markdoc from '@astrojs/markdoc'

import cloudflare from '@astrojs/cloudflare'
// import node from '@astrojs/node'

// https://astro.build/config
export default defineConfig({
	output: 'hybrid',
	integrations: [tailwind(), markdoc()],
	adapter: cloudflare(),
	experimental: {
		env: {
			schema: {
				TURNSTILE_SECRET: envField.string({context: 'server', access: 'secret'}),
			},
		},
	},
})