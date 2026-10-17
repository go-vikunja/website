import {type CollectionEntry, getCollection} from 'astro:content'
import {type Locale, locales} from './locales'

export type LocalizedCollection = 'help'

// Glob for content stored as <collection>/<locale>/<slug>.mdx
export const localizedContentPattern = `{${locales.join(',')}}/**/[^_]*.{md,mdx}`

/** Splits an entry id like `de/tasks` into its locale and slug. `index` maps to an empty slug. */
export function parseEntryId(id: string): {locale: Locale, slug: string} {
	const [locale, ...rest] = id.split('/')
	const slug = rest.join('/')
	return {locale: locale as Locale, slug: slug === 'index' ? '' : slug}
}

export async function getEntries<C extends LocalizedCollection>(collection: C, locale: Locale) {
	const entries: CollectionEntry<C>[] = await getCollection(collection)
	return entries
		.filter(entry => parseEntryId(entry.id).locale === locale)
		.map(entry => ({slug: parseEntryId(entry.id).slug, entry}))
}

export async function getStaticPathsFor(collection: LocalizedCollection, locale: Locale) {
	return (await getEntries(collection, locale)).map(({slug, entry}) => ({
		params: {slug: slug || undefined},
		props: entry,
	}))
}
