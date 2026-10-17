export const locales = ['en', 'de'] as const
export type Locale = typeof locales[number]
export const defaultLocale: Locale = 'en'

export function toLocale(value: string | undefined): Locale {
	return locales.find(l => l === value) ?? defaultLocale
}

export const localeNames: Record<Locale, string> = {
	en: 'English',
	de: 'Deutsch',
}
