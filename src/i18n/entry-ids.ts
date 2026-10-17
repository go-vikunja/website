import {type Locale, locales} from './locales'

// Glob for content stored as <collection>/<locale>/<slug>.mdx
export const localizedContentPattern = `{${locales.join(',')}}/**/[^_]*.{md,mdx}`

/** Keeps the locale folder in ids, which a frontmatter `slug` would otherwise replace. */
export function generateLocalizedId({entry, data}: {entry: string, data: Record<string, unknown>}): string {
	const [locale, ...rest] = entry.replace(/\.mdx?$/, '').split('/')
	const slug = typeof data.slug === 'string' ? data.slug : rest.join('/').replace(/(^|\/)index$/, '')
	return slug ? `${locale}/${slug}` : locale
}

/** Splits an entry id like `de/tasks` into its locale and slug. */
export function parseEntryId(id: string): {locale: Locale, slug: string} {
	const [locale, ...rest] = id.split('/')
	return {locale: locale as Locale, slug: rest.join('/')}
}
