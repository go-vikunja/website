import {defaultLocale, type Locale, locales, toLocale} from './locales'
import {collectTranslatedPaths, isTranslatedIn, localizeHref, normalizePath} from './translated-paths'

// Files under src/pages/<locale>/ and src/content/<collection>/<locale>/ mark pages as translated.
const translatedPaths = collectTranslatedPaths(
	Object.keys(import.meta.glob('/src/pages/*/**/*.{astro,md,mdx}')).map(f => f.replace('/src/pages/', '')),
	Object.fromEntries(Object.entries(import.meta.glob<string>(
		['/src/content/{help,pages}/*/**/[^_]*.{md,mdx}', '!/src/content/*/en/**'],
		{eager: true, query: '?raw', import: 'default'},
	)).map(([f, raw]) => [f.replace('/src/content/', ''), raw])),
)

export function isTranslated(locale: Locale, path: string): boolean {
	return isTranslatedIn(translatedPaths, locale, path)
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
	return localizeHref(translatedPaths, locale, href)
}

export function translationsOf(path: string): Locale[] {
	return locales.filter(l => isTranslated(l, path))
}
