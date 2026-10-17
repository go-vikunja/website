import en from './en.json'
import de from './de.json'
import type {Locale} from './locales'

export type MessageKey = keyof typeof en

// Crowdin may leave keys out or empty until they're translated.
const messages: Record<Locale, Partial<Record<MessageKey, string>>> = {en, de}

export function useTranslations(locale: Locale) {
	return (key: MessageKey, params: Record<string, string> = {}): string =>
		(messages[locale][key] || en[key]).replace(/\{(\w+)\}/g, (match, name) => params[name] ?? match)
}

export function translateMeta(locale: Locale, keys: {title: MessageKey, description: MessageKey}) {
	const t = useTranslations(locale)
	return {title: t(keys.title), description: t(keys.description)}
}
