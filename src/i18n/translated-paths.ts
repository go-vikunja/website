import {defaultLocale, type Locale, locales, toLocale} from './locales'
import {generateLocalizedId, parseEntryId} from './entry-ids'

export type TranslatedPaths = Map<Locale, Set<string>>

const contentRoutePrefixes: Record<string, string> = {help: '/help', pages: ''}

export function normalizePath(path: string): string {
	return path.length > 1 ? path.replace(/\/+$/, '') : path
}

/**
 * @param pageFiles paths relative to src/pages, e.g. `de/index.astro`
 * @param contentFiles raw file contents keyed by path relative to src/content, e.g. `help/de/tasks.mdx`
 */
export function collectTranslatedPaths(pageFiles: string[], contentFiles: Record<string, string>): TranslatedPaths {
	const translated: TranslatedPaths = new Map(locales.map(l => [l, new Set()]))
	const add = (locale: string, path: string) => {
		if (locale !== defaultLocale && toLocale(locale) === locale) {
			translated.get(locale as Locale)?.add(normalizePath(path))
		}
	}

	for (const file of pageFiles) {
		const [locale, ...segments] = file.replace(/\.\w+$/, '').split('/')
		if (segments.some(s => s.startsWith('['))) {
			continue
		}
		if (segments.at(-1) === 'index') {
			segments.pop()
		}
		add(locale, '/' + segments.join('/'))
	}

	for (const [file, raw] of Object.entries(contentFiles)) {
		const [collection, ...entry] = file.split('/')
		const frontmatterSlug = raw.match(/^---\n([\s\S]*?)\n---/)?.[1].match(/^slug:\s*['"]?([^'"\n]+?)['"]?\s*$/m)?.[1]
		const {locale, slug} = parseEntryId(generateLocalizedId({entry: entry.join('/'), data: {slug: frontmatterSlug}}))
		add(locale, `${contentRoutePrefixes[collection]}/${slug}`)
	}

	return translated
}

export function isTranslatedIn(translated: TranslatedPaths, locale: Locale, path: string): boolean {
	return locale === defaultLocale || !!translated.get(locale)?.has(normalizePath(path))
}

/** Links to the page in `locale`, or to the English page if it isn't translated. */
export function localizeHref(translated: TranslatedPaths, locale: Locale, href: string): string {
	const [path, hash] = href.split('#')
	if (locale === defaultLocale || !isTranslatedIn(translated, locale, path)) {
		return href
	}
	const localized = path === '/' ? `/${locale}/` : `/${locale}${path}`
	return hash === undefined ? localized : `${localized}#${hash}`
}
