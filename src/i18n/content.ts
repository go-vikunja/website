import {type CollectionEntry, getCollection} from 'astro:content'
import {defaultLocale, type Locale} from './locales'
import {parseEntryId} from './entry-ids'

export type LocalizedCollection = 'help' | 'pages'

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

/** Entries in `locale`, with English entries standing in for missing translations. */
export async function getEntriesWithFallback<C extends LocalizedCollection>(collection: C, locale: Locale) {
	const translated = await getEntries(collection, locale)
	const translatedSlugs = new Set(translated.map(e => e.slug))
	const fallback = (await getEntries(collection, defaultLocale)).filter(e => !translatedSlugs.has(e.slug))
	return [...translated, ...fallback]
}
