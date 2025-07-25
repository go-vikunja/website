import {defineConfig, envField} from 'astro/config'
import markdoc from '@astrojs/markdoc'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import sitemap from '@astrojs/sitemap'
import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
	site: 'https://vikunja.io',
	output: 'static',
	vite: {
		plugins: [
			tailwindcss(),
		],
	},
	integrations: [
		markdoc(),
		sitemap(),
	],
	adapter: cloudflare(),
	markdown: {
		rehypePlugins: [
			rehypeSlug,
			[
				// When changing content here, also change in Heading component for mdoc files
				rehypeAutolinkHeadings,
				{
					behavior: 'append',
					content: {
						type: 'text',
						value: '#',
					},
					properties: {
						className: ['anchor-link ml-1'],
					},
				},
			],
		],
	},
	env: {
		schema: {
			TURNSTILE_SECRET: envField.string({context: 'server', access: 'secret'}),
		},
	},
})