import {defineConfig, envField} from 'astro/config'
import mdx from '@astrojs/mdx'
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
		mdx(),
		sitemap(),
	],
	adapter: cloudflare(),
	markdown: {
		shikiConfig: {
			themes: {
				light: 'github-light',
				dark: 'github-dark',
			},
			colorReplacements: {
				'min-light': {
					'#c2c3c5': '#808080',
				},
			},
		},
		rehypePlugins: [
			rehypeSlug,
			[
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