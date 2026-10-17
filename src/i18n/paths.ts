import {defaultLocale, type Locale, toLocale} from './locales'

export function normalizePath(path: string): string {
	return path.length > 1 ? path.replace(/\/+$/, '') : path
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
