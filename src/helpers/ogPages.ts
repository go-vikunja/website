import {getCollection} from 'astro:content'
import {parseEntryId} from '../i18n/entry-ids'
import {defaultLocale} from '../i18n/locales'

export interface OgPage {
	title: string
	description?: string
}

export const OG_DEFAULT_ROUTE = 'default'

// Lazy so Layout -> ogPages -> page -> Layout doesn't hit a circular import.
const pageModules = {
	...import.meta.glob<OgPage | undefined>('/src/pages/**/*.{md,mdx}', {import: 'frontmatter'}),
	...import.meta.glob<OgPage | undefined>('/src/pages/**/*.astro', {import: 'meta'}),
}

export async function getOgPages(): Promise<Record<string, OgPage>> {
	const pages: Record<string, OgPage> = {
		[OG_DEFAULT_ROUTE]: {
			title: 'Vikunja',
			description: 'The open-source, self-hostable task manager.',
		},
	}

	for (const [path, load] of Object.entries(pageModules)) {
		const page = await load()
		if (page) {
			pages[path.replace('/src/pages/', '').replace(/\.(mdx?|astro)$/, '').replace(/\/index$/, '')] = {title: page.title, description: page.description}
		}
	}

	for (const collection of ['docs', 'changelog'] as const) {
		for (const entry of await getCollection(collection)) {
			pages[`${collection}/${entry.id.replace(/^\/|\/$/g, '')}`] = entry.data
		}
	}

	for (const [collection, prefix] of [['help', 'help/'], ['pages', '']] as const) {
		for (const entry of await getCollection(collection)) {
			const {locale, slug} = parseEntryId(entry.id)
			const route = `${prefix}${slug}`.replace(/\/$/, '')
			pages[locale === defaultLocale ? route : `${locale}/${route}`] = entry.data
		}
	}

	return pages
}

export function pathnameToOgRoute(pathname: string): string {
	return pathname.replace(/^\/|\/$/g, '') || 'index'
}
