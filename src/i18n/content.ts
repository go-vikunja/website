import {type CollectionEntry, getCollection} from 'astro:content'
import type {Locale} from './locales'
import {parseEntryId} from './entry-ids'

export type LocalizedCollection = 'help'

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
