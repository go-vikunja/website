import {OGImageRoute} from 'astro-og-canvas'
import {getOgPages} from '../../helpers/ogPages'

// ~3 lines at the description font size; astro-og-canvas doesn't clip overflow.
const MAX_DESCRIPTION_LENGTH = 150

function truncate(text: string | undefined): string | undefined {
	if (!text || text.length <= MAX_DESCRIPTION_LENGTH) {
		return text
	}
	return text.slice(0, text.lastIndexOf(' ', MAX_DESCRIPTION_LENGTH)) + '…'
}

export const {getStaticPaths, GET} = await OGImageRoute({
	pages: await getOgPages(),
	// Default strips everything after the last dot, mangling "vikunja-0.14.0-is-released".
	getSlug: route => `${route}.webp`,
	getImageOptions: (_path, page) => ({
		format: 'WEBP',
		quality: 90,
		title: page.title,
		description: truncate(page.description),
		bgImage: {
			path: './src/assets/og-background.jpg',
			fit: 'fill',
		},
		logo: {
			path: './src/assets/og-logo.png',
		},
		padding: 70,
		font: {
			title: {
				size: 68,
				families: ['Quicksand'],
				weight: 'Bold',
				color: [255, 255, 255],
			},
			description: {
				size: 34,
				lineHeight: 1.4,
				families: ['Open Sans'],
				weight: 'Normal',
				color: [235, 240, 255],
			},
		},
		fonts: [
			'./node_modules/@fontsource/quicksand/files/quicksand-latin-700-normal.woff2',
			'./node_modules/@fontsource/open-sans/files/open-sans-latin-400-normal.woff2',
		],
	}),
})
