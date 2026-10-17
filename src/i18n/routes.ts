import {defaultLocale, type Locale, locales, toLocale} from './locales'
import {generateLocalizedId, parseEntryId} from './entry-ids'

// Each file under src/pages/<locale>/ marks that page as translated.
const translatedPaths = new Map<Locale, Set<string>>(locales.map(l => [l, new Set()]))
for (const file of Object.keys(import.meta.glob('/src/pages/*/**/*.{astro,md,mdx}'))) {
	const [locale, ...segments] = file.replace('/src/pages/', '').replace(/\.\w+$/, '').split('/')
	if (locale === defaultLocale || toLocale(locale) !== locale || segments.some(s => s.startsWith('['))) {
		continue
	}
	if (segments.at(-1) === 'index') {
		segments.pop()
	}
	translatedPaths.get(locale as Locale)?.add(normalizePath('/' + segments.join('/')))
}

// Each translated entry in a localized content collection marks its page as translated.
const contentRoutePrefixes: Record<string, string> = {help: '/help', pages: ''}
const contentFiles = import.meta.glob<string>(
	['/src/content/{help,pages}/*/**/[^_]*.{md,mdx}', '!/src/content/*/en/**'],
	{eager: true, query: '?raw', import: 'default'},
)
for (const [file, raw] of Object.entries(contentFiles)) {
	const [collection, ...entry] = file.replace('/src/content/', '').split('/')
	const frontmatterSlug = raw.match(/^---\n([\s\S]*?)\n---/)?.[1].match(/^slug:\s*['"]?([^'"\n]+?)['"]?\s*$/m)?.[1]
	const {locale, slug} = parseEntryId(generateLocalizedId({entry: entry.join('/'), data: {slug: frontmatterSlug}}))
	if (toLocale(locale) === locale) {
		translatedPaths.get(locale)?.add(normalizePath(`${contentRoutePrefixes[collection]}/${slug}`))
	}
}

function normalizePath(path: string): string {
	return path.length > 1 ? path.replace(/\/+$/, '') : path
}

export function isTranslated(locale: Locale, path: string): boolean {
	return locale === defaultLocale || !!translatedPaths.get(locale)?.has(normalizePath(path))
}

/** Splits a URL pathname like `/de/pricing/` into its locale and the locale-neutral path. */
export function parsePathname(pathname: string): {locale: Locale, path: string} {
	const [, first, ...rest] = pathname.split('/')
	const locale = toLocale(first)
	if (locale === defaultLocale) {
		return {locale: defaultLocale, path: normalizePath(pathname)}
	}
	return {locale, path: normalizePath('/' + rest.join('/'))}
}

/** Links to the page in `locale`, or to the English page if it isn't translated. */
export function localizedHref(locale: Locale, href: string): string {
	const [path, hash] = href.split('#')
	if (locale === defaultLocale || !isTranslated(locale, path)) {
		return href
	}
	const localized = path === '/' ? `/${locale}/` : `/${locale}${path}`
	return hash === undefined ? localized : `${localized}#${hash}`
}

export function translationsOf(path: string): Locale[] {
	return locales.filter(l => isTranslated(l, path))
}
