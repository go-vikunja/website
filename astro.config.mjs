import {defineConfig, envField} from 'astro/config'
import mdx from '@astrojs/mdx'
import {unified} from '@astrojs/markdown-remark'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import sitemap from '@astrojs/sitemap'
import cloudflare from '@astrojs/cloudflare'
import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
	site: 'https://vikunja.io',
	output: 'static',
	prefetch: {
		prefetchAll: true,
	},
	// Preserve the HTML-aware whitespace handling that was the default before Astro v7
	// changed it to `'jsx'`, which strips spaces between inline elements.
	compressHTML: true,
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
		// Astro v7 makes Sätteri the default Markdown pipeline, which does not run
		// remark/rehype plugins. Stay on the unified() processor so the rehype plugins
		// below (heading slugs + anchor links) keep working for our .mdx content.
		processor: unified({
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
		}),
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
	},
	env: {
		schema: {
			TURNSTILE_SECRET: envField.string({context: 'server', access: 'secret'}),
		},
	},
})