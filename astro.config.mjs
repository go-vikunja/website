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
	redirects: {
		'/blog/2020/05/vikunja-0.13.0-is-released/': '/changelog/vikunja-0.13.0-is-released',
		'/blog/2020/07/vikunja-0.14.0-is-released/': '/changelog/vikunja-0.14.0-is-released',
		'/blog/2020/07/vikunja-0.14.1-is-released/': '/changelog/vikunja-0.14.1-is-released',
		'/blog/2020/10/vikunja-0.15.0-is-released/': '/changelog/vikunja-0.15.0-is-released',
		'/blog/2020/10/api-vikunja-0.15.1-is-released/': '/changelog/api-vikunja-0.15.1-is-released',
		'/blog/2021/01/vikunja-0.16.0-is-released/': '/changelog/vikunja-0.16.0-is-released',
		'/blog/2021/04/api-vikunja-0.16.1-is-released/': '/changelog/api-vikunja-0.16.1-is-released',
		'/blog/2021/05/vikunja-0.17.0-is-released/': '/changelog/vikunja-0.17.0-is-released',
		'/blog/2021/06/api-vikunja-0.17.1-is-released/': '/changelog/api-vikunja-0.17.1-is-released',
		'/blog/2021/09/whats-new-in-vikunja-0.18.0/': '/changelog/whats-new-in-vikunja-0.18.0',
		'/blog/2021/09/vikunja-0.18.1-is-released/': '/changelog/vikunja-0.18.1-is-released',
		'/blog/2021/11/vikunja-0.18.2-is-released/': '/changelog/vikunja-0.18.2-is-released',
		'/blog/2022/08/whats-new-in-vikunja-0.19.0/': '/changelog/whats-new-in-vikunja-0.19.0',
		'/blog/2022/08/vikunja-0.19.1-is-released/': '/changelog/vikunja-0.19.1-is-released',
		'/blog/2022/08/api-vikunja-0.19.2-is-released/': '/changelog/api-vikunja-0.19.2-is-released',
		'/blog/2022/10/whats-new-in-vikunja-0.20.0/': '/changelog/whats-new-in-vikunja-0.20.0',
		'/blog/2022/11/vikunja-0.20.1-was-released/': '/changelog/vikunja-0.20.1-was-released',
		'/blog/2022/12/vikunja-frontend-0.20.2-was-released/': '/changelog/vikunja-frontend-0.20.2-was-released',
		'/blog/2023/01/vikunja-frontend-v0.20.3-and-api-v0.20.2-was-released/': '/changelog/vikunja-frontend-v0.20.3-and-api-v0.20.2-was-released',
		'/blog/2023/03/vikunja-frontend-v0.20.4-and-api-v0.20.3-was-released/': '/changelog/vikunja-frontend-v0.20.4-and-api-v0.20.3-was-released',
		'/blog/2023/03/vikunja-frontend-v0.20.5-and-api-v0.20.4-was-released/': '/changelog/vikunja-frontend-v0.20.5-and-api-v0.20.4-was-released',
		'/blog/2023/07/whats-new-in-vikunja-0.21.0/': '/changelog/whats-new-in-vikunja-0.21.0',
		'/blog/2023/12/whats-new-in-vikunja-0.22.0/': '/changelog/whats-new-in-vikunja-0.22.0',
		'/blog/2024/01/vikunja-frontend-and-api-v0.22.1-was-released/': '/changelog/vikunja-frontend-and-api-v0.22.1-was-released',
		'/blog/2024/02/whats-new-in-vikunja-0.23.0/': '/changelog/whats-new-in-vikunja-0.23.0',
	},
})